# Day 13: GitHub Actions, build/test and Snyk

Resume: R27-R29/R39/R44-R50; C07-C09/C20. Time: 20/40/20/10. Local workflow study; hosted execution is optional and may consume Actions minutes.

## 1. Learning objectives
Explain event -> workflow -> job -> runner -> step. Diagnose the earliest causal failure and distinguish build/test/scan/publish responsibilities.

## 2. Concepts
Git records commits; branches name lines of work; a PR proposes reviewable changes. A workflow is YAML automation triggered by events. Jobs run on runners; steps share that job's workspace. Artifacts retain outputs; caches speed reproducible dependency retrieval but are not release evidence. Secrets are protected inputs, not safe to echo. Snyk checks dependency or image findings; policy decides what blocks release.

## 3. How it works
Event/filter -> job permissions/environment -> checkout -> runtime setup -> tests -> build -> artifact. Steps normally stop after failure; careless `continue-on-error` or a swallowed exit status can bypass a gate. Java compiles/packages via Maven/Gradle; Python needs its own dependencies/test runner. Our sample uses unittest, not an invented production Python toolchain.

## 4. Real-world usage
The resume describes standardized workflows and debugging builds across environments. Reuse shared logic with explicit inputs and approvals; do not inject production access into pull-request jobs. Slack notification delivery is separate from build success.

## 5. Hands-on lab
Read `fixtures/github-actions/checks.yml` and annotate every field. It is intentionally outside `.github/workflows` so it cannot execute here. Run its local steps:
```bash
python3 -m unittest discover -s fixtures/app -v
docker build -t academy:checks fixtures/app
git --version
```
Tests are the behavior gate; build creates a local image only. For a separate, explicitly authorized training repository containing this content at its root, the workflow can later be copied to `.github/workflows/checks.yml`; do not push during content study. Review the Snyk sample findings in the secondary-tools reference, distinguish app package versus base image, and write a remediation decision. Cleanup: retain the known local image or remove only `academy:checks` after verifying it is unused.

For the C09 standardization exercise, compare `reusable-checks.yml`, `dev-caller.yml` and `qa-caller.yml` in the same fixture directory. Both callers invoke one job-level reusable workflow; a required string input is validated against dev/qa through an environment variable rather than interpolated into shell code. These files remain inactive here. A later authorized repo would need all three in `.github/workflows`; the local `uses` reference resolves there, not in this fixture directory. This example shares validation only, not a deployment or production secret. Independently propose a compatible interface change and show how both callers would be checked.

## 6. Expected output
Passing unittest output and a built image. A failing test must stop publishing. Local YAML parsing cannot prove hosted events, credentials, permissions or minutes are configured correctly; those remain untested until authorized execution.

## 7. Troubleshooting
I13: first ask whether a run exists. If not, inspect event/branch/path filters and workflow location; if queued, inspect runner availability; if failed, identify the first failing step and causal log. Reproduce the same runtime/command locally where possible. Fix only that stage and rerun its test before the whole pipeline. Never log all environment variables for diagnosis.

## 8. Interview preparation
Q25/Q26: artifact versus cache, job versus step, test failure versus compiler failure. A strong answer identifies the failure signal and explains how verification prevents a false-green release.

## 9. Independent practice
Write a workflow requiring tests before image build, with read-only repository permission and no AWS credentials. Explain how you would share it across two environments without duplicating all logic. Challenge I13 -> H13 -> S13 after an attempt.

## 10. Revision
Trigger, runner, command, status and evidence are separate. Revisit Bash exit propagation. Snyk findings are inputs to a remediation process, not proof that all vulnerabilities are exploitable or fixed.