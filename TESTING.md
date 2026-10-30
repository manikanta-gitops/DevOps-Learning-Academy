# Stage 3 verification report

Executed locally on 2026-10-30, macOS Apple Silicon, Node 24.22.2, npm 11.19.1, Playwright 1.64.1 and its installed Chromium 156.0.8078.4. This report describes the website, not a successful execution of cloud labs or professional experience.

## Executed results

| Check | Result |
| --- | --- |
| `npm run content:check` | Passed: 30 lessons, five projects, 40 cases, 100 questions, 24 claims; all 85 source hashes match. |
| `npm run diagrams` | Passed: three existing Mermaid diagrams rendered to local SVGs. No runtime Mermaid dependency is shipped to the browser. |
| `npm run build` | Passed TypeScript and Vite production build. Production builds also ran separately inside both browser-test invocations. |
| `npm test` | **11 passed**, 22.7 seconds, production build under `/academy-check/`. |
| `npm run test:root` | **11 passed**, 22.2 seconds, production build under `/`. |
| Browser console, uncaught exceptions, HTTP failures | No unexpected errors in either completed suite; assertions run after each test. |
| Automated accessibility | No axe violations on tested desktop/mobile overview, lesson, scenario, question, settings and dark overview states. |
| Responsive checks | No document horizontal overflow on eight representative routes at 320, 390, 768 and 1440 pixels. |
| Visual inspection | Desktop/mobile overview, dark overview and rendered project diagrams reviewed from Playwright screenshots. |
| `npm run lint` | Exit 0; no errors, five non-blocking React warnings listed below. |
| Editor source diagnostics | No reported source/type errors. |
| `npm audit --omit=dev` | Zero known production dependency vulnerabilities reported at test time. Lockfile synchronization also reported zero vulnerabilities. |
| Workflow YAML | Parsed successfully; build/deploy job structure and Pages deployment permissions checked locally. Not executed on GitHub. |
| Protected originals | All 90 private-snapshot fingerprints match: 85 original Stage 2 files plus the original audit, roadmap, progress, dashboard and resume PDF. |
| Package-boundary screening | No known private-key, AWS access-key or GitHub-token signatures or absolute user-home paths found in the 103 screened application/content/script/workflow files. This is a bounded signature scan, not a guarantee against every possible secret format. |
| Packaging scripts | Both scripts passed Node syntax checks. The ZIP includes a per-file SHA-256 manifest and has a SHA-256 sidecar. |

## Browser coverage

1. Blank fresh progress; all 30 lesson titles and ten sections; question/case links; previous/next navigation; completion and revision persistence.
2. All five project routes, original section-derived checklists, completion, all three diagram requests and decoded image dimensions.
3. All 40 scenario routes; no immediate solution; evidence disclosure; independent attempt, authored hint, retry, original resolution, solved marks and reload persistence.
4. All 100 question routes, attempt-gated original answers, follow-ups and practised counts.
5. All 24 claim routes, approved technical meanings/follow-ups, original exercises/verification and unconfirmed ownership wording; explicit R49/R50 errata.
6. All 11 technology filters, question search, global search, empty results, all 85 source-library routes and scenario difficulty filtering.
7. Clipboard copy checked against exact rendered command, source download checked byte-for-byte, heading navigation and scroll position.
8. Theme selection and reload, reset cancel preserving data, confirmed reset removing data, native dialog visibility.
9. Corrupt storage left unmodified with a warning; denied storage writes produce a temporary-session warning.
10. Four viewport widths; keyboard drawer focus trap, Escape focus return, focus after navigation; accessibility scans and screenshots.
11. Deep-link refresh, missing-page route, incomplete course data error and Retry recovery.

Synthetic test notes and completion marks exist only in isolated Playwright browser contexts. They are not imported into the site, originals or ZIP. The learner begins with no completion or assessed score.

## Issues found and resolved

- Removed unused imports detected by the first TypeScript build.
- Darkened the light-theme navigation accent after axe measured insufficient contrast.
- Moved drawer focus restoration to effect cleanup so the destination is no longer inert.
- Added distinct accessible names for the navigation and lesson-content landmarks.
- Corrected test expectations for the actual three-diagram inventory, textarea values and asynchronous heading scrolling. The source curriculum was not changed to satisfy tests.

## Remaining warnings and limitations

Oxlint reports five warnings: one state update while synchronizing browser storage, two mixed-export Fast Refresh warnings in the Markdown reader, one broad-object dependency warning for the lesson effect, and one ref-capture warning in drawer cleanup. They do not fail compilation or the tested workflows; they remain maintenance work, not a claim of a warning-free lint run.

GitHub Pages publishing and GitHub-hosted CI were **not run**. Account settings, organization restrictions and the final public URL cannot be verified without the user's publishing action. The prepared workflow is not evidence that a deployment succeeded.

Browser automation used Chromium on macOS, with viewport emulation rather than physical mobile devices. Safari, Firefox, real Android/iOS, screen-reader use, browser-specific storage eviction and every possible assistive-technology combination were not tested. Axe and screenshots are useful checks, not a complete accessibility certification. Copy may be denied by browser permissions; the app provides a selectable-code fallback notice.

Tests verify content integrity and presentation, not the correctness or live execution of every training command. No AWS/Kubernetes/EKS/ECS/EC2/Docker website deployment, external account integration, production mutation, cloud payment, backend or database was performed. Cloud/SaaS lessons retain their separate prerequisites, costs and simulation boundaries.

Browser-local progress has no server sync, encryption, cross-device backup or automated grading. Public static answers remain inspectable even when the interface gates their display. Source gaps and the Gradle/Maven mapping discrepancy remain explicitly documented; no missing instructional text or employment story was invented.

## Reproduce

```sh
npm ci
npm run content:check
npm run lint
npx playwright install chromium
npm test
npm run test:root
npm run build
```

The test runner starts and closes its own production preview on port 4178. On Linux, replace browser installation with `npx playwright install --with-deps chromium`. Generated screenshots and traces live in `test-results`; the HTML report lives in `playwright-report`. These temporary artifacts and dependencies are excluded from the delivered ZIP. Regenerate them with the commands above.

To verify a newly extracted delivery **before** dependency installation:

```sh
node scripts/verify-package.mjs
npm ci
npm run build
```

The first command requires only Node standard-library modules and checks every packaged file and the absence of unexpected files. It is intentionally strict: running it after `npm ci` will report the newly added dependencies as unexpected. The private preservation snapshot used for the originals is outside the project and is not distributed.