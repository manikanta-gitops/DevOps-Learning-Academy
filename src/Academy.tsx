import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  HashRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  FileText,
  FlaskConical,
  FolderKanban,
  LayoutDashboard,
  Library,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Terminal,
  Trash2,
  Workflow,
  X,
} from "lucide-react";
import Reader, { CodeBlock, DownloadSource, slug, sourceRoute } from "./Reader";
import { emptyPractice, useProgress } from "./progress";
import type { Course, Practice, Progress } from "./types";
import "./academy.css";

const phases = [
  "Foundations & diagnosis",
  "Cloud & container runtime",
  "Delivery & infrastructure",
  "GitOps & observability",
  "Integration & resume defense",
  "Interview readiness",
];
const phaseRanges = [
  "01 - 05",
  "06 - 12",
  "13 - 18",
  "19 - 24",
  "25 - 27",
  "28 - 30",
];
type State = ReturnType<typeof useProgress>;
type ViewProps = { course: Course; state: State };
const labelDay = (day: number) => String(day).padStart(2, "0");
const count = (progress: Progress, ids: string[]) =>
  ids.filter((id) => progress.completed[id]).length;
function PageTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </header>
  );
}
function Completion({
  id,
  state,
  label = "Mark complete",
  disabled = false,
}: {
  id: string;
  state: State;
  label?: string;
  disabled?: boolean;
}) {
  const checked = !!state.progress.completed[id];
  return (
    <label className={`completion ${checked ? "is-complete" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) =>
          state.setProgress((previous) => ({
            ...previous,
            completed: { ...previous.completed, [id]: event.target.checked },
          }))
        }
      />
      {checked ? "Completed" : label}
    </label>
  );
}
function Checklist({
  id,
  items,
  state,
}: {
  id: string;
  items: string[];
  state: State;
}) {
  return (
    <div className="checklist">
      {items.map((item, index) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={!!state.progress.checks[`${id}:${index}`]}
            onChange={(event) =>
              state.setProgress((previous) => ({
                ...previous,
                checks: {
                  ...previous.checks,
                  [`${id}:${index}`]: event.target.checked,
                },
              }))
            }
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}
function Dashboard({ course, state }: ViewProps) {
  const done = count(
    state.progress,
    course.lessons.map((item) => `D${item.day}`),
  );
  const next = course.lessons.find(
    (item) => !state.progress.completed[`D${item.day}`],
  );
  const continuation = course.lessons.find(
    (item) => item.day === state.progress.lastLesson,
  )!;
  const metrics = [
    {
      title: "Lessons completed",
      value: done,
      total: 30,
      icon: BookOpen,
      route: "/roadmap",
      color: "teal",
    },
    {
      title: "Projects completed",
      value: count(
        state.progress,
        course.projects.map((item) => item.id),
      ),
      total: 5,
      icon: FolderKanban,
      route: "/projects",
      color: "blue",
    },
    {
      title: "Scenarios solved",
      value: count(
        state.progress,
        course.incidents.map((item) => item.id),
      ),
      total: 40,
      icon: FlaskConical,
      route: "/scenarios",
      color: "amber",
    },
    {
      title: "Questions practised",
      value: count(
        state.progress,
        course.questions.map((item) => item.id),
      ),
      total: 100,
      icon: MessageSquare,
      route: "/interviews",
      color: "rose",
    },
  ];
  return (
    <>
      <PageTitle eyebrow="Your workspace" title="Learning overview">
        <p>Understand. Implement. Troubleshoot. Explain.</p>
      </PageTitle>
      <div className="stats-grid">
        {metrics.map((metric) => (
          <Link
            className={`stat ${metric.color}`}
            to={metric.route}
            key={metric.title}
          >
            <metric.icon size={21} />
            <span className="stat-label">{metric.title}</span>
            <span className="stat-value">
              {metric.value}
              <small> / {metric.total}</small>
            </span>
            <progress
              aria-label={metric.title}
              value={metric.value}
              max={metric.total}
            />
          </Link>
        ))}
      </div>
      <section className="next-session">
        <div>
          <p className="eyebrow">
            {next ? "Today's recommendation" : "All lessons marked complete"}
          </p>
          <div className="session-meta">
            <span className="tag">
              DAY {labelDay((next || continuation).day)}
            </span>
            <span>
              <Clock3 size={15} /> 90 minutes
            </span>
          </div>
          <h2>{(next || continuation).title}</h2>
          <p>{phases[(next || continuation).phase - 1]}</p>
          <div className="actions">
            <Link
              className="button primary"
              to={`/lessons/${continuation.day}`}
            >
              Continue learning <ArrowRight size={17} />
            </Link>
            {next && next.day !== continuation.day && (
              <Link className="button secondary" to={`/lessons/${next.day}`}>
                Open recommended lesson
              </Link>
            )}
          </div>
        </div>
        <div className="session-budget">
          <h3>Your study session</h3>
          {[
            ["Concepts", 20],
            ["Hands-on lab", 40],
            ["Interview & investigation", 20],
            ["Revision", 10],
          ].map(([label, minutes]) => (
            <div className="budget-row" key={label}>
              <span>{label}</span>
              <b>
                {minutes}
                <small> min</small>
              </b>
            </div>
          ))}
        </div>
      </section>
      <div className="section-heading">
        <h2>Your learning path</h2>
        <Link to="/roadmap">
          Full roadmap <ArrowRight size={16} />
        </Link>
      </div>
      <div className="phase-list">
        {phases.map((phase, index) => {
          const lessons = course.lessons.filter(
            (item) => item.phase === index + 1,
          );
          const completed = count(
            state.progress,
            lessons.map((item) => `D${item.day}`),
          );
          return (
            <Link
              to={`/roadmap?phase=${index + 1}`}
              className="phase-row"
              key={phase}
            >
              <span className="phase-number">0{index + 1}</span>
              <div>
                <h3>{phase}</h3>
                <span className="muted">Days {phaseRanges[index]}</span>
              </div>
              <span className="phase-progress">
                <progress
                  aria-label={`${phase} completion`}
                  max={lessons.length}
                  value={completed}
                />
                <small>
                  {completed}/{lessons.length}
                </small>
              </span>
              <ChevronRight size={18} />
            </Link>
          );
        })}
      </div>
      <div className="section-heading">
        <h2>Practice workbench</h2>
      </div>
      <div className="workbench">
        <Link to="/scenarios">
          <FlaskConical />
          <h3>Investigate a failure</h3>
          <span>
            40 evidence-led cases <ArrowRight size={16} />
          </span>
        </Link>
        <Link to="/interviews">
          <MessageSquare />
          <h3>Explain the mechanism</h3>
          <span>
            100 interview questions <ArrowRight size={16} />
          </span>
        </Link>
        <Link to="/claims">
          <ShieldCheck />
          <h3>Defend your contribution</h3>
          <span>
            24 claim-defense exercises <ArrowRight size={16} />
          </span>
        </Link>
      </div>
      <p className="footnote">
        Progress is self-reported and stored in this browser. No assessment or
        professional experience is inferred.
      </p>
    </>
  );
}
function Roadmap({ course, state }: ViewProps) {
  const [params, setParams] = useSearchParams();
  const phase = Number(params.get("phase") || 0);
  return (
    <>
      <PageTitle
        eyebrow="30 sessions / 45 planned hours"
        title="Learning roadmap"
      >
        <p>
          One bounded task at a time. Carry unfinished work into the next
          session.
        </p>
      </PageTitle>
      <div className="filters">
        <label>
          Phase
          <select
            value={phase}
            onChange={(event) =>
              setParams(
                event.target.value === "0" ? {} : { phase: event.target.value },
              )
            }
          >
            <option value="0">All phases</option>
            {phases.map((name, index) => (
              <option value={index + 1} key={name}>
                {index + 1}. {name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {phases.map(
        (name, index) =>
          (!phase || phase === index + 1) && (
            <section key={name} className="roadmap-phase">
              <div className="section-heading">
                <h2>
                  <span className="muted">0{index + 1}</span> {name}
                </h2>
                <span className="muted">Days {phaseRanges[index]}</span>
              </div>
              <div className="lesson-grid">
                {course.lessons
                  .filter((item) => item.phase === index + 1)
                  .map((lesson) => (
                    <Link
                      className="lesson-card"
                      to={`/lessons/${lesson.day}`}
                      key={lesson.day}
                    >
                      <div className="card-meta">
                        <span>DAY {labelDay(lesson.day)}</span>
                        {state.progress.completed[`D${lesson.day}`] ? (
                          <CheckCircle2 size={18} aria-label="Completed" />
                        ) : (
                          <Circle size={16} aria-label="Not completed" />
                        )}
                      </div>
                      <h3>{lesson.title}</h3>
                      <div className="card-footer">
                        <span>
                          <Clock3 size={14} /> 90 min
                        </span>
                        <ArrowRight size={17} />
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          ),
      )}
    </>
  );
}
function LessonPage({ course, state }: ViewProps) {
  const { id } = useParams();
  const lesson = course.lessons.find((item) => item.day === Number(id));
  useEffect(() => {
    if (lesson)
      state.setProgress((previous) =>
        previous.lastLesson === lesson.day
          ? previous
          : { ...previous, lastLesson: lesson.day },
      );
  }, [lesson, state.setProgress]);
  if (!lesson) return <NotFound />;
  const text = course.files[lesson.path];
  const headings = [...text.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  const revision = text.split("## 10. Revision")[1]?.trim() || "";
  return (
    <>
      <Link className="back-link" to="/roadmap">
        <ArrowLeft size={16} /> Roadmap
      </Link>
      <PageTitle
        eyebrow={`Day ${labelDay(lesson.day)} / ${phases[lesson.phase - 1]}`}
        title={lesson.title}
      >
        <div className="actions">
          <span className="tag">
            <Clock3 size={14} /> 90 minutes
          </span>
          <Completion id={`D${lesson.day}`} state={state} />
        </div>
      </PageTitle>
      <div className="reading-layout">
        <article>
          <Reader text={text} path={lesson.path} course={course} />
          <section className="review-block">
            <h2>Revision checklist</h2>
            <Checklist
              id={`D${lesson.day}`}
              items={revision.split(/(?<=[.!?])\s+/).filter(Boolean)}
              state={state}
            />
          </section>
          <section className="related">
            <h2>Practice this lesson</h2>
            <Link to={`/scenarios/${lesson.incident}`}>
              <FlaskConical size={18} /> {lesson.incident} investigation{" "}
              <ArrowRight size={16} />
            </Link>
            {lesson.questions.map((questionId) => (
              <Link key={questionId} to={`/interviews/${questionId}`}>
                <MessageSquare size={18} /> {questionId}:{" "}
                {
                  course.questions.find((item) => item.id === questionId)
                    ?.question
                }
                <ArrowRight size={16} />
              </Link>
            ))}
          </section>
          <nav className="previous-next" aria-label="Lesson navigation">
            {lesson.day > 1 ? (
              <Link to={`/lessons/${lesson.day - 1}`}>
                <ArrowLeft size={17} /> Previous lesson
              </Link>
            ) : (
              <span />
            )}
            {lesson.day < 30 ? (
              <Link to={`/lessons/${lesson.day + 1}`}>
                Next lesson <ArrowRight size={17} />
              </Link>
            ) : (
              <Link to="/">
                Learning overview <ArrowRight size={17} />
              </Link>
            )}
          </nav>
        </article>
        <aside className="contents" aria-label="Lesson contents">
          <p className="eyebrow">On this page</p>
          {headings.map((heading) => (
            <Link key={heading} to={`?section=${slug(heading)}`}>
              {heading}
            </Link>
          ))}
          <DownloadSource path={lesson.path} course={course} />
        </aside>
      </div>
    </>
  );
}
function Projects({ course, state }: ViewProps) {
  return (
    <>
      <PageTitle eyebrow="Build on your daily work" title="Hands-on projects" />
      <div className="project-list">
        {course.projects.map((project, index) => (
          <Link
            className="project-item"
            key={project.id}
            to={`/projects/${project.id}`}
          >
            <span className="project-number">0{index + 1}</span>
            <div>
              <span className="eyebrow">Integrated project</span>
              <h2>{project.title.replace(/^Project \d+: /, "")}</h2>
              <span className="muted">
                {project.checklist.length} sections / Guided, independent &
                investigation
              </span>
            </div>
            {state.progress.completed[project.id] ? (
              <CheckCircle2 aria-label="Completed" />
            ) : (
              <ArrowRight />
            )}
          </Link>
        ))}
      </div>
      <Reader
        text={course.files["content/projects/README.md"]}
        path="content/projects/README.md"
        course={course}
      />
    </>
  );
}
function ProjectPage({ course, state }: ViewProps) {
  const { id } = useParams();
  const project = course.projects.find((item) => item.id === id);
  if (!project) return <NotFound />;
  return (
    <>
      <Link className="back-link" to="/projects">
        <ArrowLeft size={16} /> Projects
      </Link>
      <PageTitle eyebrow="Personal training project" title={project.title}>
        <Completion id={project.id} state={state} />
      </PageTitle>
      <article className="article-wide">
        <Reader
          text={course.files[project.path]}
          path={project.path}
          course={course}
        />
        <section className="review-block">
          <h2>Completion checklist</h2>
          <p className="muted">
            Section review, not proof that an optional integration ran.
          </p>
          <Checklist id={project.id} items={project.checklist} state={state} />
          <p className="footnote">
            Record simulated or unexecuted extensions in your private evidence.
            Completion is your own report.
          </p>
        </section>
        <DownloadSource path={project.path} course={course} />
      </article>
    </>
  );
}
function SearchField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <label className="search-field">
      <Search size={18} />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
      />
    </label>
  );
}
function Scenarios({ course, state }: ViewProps) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const rows = course.incidents.filter(
    (item) =>
      (level === "all" || item.difficulty === level) &&
      `${item.id} ${item.symptom} ${item.architecture}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="Observe / hypothesize / verify"
        title="Troubleshooting practice"
      />
      <div className="filters">
        <SearchField
          value={search}
          onChange={setSearch}
          label="Search scenarios"
        />
        <label>
          Difficulty
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            {["all", "beginner", "intermediate", "advanced"].map((value) => (
              <option value={value} key={value}>
                {value === "all" ? "All levels" : value}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="result-count" role="status">
        {rows.length} of 40 scenarios
      </p>
      <div className="question-list">
        {rows.map((item) => (
          <Link
            className="question-row"
            key={item.id}
            to={`/scenarios/${item.id}`}
          >
            <span className="item-id">{item.id}</span>
            <div>
              <h2>{item.symptom}</h2>
              <span className="muted">{item.difficulty} / simulation</span>
            </div>
            {state.progress.completed[item.id] ? (
              <CheckCircle2 aria-label="Completed" />
            ) : (
              <ChevronRight />
            )}
          </Link>
        ))}
      </div>
      {!rows.length && <EmptyResults />}
    </>
  );
}
function PracticeNotes({
  practice,
  onChange,
  retry = false,
}: {
  practice: Practice;
  onChange: (value: Partial<Practice>) => void;
  retry?: boolean;
}) {
  return (
    <label className="answer-field">
      <span>
        {retry
          ? "Your retry and verification plan"
          : "Your independent attempt"}
      </span>
      <textarea
        rows={5}
        value={retry ? practice.retry : practice.attempt}
        onChange={(event) =>
          onChange(
            retry
              ? { retry: event.target.value }
              : { attempt: event.target.value },
          )
        }
        placeholder={
          retry
            ? "What changed your diagnosis? How would you verify it?"
            : "State your hypothesis, first check, and reasoning. Keep secrets and personal data out."
        }
      />
    </label>
  );
}
function ScenarioPage({ course, state }: ViewProps) {
  const { id } = useParams();
  const item = course.incidents.find((entry) => entry.id === id);
  if (!item) return <NotFound />;
  const practice = state.progress.practices[item.id] || emptyPractice();
  const update = (value: Partial<Practice>) =>
    state.setProgress((previous) => ({
      ...previous,
      practices: {
        ...previous.practices,
        [item.id]: {
          ...(previous.practices[item.id] || emptyPractice()),
          ...value,
        },
      },
    }));
  return (
    <>
      <Link className="back-link" to="/scenarios">
        <ArrowLeft size={16} /> Scenarios
      </Link>
      <PageTitle
        eyebrow={`${item.id} / ${item.difficulty} / simulation`}
        title={item.symptom}
      />
      <div className="article-wide">
        <section className="investigation">
          <h2>Investigation brief</h2>
          <p>{item.architecture}</p>
          <p>{item.prompt}</p>
          <h3>Possible causes</h3>
          <ul>
            {item.possibleCauses.map((cause) => (
              <li key={cause}>{cause}</li>
            ))}
          </ul>
          <PracticeNotes practice={practice} onChange={update} />
          <h3>Evidence desk</h3>
          <div className="evidence-list">
            {item.evidence.map((card, index) => (
              <div className="evidence-card" key={card.check}>
                <button
                  className="evidence-toggle"
                  aria-expanded={practice.evidence.includes(index)}
                  onClick={() =>
                    update({
                      evidence: practice.evidence.includes(index)
                        ? practice.evidence.filter((value) => value !== index)
                        : [...practice.evidence, index],
                    })
                  }
                >
                  <Terminal size={18} />
                  {card.check}
                  <ChevronRight size={16} />
                </button>
                {practice.evidence.includes(index) && (
                  <div className="evidence-content">
                    <CodeBlock
                      text={card.command}
                      language="diagnostic check"
                    />
                    <CodeBlock text={card.output} language="synthetic output" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            className="button secondary"
            disabled={!practice.attempt.trim()}
            onClick={() => update({ hint: !practice.hint })}
          >
            {practice.hint ? "Hide hint" : "Reveal hint"}
          </button>
          {practice.hint && (
            <section className="hint">
              <h3>Investigation hint</h3>
              <Reader
                text={course.hints[`H${item.id.slice(1)}`]}
                course={course}
              />
            </section>
          )}
          <PracticeNotes practice={practice} onChange={update} retry />
          <div className="actions">
            <button
              className="button primary"
              disabled={
                !practice.attempt.trim() ||
                !practice.retry.trim() ||
                !practice.hint
              }
              onClick={() => update({ revealed: !practice.revealed })}
            >
              {practice.revealed ? "Hide resolution" : "Reveal resolution"}
            </button>
            <Completion
              id={item.id}
              label="Mark solved"
              disabled={!practice.attempt.trim() || !practice.retry.trim()}
              state={state}
            />
          </div>
          {practice.revealed && (
            <section className="resolution">
              <h2>Resolution, root cause & prevention</h2>
              <Reader
                text={course.solutions[`S${item.id.slice(1)}`]}
                course={course}
              />
            </section>
          )}
          <p className="footnote">
            Original hint and resolution text. A written attempt is not
            automatically graded. Static bundled answers are not a security
            boundary.
          </p>
        </section>
        <section className="review-block">
          <h2>Investigation process</h2>
          <ol>
            {[
              "State symptom and impact",
              "List plausible causes",
              "Choose the simplest discriminating check",
              "Review its scoped diagnostic evidence",
              "Interpret what it proves and cannot prove",
              "Narrow to the supported cause",
              "Propose the smallest authorized fix",
              "Repeat the original failure check and relevant health checks",
              "Prevent recurrence with a concrete test and owner",
            ].map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
function Interviews({ course, state }: ViewProps) {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const category = params.get("category") || "all";
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    setParams(next, { replace: true });
  };
  const rows = course.questions.filter(
    (item) =>
      (category === "all" || item.categories.includes(category)) &&
      `${item.id} ${item.question} ${item.categories.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="Recall / explain / refine"
        title="Interview preparation"
      />
      <div className="filters">
        <SearchField
          value={search}
          onChange={(value) => update("q", value)}
          label="Search interview questions"
        />
        <label>
          Technology
          <select
            value={category}
            onChange={(event) => update("category", event.target.value)}
          >
            <option value="all">All technologies</option>
            {course.categories.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="result-count" role="status">
        {rows.length} of 100 questions
      </p>
      <div className="question-list">
        {rows.map((item) => (
          <Link
            to={`/interviews/${item.id}`}
            key={item.id}
            className="question-row"
          >
            <span className="item-id">{item.id}</span>
            <div>
              <h2>{item.question}</h2>
              <span className="muted">
                {item.difficulty} / {item.type} / {item.priority}
              </span>
            </div>
            {state.progress.completed[item.id] ? (
              <CheckCircle2 aria-label="Practised" />
            ) : (
              <ChevronRight />
            )}
          </Link>
        ))}
      </div>
      {!rows.length && <EmptyResults />}
    </>
  );
}
function QuestionPage({ course, state }: ViewProps) {
  const { id } = useParams();
  const item = course.questions.find((entry) => entry.id === id);
  if (!item) return <NotFound />;
  const practice = state.progress.practices[item.id] || emptyPractice();
  const update = (value: Partial<Practice>) =>
    state.setProgress((previous) => ({
      ...previous,
      practices: {
        ...previous.practices,
        [item.id]: {
          ...(previous.practices[item.id] || emptyPractice()),
          ...value,
        },
      },
    }));
  return (
    <>
      <Link className="back-link" to="/interviews">
        <ArrowLeft size={16} /> Interview questions
      </Link>
      <PageTitle
        eyebrow={`${item.id} / ${item.difficulty} / ${item.priority}`}
        title={item.question}
      />
      <article className="article-wide">
        <div className="tags">
          {item.categories.map((category) => (
            <Link
              className="tag"
              to={`/interviews?category=${encodeURIComponent(category)}`}
              key={category}
            >
              {category}
            </Link>
          ))}
        </div>
        <section className="review-block">
          <h2>Why this is asked</h2>
          <p>{item.whyAsked}</p>
        </section>
        <PracticeNotes practice={practice} onChange={update} />
        <div className="actions">
          <button
            className="button primary"
            disabled={!practice.attempt.trim()}
            onClick={() => update({ revealed: !practice.revealed })}
          >
            {practice.revealed ? "Hide model answer" : "Reveal model answer"}
          </button>
          <Completion
            id={item.id}
            label="Mark practised"
            disabled={!practice.attempt.trim()}
            state={state}
          />
        </div>
        {practice.revealed && (
          <section className="resolution">
            <h2>Model answer & common mistakes</h2>
            <Reader text={course.answers[item.id]} course={course} />
            <PracticeNotes practice={practice} onChange={update} retry />
          </section>
        )}
        <section className="review-block">
          <h2>Technical follow-ups</h2>
          <ul>
            {item.followUps.map((followUp) => (
              <li key={followUp}>{followUp}</li>
            ))}
          </ul>
        </section>
        <p className="footnote">
          Practice is self-reported, not an assessed score. Model answers are
          explanations, not employment stories.
        </p>
        {item.day && (
          <Link className="button secondary" to={`/lessons/${item.day}`}>
            <BookOpen size={16} /> Day {item.day} lesson
          </Link>
        )}
      </article>
    </>
  );
}
function Claims({ course, state }: ViewProps) {
  return (
    <>
      <PageTitle eyebrow="Evidence before claims" title="Resume claim defense">
        <p>
          Personally implemented, supported, observed, studied, or practised in
          a lab.
        </p>
      </PageTitle>
      <div className="notice">
        Professional role, dates and contribution ownership remain unconfirmed.
        Completing a lab does not establish past production experience.
      </div>
      <div className="question-list">
        {course.claims.map((item) => (
          <Link
            className="question-row"
            key={item.id}
            to={`/claims/${item.id}`}
          >
            <span className="item-id">{item.id}</span>
            <div>
              <h2>{item.title}</h2>
              <span className="muted">Contribution evidence exercise</span>
            </div>
            {state.progress.completed[item.id] ? (
              <CheckCircle2 aria-label="Completed" />
            ) : (
              <ChevronRight />
            )}
          </Link>
        ))}
      </div>
    </>
  );
}
function ClaimPage({ course, state }: ViewProps) {
  const { id } = useParams();
  const item = course.claims.find((entry) => entry.id === id);
  if (!item) return <NotFound />;
  const practice = state.progress.practices[item.id] || emptyPractice();
  return (
    <>
      <Link className="back-link" to="/claims">
        <ArrowLeft size={16} /> Claim defense
      </Link>
      <PageTitle
        eyebrow={`${item.id} / Ownership unconfirmed`}
        title={item.title}
      />
      <article className="article-wide">
        {[
          ["What the claim means", item.meaning],
          ["Technical follow-up questions", item.followUp],
          ["Required exercise and evidence", item.exercise],
          ["Verification and honest boundaries", item.verification],
        ].map(([title, text]) => (
          <section className="review-block" key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <section className="review-block">
          <h2>Your contribution record</h2>
          <p>
            Actual classification; context; your action; what others did;
            evidence you may discuss; verification; limitations; next learning
            task. Leave unknown fields unknown. Do not enter employer
            identifiers, secrets or sensitive personal information.
          </p>
          <PracticeNotes
            practice={practice}
            onChange={(value) =>
              state.setProgress((previous) => ({
                ...previous,
                practices: {
                  ...previous.practices,
                  [item.id]: {
                    ...(previous.practices[item.id] || emptyPractice()),
                    ...value,
                  },
                },
              }))
            }
          />
          <Completion
            id={item.id}
            label="Mark exercise complete"
            disabled={!practice.attempt.trim()}
            state={state}
          />
        </section>
        <Link
          className="button secondary"
          to="/reference?path=content%2Fresume-defense%2Fdefense.md"
        >
          <ShieldCheck size={16} /> Explanation framework and evidence matrix
        </Link>
      </article>
    </>
  );
}
function LibraryPage({ course }: ViewProps) {
  const [search, setSearch] = useState("");
  const files = Object.keys(course.files).filter((path) =>
    path.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageTitle eyebrow="Original course material" title="Reference library">
        <p>
          Curriculum source and fixtures. These files are not website-hosting
          infrastructure.
        </p>
      </PageTitle>
      <SearchField
        value={search}
        onChange={setSearch}
        label="Search source files"
      />
      <p className="result-count">{files.length} files</p>
      <div className="file-list">
        {files.map((path) => (
          <Link key={path} to={sourceRoute(path, "", course)}>
            <FileText size={17} />
            <span>{path}</span>
            <ChevronRight size={16} />
          </Link>
        ))}
      </div>
      {!files.length && <EmptyResults />}
    </>
  );
}
function ReferencePage({ course }: ViewProps) {
  const [params] = useSearchParams();
  const path = params.get("path") || "README.md";
  if (
    /content\/troubleshooting\/(hints|solutions)\.md/.test(path) ||
    path === "content/interview-questions/answers.md"
  )
    return <Navigate to={sourceRoute(path, "", course)} replace />;
  if (!(path in course.files)) return <NotFound />;
  return (
    <>
      <Link className="back-link" to="/library">
        <ArrowLeft size={16} /> Reference library
      </Link>
      <PageTitle
        eyebrow="Unchanged Stage 2 source"
        title={path.split("/").pop() || path}
      >
        <DownloadSource path={path} course={course} />
      </PageTitle>
      <article className="article-wide">
        {path.endsWith(".md") ? (
          <Reader text={course.files[path]} path={path} course={course} />
        ) : (
          <CodeBlock
            text={course.files[path]}
            language={path.split(".").pop()}
          />
        )}
      </article>
    </>
  );
}
function SearchPage({ course }: ViewProps) {
  const [params] = useSearchParams();
  const query = (params.get("q") || "").trim().toLowerCase();
  const entries = [
    ...course.lessons.map((item) => ({
      title: `Day ${item.day}: ${item.title}`,
      text: course.files[item.path],
      route: `/lessons/${item.day}`,
      type: "Lesson",
    })),
    ...course.projects.map((item) => ({
      title: item.title,
      text: course.files[item.path],
      route: `/projects/${item.id}`,
      type: "Project",
    })),
    ...course.questions.map((item) => ({
      title: `${item.id}: ${item.question}`,
      text: item.categories.join(" "),
      route: `/interviews/${item.id}`,
      type: "Interview",
    })),
    ...course.incidents.map((item) => ({
      title: `${item.id}: ${item.symptom}`,
      text: item.architecture,
      route: `/scenarios/${item.id}`,
      type: "Scenario",
    })),
    ...course.claims.map((item) => ({
      title: `${item.id}: ${item.title}`,
      text: item.exercise,
      route: `/claims/${item.id}`,
      type: "Claim",
    })),
  ];
  const results = query
    ? entries.filter((item) =>
        `${item.title} ${item.text}`.toLowerCase().includes(query),
      )
    : [];
  return (
    <>
      <PageTitle
        eyebrow="Across the academy"
        title={
          query ? `Results for "${params.get("q")}"` : "Search the academy"
        }
      />
      <p role="status">{results.length} results</p>
      <div className="question-list">
        {results.map((item) => (
          <Link className="question-row" to={item.route} key={item.route}>
            <Search size={18} />
            <div>
              <span className="eyebrow">{item.type}</span>
              <h2>{item.title}</h2>
            </div>
            <ChevronRight size={17} />
          </Link>
        ))}
      </div>
      {!results.length && <EmptyResults />}
    </>
  );
}
function SettingsPage({ state }: ViewProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <PageTitle eyebrow="Browser-local preferences" title="Settings" />
      <section className="settings-section">
        <h2>Appearance</h2>
        <label>
          Theme
          <select
            aria-label="Theme"
            value={state.progress.theme}
            onChange={(event) =>
              state.setProgress((previous) => ({
                ...previous,
                theme: event.target.value as Progress["theme"],
              }))
            }
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </section>
      <section className="settings-section">
        <h2>Learning progress</h2>
        <p>
          Progress and practice notes stay in this browser profile and site
          origin. They do not sync across devices. Clearing browser data removes
          them. Do not store confidential information here.
        </p>
        <button
          className="button danger"
          onClick={() => dialog.current?.showModal()}
        >
          <Trash2 size={16} /> Reset progress
        </button>
      </section>
      <dialog ref={dialog} aria-labelledby="reset-heading">
        <h2 id="reset-heading">Reset all learning progress?</h2>
        <p>
          This removes completion marks, checklists and practice notes in this
          browser. This cannot be undone.
        </p>
        <div className="actions">
          <button
            className="button secondary"
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            Cancel
          </button>
          <button
            className="button danger"
            onClick={() => {
              state.reset();
              dialog.current?.close();
            }}
          >
            Confirm reset
          </button>
        </div>
      </dialog>
    </>
  );
}
function About() {
  return (
    <>
      <PageTitle
        eyebrow="Source boundaries and limitations"
        title="Content notes"
      />
      <article className="article-wide">
        <section className="review-block">
          <h2>Gradle / Maven mapping</h2>
          <p>
            The Stage 1 inventory defines <strong>R49 as Gradle</strong> and{" "}
            <strong>R50 as Maven</strong>. Some Stage 2 references, including
            Q82/Q83, reverse these IDs. All source wording is preserved.
            Technology filters use the named subject; the ID discrepancy is not
            silently rewritten.
          </p>
        </section>
        <section className="review-block">
          <h2>Private source references</h2>
          <p>
            The original resume, full audit and personal progress records are
            deliberately not included in this public project. Links to those
            private originals lead here. Claim pages contain only the approved
            technical-meaning and follow-up table excerpts, alongside the
            existing Stage 2 exercises.
          </p>
        </section>
        <section className="review-block">
          <h2>Evidence and publishing</h2>
          <p>
            All 30 lessons, five projects, 40 cases, 100 questions and 24 claim
            exercises come from the approved curriculum. Scenario evidence is
            synthetic; optional cloud and SaaS integrations are not verified by
            using this website. The website itself is a static React application
            for GitHub Pages, with no backend, database or cloud infrastructure.
          </p>
          <p>
            Hints, resolutions and answers are separated in the interface, not
            securely hidden from inspection of static files. Practice and
            completion are self-reported. No AI grading or employment claims are
            generated.
          </p>
        </section>
        <section className="review-block">
          <h2>Source tools</h2>
          <p>
            The preserved Stage 2 Ruby validator references private files
            outside its original folder. It is an archival authoring tool, not
            the standalone website check. This project uses its own content
            hashes, parser and browser tests.
          </p>
        </section>
      </article>
    </>
  );
}
function EmptyResults() {
  return (
    <div className="empty">
      <Search size={28} />
      <h2>No matches</h2>
      <p>Try a different search or filter.</p>
    </div>
  );
}
function NotFound() {
  return (
    <>
      <PageTitle eyebrow="404" title="Page not found" />
      <Link className="button primary" to="/">
        Return to learning overview <ArrowRight size={17} />
      </Link>
    </>
  );
}
function Shell({ course }: { course: Course }) {
  const state = useProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const sidebar = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigation = [
    { route: "/", label: "Overview", icon: LayoutDashboard },
    { route: "/roadmap", label: "30-day roadmap", icon: BookOpen },
    { route: "/projects", label: "Hands-on projects", icon: FolderKanban },
    { route: "/scenarios", label: "Troubleshooting", icon: FlaskConical },
    { route: "/interviews", label: "Interview practice", icon: MessageSquare },
    { route: "/claims", label: "Resume defense", icon: ShieldCheck },
    { route: "/library", label: "Reference library", icon: Library },
  ];
  useEffect(() => {
    const section = new URLSearchParams(location.search).get("section");
    const target = section
      ? document.getElementById(`doc-${slug(section)}`)
      : document.querySelector<HTMLElement>("main h1");
    if (section) target?.scrollIntoView({ block: "start" });
    else {
      window.scrollTo(0, 0);
      target?.setAttribute("tabindex", "-1");
      target?.focus({ preventScroll: true });
    }
    document.title = `${document.querySelector("main h1")?.textContent || "Study"} | DevOps Learning Academy`;
  }, [location.pathname, location.search]);
  useEffect(() => {
    if (!menu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const elements = () =>
      Array.from(
        sidebar.current?.querySelectorAll<HTMLElement>("a, button") || [],
      ).filter((element) => element.getClientRects().length);
    elements()[0]?.focus();
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const choices = elements();
        const first = choices[0];
        const last = choices[choices.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handler);
      menuButton.current?.focus();
    };
  }, [menu]);
  const props = { course, state };
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      {menu && (
        <button
          className="nav-scrim"
          aria-label="Close navigation"
          onClick={() => {
            setMenu(false);
            menuButton.current?.focus();
          }}
        />
      )}
      <aside
        ref={sidebar}
        aria-label="Academy navigation"
        className={`sidebar ${menu ? "open" : ""}`}
        id="navigation"
      >
        <div className="brand">
          <Workflow size={29} />
          <Link to="/" onClick={() => setMenu(false)}>
            DevOps<span>Learning Academy</span>
          </Link>
          <button
            className="icon-button mobile-only"
            aria-label="Close navigation menu"
            onClick={() => {
              setMenu(false);
              menuButton.current?.focus();
            }}
          >
            <X size={20} />
          </button>
        </div>
        <p className="nav-caption">LEARNING WORKSPACE</p>
        <nav aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink
              end={item.route === "/"}
              key={item.route}
              to={item.route}
              onClick={() => setMenu(false)}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-progress">
            <span>Course progress</span>
            <b>
              {count(
                state.progress,
                course.lessons.map((item) => `D${item.day}`),
              )}
              /30
            </b>
            <progress
              aria-label="Course progress"
              max={30}
              value={count(
                state.progress,
                course.lessons.map((item) => `D${item.day}`),
              )}
            />
          </div>
          <NavLink to="/about" onClick={() => setMenu(false)}>
            <FileText size={17} /> Content notes
          </NavLink>
          <NavLink to="/settings" onClick={() => setMenu(false)}>
            <Settings size={17} /> Settings
          </NavLink>
        </div>
      </aside>
      <div className="workspace" inert={menu}>
        <header className="topbar">
          <button
            ref={menuButton}
            className="icon-button mobile-only"
            aria-label="Open navigation"
            aria-expanded={menu}
            aria-controls="navigation"
            onClick={() => setMenu(true)}
          >
            <Menu size={21} />
          </button>
          <form
            className="global-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              navigate(`/search?q=${encodeURIComponent(query)}`);
            }}
          >
            <Search size={18} />
            <input
              aria-label="Search academy"
              placeholder="Search the academy"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              className="icon-button"
              type="submit"
              aria-label="Submit search"
            >
              <ArrowRight size={17} />
            </button>
          </form>
          <span className="local-badge">
            <span />
            Local progress
          </span>
          <button
            className="icon-button"
            title="Toggle color theme"
            aria-label="Toggle color theme"
            onClick={() =>
              state.setProgress((previous) => ({
                ...previous,
                theme:
                  document.documentElement.dataset.theme === "dark"
                    ? "light"
                    : "dark",
              }))
            }
          >
            {state.progress.theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>
        </header>
        {state.warning && (
          <div className="storage-warning" role="alert">
            {state.warning}
          </div>
        )}
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Dashboard {...props} />} />
            <Route path="/roadmap" element={<Roadmap {...props} />} />
            <Route path="/lessons/:id" element={<LessonPage {...props} />} />
            <Route path="/projects" element={<Projects {...props} />} />
            <Route path="/projects/:id" element={<ProjectPage {...props} />} />
            <Route path="/scenarios" element={<Scenarios {...props} />} />
            <Route
              path="/scenarios/:id"
              element={<ScenarioPage {...props} />}
            />
            <Route path="/interviews" element={<Interviews {...props} />} />
            <Route
              path="/interviews/:id"
              element={<QuestionPage {...props} />}
            />
            <Route path="/claims" element={<Claims {...props} />} />
            <Route path="/claims/:id" element={<ClaimPage {...props} />} />
            <Route path="/library" element={<LibraryPage {...props} />} />
            <Route path="/reference" element={<ReferencePage {...props} />} />
            <Route path="/search" element={<SearchPage {...props} />} />
            <Route path="/settings" element={<SettingsPage {...props} />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <span>DevOps Learning Academy</span>
          <Link to="/about">Source notes & limitations</Link>
          <span>30 days. One practice at a time.</span>
        </footer>
      </div>
    </div>
  );
}
export default function Academy() {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}course.json`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Content request failed (${response.status})`);
        return response.json();
      })
      .then((data: Course) => {
        if (data.lessons?.length !== 30 || data.questions?.length !== 100)
          throw new Error("Course content is incomplete");
        setCourse(data);
      })
      .catch((failure: Error) => {
        if (failure.name !== "AbortError") setError(failure.message);
      });
    return () => controller.abort();
  }, []);
  if (error)
    return (
      <div className="boot-state" role="alert">
        <h1>Course could not load</h1>
        <p>{error}</p>
        <p>
          Check that the site was built with its repository base path and course
          assets.
        </p>
        <button className="button primary" onClick={() => location.reload()}>
          Retry
        </button>
      </div>
    );
  if (!course)
    return (
      <div className="boot-state" role="status">
        <Workflow size={32} />
        <h1>DevOps Learning Academy</h1>
        <p>Loading course material...</p>
      </div>
    );
  return (
    <HashRouter>
      <Shell course={course} />
    </HashRouter>
  );
}
