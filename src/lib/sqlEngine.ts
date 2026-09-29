/**
 * A tiny, safe, in-memory SQL engine for the playground.
 * Supports the SELECT subset: column lists, *, aliases, WHERE with
 * =/!=/<>/</>/<=/>=/LIKE/IN/IS NULL/AND/OR, ORDER BY, LIMIT/OFFSET,
 * aggregate functions with GROUP BY + HAVING, INNER/LEFT JOIN .. ON,
 * COUNT(*) vs COUNT(col) NULL semantics, DISTINCT, AS labels.
 * This runs entirely client-side against tiny sample tables — no network,
 * no eval, no production anything.
 */

export type Row = Record<string, string | number | null>;
export interface Table {
  name: string;
  rows: Row[];
  columns: string[];
}

/* ------------------------------- Sample data ------------------------------- */

export const sampleTables: Table[] = [
  {
    name: "customers",
    columns: ["id", "name", "city", "email", "joined"],
    rows: [
      { id: 1, name: "Aarav", city: "Mumbai", email: "aarav@example.com", joined: "2025-01-14" },
      { id: 2, name: "Diya", city: "Delhi", email: "diya@example.com", joined: "2025-02-03" },
      { id: 3, name: "Kabir", city: "Mumbai", email: null, joined: "2025-03-22" },
      { id: 4, name: "Meera", city: "Pune", email: "meera@example.com", joined: "2025-05-30" },
      { id: 5, name: "Rohan", city: "Delhi", email: "rohan@example.com", joined: "2025-07-11" },
      { id: 6, name: "Sara", city: null, email: "sara@example.com", joined: "2025-08-01" },
    ],
  },
  {
    name: "orders",
    columns: ["id", "customer_id", "amount", "status", "created_at"],
    rows: [
      { id: 101, customer_id: 1, amount: 1250.5, status: "completed", created_at: "2026-01-08" },
      { id: 102, customer_id: 1, amount: 340.0, status: "completed", created_at: "2026-02-11" },
      { id: 103, customer_id: 2, amount: 890.99, status: "pending", created_at: "2026-02-18" },
      { id: 104, customer_id: 3, amount: 120.0, status: "completed", created_at: "2026-03-05" },
      { id: 105, customer_id: 3, amount: 455.25, status: "cancelled", created_at: "2026-03-19" },
      { id: 106, customer_id: 4, amount: 2100.0, status: "completed", created_at: "2026-04-02" },
      { id: 107, customer_id: 4, amount: 78.5, status: "pending", created_at: "2026-04-27" },
      { id: 108, customer_id: 1, amount: 660.75, status: "completed", created_at: "2026-05-09" },
      { id: 109, customer_id: 5, amount: 1500.0, status: "completed", created_at: "2026-06-14" },
      { id: 110, customer_id: null, amount: 99.0, status: "pending", created_at: "2026-06-30" },
    ],
  },
  {
    name: "products",
    columns: ["id", "name", "category", "price", "stock"],
    rows: [
      { id: 1, name: "Keyboard", category: "peripherals", price: 1499.0, stock: 42 },
      { id: 2, name: "Mouse", category: "peripherals", price: 799.0, stock: 60 },
      { id: 3, name: "Monitor", category: "displays", price: 11499.0, stock: 15 },
      { id: 4, name: "USB Hub", category: "accessories", price: 549.0, stock: 0 },
      { id: 5, name: "Laptop Stand", category: "accessories", price: 1299.0, stock: 27 },
      { id: 6, name: "Webcam", category: "video", price: 2499.0, stock: 8 },
    ],
  },
  {
    name: "employees",
    columns: ["id", "name", "department_id", "salary", "manager_id"],
    rows: [
      { id: 1, name: "Nina", department_id: 10, salary: 95000, manager_id: null },
      { id: 2, name: "Omar", department_id: 10, salary: 72000, manager_id: 1 },
      { id: 3, name: "Priya", department_id: 20, salary: 88000, manager_id: null },
      { id: 4, name: "Raj", department_id: 20, salary: 64000, manager_id: 3 },
      { id: 5, name: "Tara", department_id: 30, salary: 71000, manager_id: 3 },
    ],
  },
  {
    name: "departments",
    columns: ["id", "name", "location"],
    rows: [
      { id: 10, name: "Engineering", location: "Pune" },
      { id: 20, name: "Data", location: "Mumbai" },
      { id: 30, name: "Sales", location: "Delhi" },
    ],
  },
];

/* --------------------------------- Helpers --------------------------------- */

class SqlError extends Error {}

type Token = { t: "word" | "string" | "number" | "op" | "punct"; v: string; upper: string };

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "-" && sql[i + 1] === "-") { while (i < sql.length && sql[i] !== "\n") i++; continue; }
    // Numbers must be checked before identifiers so '2025-01-14' does not
    // start consuming letters, and identifiers starting with digits are rejected.
    if (c === "'" || c === '"') {
      const quote = c;
      let j = i + 1;
      let str = "";
      while (j < sql.length && sql[j] !== quote) {
        if (sql[j] === "\\" && sql[j + 1] === quote) { str += quote; j += 2; continue; }
        str += sql[j]; j++;
      }
      if (j >= sql.length) throw new SqlError("Unterminated string literal");
      tokens.push({ t: "string", v: str, upper: str });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(sql[i + 1] ?? ""))) {
      let j = i;
      while (j < sql.length && /[0-9.]/.test(sql[j])) j++;
      tokens.push({ t: "number", v: sql.slice(i, j), upper: sql.slice(i, j) });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      // Collect an identifier, allowing qualified names like t.col or t.*
      for (;;) {
        while (j < sql.length && /[A-Za-z0-9_]/.test(sql[j])) j++;
        if (sql[j] === "." && /[A-Za-z_*]/.test(sql[j + 1] ?? "")) {
          j += 1; // include the dot and keep collecting
          continue;
        }
        break;
      }
      const raw = sql.slice(i, j);
      tokens.push({ t: "word", v: raw, upper: raw.toUpperCase() });
      i = j;
      continue;
    }
    if (c === "*") {
      tokens.push({ t: "punct", v: "*", upper: "*" });
      i++;
      continue;
    }
    if ("<>=!".includes(c)) {
      let j = i;
      while (j < sql.length && "<>=!".includes(sql[j])) j++;
      tokens.push({ t: "op", v: sql.slice(i, j), upper: sql.slice(i, j) });
      i = j;
      continue;
    }
    if ("(),;".includes(c)) {
      tokens.push({ t: "punct", v: c, upper: c });
      i++;
      continue;
    }
    throw new SqlError(`Unexpected character: '${c}'`);
  }
  return tokens;
}

const AGG_FUNCS = ["COUNT", "SUM", "AVG", "MIN", "MAX"];
const KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "GROUP", "BY", "HAVING", "ORDER", "LIMIT", "OFFSET",
  "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "ON", "AS", "AND", "OR", "NOT", "NULL",
  "IS", "IN", "LIKE", "DISTINCT", "ASC", "DESC", "COUNT", "SUM", "AVG", "MIN", "MAX",
]);

interface Parser {
  pos: number;
  peek(): Token | undefined;
  peekAt(offset: number): Token | undefined;
  next(): Token | undefined;
  expectUpper(u: string): void;
  acceptUpper(u: string): boolean;
}

function makeParser(tokens: Token[]): Parser {
  return {
    pos: 0,
    peek() { return tokens[this.pos]; },
    peekAt(offset: number) { return tokens[this.pos + offset]; },
    next() { return tokens[this.pos++]; },
    expectUpper(u: string) {
      const tk = tokens[this.pos];
      if (!tk || tk.upper !== u) throw new SqlError(`Expected ${u}${tk ? ` near '${tk.v}'` : ""}`);
      this.pos++;
    },
    acceptUpper(u: string) {
      const tk = tokens[this.pos];
      if (tk && tk.upper === u) { this.pos++; return true; }
      return false;
    },
  };
}

/* ---------------------------------- AST ----------------------------------- */

interface SelectItem {
  expr: string | { agg: string; arg: string | null };
  alias?: string;
}
interface JoinClause {
  type: "inner" | "left";
  table: string;
  alias?: string;
  leftCol: string;
  rightCol: string;
}
interface Query {
  distinct: boolean;
  columns: SelectItem[];
  from: { table: string; alias?: string };
  joins: JoinClause[];
  where: WhereNode | null;
  groupBy: string[];
  having: WhereNode | null;
  orderBy: { col: string; dir: "asc" | "desc" }[];
  limit: number | null;
  offset: number | null;
}

type WhereNode =
  | { op: "and" | "or"; left: WhereNode; right: WhereNode }
  | { op: "not"; inner: WhereNode }
  | { kind: "cmp"; col: string; cmp: string; value: string | number | null }
  | { kind: "null"; col: string; negated: boolean }
  | { kind: "in"; col: string; values: (string | number)[]; negated: boolean }
  | { kind: "like"; col: string; pattern: string; negated: boolean }
  | { kind: "agg"; label: string; cmp: string; value: number };

function parseExpression(p: Parser): SelectItem {
  const tk = p.peek();
  if (!tk) throw new SqlError("Unexpected end of query");
  if (tk.t === "op") throw new SqlError(`Unexpected '${tk.v}' in select list`);
  // Bare * selects all columns
  if (tk.t === "punct" && tk.v === "*") {
    p.next();
    return { expr: "*" };
  }
  if (tk.t === "punct") throw new SqlError(`Unexpected '${tk.v}' in select list`);

  // aggregate?
  if (tk.t === "word" && AGG_FUNCS.includes(tk.upper)) {
    p.next();
    const next = p.next();
    if (!next || next.v !== "(") throw new SqlError(`Expected ( after ${tk.upper}`);
    let arg: string | null = null;
    if (p.peek()?.v === "*") {
      p.next();
      arg = "*";
    } else if (p.peek()?.upper === "DISTINCT") {
      p.next();
      const col = p.next();
      if (!col) throw new SqlError("Expected column after DISTINCT");
      arg = col.v;
    } else {
      const col = p.next();
      if (!col || col.t !== "word") throw new SqlError(`Expected column inside ${tk.upper}()`);
      arg = col.v;
    }
    const close = p.next();
    if (!close || close.v !== ")") throw new SqlError("Expected ) after aggregate argument");
    let alias: string | undefined;
    if (p.acceptUpper("AS")) {
      const a = p.next();
      if (!a) throw new SqlError("Expected alias after AS");
      alias = a.v;
    }
    return { expr: { agg: tk.upper, arg: arg === "*" ? null : arg }, alias };
  }

  const col = p.next()!;
  let alias: string | undefined;
  if (p.acceptUpper("AS")) {
    const a = p.next();
    if (!a) throw new SqlError("Expected alias after AS");
    alias = a.v;
  }
  return { expr: col.v, alias };
}

function parseWhere(p: Parser): WhereNode {
  const left = parseWhereAtom(p);
  const tk = p.peek();
  if (tk && (tk.upper === "AND" || tk.upper === "OR")) {
    p.next();
    const right = parseWhere(p);
    return { op: tk.upper.toLowerCase() as "and" | "or", left, right };
  }
  return left;
}

/** Parses `AGG(arg) op number` if present; returns null otherwise. */
function parseAggregateAtom(p: Parser): WhereNode | null {
  const tk = p.peek();
  if (!tk || tk.t !== "word" || !AGG_FUNCS.includes(tk.upper)) return null;
  const aggName = tk.upper;
  p.next();
  if (p.next()?.v !== "(") return null;
  let arg: string | null = null;
  if (p.peek()?.v === "*") {
    p.next();
  } else {
    const c = p.next();
    if (!c || c.t !== "word") return null;
    arg = c.v;
  }
  if (p.next()?.v !== ")") return null;
  const opTk = p.peek();
  if (!opTk || opTk.t !== "op") return null;
  const valTk = p.peekAt(1);
  if (!valTk || valTk.t !== "number") return null;
  p.next();
  p.next();
  const map: Record<string, string> = { "=": "=", "!=": "!=", "<>": "!=", "<": "<", ">": ">", "<=": "<=", ">=": ">=" };
  return {
    kind: "agg",
    label: `${aggName.toLowerCase()}(${arg ?? "*"})`,
    cmp: map[opTk.v] ?? opTk.v,
    value: Number(valTk.v),
  };
}

function parseWhereAtom(p: Parser): WhereNode {
  if (p.peek()?.upper === "NOT") {
    p.next();
    return { op: "not", inner: parseWhereAtom(p) };
  }
  if (p.peek()?.v === "(") {
    p.next();
    const inner = parseWhere(p);
    const close = p.next();
    if (!close || close.v !== ")") throw new SqlError("Expected )");
    return inner;
  }
  // Aggregate comparison inside HAVING: COUNT(*) > 5, SUM(x) <= 100
  const aggTk = p.peek();
  if (aggTk && aggTk.t === "word" && AGG_FUNCS.includes(aggTk.upper)) {
    const savePos = p.pos;
    const parsedAgg = parseAggregateAtom(p);
    if (parsedAgg) return parsedAgg;
    p.pos = savePos;
  }
  const col = p.next();
  if (!col || col.t !== "word") throw new SqlError("Expected column in WHERE");
  const opTk = p.peek();
  if (!opTk) throw new SqlError("Unexpected end in WHERE");

  if (opTk.upper === "IS") {
    p.next();
    const negated = p.acceptUpper("NOT");
    p.expectUpper("NULL");
    return { kind: "null", col: col.v, negated };
  }
  if (opTk.upper === "IN") {
    p.next();
    const negated = p.acceptUpper("NOT");
    if (p.next()?.v !== "(") throw new SqlError("Expected ( after IN");
    const values: (string | number)[] = [];
    while (p.peek() && p.peek()!.v !== ")") {
      const v = p.next()!;
      if (v.t === "string" || v.t === "number") values.push(v.t === "number" ? Number(v.v) : v.v);
      else if (v.v === ",") continue;
      else throw new SqlError("Bad IN list");
    }
    if (!p.next()) throw new SqlError("Expected ) after IN list");
    return { kind: "in", col: col.v, values, negated };
  }
  if (opTk.upper === "LIKE") {
    p.next();
    const pat = p.next();
    if (!pat || pat.t !== "string") throw new SqlError("Expected pattern after LIKE");
    return { kind: "like", col: col.v, pattern: pat.v, negated: false };
  }
  if (opTk.upper === "NOT" && p.peekAt(1)?.upper === "LIKE") {
    p.next();
    p.next();
    const pat = p.next();
    if (!pat || pat.t !== "string") throw new SqlError("Expected pattern after NOT LIKE");
    return { kind: "like", col: col.v, pattern: pat.v, negated: true };
  }
  if (opTk.t === "op") {
    p.next();
    const val = p.next();
    if (!val) throw new SqlError("Expected value after operator");
    let value: string | number | null;
    if (val.t === "number") value = Number(val.v);
    else if (val.t === "string") value = val.v;
    else if (val.upper === "NULL") value = null;
    else throw new SqlError(`Unexpected value '${val.v}'`);
    const map: Record<string, string> = { "=": "=", "!=": "!=", "<>": "!=", "<": "<", ">": ">", "<=": "<=", ">=": ">=" };
    const cmp = map[opTk.v] ?? opTk.v;
    // Store the full qualified reference; resolution happens at eval time.
    return { kind: "cmp", col: col.v, cmp, value };
  }
  throw new SqlError(`Unsupported WHERE operator near '${opTk.v}'`);
}

function parseQuery(sql: string): Query {
  const tokens = tokenize(sql);
  const p = makeParser(tokens);
  p.expectUpper("SELECT");
  const distinct = p.acceptUpper("DISTINCT");
  const columns: SelectItem[] = [parseExpression(p)];
  while (p.peek()?.v === ",") {
    p.next();
    columns.push(parseExpression(p));
  }
  p.expectUpper("FROM");
  const tableTk = p.next();
  if (!tableTk || tableTk.t !== "word") throw new SqlError("Expected table name after FROM");
  const from = { table: tableTk.v, alias: undefined as string | undefined };
  if (p.peek() && p.peek()!.t === "word" && !KEYWORDS.has(p.peek()!.upper)) {
    from.alias = p.next()!.v;
  }
  const joins: JoinClause[] = [];
  for (;;) {
    let joinType: "inner" | "left" | null = null;
    if (p.acceptUpper("JOIN")) joinType = "inner";
    else if (p.peek()?.upper === "INNER" && p.peekAt(1)?.upper === "JOIN") {
      p.next(); p.next(); joinType = "inner";
    } else if (p.peek()?.upper === "LEFT" && p.peekAt(1)?.upper === "JOIN") {
      p.next(); p.next(); joinType = "left";
    } else if (p.peek()?.upper === "LEFT" && p.peekAt(1)?.upper === "OUTER" && p.peekAt(2)?.upper === "JOIN") {
      p.next(); p.next(); p.next(); joinType = "left";
    }
    if (!joinType) break;
    const t = p.next();
    if (!t || t.t !== "word") throw new SqlError("Expected table after JOIN");
    const alias = p.peek() && p.peek()!.t === "word" && !KEYWORDS.has(p.peek()!.upper) ? p.next()!.v : undefined;
    p.expectUpper("ON");
    const l = p.next();
    if (!l || l.t !== "word") throw new SqlError("Expected join column");
    if (p.next()?.v !== "=") throw new SqlError("Expected = in ON clause");
    const r = p.next();
    if (!r || r.t !== "word") throw new SqlError("Expected join column after =");
    joins.push({ type: joinType, table: t.v, alias, leftCol: l.v, rightCol: r.v });
  }
  let where: WhereNode | null = null;
  if (p.acceptUpper("WHERE")) where = parseWhere(p);
  const groupBy: string[] = [];
  if (p.peek()?.upper === "GROUP") {
    p.next();
    p.expectUpper("BY");
    for (;;) {
      const c = p.next();
      if (!c || c.t !== "word") throw new SqlError("Expected column in GROUP BY");
      groupBy.push(c.v);
      if (p.peek()?.v === ",") { p.next(); continue; }
      break;
    }
  }
  let having: WhereNode | null = null;
  if (p.acceptUpper("HAVING")) having = parseWhere(p);
  const orderBy: { col: string; dir: "asc" | "desc" }[] = [];
  if (p.peek()?.upper === "ORDER") {
    p.next();
    p.expectUpper("BY");
    for (;;) {
      const c = p.next();
      if (!c || c.t !== "word") throw new SqlError("Expected column in ORDER BY");
      let dir: "asc" | "desc" = "asc";
      if (p.peek()?.upper === "ASC") p.next();
      else if (p.peek()?.upper === "DESC") { p.next(); dir = "desc"; }
      orderBy.push({ col: c.v, dir });
      if (p.peek()?.v === ",") { p.next(); continue; }
      break;
    }
  }
  let limit: number | null = null;
  let offset: number | null = null;
  if (p.acceptUpper("LIMIT")) {
    const n = p.next();
    if (!n || n.t !== "number") throw new SqlError("Expected number after LIMIT");
    limit = Number(n.v);
    if (p.acceptUpper("OFFSET")) {
      const o = p.next();
      if (!o || o.t !== "number") throw new SqlError("Expected number after OFFSET");
      offset = Number(o.v);
    }
  }
  while (p.peek()?.v === ";") p.next();
  if (p.peek()) throw new SqlError(`Unexpected token near '${p.peek()!.v}'`);
  return { distinct, columns, from, joins, where, groupBy, having, orderBy, limit, offset };
}

/* -------------------------------- Executor -------------------------------- */

function likeToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, ".");
  return new RegExp(`^${escaped}$`, "i");
}

function computeAgg(agg: string, arg: string | null, grp: Row[]): number | null {
  if (agg === "COUNT") {
    return arg === null ? grp.length : grp.filter((r) => r[arg] !== null && r[arg] !== undefined).length;
  }
  const vals = (arg === null ? grp : grp.filter((r) => r[arg] !== null))
    .map((r) => Number(r[arg ?? ""]))
    .filter((n) => !Number.isNaN(n));
  switch (agg) {
    case "SUM": return vals.length ? vals.reduce((s, x) => s + x, 0) : null;
    case "AVG": return vals.length ? vals.reduce((s, x) => s + x, 0) / vals.length : null;
    case "MIN": return vals.length ? Math.min(...vals) : null;
    case "MAX": return vals.length ? Math.max(...vals) : null;
    default: throw new SqlError(`Unsupported aggregate ${agg}`);
  }
}

function evalWhere(node: WhereNode, row: Row, aggs?: Map<string, number | null>): boolean {
  if ("left" in node && "right" in node) {
    return node.op === "and"
      ? evalWhere(node.left, row, aggs) && evalWhere(node.right, row, aggs)
      : evalWhere(node.left, row, aggs) || evalWhere(node.right, row, aggs);
  }
  if ("inner" in node) {
    return !evalWhere(node.inner, row, aggs);
  }
  if ("kind" in node) {
    switch (node.kind) {
      case "agg": {
        if (!aggs) throw new SqlError("Aggregate not allowed here");
        const v = aggs.get(node.label);
        if (v === undefined) throw new SqlError(`Unknown aggregate in HAVING: ${node.label}`);
        const b = node.value;
        if (v === null || b === null) return false;
        const cmp =
          typeof v === "number" && typeof b === "number"
            ? v < b ? -1 : v > b ? 1 : 0
            : String(v).localeCompare(String(b));
        switch (node.cmp) {
          case "=": return v === b;
          case "!=": return v !== b;
          case "<": return cmp < 0;
          case ">": return cmp > 0;
          case "<=": return cmp <= 0;
          case ">=": return cmp >= 0;
          default: throw new SqlError(`Unknown comparison ${node.cmp}`);
        }
      }
      case "null":
        return node.negated ? row[node.col] !== null : row[node.col] === null;
      case "in": {
        const v = row[node.col];
        const found = node.values.some((x: string | number) => x === v);
        return node.negated ? !found : found;
      }
      case "like": {
        const v = row[node.col];
        if (v === null) return false;
        const m = likeToRegex(node.pattern).test(String(v));
        return node.negated ? !m : m;
      }
      case "cmp": {
        const a = row[node.col];
        const b = node.value;
        if (a === null || b === null) return false;
        if (typeof a === "number" && typeof b === "number") {
          switch (node.cmp) {
            case "=": return a === b;
            case "!=": return a !== b;
            case "<": return a < b;
            case ">": return a > b;
            case "<=": return a <= b;
            case ">=": return a >= b;
            default: throw new SqlError(`Unknown comparison ${node.cmp}`);
          }
        }
        if (typeof b === "number" && typeof a !== "number") {
          const an = Number(a);
          if (!Number.isNaN(an)) {
            switch (node.cmp) {
              case "=": return an === b;
              case "!=": return an !== b;
              case "<": return an < b;
              case ">": return an > b;
              case "<=": return an <= b;
              case ">=": return an >= b;
              default: throw new SqlError(`Unknown comparison ${node.cmp}`);
            }
          }
        }
        switch (node.cmp) {
          case "=": return a === b;
          case "!=": return a !== b;
          case "<": return String(a) < String(b);
          case ">": return String(a) > String(b);
          case "<=": return String(a) <= String(b);
          case ">=": return String(a) >= String(b);
          default: throw new SqlError(`Unknown comparison ${node.cmp}`);
        }
      }
    }
  }
  throw new SqlError("Bad WHERE expression");
}

function resolveColumn(name: string, tables: { alias?: string; table: Table }[]): string {
  if (name.includes(".")) {
    const [prefix, col] = name.split(".");
    const idx = tables.findIndex((t) => (t.alias ?? t.table.name.toLowerCase()) === prefix.toLowerCase());
    if (idx === -1) throw new SqlError(`Unknown table alias '${prefix}'`);
    if (col === "*" || tables[idx].table.columns.includes(col)) {
      // If an earlier table also has this column name, the stored key is prefixed.
      const earlier = tables.slice(0, idx).some((t) => t.table.columns.includes(col));
      return earlier ? `${prefix.toLowerCase()}.${col}` : col;
    }
    throw new SqlError(`Unknown column '${name}'`);
  }
  const owners = tables.filter((t) => t.table.columns.includes(name));
  if (owners.length === 0) throw new SqlError(`Unknown column '${name}'`);
  if (owners.length > 1) throw new SqlError(`Ambiguous column '${name}' — qualify it like t.col`);
  return name;
}

/** Which source table owns a (possibly qualified) column reference. */
function ownerOf(name: string, tables: { alias?: string; table: Table }[]): string {
  if (name.includes(".")) {
    return name.split(".")[0].toLowerCase();
  }
  const owner = tables.find((t) => t.table.columns.includes(name));
  return owner ? (owner.alias ?? owner.table.name.toLowerCase()) : "";
}

export interface QueryResult {
  columns: string[];
  rows: Row[];
  ms: number;
  error?: never;
}
export interface QueryError {
  error: string;
  ms: number;
}

export function runSql(sql: string): QueryResult | QueryError {
  const t0 = performance.now();
  try {
    const q = parseQuery(sql);
    const find = (name: string): Table => {
      const t = sampleTables.find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (!t) throw new SqlError(`No such table: ${name}`);
      return t;
    };
    const base = find(q.from.table);
    const sources: { alias?: string; table: Table }[] = [{ alias: q.from.alias, table: base }];

    // Build joined rows
    let rows: Row[] = base.rows.map((r) => ({ ...r }));
    for (const j of q.joins) {
      const jt = find(j.table);
      const prevSources = [...sources];
      sources.push({ alias: j.alias, table: jt });
      // Determine which ON side refers to the newly joined table by checking
      // the qualified prefix (or, unqualified, whether the previous sources
      // contain the column).
      const ownerOfRaw = (rawName: string): string | null => {
        if (rawName.includes(".")) return rawName.split(".")[0].toLowerCase();
        const owner = prevSources.find((t) => t.table.columns.includes(rawName.split(".").pop()!));
        return owner ? (owner.alias ?? owner.table.name.toLowerCase()) : null;
      };
      const jtKey = (j.alias ?? j.table).toLowerCase();
      const leftOwner = ownerOfRaw(j.leftCol);
      const rightOwner = ownerOfRaw(j.rightCol);
      // True when the RIGHT raw side refers to the newly joined table.
      const rightIsNew = rightOwner === jtKey && leftOwner !== jtKey;
      const accRaw = rightIsNew ? j.leftCol : j.rightCol;
      const newRaw = rightIsNew ? j.rightCol : j.leftCol;
      // Accumulated-side key: resolved against the already-built sources so a
      // previously collision-renamed key (e.g. "d.name") is found. New-side key
      // is the plain column name — join rows compare against the pre-rename
      // joined-table row (`raw`), not the renamed copy.
      let keyOnAccumulated: string;
      let keyOnNew: string;
      try {
        keyOnAccumulated = resolveColumn(accRaw, prevSources);
        keyOnNew = newRaw.includes(".") ? newRaw.split(".").slice(1).join(".") : newRaw;
      } catch {
        // Ownership detection can be ambiguous when both ON sides are
        // unqualified — try the swapped orientation before failing.
        keyOnAccumulated = resolveColumn(newRaw, prevSources);
        keyOnNew = accRaw.includes(".") ? accRaw.split(".").slice(1).join(".") : accRaw;
      }
      const out: Row[] = [];
      // Merge with collision handling: if the joined table has columns whose
      // names already exist in the accumulated row, store them as "alias.col".
      const collided = jt.columns.filter((c) =>
        rows.some((l) => Object.prototype.hasOwnProperty.call(l, c))
      );
      const rename = (r: Row): Row => {
        const out2: Row = {};
        for (const [k, v] of Object.entries(r)) {
          if (collided.includes(k)) {
            out2[`${(j.alias ?? j.table.toLowerCase()).toLowerCase()}.${k}`] = v;
          } else {
            out2[k] = v;
          }
        }
        return out2;
      };
      if (j.type === "inner") {
        for (const l of rows) {
          for (const raw of jt.rows) {
            const r = rename(raw);
            if (l[keyOnAccumulated] === raw[keyOnNew]) out.push({ ...l, ...r });
          }
        }
      } else {
        // LEFT JOIN: keep all accumulated rows, null-fill missing join-table columns
        for (const l of rows) {
          let matched = false;
          for (const raw of jt.rows) {
            const r = rename(raw);
            if (l[keyOnAccumulated] === raw[keyOnNew]) {
              out.push({ ...l, ...r });
              matched = true;
            }
          }
          if (!matched) {
            const nulls: Row = {};
            for (const c of jt.columns) {
              nulls[collided.includes(c) ? `${(j.alias ?? j.table.toLowerCase()).toLowerCase()}.${c}` : c] = null;
            }
            out.push({ ...l, ...nulls });
          }
        }
      }
      rows = out;
    }

    // Resolve any qualified WHERE columns (e.g. e.salary → salary) once
    const resolveRowCols = (n: WhereNode): WhereNode => {
      if ("left" in n) return { ...n, left: resolveRowCols(n.left), right: resolveRowCols(n.right) } as WhereNode;
      if ("inner" in n) return { ...n, inner: resolveRowCols(n.inner) } as WhereNode;
      if ("col" in n) return { ...n, col: resolveColumn(n.col, sources) } as WhereNode;
      return n;
    };
    const whereResolved = q.where ? resolveRowCols(q.where) : null;

    if (whereResolved) rows = rows.filter((r) => evalWhere(whereResolved, r));

    // Resolve aggregate arguments against the source tables so unknown columns
    // error consistently (e.g. SUM(bogus) → error, not a silent null).
    const resolveAggArg = (arg: string | null): string | null =>
      arg === null ? null : resolveColumn(arg, sources);

    const hasAgg = q.columns.some((c) => typeof c.expr !== "string");
    const groupCols = q.groupBy.map((g) => resolveColumn(g, sources));

    let resultRows: Row[];
    // Parallel source rows for the non-grouped path (aligned with resultRows)
    // so ORDER BY can sort on columns that are not in the SELECT list.
    let srcAligned: Row[] | null = null;

    if (hasAgg || groupCols.length > 0) {
      // Group rows
      const groups = new Map<string, Row[]>();
      if (groupCols.length === 0) {
        groups.set("*", rows);
      } else {
        for (const r of rows) {
          const key = JSON.stringify(groupCols.map((c) => r[c]));
          const list = groups.get(key) ?? [];
          list.push(r);
          groups.set(key, list);
        }
      }
      // Precompute aggregates per group for HAVING
      const aggLabels: { label: string; agg: string; arg: string | null }[] = [];
      const collectAggs = (n: WhereNode) => {
        if ("left" in n) { collectAggs(n.left); collectAggs(n.right); return; }
        if ("inner" in n) { collectAggs(n.inner); return; }
        if ("kind" in n && n.kind === "agg") {
          if ("agg" in n || true) {
            const m = n as { label: string; labelKey?: string };
            // label like count(*) or sum(amount)
            const mm = /^(\w+)\((.*)\)$/.exec(m.label);
            if (mm) aggLabels.push({ label: m.label, agg: mm[1].toUpperCase(), arg: mm[2] === "*" || mm[2] === "" ? null : mm[2] });
          }
        }
      };
      if (q.having) collectAggs(q.having);

      resultRows = [];
      for (const [, grp] of groups) {
        const out: Row = {};
        const aggValues = new Map<string, number | null>();
        for (const c of q.columns) {
          if (typeof c.expr === "string") {
            const col = resolveColumn(c.expr, sources);
            out[c.alias ?? c.expr] = grp[0] ? grp[0][col] : null;
          } else {
            const { agg, arg } = c.expr;
            const label = c.alias ?? `${agg.toLowerCase()}(${arg ?? "*"})`;
            aggValues.set(label, computeAgg(agg, resolveAggArg(arg), grp));
            out[label] = aggValues.get(label)!;
          }
        }
        // Compute HAVING aggregates not present in the select list
        for (const a of aggLabels) {
          if (!aggValues.has(a.label)) {
            aggValues.set(a.label, computeAgg(a.agg, resolveAggArg(a.arg), grp));
          }
        }
        resultRows.push(out);
        // HAVING evaluated per-group with agg values available
        if (q.having) {
          if (!evalWhere(q.having, out, aggValues)) resultRows.pop();
        }
      }
    } else {
      // Keep (projected, source) pairs; DISTINCT dedupes on the projected row
      // while preserving pair alignment.
      const pairs = rows.map((r) => {
        const out: Row = {};
        for (const c of q.columns) {
          if (typeof c.expr === "string" && c.expr === "*") {
            for (const col of sources[0].table.columns) out[col] = r[col];
          } else if (typeof c.expr === "string") {
            const col = resolveColumn(c.expr, sources);
            out[c.alias ?? c.expr] = r[col];
          }
        }
        return { out, src: r };
      });
      let kept = pairs;
      if (q.distinct) {
        const seen = new Set<string>();
        kept = pairs.filter((p) => {
          const k = JSON.stringify(p.out);
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
      }
      resultRows = kept.map((p) => p.out);
      srcAligned = kept.map((p) => p.src);
    }

    if (q.distinct && srcAligned === null) {
      // Grouped-path DISTINCT (already deduped for the non-grouped path).
      const seen = new Set<string>();
      resultRows = resultRows.filter((r) => {
        const k = JSON.stringify(r);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }

    if (q.orderBy.length > 0) {
      // ORDER BY may reference an output alias (e.g. ORDER BY cnt) — resolve
      // against select aliases first, then against source columns.
      const aliasMap = new Map<string, string>();
      for (const c of q.columns) {
        if (c.alias) aliasMap.set(c.alias.toLowerCase(), c.alias);
      }
      const keys: (string | null)[] = q.orderBy.map((o) => {
        if (aliasMap.has(o.col.toLowerCase())) return aliasMap.get(o.col.toLowerCase())!;
        try {
          return resolveColumn(o.col, sources);
        } catch {
          return null;
        }
      });
      // Decorate-sort-undecorate: each output row keeps its paired source row
      // (when available) so ORDER BY can read non-projected columns.
      const decorated = resultRows.map((out, i) => ({ out, src: srcAligned ? srcAligned[i] : null }));
      decorated.sort((x, y) => {
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          const pick = (d: { out: Row; src: Row | null }): unknown => {
            if (k === null) return undefined;
            if (k in d.out) return d.out[k];
            if (d.src && k in d.src) return d.src[k];
            return undefined;
          };
          const av = pick(x);
          const bv = pick(y);
          if (av === undefined && bv === undefined) continue;
          if (av === null || av === undefined) return 1;
          if (bv === null || bv === undefined) return -1;
          let cmp: number;
          if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
          else cmp = String(av).localeCompare(String(bv));
          if (cmp !== 0) return q.orderBy[i].dir === "desc" ? -cmp : cmp;
        }
        return 0;
      });
      for (let i = 0; i < decorated.length; i++) resultRows[i] = decorated[i].out;
    }

    if (q.offset) resultRows = resultRows.slice(q.offset);
    if (q.limit !== null) resultRows = resultRows.slice(0, q.limit);

    const cols = resultRows.length > 0 ? Object.keys(resultRows[0]) : q.columns.map((c) => (typeof c.expr === "string" ? c.expr : c.alias ?? "expr"));
    return { columns: cols, rows: resultRows, ms: Math.round((performance.now() - t0) * 100) / 100 };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e), ms: Math.round((performance.now() - t0) * 100) / 100 };
  }
}
