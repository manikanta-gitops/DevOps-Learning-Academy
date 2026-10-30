# Validation and limitations

This report concerns authored content and fixtures, **not learner progress**. No company or production system was used. No website, server deployment, hosted workflow, AWS resource or SaaS account was created. Original resume/roadmap are protected by recorded SHA-256 checks in the validator.

## Repeatable content checks

From the academy-content root, run `ruby tools/validate.rb`. Ruby uses standard libraries only. It checks ordered days, timing, audit coverage, daily sections, question/answer mappings, incident/help counts, Markdown links/fences, Bash syntax without execution, JSON/plain YAML/Maven XML, original fingerprints and common accidental state/key artifacts. Helm templates require Helm rendering separately. Syntax checks do not establish remote API compatibility, access permissions or safe runtime outcomes. The accidental-file check is not a comprehensive secret scanner.

The full content check passed on 2026-10-30: 30 lessons, R01-R56, C01-C24, S01-S10, 100 question/answer pairs, 40 incident/hint/solution sets, five projects, 44 Markdown files with valid local links, 53 Bash/sh fenced blocks and 12 plain YAML files. All JSON and Maven XML parsed. The original PDF and roadmap fingerprints matched. Editor diagnostics reported no errors in academy-content. These results validate structure and syntax, not the operational integrations listed below.

## Focused checks already performed

- Python standard-library sample: three unit/in-process HTTP tests passed; the ephemeral listener used loopback and shut down. Pylance syntax checks passed for the app and test file.
- Bash health script syntax passed; this alone is not a full network integration test.
- Terraform formatting and init/validate passed in a fresh temporary copy with backend disabled, using only the built-in terraform_data resource. No cloud provider, apply, import or state migration was executed.
- Helm lint and QA render passed. A string replica count was rejected by the schema; HPA rendering omitted the Deployment replica field to avoid ownership conflict. No cluster install/upgrade was executed.
- Intermediate structure checks passed for 30 lessons, 100 question/answer pairs, 40 incidents and five projects. Final cross-file checks remain separately identified.

## Not executed and prerequisites

Docker builds/containers, kind creation, Kubernetes manifests, HPA/metrics-server, Nginx runtime, systemd installation and ArgoCD installation/sync were **not run by the authoring assistant**. kind was not installed in the inspected host. Docker CLI availability does not prove a running daemon; kubectl availability does not authorize any context. The Ubuntu VM and appropriate memory/disk capacity remain learner prerequisites.

Java/Maven/Gradle builds, optional ddtrace/Rollbar SDK behavior, Snyk scanning, hosted GitHub triggers/callers/OIDC, ECR push, S3 backend locking, real EKS/ALB networking and Datadog/Rollbar ingestion were not executed. Java source/build metadata and optional dependency ranges are teaching fixtures, not a current security/support certification. Optional telemetry should use a verified compatible Python 3.11/3.12 environment; the inspected terminal had Python 3.15. Never equate parsing with these integrations passing.

No live URL checks guarantee future availability of external installers/releases. Review official versions, compatibility and supply-chain integrity before optional setup. Packages/images may need internet and local disk; initial setup may consume a whole session.

## Approvals and missing information

- Clarify actual employment dates, role and personal contributions before rehearsing professional claims. No numerical achievement or historical incident has been invented.
- Authorized personal repository and permission for hosted Actions/push are needed for live workflow exercises. Example workflows remain outside .github/workflows and cannot auto-run here.
- Real cloud labs require an explicit sandbox account/profile/region, owner, budget, least-privilege permissions, private connectivity and cleanup plan. Budget alerts do not cap spend. The course never modifies company Terraform state, production clusters or tenant roles.
- Datadog/Rollbar/Snyk/Entra execution requires approved test access, private credential handling and data/cost review. Local spans/test events do not prove full application instrumentation or distributed tracing.
- Markdown separates attempts, hints and solutions but cannot enforce access gates. A future website can gate presentation; no static client can securely hide answers bundled with it.

## Scope and preservation

All Stage 2 additions are under academy-content. The original PDF, roadmap, progress record and Stage 1 audit have not been edited. No scores, completed days or assessed weaknesses are pre-populated. The five projects compose the daily work; optional extensions replace a lab block or carry forward, rather than silently extending 90 minutes.