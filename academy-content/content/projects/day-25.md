# Day 25: Integrated delivery project

Resume: R01/R11/R24-R33/R51-R54/R56. Time: 20/40/20/10. Reuse earlier artifacts; no new platform provisioning.

## 1. Learning objectives
Explain and verify the contracts between source, tests, image, configuration, reconciliation and runtime behavior. Identify your own contribution honestly.

## 2. Concepts
An integration is a handoff with an input, output, identity and failure signal. Source commit, image digest, chart version and config commit are separate identifiers. Jira describes the planned work; Confluence/runbooks document repeatable operations; Slack communicates status. None substitutes for actual verification.

## 3. How it works
Developer PR -> tests/scan policy -> Docker build -> registry -> config PR -> Helm render -> ArgoCD -> Kubernetes -> health/telemetry. Terraform prepares infrastructure separately; it is not necessarily invoked on every application commit. Runtime requests travel through DNS/TLS/load balancing/application, not through CI or ArgoCD.

## 4. Real-world usage
The resume's single platform spans these tools. Explain one service deeply rather than memorizing "15 microservices." Local kind and local images demonstrate parts of the design, not five-account AWS experience.

## 5. Hands-on lab
Choose the most complete existing project path; spend the block verifying it rather than reinstalling tools:
```bash
python3 -m unittest discover -s fixtures/app -v
helm lint fixtures/helm/academy
helm template gitops fixtures/helm/academy --namespace academy-gitops
kubectl --context kind-academy -n academy get deployments,pods,services
kubectl --context kind-academy -n academy exec deployment/academy -- python -c 'import urllib.request; print(urllib.request.urlopen("http://academy/", timeout=3).read().decode())'
```
These commands test app behavior, chart validity and the manually installed baseline's Service path. For a live GitOps release inspect the actual `academy-gitops` objects instead; do not call the manual baseline a GitOps test. Add a private issue/runbook record with desired change, evidence, approval boundary and rollback. Cleanup: stop forwards; keep artifacts for the next incident.

## 6. Expected output
Tests/render succeed and the verified workload responds with its known version. Record unimplemented links explicitly: e.g. "local image loaded; ECR/OIDC not executed." A diagram arrow does not count as a tested integration.

## 7. Troubleshooting
I25: image exists but deployment still references the old tag. Trace published artifact -> config revision -> controller source -> running image. Fix the owning config handoff, then verify actual served version and metrics. Do not rebuild repeatedly if the artifact already exists.

## 8. Interview preparation
Q49/Q50: explain delivery versus request flow and defend the evidence chain. Include requirement, architecture, responsibility, implementation, verification, possible failures, diagnosis and improvement.

## 9. Independent practice
Draw all three flows (delivery, runtime, telemetry) without notes. Annotate each arrow with identity, input/output and failure evidence. Challenge I25 -> H25 -> S25. Create a small change ticket with acceptance criteria, not invented employment achievements.

## 10. Revision
Mark each handoff tested, simulated or pending. Revisit GitOps recovery and keep only sanitized lab artifacts in the portfolio.