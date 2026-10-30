import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { resolve, relative } from "node:path";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString } from "mdast-util-to-string";

export const root = resolve(import.meta.dirname, "..");
export const parser = unified().use(remarkParse).use(remarkGfm);
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export function filesUnder(folder) {
  return readdirSync(folder, { withFileTypes: true })
    .flatMap((entry) => {
      const path = resolve(folder, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    })
    .sort();
}
export function tableRows(text, pattern) {
  return parser
    .parse(text)
    .children.filter((node) => node.type === "table")
    .flatMap((table) => table.children)
    .map((row) => row.children.map((cell) => toString(cell)))
    .filter((cells) => pattern.test(cells[0]));
}
function sections(text, pattern) {
  const headings = parser
    .parse(text)
    .children.filter((node) => node.type === "heading" && node.depth === 2);
  return Object.fromEntries(
    headings.flatMap((heading, index) => {
      const label = toString(heading);
      if (!pattern.test(label)) return [];
      return [
        [
          label,
          text
            .slice(
              heading.position.end.offset,
              headings[index + 1]?.position.start.offset ?? text.length,
            )
            .trim(),
        ],
      ];
    }),
  );
}
const categories = [
  "Linux and networking",
  "AWS",
  "Docker",
  "Kubernetes and EKS",
  "Terraform",
  "GitHub Actions",
  "Helm",
  "ArgoCD",
  "Monitoring and observability",
  "Security and identity",
  "Application and infrastructure troubleshooting",
];
function questionCategories(question) {
  const number = Number(question.id.slice(1));
  const result = [];
  if (number <= 8 || [61, 63, 64].includes(number)) result.push(categories[0]);
  const groups = [
    [1, 10, 1],
    [11, 11, 2],
    [12, 23, 3],
    [24, 26, 4],
    [27, 29, 5],
    [31, 32, 6],
    [30, 30, 7],
    [33, 33, 7],
    [34, 39, 8],
    [40, 44, 9],
  ];
  for (const [minimum, maximum, category] of groups) {
    if (
      question.resume.some(
        (id) =>
          Number(id.slice(1)) >= minimum && Number(id.slice(1)) <= maximum,
      )
    )
      result.push(categories[category]);
  }
  if (question.resume.includes("R03")) result.push(categories[9]);
  if (
    question.type === "diagnosis" ||
    question.resume.some((id) => Number(id.slice(1)) >= 45)
  )
    result.push(categories[10]);
  return [...new Set(result)];
}
export function buildContent() {
  const source = resolve(root, "academy-content");
  const manifest = JSON.parse(
    readFileSync(resolve(root, "content/source-manifest.json"), "utf8"),
  );
  const files = Object.fromEntries(
    filesUnder(source).map((path) => {
      const name = relative(source, path).split("\\").join("/");
      const buffer = readFileSync(path);
      assert.equal(
        hash(buffer),
        manifest[name],
        `Changed course source: ${name}`,
      );
      return [name, buffer.toString("utf8")];
    }),
  );
  assert.equal(Object.keys(files).length, Object.keys(manifest).length);
  const plan = JSON.parse(files["content/roadmap/plan.json"]);
  const questions = JSON.parse(
    files["content/interview-questions/questions.json"],
  ).questions;
  const incidents = JSON.parse(files["content/troubleshooting/incidents.json"]);
  const answers = sections(
    files["content/interview-questions/answers.md"],
    /^Q\d+$/,
  );
  const hints = sections(files["content/troubleshooting/hints.md"], /^H\d+$/);
  const solutions = sections(
    files["content/troubleshooting/solutions.md"],
    /^S\d+$/,
  );
  const claimRows = tableRows(
    files["content/resume-defense/defense.md"],
    /^C\d{2}\s/,
  );
  const excerpts = JSON.parse(
    readFileSync(resolve(root, "content/claim-excerpts.json"), "utf8"),
  );
  const claims = claimRows.map((row) => ({
    id: row[0].slice(0, 3),
    title: row[0].slice(4),
    exercise: row[1],
    verification: row[2],
    ...excerpts[row[0].slice(0, 3)],
  }));
  const lessons = plan.days.map((day) => ({
    ...day,
    path: relative(source, resolve(source, "content/roadmap", day.lesson))
      .split("\\")
      .join("/"),
  }));
  const projects = Array.from({ length: 5 }, (_, index) => {
    const id = `P0${index + 1}`;
    const path = `content/projects/project-0${index + 1}.md`;
    const tree = parser.parse(files[path]);
    return {
      id,
      path,
      title: toString(tree.children.find((node) => node.type === "heading")),
      checklist: tree.children
        .filter((node) => node.type === "heading" && node.depth === 2)
        .map(toString),
    };
  });
  for (const [count, actual] of [
    [30, lessons.length],
    [5, projects.length],
    [40, incidents.length],
    [100, questions.length],
    [24, claims.length],
  ])
    assert.equal(actual, count);
  assert.equal(Object.keys(answers).length, 100);
  assert.equal(Object.keys(hints).length, 40);
  assert.equal(Object.keys(solutions).length, 40);
  for (const lesson of lessons) {
    assert(files[lesson.path], lesson.path);
    assert.equal(
      parser
        .parse(files[lesson.path])
        .children.filter((node) => node.type === "heading" && node.depth === 2)
        .length,
      10,
    );
    lesson.questions.forEach((id) => assert(answers[id], id));
  }
  const diagrams = [];
  for (const text of Object.values(files)) {
    for (const node of parser.parse(text).children) {
      if (node.type === "code" && node.lang === "mermaid")
        diagrams.push({
          id: hash(node.value).slice(0, 16),
          source: node.value,
        });
    }
  }
  const data = {
    lessons,
    projects,
    incidents,
    questions: questions.map((question) => ({
      ...question,
      categories: questionCategories(question),
    })),
    claims,
    answers,
    hints,
    solutions,
    files,
    categories,
    diagrams,
  };
  mkdirSync(resolve(root, "public"), { recursive: true });
  writeFileSync(resolve(root, "public/course.json"), JSON.stringify(data));
  console.log(
    `Content verified: ${lessons.length} lessons, ${projects.length} projects, ${incidents.length} cases, ${questions.length} questions, ${claims.length} claims; ${Object.keys(files).length} unchanged source files.`,
  );
  return data;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(import.meta.filename)
) {
  const data = buildContent();
  if (process.argv.includes("--check-diagrams")) {
    for (const diagram of data.diagrams)
      assert(
        existsSync(resolve(root, `public/assets/diagrams/${diagram.id}.svg`)),
        `Missing diagram ${diagram.id}`,
      );
  }
}
