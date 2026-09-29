import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
  className?: string;
}

/** Shared markdown renderer: headings, lists, tables, inline code, code blocks. */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={className ?? "markdown"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => <a {...props} className="text-accent-400 underline underline-offset-4" />,
          table: (props) => (
            <div className="overflow-x-auto my-4">
              <table {...props} className="w-full text-sm border-collapse" />
            </div>
          ),
          th: (props) => (
            <th {...props} className="border border-ink-700 bg-ink-800/60 px-3 py-2 text-left font-medium" />
          ),
          td: (props) => <td {...props} className="border border-ink-700 px-3 py-2 align-top" />,
          blockquote: (props) => (
            <blockquote
              {...props}
              className="border-l-2 border-accent-500/60 pl-4 italic text-ink-300 my-4"
            />
          ),
          code: ({ className: cls, children, ...rest }) => {
            const isBlock = /language-/.test(cls || "") || String(children).includes("\n");
            if (isBlock) {
              return (
                <code {...rest} className={cls}>
                  {children}
                </code>
              );
            }
            return (
              <code
                {...rest}
                className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-300"
              >
                {children}
              </code>
            );
          },
          pre: (props) => (
            <pre
              {...props}
              className="overflow-x-auto rounded-lg border border-ink-700 bg-ink-900/80 p-4 text-sm leading-relaxed"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
