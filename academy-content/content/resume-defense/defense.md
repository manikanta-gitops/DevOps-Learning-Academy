# Resume defense and technical confidence

Authority: Stage 1 claim IDs C01-C24. Professional role/dates and ownership remain **unconfirmed**. This document is a task/evidence map, not a progress record. Do not publish personal evidence without review.

## Contribution vocabulary

- Personally implemented: specify exactly what you changed and verified, in what authorized environment.
- Supported: specify the part you performed and what the owner/other engineer decided or implemented.
- Observed: explain what you saw and understood without claiming execution.
- Studied: explain concepts without asserting practical evidence.
- Practised in a lab: identify the local or simulated environment and its limits.

## Claim-to-practical-evidence matrix

| Claim | Required exercise/evidence | Verification and honest boundary |
| --- | --- | --- |
| C01 Employment/tenure | Write an accurate role/date timeline privately | Clarify discrepancy with non-IT background; a lab cannot verify employment |
| C02 15+ services/five environments | Day 25 generic service/environment responsibility matrix | Demonstrate one sample deeply; counts remain resume assertions |
| C03 Account/cluster provisioning | Project 2 annotated account/VPC/EKS diagram and local workload | kind is not AWS provisioning; classify any authorized actual work separately |
| C04 Modules/remote state | Days 15-18 module inputs/outputs, two states and lock/recovery diagnosis | Local terraform_data plus backend design, not proof of every AWS module |
| C05 IAM least privilege | Day 7 action/resource matrix and I07 diagnosis | Include allowed/denied test design; no real policy changes |
| C06 ALB/Route 53 | Project 1 layered diagnosis and Project 2 target-path diagram | Separate local proxy evidence from actual AWS target health |
| C07 CI build/test/publish | Project 3 workflow, tests and image identity | Separate local build, hosted workflow and actual ECR push evidence |
| C08 Build/test diagnosis | I13 first-causal-error investigation and negative test | Do not convert a supplied failure into a past production story |
| C09 Workflow standardization | Day 13 shared job design and environment permission matrix | Show interface/version boundary and reviewers, not fabricated deployment frequency |
| C10 Kubernetes operations | Days 8-11 manifest, readiness and actual Service-path verification | Record explicit local context and namespace |
| C11 Helm authoring | Days 19-20 chart/helper/schema plus two environment renders | Explain each change; running upgrade alone is not authorship |
| C12 ArgoCD operation | Project 4 Application/source diff and I21/I22 diagnosis | Render-only, simulated and live reconciliation remain distinct |
| C13 Resource/HPA stability | Day 11 scheduler/metrics/PDB exercise | No invented performance gains; metrics-source prerequisites explicit |
| C14 Datadog detection | Day 23 scoped monitor decision table | Separate observing dashboards from creating collection/instrumentation |
| C15 Trace/log/Rollbar correlation | Day 24 evidence timeline with competing hypothesis | Synthetic bundle is labeled; causality needs verification |
| C16 Production fixes | Day 26 incident record with stop/approval/rollback/verification | Lab repair is not production ownership; clarify actual authorization |
| C17 Slack incident response | Day 26 fictional update and notification-path map | Receiving alerts differs from owning alert configuration |
| C18 Entra/product access | Day 27 least-privilege request review and expiry/revoke tests | No tenant role granted; distinguish directory and product permissions |
| C19 Supported OIDC | Day 14 aud/sub/trust diagnosis and Project 3 approved extension | Preserve "supported" unless actual evidence establishes ownership |
| C20 Snyk scans | Secondary-tools findings review and remediation/exception record | Scanner execution, policy ownership and remediation are different |
| C21 Reduced duplication | Days 16/20 interface and before/after design comparison | No numerical time/cost improvement without a real measured baseline |
| C22 Architecture contribution | Day 25 three flow diagrams with alternatives | Contribution is not sole architect responsibility |
| C23 Runbooks/docs | Day 24/26 scoped incident runbook | Validate steps against the local lab; never copy internal documents |
| C24 Work coordination | Day 25 issue acceptance criteria, risk and handover | Product use is not Jira administration or management authority |

## Private evidence record template

For each claim fill: claim ID; actual role classification; real context; personal action; others' actions; permitted artifact; verification; limitations; next learning task. Leave unknown fields unknown. Keep employer/private identifiers outside the course repository. Do not create a score for unattempted tasks.

## Nine-step explanation practice

1. Requirement: what needed to work and under what constraints?
2. Architecture: which components and boundaries were involved?
3. Actual responsibility: what did you personally do, support or observe?
4. Tools: why were these tools involved?
5. Implementation: what sequence/configuration mattered?
6. Verification: what evidence proved the intended result?
7. Failure modes: what could fail at each relevant boundary?
8. Troubleshooting: what would you inspect first and why?
9. Improvement: what evidence would justify a safer or simpler alternative?

Example to adapt only to true lab work: "In my local kind lab, I deployed the sample and checked the Service path. A selector mismatch produced no endpoints. I compared labels with the Service selector, corrected my lab manifest, and verified an in-cluster request. I have not independently operated this configuration in production."

Likely follow-ups: What did another engineer own? Which environment was this? What evidence can you discuss safely? What would change in EKS? What did you not test? Strong answers state limits rather than inventing missing details.