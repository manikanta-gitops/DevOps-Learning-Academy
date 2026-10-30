import { chromium } from "@playwright/test";
import { createServer } from "vite";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildContent, root } from "./content.mjs";

const course = buildContent();
const server = await createServer({
  configFile: resolve(root, "vite.config.ts"),
  base: "/",
  server: { host: "127.0.0.1", port: 0 },
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  const diagrams = await page.evaluate(async (definitions) => {
    const { default: mermaid } =
      await import("/node_modules/mermaid/dist/mermaid.esm.min.mjs");
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "neutral",
      fontFamily: "sans-serif",
    });
    const results = [];
    for (const definition of definitions) {
      const { svg } = await mermaid.render(
        `architecture-${definition.id}`,
        definition.source,
      );
      results.push({ id: definition.id, svg });
    }
    return results;
  }, course.diagrams);
  mkdirSync(resolve(root, "public/assets/diagrams"), { recursive: true });
  for (const diagram of diagrams)
    writeFileSync(
      resolve(root, `public/assets/diagrams/${diagram.id}.svg`),
      diagram.svg,
    );
  console.log(
    `Rendered ${diagrams.length} source diagrams to static SVG; no Mermaid runtime shipped.`,
  );
} finally {
  await browser.close();
  await server.close();
}
