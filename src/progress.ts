import { useEffect, useState } from "react";
import type { Practice, Progress } from "./types";

export const STORAGE_KEY = "devops-academy.progress.v1";
export const emptyPractice = (): Practice => ({
  attempt: "",
  retry: "",
  hint: false,
  revealed: false,
  evidence: [],
});
export const emptyProgress = (): Progress => ({
  version: 1,
  completed: {},
  checks: {},
  practices: {},
  lastLesson: 1,
  theme: "system",
});
function readProgress(): { value: Progress; warning: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { value: emptyProgress(), warning: "" };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object")
      throw new Error("Invalid progress");
    const data = parsed as Record<string, unknown>;
    if (
      data.version !== 1 ||
      !data.completed ||
      typeof data.completed !== "object" ||
      !data.checks ||
      typeof data.checks !== "object" ||
      !data.practices ||
      typeof data.practices !== "object"
    )
      throw new Error("Unsupported progress");
    const value = emptyProgress();
    for (const [id, complete] of Object.entries(data.completed))
      if (
        /^(D(?:[1-9]|[12]\d|30)|P0[1-5]|I(?:0[1-9]|[1-3]\d|40)|Q(?:0[1-9]|[1-9]\d|100)|C(?:0[1-9]|1\d|2[0-4]))$/.test(
          id,
        ) &&
        typeof complete === "boolean"
      )
        value.completed[id] = complete;
    for (const [id, checked] of Object.entries(data.checks))
      if (typeof checked === "boolean") value.checks[id] = checked;
    for (const [id, entry] of Object.entries(data.practices)) {
      if (!entry || typeof entry !== "object") continue;
      const practice = entry as Record<string, unknown>;
      value.practices[id] = {
        attempt: typeof practice.attempt === "string" ? practice.attempt : "",
        retry: typeof practice.retry === "string" ? practice.retry : "",
        hint: practice.hint === true,
        revealed: practice.revealed === true,
        evidence: Array.isArray(practice.evidence)
          ? practice.evidence.filter(
              (item) => Number.isInteger(item) && item >= 0,
            )
          : [],
      };
    }
    if (
      typeof data.lastLesson === "number" &&
      Number.isInteger(data.lastLesson) &&
      data.lastLesson >= 1 &&
      data.lastLesson <= 30
    )
      value.lastLesson = data.lastLesson;
    if (
      data.theme === "light" ||
      data.theme === "dark" ||
      data.theme === "system"
    )
      value.theme = data.theme;
    return { value, warning: "" };
  } catch {
    return {
      value: emptyProgress(),
      warning:
        "Saved progress could not be read. Existing storage has not been overwritten. This session is temporary until you reset progress.",
    };
  }
}
export function useProgress() {
  const [initial] = useState(readProgress);
  const [progress, setProgress] = useState(initial.value);
  const [warning, setWarning] = useState(initial.warning);
  const [writable, setWritable] = useState(!initial.warning);
  useEffect(() => {
    if (!writable) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setWarning("");
    } catch {
      setWarning(
        "Browser storage is unavailable or full. Changes are only retained in this open tab.",
      );
      setWritable(false);
    }
  }, [progress, writable]);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme =
        progress.theme === "system"
          ? media.matches
            ? "dark"
            : "light"
          : progress.theme;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [progress.theme]);
  return {
    progress,
    setProgress,
    warning,
    reset: () => {
      setProgress(emptyProgress());
      setWarning("");
      setWritable(true);
    },
  };
}
