# DevOps Interview Preparation Academy: Learning Content

Stage 2 only. No website, deployment, learner scores, or professional experience is created by these files. Authority: [Stage 1 audit](../academy-resume-audit.md). Original resume, roadmap and progress files remain unchanged.

Start with [the schedule](content/roadmap/README.md), then its linked daily lesson. Machine-readable navigation and coverage live in [plan.json](content/roadmap/plan.json). All paths in lab commands are relative to this `academy-content` directory unless a lesson explicitly says Ubuntu VM.

## The 90-minute contract

20 minutes concepts, 40 minutes **one** guided/independent/challenge lab, 20 minutes investigation and interview, 10 minutes revision. The three levels are alternatives, not extra compulsory homework. Projects reuse the daily artifacts across several sessions. Installation, downloading images and debugging setup consume lab time. Stop at 90 minutes and carry work forward. Thirty sessions total 45 hours; this is not a promise of mastery or employment readiness.

## Attempt-first practice

Guided examples are available to study. Independent tasks give requirements and success criteria, not solutions. Record your attempt, observed output and hypothesis first. Then open the relevant hint in [the hint book](content/troubleshooting/hints.md). Only after retrying consult [the solution book](content/troubleshooting/solutions.md). Answers are separate files, not securely locked: Markdown cannot enforce an attempt gate. The future website must enforce the presentation gate without pretending it can hide bundled source from an inspector.

The interview bank is also split into [questions](content/interview-questions/questions.json) and [answer references](content/interview-questions/answers.md). Say your answer before opening the reference. Assess correctness /3, practical understanding /2, evidence /2, clarity /2, coverage /1; record first and assisted attempts separately. Self-scoring is not expert or AI grading.

## Lab safety and prerequisites

- Nothing here authorizes company or production access. All supplied evidence is synthetic **training simulation**, and all configurations are **personal lab examples**, not employer architecture.
- Use a dedicated Ubuntu 24.04 VM for systemd/Linux. Do not execute VM installation, permission or service commands on macOS. A normal Docker container is not a systemd VM. A VM installer and its hypervisor are prerequisites to choose locally; no unattended privileged installer is provided.
- Host labs need Git, Python 3.11+, curl, OpenSSL, Docker Desktop, kubectl, kind, Helm 3+, and Terraform 1.10+ as used. Use official installers. macOS `ps`, `free`, `ss`, `systemctl`, `timeout` and GNU flags differ; Linux commands are labeled. Check versions before starting. Docker/VM memory consumption is a real local cost.
- Ruby 2.6+ is used for dossier inspection and the content validator; ensure it exists in whichever environment runs those commands. The alternative Java lab needs JDK 17 and Maven 3.9 or compatible Gradle 8.14. Optional telemetry needs a verified Python 3.11/3.12 SDK environment, not an assumption that all new Python versions are supported.
- Use a writable copy of lab configurations in your own training directory for independent edits. Do not edit the original resume, original roadmap, shared source, or any work repository. Private evidence and generated plans/state belong outside Git.
- Local application listeners default to loopback. A container binds internally to `0.0.0.0` only when explicitly configured; Docker publishes to `127.0.0.1`. Never expose the training fault endpoints publicly.
- The named local cluster is `academy`; its explicit context is `kind-academy`. Core Kubernetes mutations use that context. Confirm `kubectl --context kind-academy cluster-info` matches your local Docker-created cluster. The optional approved EKS extension instead requires an explicitly verified sandbox context and endpoint. A namespace alone is not a safety boundary.
- Run only one HTTP listener per listed port. Stop foreground lab servers with Ctrl+C in their own terminal. Do not kill unrelated processes or delete unnamed resources to free a port.
- Optional AWS work requires an approved sandbox, explicit account/profile/region, a cost budget, owner and cleanup plan. EKS control plane, EC2 nodes, EBS, ALB, NAT, ECR storage, S3, Secrets Manager, telemetry and transfer can incur costs. Budget alerts are not spending caps. No cloud provisioning is required for the daily core plan.
- Before any approved AWS read, set `export AWS_PAGER=""` and inspect `aws sts get-caller-identity --profile "$LAB_PROFILE"`. Do not print tokens, secret values, kubeconfig or Terraform state. Logs, plans, rendered charts and environment dumps may also contain secrets.
- Identity, telemetry and paid scanning exercises default to supplied evidence. No Entra tenant, Datadog, Rollbar, Snyk or AWS access is assumed. Never paste credentials into Markdown, Git, an answer, or a terminal command recorded by the assistant.
- Tags in examples are explicit but not immutable. For a real approved deployment resolve and review image digests, tool versions and action commit SHAs against current official releases. A lab fixture is not a hardened production baseline.

## Content conventions

Daily lessons use ten fixed sections and explicit resume IDs. Concepts also state purpose/problem/terms; architecture states workflow; examples, integrations, mistakes and interview framing are included. Each major area includes guided, independent and challenge practice. Daily `plan.json` rows point to questions and incident IDs, and map the audit's R01-R56 and C01-C24 identifiers. S01-S10 are prerequisites, not additional employment claims.

Examples of expected output are illustrative. IDs, PIDs, addresses and timings vary. A fixture replay is not a real cloud test. [VALIDATION.md](VALIDATION.md) distinguishes checks actually performed from unexecuted infrastructure labs.

## Course navigation

- [Roadmap](content/roadmap/README.md)
- [Five practical projects](content/projects/README.md)
- [Incident dossiers](content/troubleshooting/incidents.json)
- [Resume defense and engineering evidence](content/resume-defense/defense.md)
- [Supplementary tool deep-dives](content/reference/secondary-tools.md)
- [Validation and limitations](VALIDATION.md)

No progress is pre-populated. Employment/contribution clarification remains pending. Completing a lab supports the statement "I practised this in a lab," not "I operated it in production."