import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import type { Course } from "../src/types";
import { parser } from "../scripts/content.mjs";
import { toString } from "mdast-util-to-string";

const course: Course = JSON.parse(
  readFileSync(new URL("../public/course.json", import.meta.url), "utf8"),
);
const key = "devops-academy.progress.v1";
const runtimeErrors = new WeakMap<object, string[]>();
const firstParagraph = (source: string) =>
  toString(
    parser.parse(source).children.find((node) => node.type === "paragraph"),
  );

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("./");
  await expect(page.locator("main h1")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page), 'Browser errors and failed HTTP responses').toEqual([]);
});

test("fresh dashboard, all 30 lessons, navigation and checklist persistence", async ({
  page,
}) => {
  await expect(page.locator(".stat-value")).toHaveText([
    "0 / 30",
    "0 / 5",
    "0 / 40",
    "0 / 100",
  ]);
  for (const lesson of course.lessons) {
    await page.goto(`./#/lessons/${lesson.day}`);
    await expect(page.locator("main h1")).toHaveText(lesson.title);
    await expect(page.locator(".prose h2[id]")).toHaveCount(10);
    await expect(
      page.locator(`.related a[href$="/scenarios/${lesson.incident}"]`),
    ).toHaveCount(1);
    for (const question of lesson.questions)
      await expect(
        page.locator(`.related a[href$="/interviews/${question}"]`),
      ).toHaveCount(1);
  }
  await page.goto("./#/lessons/1");
  await page
    .getByRole("checkbox", { name: "Mark complete", exact: true })
    .check();
  await page.locator(".checklist input").first().check();
  await page.getByRole("link", { name: "Next lesson", exact: true }).click();
  await expect(page).toHaveURL(/lessons\/2$/);
  await page
    .getByRole("link", { name: "Previous lesson", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Completed", exact: true }),
  ).toBeChecked();
  await expect(page.locator(".checklist input").first()).toBeChecked();
  await page.goto("./#/");
  await expect(page.locator(".stat-value").first()).toHaveText("1 / 30");
});

test("all five projects and local diagrams render", async ({ page }) => {
  for (const project of course.projects) {
    await page.goto(`./#/projects/${project.id}`);
    await expect(page.locator("main h1")).toHaveText(project.title);
    await expect(page.locator(".checklist input")).toHaveCount(
      project.checklist.length,
    );
    await page.locator(".checklist input").first().check();
    await page
      .getByRole("checkbox", { name: "Mark complete", exact: true })
      .check();
  }
  await page.goto("./#/projects");
  await expect(page.locator("img.architecture")).toHaveCount(
    course.diagrams.length,
  );
  for (const image of await page.locator("img.architecture").all()) {
    await expect(image).toBeVisible();
    expect(
      await image.evaluate(
        (element: HTMLImageElement) =>
          element.complete && element.naturalWidth > 100,
      ),
    ).toBeTruthy();
  }
  for (const diagram of course.diagrams) {
    const response = await page.request.get(
      `./assets/diagrams/${diagram.id}.svg`,
    );
    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toContain("<svg");
  }
  await page.goto("./#/");
  await expect(page.locator(".stat-value").nth(1)).toHaveText("5 / 5");
});

test("all 40 scenarios gate hints and resolutions and retain attempts", async ({
  page,
}) => {
  for (const incident of course.incidents) {
    await page.goto(`./#/scenarios/${incident.id}`);
    await expect(page.locator("main h1")).toHaveText(incident.symptom);
    await expect(
      page.getByRole("button", { name: "Reveal resolution", exact: true }),
    ).toBeDisabled();
    await expect(page.locator(".resolution")).toHaveCount(0);
    await page
      .getByLabel("Your independent attempt", { exact: true })
      .fill("My first hypothesis needs a scoped evidence check.");
    await page.locator(".evidence-toggle").first().click();
    await expect(page.locator(".evidence-content pre").first()).toHaveText(
      incident.evidence[0].command,
    );
    await page
      .getByRole("button", { name: "Reveal hint", exact: true })
      .click();
    await expect(page.locator(".hint .prose")).toContainText(
      firstParagraph(course.hints[`H${incident.id.slice(1)}`]),
    );
    await page
      .getByLabel("Your retry and verification plan")
      .fill("Revisit the hypothesis and repeat the original failure check.");
    await page
      .getByRole("button", { name: "Reveal resolution", exact: true })
      .click();
    await expect(page.locator(".resolution .prose")).toContainText(
      firstParagraph(course.solutions[`S${incident.id.slice(1)}`]),
    );
    await page
      .getByRole("checkbox", { name: "Mark solved", exact: true })
      .check();
  }
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Completed", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("textbox", {
      name: "Your independent attempt",
      exact: true,
    }),
  ).toHaveValue("My first hypothesis needs a scoped evidence check.");
  await page.goto("./#/");
  await expect(page.locator(".stat-value").nth(2)).toHaveText("40 / 40");
});

test("all 100 questions preserve model answers and follow-ups behind attempts", async ({
  page,
}) => {
  for (const question of course.questions) {
    await page.goto(`./#/interviews/${question.id}`);
    await expect(page.locator("main h1")).toHaveText(question.question);
    await expect(
      page.getByRole("button", { name: "Reveal model answer", exact: true }),
    ).toBeDisabled();
    await page
      .getByLabel("Your independent attempt", { exact: true })
      .fill(
        "A bounded explanation with a verification step and an honest limitation.",
      );
    await page
      .getByRole("button", { name: "Reveal model answer", exact: true })
      .click();
    await expect(page.locator(".resolution .prose")).toContainText(
      firstParagraph(course.answers[question.id]),
    );
    for (const followUp of question.followUps)
      await expect(page.locator("main")).toContainText(followUp);
    await page
      .getByRole("checkbox", { name: "Mark practised", exact: true })
      .check();
  }
  await page.goto("./#/");
  await expect(page.locator(".stat-value").nth(3)).toHaveText("100 / 100");
});

test("all 24 claim exercises preserve approved technical meanings and uncertainty", async ({
  page,
}) => {
  for (const claim of course.claims) {
    await page.goto(`./#/claims/${claim.id}`);
    await expect(page.locator("main h1")).toHaveText(claim.title);
    for (const text of [
      claim.meaning,
      claim.followUp,
      claim.exercise,
      claim.verification,
    ])
      await expect(page.locator("main")).toContainText(text);
    await expect(page.locator("main")).toContainText("Ownership unconfirmed");
    await expect(
      page.getByRole("checkbox", { name: "Mark exercise complete" }),
    ).toBeDisabled();
  }
  await page.goto("./#/about");
  await expect(page.locator("main")).toContainText("R49 as Gradle");
  await expect(page.locator("main")).toContainText("R50 as Maven");
});

test("search, all technology filters and source routes", async ({ page }) => {
  await page.goto("./#/interviews");
  await expect(page.locator(".question-row")).toHaveCount(100);
  for (const category of course.categories) {
    await page.getByLabel("Technology").selectOption(category);
    await expect(page.locator(".question-row")).toHaveCount(
      course.questions.filter((item) => item.categories.includes(category))
        .length,
    );
  }
  await page.getByLabel("Technology").selectOption("all");
  await page
    .getByRole("searchbox", { name: "Search interview questions" })
    .fill("zzznomatches");
  await expect(page.getByRole("heading", { name: "No matches" })).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search interview questions" })
    .fill("Maven");
  await expect(page.locator(".question-row")).not.toHaveCount(0);
  await page.getByLabel("Search academy", { exact: true }).fill("Terraform");
  await page.getByRole("button", { name: "Submit search" }).click();
  await expect(page.locator(".question-row")).not.toHaveCount(0);
  await page.goto("./#/library");
  await expect(page.locator(".file-list a")).toHaveCount(85);
  const links = await page
    .locator(".file-list a")
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href")),
    );
  for (const link of links) {
    await page.goto(`./${link}`);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("main h1")).not.toHaveText("Page not found");
  }
  await page.goto("./#/scenarios");
  await page.getByLabel("Difficulty").selectOption("advanced");
  await expect(page.locator(".question-row")).toHaveCount(
    course.incidents.filter((item) => item.difficulty === "advanced").length,
  );
});

test("copy, source download and heading navigation", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("./#/lessons/1");
  const code = await page.locator(".code-block pre").first().textContent();
  await page.getByRole("button", { name: "Copy code" }).first().click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(code);
  await page.locator(".contents a").last().click();
  const target = page.locator(".prose h2[id]").last();
  // `boundingBox()` can return null for a frame during the route change;
  // fall back to a sentinel so `expect.poll` keeps retrying instead of throwing.
  const yOf = async () => (await target.boundingBox())?.y ?? -1;
  await expect.poll(yOf).toBeGreaterThanOrEqual(70);
  await expect.poll(yOf).toBeLessThan(400);
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download source" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("day-01.md");
  expect(readFileSync((await download.path())!, "utf8")).toBe(
    course.files[course.lessons[0].path],
  );
});

test("theme persistence and reset cancel/confirm", async ({ page }) => {
  await page.goto("./#/lessons/1");
  await page
    .getByRole("checkbox", { name: "Mark complete", exact: true })
    .check();
  await page.goto("./#/settings");
  await page
    .getByRole("combobox", { name: "Theme", exact: true })
    .selectOption("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("button", { name: "Reset progress", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(
    await page.evaluate(
      (storageKey) =>
        JSON.parse(localStorage.getItem(storageKey)!).completed.D1,
      key,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Reset progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm reset", exact: true })
    .click();
  expect(
    await page.evaluate(
      (storageKey) => JSON.parse(localStorage.getItem(storageKey)!).completed,
      key,
    ),
  ).toEqual({});
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("malformed and blocked storage surface honest warnings", async ({
  page,
}) => {
  await page.evaluate(
    (storageKey) => localStorage.setItem(storageKey, "{broken"),
    key,
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("could not be read");
  expect(
    await page.evaluate((storageKey) => localStorage.getItem(storageKey), key),
  ).toBe("{broken");
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Denied", "SecurityError");
    };
  });
  await page.goto("./#/settings");
  await page
    .getByRole("button", { name: "Reset progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm reset", exact: true })
    .click();
  await page.reload();
  await page
    .getByRole("button", { name: "Reset progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm reset", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("unavailable or full");
});

test("responsive layouts, keyboard drawer, diagrams and accessibility", async ({
  page,
}, testInfo) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width > 800 ? 1000 : 844 });
    for (const route of [
      "/",
      "/roadmap",
      "/lessons/1",
      "/projects",
      "/scenarios/I01",
      "/interviews/Q01",
      "/claims/C01",
      "/settings",
    ]) {
      await page.goto(`./#${route}`);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${width}px ${route} overflow`,
      ).toBeTruthy();
    }
    await page.goto("./#/");
    await page.screenshot({
      path: testInfo.outputPath(`overview-${width}.png`),
      fullPage: true,
    });
    if ([1440, 390].includes(width))
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await expect(page.locator(".sidebar")).toHaveClass(/open/);
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator(".sidebar-bottom a").last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".brand a")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page.getByRole("link", { name: "30-day roadmap", exact: true }).click();
  await expect(page.locator("main h1")).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of [
    "/lessons/1",
    "/scenarios/I01",
    "/interviews/Q01",
    "/settings",
  ]) {
    await page.goto(`./#${route}`);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  await page
    .getByRole("combobox", { name: "Theme", exact: true })
    .selectOption("dark");
  await page.goto("./#/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("overview-dark.png"),
    fullPage: true,
  });
  await page.goto("./#/projects");
  await page.screenshot({
    path: testInfo.outputPath("project-diagrams.png"),
    fullPage: true,
  });
});

test("deep-link refresh, missing routes and content load failure", async ({
  page,
}) => {
  await page.goto("./#/interviews/Q82");
  await page.reload();
  await expect(page.locator("main h1")).toHaveText(
    course.questions.find((item) => item.id === "Q82")!.question,
  );
  await page.goto("./#/missing");
  await expect(page.locator("main h1")).toHaveText("Page not found");
  await page.route("**/course.json", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(
    "Course content is incomplete",
  );
  await page.unroute("**/course.json");
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.locator("main h1")).toHaveText("Page not found");
});
