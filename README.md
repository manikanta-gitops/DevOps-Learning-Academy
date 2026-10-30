# DevOps Learning Academy

A separate React + TypeScript + Vite learning application, intended exclusively for GitHub Pages hosting. No backend, database, account integration, analytics or paid hosting is needed. It has not been deployed.

## Included curriculum

- 30 complete lessons, each retaining its ten original sections.
- Five guided projects and section-review checklists.
- 40 synthetic troubleshooting cases, evidence, original hints and resolutions.
- 100 interview questions, model answers, follow-ups and technology filters.
- 24 claim-defense exercises with only the approved technical-meaning and follow-up excerpts from Stage 1.
- All 85 unchanged Stage 2 source files and three locally rendered architecture diagrams.

The dashboard, search, source library, copy/download controls, themes and browser-local progress work without a server-side service. Marking something complete is a self-report, not a grade or proof of production experience. No previous progress was imported.

## Run locally

1. Extract the complete ZIP. Open the extracted `DevOps-Learning-Academy` folder in VS Code.
2. Install Node.js 24 LTS from https://nodejs.org/ if needed. Open a new terminal and confirm `node --version` reports `v24`.
3. In the project folder run:

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Stop the local server with Ctrl+C. This is a local development preview, not production hosting. Do not double-click `index.html`: the app needs a build/server to resolve its modules and course data.

Production preview:

```sh
npm run build
npm run preview
```

The build automatically validates source hashes and required counts and regenerates `public/course.json`. The ZIP includes all custom diagram assets; normal builds do not need a browser or Mermaid rendering.

## Publish to GitHub Pages

Use the complete steps in [DEPLOYMENT.md](DEPLOYMENT.md). In brief:

1. Create a public GitHub repository, preferably named `DevOps-Learning-Academy`, with default branch `main` for the supplied workflow. Public repositories support free Pages hosting on GitHub Free, subject to GitHub's published limits and policies.
2. Upload/commit the **extracted project contents**, including hidden `.github`, at the repository root. Do not upload only the ZIP or add an extra enclosing folder. Do not upload `node_modules`, `dist`, private records or credentials.
3. Under Settings > Pages, select **GitHub Actions** as the source. Enable Actions if your repository or organization requires it.
4. Open Actions > Test and publish academy to GitHub Pages > Run workflow. A later push to `main` also runs it.

The workflow tests the site before uploading only `dist`. It computes the correct repository base path automatically. No personal token, cloud credential or repository secret is required. Uploading the workflow and enabling it are actions for you to perform; no GitHub account was accessed during implementation.

## Tests and checks

```sh
npm run content:check
npm run lint
npx playwright install chromium
npm test
npm run test:root
```

On Linux CI, use `npx playwright install --with-deps chromium`. `npm test` builds and serves the production site under `/academy-check/`; `test:root` repeats at `/`. Port 4178 must be free. The root-test shortcut uses POSIX environment syntax; on Windows PowerShell use `$env:TEST_BASE='/'; npm test; Remove-Item Env:TEST_BASE`.

Read [TESTING.md](TESTING.md) for executed results, coverage and limitations. Tests use synthetic notes in isolated temporary browser contexts, never your normal browser profile.

Optional regeneration of diagrams from the preserved Mermaid sources:

```sh
npx playwright install chromium
npm run diagrams
npm run content:check
```

## Source structure

| Path | Purpose |
| --- | --- |
| `src/` | React views, Markdown reader, local progress and responsive styles |
| `academy-content/` | Immutable copy of the complete Stage 2 curriculum and fixtures |
| `content/source-manifest.json` | SHA-256 fingerprints of those 85 source files |
| `content/claim-excerpts.json` | Minimal approved technical-meaning/follow-up excerpts |
| `public/course.json` | Generated static curriculum data, including all original text |
| `public/assets/diagrams/` | Three pre-rendered local SVGs |
| `scripts/` | Content validation, diagram rendering and source packaging |
| `tests/` | Playwright workflows and axe accessibility checks |
| `.github/workflows/pages.yml` | The only active deployment workflow |

The AWS, Terraform, Kubernetes, Docker and other examples **inside the curriculum** are teaching fixtures, not website-hosting configuration. The website neither runs them nor provisions infrastructure.

## Integrity and content boundaries

The original resume PDF, full Stage 1 audit, old dashboard, roadmap and original progress are not included. They were not changed. Private-original links in the copied curriculum lead to the site's Content notes page. Original curriculum wording is retained, including archival Stage 2 validation notes; those notes are not a Stage 3 website test report.

**Known mapping discrepancy:** Stage 1 defines **R49 = Gradle** and **R50 = Maven**. Some Stage 2 references, including Q82/Q83, reverse them. This is explicitly documented in the site; the source has not been silently corrected. Filters classify by the named topic rather than claiming that these IDs were repaired.

Stage 2 provides one authored hint per case. The interface stages an attempt, evidence, that hint, a retry and the original resolution; it does not invent additional teaching hints. Project checklists are derived from existing section headings. Answer controls discourage premature reveal but cannot keep answers secret in a static site: all public assets are inspectable.

The copied Ruby validator is an archival authoring tool with references to private originals. Use `npm run content:check` for this standalone project. Changing source material requires an explicit curriculum revision, not merely updating a hash to bypass a failure.

## Progress and privacy

Completion, checklist state, notes and theme use `devops-academy.progress.v1` in localStorage. They remain on this browser profile and site origin, do not synchronize with other devices or the original progress file, and are lost if site data is cleared. Reset requires confirmation. Corrupt/unavailable storage produces a visible warning instead of pretending notes were saved. Progress on localhost is separate from GitHub Pages.

Do not type credentials, employer identifiers, personal data or confidential evidence into practice notes. Public source files contain the approved training material; GitHub also receives normal hosting requests according to its own policies. Fonts and diagrams are served locally with the app, without third-party tracking. External reference links open in a separate tab.

No employment classification, introduction, score or production integration success is inferred. Actual role, dates and contribution ownership still require confirmation.

## Source ZIP

The delivered archive contains source, lockfile, tests, documentation, curriculum, configuration and custom assets, not dependency caches or generated production output. `npm ci` obtains the exact dependency tree from the public package registry; an internet connection is required for initial setup. Dependencies retain their respective licenses, including IBM Plex's SIL Open Font License.

Before installing dependencies in a newly extracted delivery, verify its per-file manifest:

```sh
node scripts/verify-package.mjs
```

Maintainers on macOS/Linux can run `npm run package` after tests. It requires the standard `zip` utility, writes a source ZIP and SHA-256 sidecar in the parent directory, uses an explicit inclusion list and refuses to overwrite an existing archive. Local browser state is never read by the packager.
