import type { CheatSheet } from "@/types";

export const cheatsheets: CheatSheet[] = [
  {
    slug: "python",
    title: "Python",
    description: "Everyday syntax for scripts and data work.",
    sections: [
      {
        title: "Collections",
        rows: [
          ["list", "a = [1, 2, 3] — mutable, ordered"],
          ["tuple", "t = (1, 2) — immutable, ordered"],
          ["dict", "d = {'k': 'v'} — key/value, insertion-ordered"],
          ["set", "s = {1, 2} — unique, unordered"],
          ["comprehension", "[x*x for x in xs if x > 0]"],
        ],
      },
      {
        title: "Functions",
        rows: [
          ["define", "def f(a, b=2): return a + b"],
          ["varargs", "def f(*args, **kwargs): ..."],
          ["lambda", "double = lambda x: x * 2"],
          ["type hints", "def f(x: int) -> str: ..."],
        ],
      },
      {
        title: "Control flow",
        rows: [
          ["if", "if x > 0: ... elif x == 0: ... else: ..."],
          ["for", "for i, v in enumerate(xs): ..."],
          ["while", "while cond: ..."],
          ["with", "with open(p) as f: ... — auto-closes"],
        ],
      },
      {
        title: "Files & errors",
        rows: [
          ["read file", "open(path, encoding='utf-8')"],
          ["json", "json.load(f) / json.dumps(obj)"],
          ["try", "try: ... except ValueError as e: ... finally: ..."],
          ["raise", "raise ValueError('bad input')"],
        ],
      },
    ],
  },
  {
    slug: "sql",
    title: "SQL",
    description: "Query patterns from SELECT to windows.",
    sections: [
      {
        title: "Query shape",
        rows: [
          ["select", "SELECT cols FROM t WHERE cond ORDER BY col DESC LIMIT 10"],
          ["distinct", "SELECT DISTINCT col FROM t"],
          ["null test", "WHERE col IS NULL / IS NOT NULL"],
          ["range", "WHERE d BETWEEN '2026-01-01' AND '2026-12-31'"],
        ],
      },
      {
        title: "Joins",
        rows: [
          ["inner", "FROM a JOIN b ON a.k = b.k"],
          ["left", "FROM a LEFT JOIN b ON a.k = b.k"],
          ["anti-join", "LEFT JOIN ... WHERE b.k IS NULL"],
          ["self", "FROM e e1 JOIN e e2 ON e1.mgr_id = e2.id"],
        ],
      },
      {
        title: "Aggregation",
        rows: [
          ["group", "SELECT c, COUNT(*) FROM t GROUP BY c HAVING COUNT(*) > 5"],
          ["count null", "COUNT(col) skips NULLs; COUNT(*) doesn't"],
          ["avg/sum", "AVG(amount), SUM(amount)"],
        ],
      },
      {
        title: "Window functions",
        rows: [
          ["row number", "ROW_NUMBER() OVER (PARTITION BY c ORDER BY d DESC)"],
          ["rank", "RANK() repeats on ties with gaps; DENSE_RANK() without gaps"],
          ["lag/lead", "LAG(amount) OVER (ORDER BY d)"],
        ],
      },
    ],
  },
  {
    slug: "git",
    title: "Git",
    description: "Daily version control commands.",
    sections: [
      {
        title: "Everyday",
        rows: [
          ["status", "git status"],
          ["stage", "git add file / git add -p"],
          ["commit", "git commit -m 'message'"],
          ["log", "git log --oneline --graph"],
        ],
      },
      {
        title: "Branches",
        rows: [
          ["create", "git switch -c feature/x"],
          ["merge", "git merge main"],
          ["rebase", "git rebase main (local work only)"],
          ["delete", "git branch -d feature/x"],
        ],
      },
      {
        title: "Undo",
        rows: [
          ["amend", "git commit --amend"],
          ["unstage", "git restore --staged file"],
          ["soft reset", "git reset --soft HEAD~1"],
          ["revert", "git revert <sha> — safe on shared branches"],
        ],
      },
      {
        title: "Remotes",
        rows: [
          ["clone", "git clone <url>"],
          ["fetch", "git fetch origin"],
          ["pull", "git pull --rebase"],
          ["push", "git push -u origin branch"],
        ],
      },
    ],
  },
  {
    slug: "linux",
    title: "Linux",
    description: "Terminal commands that matter daily.",
    sections: [
      {
        title: "Files",
        rows: [
          ["navigate", "pwd, ls -la, cd path"],
          ["copy/move", "cp -r src dst, mv a b"],
          ["find", "find . -name '*.csv' -mtime -7"],
          ["size", "du -sh * | sort -h"],
        ],
      },
      {
        title: "Text",
        rows: [
          ["search", "grep -rn 'pattern' ."],
          ["columns", "awk -F',' '{print $2}' data.csv"],
          ["replace", "sed 's/old/new/g' in.txt > out.txt"],
          ["pipes", "sort | uniq -c | sort -rn | head"],
        ],
      },
      {
        title: "Processes",
        rows: [
          ["list", "ps aux | grep python"],
          ["live", "top / htop"],
          ["kill", "kill -9 PID (last resort)"],
          ["background", "nohup job &  /  ctrl+z, bg"],
        ],
      },
      {
        title: "Permissions & disk",
        rows: [
          ["chmod", "chmod 755 script.sh"],
          ["chown", "sudo chown user:group file"],
          ["df", "df -h"],
          ["free", "free -h"],
        ],
      },
    ],
  },
  {
    slug: "pandas",
    title: "Pandas",
    description: "DataFrames for cleaning and analysis.",
    sections: [
      {
        title: "I/O",
        rows: [
          ["read", "pd.read_csv('f.csv'), pd.read_parquet('f.parquet')"],
          ["write", "df.to_csv('out.csv', index=False)"],
          ["sql", "pd.read_sql(query, conn)"],
        ],
      },
      {
        title: "Inspect",
        rows: [
          ["peek", "df.head(), df.info(), df.describe()"],
          ["nulls", "df.isna().sum()"],
          ["duplicates", "df.duplicated().sum()"],
        ],
      },
      {
        title: "Clean",
        rows: [
          ["drop nulls", "df.dropna(subset=['id'])"],
          ["fill", "df['c'].fillna(0)"],
          ["dedupe", "df.drop_duplicates(subset=['id'], keep='last')"],
          ["types", "df['d'] = pd.to_datetime(df['d'])"],
        ],
      },
      {
        title: "Reshape",
        rows: [
          ["select", "df.loc[rows, cols], df.iloc[0:10]"],
          ["filter", "df[df.amount > 100]"],
          ["groupby", "df.groupby('city')['amount'].sum()"],
          ["merge", "pd.merge(a, b, on='key', how='left')"],
        ],
      },
    ],
  },
  {
    slug: "pyspark",
    title: "PySpark",
    description: "DataFrame API essentials.",
    sections: [
      {
        title: "Session",
        rows: [
          ["start", "spark = SparkSession.builder.appName('etl').getOrCreate()"],
          ["read", "df = spark.read.parquet('s3://bucket/path')"],
          ["write", "df.write.mode('overwrite').parquet('out')"],
        ],
      },
      {
        title: "Transform",
        rows: [
          ["select", "df.select('a', 'b').filter(F.col('a') > 0)"],
          ["groupby", "df.groupBy('c').agg(F.sum('x').alias('total'))"],
          ["join", "df1.join(df2, 'key', 'left')"],
          ["with column", "df.withColumn('d', F.col('a') * 2)"],
        ],
      },
      {
        title: "Concepts",
        rows: [
          ["lazy", "Transformations build a plan; actions (count, show) execute"],
          ["shuffle", "groupby/join trigger shuffles — expensive"],
          ["cache", "df.cache() for reuse"],
        ],
      },
    ],
  },
  {
    slug: "docker",
    title: "Docker",
    description: "Containers for repeatable pipelines.",
    sections: [
      {
        title: "Images",
        rows: [
          ["build", "docker build -t etl:latest ."],
          ["pull", "docker pull postgres:16"],
          ["layers", "Order steps least → most volatile"],
        ],
      },
      {
        title: "Containers",
        rows: [
          ["run", "docker run --rm -it etl:latest"],
          ["ports", "docker run -p 5432:5432 postgres:16"],
          ["volumes", "docker run -v $PWD/data:/data etl"],
          ["exec", "docker exec -it db psql -U postgres"],
        ],
      },
      {
        title: "Compose & cleanup",
        rows: [
          ["compose", "docker compose up -d"],
          ["logs", "docker logs -f container"],
          ["cleanup", "docker system prune"],
        ],
      },
    ],
  },
  {
    slug: "regex",
    title: "Regex",
    description: "Pattern matching for cleaning and validation.",
    sections: [
      {
        title: "Basics",
        rows: [
          ["classes", "\\\\d digit, \\\\w word char, \\\\s whitespace"],
          ["quantifiers", "* 0+, + 1+, ? 0/1, {2,4} range"],
          ["anchors", "^ start, $ end, \\\\b word boundary"],
          ["groups", "(...) capture, (?:...) non-capture"],
        ],
      },
      {
        title: "Common patterns",
        rows: [
          ["email (loose)", "^[\\\\w.+-]+@[\\\\w-]+\\\\.[\\\\w.]+$"],
          ["date ISO", "^\\\\d{4}-\\\\d{2}-\\\\d{2}$"],
          ["decimal", "^\\\\d+(\\\\.\\\\d+)?$"],
          ["python", "re.findall(r'\\\\d+', text), re.sub(r'\\\\s+', ' ', text)"],
        ],
      },
    ],
  },
  {
    slug: "data-engineering",
    title: "Data Engineering",
    description: "Pipeline design vocabulary and rules of thumb.",
    sections: [
      {
        title: "Architecture",
        rows: [
          ["layers", "raw → clean → marts"],
          ["etl vs elt", "transform before vs after load"],
          ["idempotency", "same run → same state; safe retries"],
          ["backfill", "reprocess history deterministically"],
        ],
      },
      {
        title: "Quality",
        rows: [
          ["checks", "nulls, duplicates, types, ranges, freshness"],
          ["rejects", "log bad rows; don't lose them"],
          ["row counts", "log in/out at every stage"],
        ],
      },
      {
        title: "Modeling",
        rows: [
          ["star", "fact + dimensions"],
          ["grain", "one row = what? decide first"],
          ["scd", "type 2 keeps history with valid_from/valid_to"],
        ],
      },
      {
        title: "Orchestration",
        rows: [
          ["dag", "tasks + dependencies + schedule"],
          ["retries", "per-task, with backoff"],
          ["monitoring", "success/failure + freshness + volume anomalies"],
        ],
      },
    ],
  },
];
