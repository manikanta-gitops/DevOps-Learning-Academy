import { useMemo, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { Check, Copy, Download } from "lucide-react";
import type { Course } from "./types";

const REMARK_PLUGINS = [remarkGfm];

export const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/\s+/g, "-");
export function sourceRoute(path: string, anchor = "", course?: Course) {
  if (path === "content/interview-questions/answers.md")
    return /^q\d+$/i.test(anchor)
      ? `/interviews/${anchor.toUpperCase()}`
      : "/interviews";
  if (/content\/troubleshooting\/(hints|solutions)\.md/.test(path))
    return /^[hs]\d+$/i.test(anchor)
      ? `/scenarios/I${anchor.slice(1)}`
      : "/scenarios";
  if (path === "content/interview-questions/questions.json")
    return "/interviews";
  if (path === "content/troubleshooting/incidents.json") return "/scenarios";
  const lesson = course?.lessons.find((item) => item.path === path);
  const project = course?.projects.find((item) => item.path === path);
  const route = lesson
    ? `/lessons/${lesson.day}`
    : project
      ? `/projects/${project.id}`
      : course && !(path in course.files)
        ? "/about"
        : `/reference?path=${encodeURIComponent(path)}`;
  return anchor
    ? `${route}${route.includes("?") ? "&" : "?"}section=${encodeURIComponent(anchor)}`
    : route;
}
export function CodeBlock({
  text,
  language = "text",
}: {
  text: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{language}</span>
        <button
          className="icon-button"
          type="button"
          title="Copy code"
          aria-label="Copy code"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setError("");
              setTimeout(() => setCopied(false), 1800);
            } catch {
              setError(
                "Copy unavailable. Select the code to copy it manually.",
              );
            }
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <pre>
        <code>{text}</code>
      </pre>
      <span className="sr-only" role="status">
        {copied ? "Copied" : error}
      </span>
      {error && <p className="copy-error">{error}</p>}
    </div>
  );
}
export function DownloadSource({
  path,
  course,
}: {
  path: string;
  course: Course;
}) {
  return (
    <button
      className="button secondary"
      onClick={() => {
        const url = URL.createObjectURL(
          new Blob([course.files[path]], { type: "text/plain;charset=utf-8" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = path.split("/").pop() || "source.txt";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}
    >
      <Download size={16} /> Download source
    </button>
  );
}
export default function Reader({
  text,
  path = "README.md",
  course,
}: {
  text: string;
  path?: string;
  course: Course;
}) {
  const components = useMemo(
    () => ({
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="source-title">{children}</h2>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 id={`doc-${slug(String(children))}`}>{children}</h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 id={`doc-${slug(String(children))}`}>{children}</h3>
      ),
      table: ({ children }: { children?: React.ReactNode }) => (
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Content table"
        >
          <table>{children}</table>
        </div>
      ),
      pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
      code: ({
        children,
        className,
        node,
      }: {
        children?: React.ReactNode;
        className?: string;
        node?: { position?: { start: { line: number }; end: { line: number } } };
      }) => {
        const content = String(children).replace(/\n$/, "");
        const language = className?.replace("language-", "");
        if (language === "mermaid") {
          const diagram = course.diagrams.find(
            (item) => item.source.trim() === content.trim(),
          );
          return diagram ? (
            <figure>
              <img
                className="architecture"
                src={`${import.meta.env.BASE_URL}assets/diagrams/${diagram.id}.svg`}
                alt="Training architecture and workflow diagram"
              />
              <details>
                <summary>Diagram source</summary>
                <CodeBlock text={content} language="mermaid" />
              </details>
            </figure>
          ) : (
            <CodeBlock text={content} language="mermaid" />
          );
        }
        return language ||
          (node?.position &&
            node.position.end.line > node.position.start.line) ? (
          <CodeBlock text={content} language={language} />
        ) : (
          <code>{children}</code>
        );
      },
      a: ({
        href = "",
        children,
      }: {
        href?: string;
        children?: React.ReactNode;
      }) => {
        if (/^https?:\/\//.test(href))
          return (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          );
        if (/^(mailto:|tel:)/.test(href))
          return <a href={href}>{children}</a>;
        const url = new URL(href, `https://course.local/${path}`);
        return (
          <Link
            to={sourceRoute(
              decodeURIComponent(url.pathname.slice(1)),
              decodeURIComponent(url.hash.slice(1)),
              course,
            )}
          >
            {children}
          </Link>
        );
      },
    }),
    [course, path],
  );
  return (
    <div className="prose">
      <Markdown remarkPlugins={REMARK_PLUGINS} components={components}>
        {text}
      </Markdown>
    </div>
  );
}
