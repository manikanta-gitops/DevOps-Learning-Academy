# Thirty study sessions

Authority: [Stage 1 audit](../../../academy-resume-audit.md). Navigation/coverage: [plan.json](plan.json). Every row is **20 minutes concepts + 40 minutes one lab + 20 minutes incident/interview + 10 minutes revision = 90 minutes**. There are 45 planned hours, not a promise of mastery. Dates/completion/scores remain unset.

Setup belongs inside the lab block. If installation or investigation exceeds it, carry the task forward and shift later sessions. Choose guided, independent or challenge level for the block, not all three. Two daily questions are a menu: ask one, answer, discuss; use the second only if time remains. Revisit actual weaknesses after one, three and seven study sessions. No weakness is pre-assessed.

| Day | Lesson | Practical target | Questions / incident |
| --- | --- | --- | --- |
| 1 | [Linux process/resource evidence](../linux/day-01.md) | Process/listener/request evidence or setup blocker | Q01-02 / I01 |
| 2 | [Permissions/systemd](../linux/day-02.md) | Scoped service-user diagnosis in Ubuntu VM | Q03-04 / I02 |
| 3 | [Bash failure handling](../linux/day-03.md) | Success, HTTP failure and transport failure | Q05-06 / I03 |
| 4 | [DNS/TCP/TLS/HTTP](../networking/day-04.md) | Identify the earliest failing layer | Q07-08 / I04 |
| 5 | [VPC/ALB/environments](../aws/day-05.md) | Annotated network/target-health fixture | Q09-10 / I05 |
| 6 | [Docker and one service](../docker/day-06.md) | Tested image and loopback HTTP response | Q11-12 / I06 |
| 7 | [IAM/access/secrets](../aws/day-07.md) | Restricted policy and deny reasoning | Q13-14 / I07 |
| 8 | [Kubernetes lifecycle](../kubernetes/day-08.md) | Local desired state to ready workload | Q15-16 / I08 |
| 9 | [Service/Ingress traffic](../kubernetes/day-09.md) | Verify real in-cluster Service path | Q17-18 / I09 |
| 10 | [EKS architecture](../eks/day-10.md) | CNI/DNS/ownership investigation | Q19-20 / I10 |
| 11 | [Resources/HPA/PDB/storage](../kubernetes/day-11.md) | One bounded scheduling/scaling case | Q21-22 / I11 |
| 12 | [S3/ECR/secrets/CloudWatch](../aws/day-12.md) | One fully reasoned access failure | Q23-24 / I12 |
| 13 | [Actions/build/test/Snyk](../github-actions/day-13.md) | Causal build failure and reusable interface | Q25-26 / I13 |
| 14 | [OIDC and publishing](../github-actions/day-14.md) | Trust diagnosis or local registry publish | Q27-28 / I14 |
| 15 | [Terraform fundamentals](../terraform/day-15.md) | Explain local-only plan/state | Q29-30 / I15 |
| 16 | [Modules/environments](../terraform/day-16.md) | Reusable module with isolated callers | Q31-32 / I16 |
| 17 | [Remote state/locks](../terraform/day-17.md) | Lock-owner and backend review | Q33-34 / I17 |
| 18 | [Drift/import/recovery](../terraform/day-18.md) | Reviewed partial-failure recovery | Q35-36 / I18 |
| 19 | [Helm fundamentals](../helm/day-19.md) | Lint/render and explain generated resources | Q37-38 / I19 |
| 20 | [Helm environments/releases](../helm/day-20.md) | QA render and negative values test | Q39-40 / I20 |
| 21 | [ArgoCD reconciliation](../argocd/day-21.md) | Source/destination Application or setup | Q41-42 / I21 |
| 22 | [GitOps promotion/recovery](../argocd/day-22.md) | Source/image/config traceability | Q43-44 / I22 |
| 23 | [Metrics/logs/alerts](../monitoring/day-23.md) | Monitor decision table and query evidence | Q45-46 / I23 |
| 24 | [Traces/Rollbar/incidents](../monitoring/day-24.md) | Correlated synthetic evidence and runbook | Q47-48 / I24 |
| 25 | [Integrated delivery](../projects/day-25.md) | Connect existing artifacts, verify a handoff | Q49-50 / I25 |
| 26 | [Integrated investigation](../projects/day-26.md) | One nine-step evidence-led incident | Q51-52 / I26 |
| 27 | [Resume/Entra access defense](../resume-defense/day-27.md) | Honest claim ledger and access proposal | Q53-54 / I27 |
| 28 | [Service-based mock](../interview-questions/day-28.md) | One timed independent task and answer | Q55-56 / I28 |
| 29 | [Product-based design mock](../interview-questions/day-29.md) | Trade-off justified by practical evidence | Q57-58 / I29 |
| 30 | [Independent readiness](../interview-questions/day-30.md) | Retest one weakness; record unassessed areas | Q59-60 / I30 |

Phases: foundations 1-5; runtime/cloud 6-12; delivery/IaC 13-18; GitOps/observability 19-24; integration/defense 25-27; readiness 28-30. The question bank's Q61-Q100 and incidents I31-I40 are targeted revisits within this budget.

## Inventory coverage

| Audit inventory | Concrete home and required explanation |
| --- | --- |
| R01-R10: accounts, VPC, IAM, EKS, ECR, S3, ALB, Route 53, CloudWatch, Secrets Manager | Days 5/7/10/12/14/17; Projects 2/3; identity/network/telemetry references |
| R11: Docker | Day 6; Project 1 proxy; day 14 registry; Python and Java Dockerfiles |
| R12-R23: Kubernetes architecture, Deployment, Service, Namespace, ConfigMap, Secret, Ingress, AWS controller, requests/limits, HPA, PDB, logs/events | Days 8-11/19-20/26; workload/scaling/chart fixtures; Project 2 |
| R24-R26: Terraform, modules, remote state/environment configuration | Days 15-18; local module and inactive backend example; Project 3 |
| R27-R29: Git, Actions, CI/CD validation/standardization/debugging | Days 13-14/22/25; inactive build/publish and reusable/two-caller examples |
| R30-R33: GitOps, Helm, environment values, ArgoCD | Days 19-22; chart/schema/QA values/Application; Project 4 |
| R34-R39: Datadog APM, tracing, logs, metrics/dashboards, Rollbar, Slack | Days 23-24/26; synthetic evidence and Project 5; separate collection/delivery limits |
| R40-R44: Entra ID, Azure Portal, RBAC/privileged access, GitHub OIDC, Snyk | Days 7/13-14/27; access/trust fixtures and secondary-tools exercises |
| R45-R50: Java, Spring Boot, Python, Bash, Gradle, Maven | Days 3/6/13/24; runnable source/build fixtures and optional Java path |
| R51-R56: Jira, Confluence, diagrams, runbooks, incident recovery, platform standardization | Days 25-27; claim matrix, issue/runbook exercises and integrated projects |

All 56 IDs are mapped in plan.json; all 24 claims have an exercise in [the defense matrix](../resume-defense/defense.md). Linux/networking/EKS internals/probes/storage/RBAC/identity/instrumentation/state recovery are labeled prerequisites S01-S10, not extra employment claims. [Secondary-tool exercises](../reference/secondary-tools.md) supply bounded depth for the supporting products. RDS/Lambda/NLB/Prometheus/Grafana/ELK/databases/message brokers/Compose are not added as resume courses.

## Evidence and next stages

Use [the five projects](../projects/README.md) to compose existing artifacts. Use [incident dossiers](../troubleshooting/incidents.json) before [hints](../troubleshooting/hints.md), retry, then consult [resolutions](../troubleshooting/solutions.md). Model interview answers remain in a separate file. Markdown provides an attempt-first workflow, not enforceable access control.

This is content, not a functioning website or learner-progress database. A future frontend may render these IDs and links, but it must not fabricate semantic grading or recorded completion. Read [validation and limitations](../../VALIDATION.md) before treating examples as tested integrations.