# GitHub Pages deployment

## Scope and status

GitHub Pages is the only supported production host for this website. Nothing here deploys a website to AWS, EKS, ECS, EC2, Docker or Kubernetes. No backend or database exists. The workflow is prepared but has not been run on GitHub; no account, token or credentials were accessed.

Use a public repository and GitHub's standard public-repository runners for the intended free route. GitHub plan, Actions availability, organization policy and usage limits remain account-level prerequisites. Optional cloud labs inside the course may incur costs and require separate authorization; they are unrelated to website hosting.

## Beginner steps

1. Extract the ZIP and open its `DevOps-Learning-Academy` folder. `package.json`, `src`, `academy-content` and `.github` must be siblings.
2. Create a new **public** GitHub repository with `main` as its default branch. The recommended name is `DevOps-Learning-Academy`. Do not add private documents to it.
3. Upload the extracted project files, or use GitHub Desktop to publish this folder. Include hidden `.github/workflows/pages.yml` and the lockfile. On macOS, Command+Shift+Period reveals hidden files in Finder. Using GitHub Desktop avoids accidentally omitting the workflow. Do not commit `node_modules`, `dist` or the delivered ZIP itself.
4. In repository Settings > Pages > Build and deployment > Source, choose **GitHub Actions**. Enable Actions under Settings > Actions > General if necessary and permitted by your organization.
5. In Actions, select **Test and publish academy to GitHub Pages**, then **Run workflow** on `main`. If a push ran before Pages was enabled, rerun after enabling it.
6. Wait for both `build` and `deploy` jobs. Follow the environment URL shown in the successful deployment, or the URL in Settings > Pages.
7. Open the site, open a lesson, refresh that lesson, copy a command, mark a test completion and reload. Test mobile navigation. Reset test progress when done.

For a normal repository, the expected address is `https://YOUR-USERNAME.github.io/DevOps-Learning-Academy/`. Replace the username and repository with your actual values. A repository named `YOUR-USERNAME.github.io` serves at the domain root instead. A custom domain is neither needed nor configured.

You perform account sign-in locally in GitHub or GitHub Desktop. Never put passwords, personal access tokens, SSH keys or cloud keys in this project or in chat. The workflow uses GitHub's automatically provided short-lived workflow identity; no user-created secret is needed.

## Workflow behavior

The supplied workflow runs on a push to `main` or manual dispatch. It uses Node 24, `npm ci`, lint, Chromium installation, the complete production browser suite under both root and repository paths, content validation and the production build. Official actions are pinned to commit SHAs. Only `dist` is uploaded as a Pages artifact.

Repository contents are read-only to the build. The separate deployment job has `pages: write` and `id-token: write` for GitHub Pages, with the `github-pages` environment. It has no cloud credentials or infrastructure provisioning steps. Deployment concurrency prevents overlapping Pages releases.

The base-path step compares the repository name with `OWNER.github.io` case-insensitively. A matching user/organization repository uses `/`; all other names use `/REPOSITORY/`. Vite prefixes JavaScript, CSS, fonts, course data and diagrams accordingly. HashRouter keeps lesson URLs such as `/#/lessons/1` refresh-safe on static hosting without a server rewrite or a `404.html` hack.

## Local production equivalents

```sh
npm ci
npm run build
npm run preview
```

To inspect an actual repository prefix from macOS/Linux:

```sh
PAGES_BASE=/DevOps-Learning-Academy/ npm run build
PAGES_BASE=/DevOps-Learning-Academy/ npm run preview -- --port 4173 --strictPort
```

Visit `http://127.0.0.1:4173/DevOps-Learning-Academy/`. For a normal local root preview, rebuild without `PAGES_BASE`. Do not reuse a differently prefixed `dist` and assume it is a root build.

## Troubleshooting deployment

| Symptom | Check |
| --- | --- |
| Workflow missing | `.github/workflows/pages.yml` must be at the repository root, not inside an extra folder or ZIP. |
| Pages configuration failure | Select GitHub Actions in Settings > Pages; confirm repository visibility/plan and organization policy. |
| Workflow does not run on push | The supplied branch filter is `main`; use manual dispatch or update that filter intentionally for a different default branch. |
| Permission/environment rejection | Check Pages availability, Actions policy and any `github-pages` environment approval requirement. Do not solve this by pasting a token into source. |
| Blank page or asset 404 | Confirm the published artifact is `dist` from the workflow and the repository base path matches its name. Rebuild after a rename. |
| Lesson refresh failure | Use the supplied `/#/lessons/N` hash route, not `/lessons/N`. |
| Content hash failure | The immutable curriculum copy differs from its manifest. Restore the approved content or review an explicit curriculum revision; do not casually regenerate fingerprints. |
| Local tests fail to start | Install Chromium, use Node 24 and free port 4178. On Linux install browser OS dependencies. |
| Notes do not appear on another device | Expected: localStorage is per origin and browser profile, with no synchronization. |
| Clipboard denied | Use the site's HTTPS URL. Browser policy can still deny access; code remains selectable. |

## Updating the site

Make focused application changes, run the checks in the README, and push to `main`. The same workflow rebuilds and redeploys after successful tests. Never copy curriculum Terraform/Kubernetes/Actions examples into the website's active workflow directory. Those are inert learning fixtures in `academy-content`, not required deployment steps.