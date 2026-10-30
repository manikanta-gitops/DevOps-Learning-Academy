# Day 20: Helm environments and release safety

Resume: R20-R22/R31/R32/R56; C11/C13/C21. Time: 20/40/20/10. Local rendering or one local release exercise, not both plus every optional feature.

## 1. Learning objectives
Compare environment values, validate their types and explain release recovery. Understand HPA/PDB templates without confusing them with installed metrics infrastructure.

## 2. Concepts
Later values files override earlier values; explicit set flags take high precedence. Lists generally replace rather than merge element-by-element, and template behavior still matters. Conditionals include optional resources; range loops render repeated values; helpers keep naming consistent. Dependencies declare charts and need reviewed versions/lockfiles. Upgrade changes a release; rollback restores a previous Helm revision, not external data.

## 3. How it works
Base values + QA override -> schema check -> rendered replica/PDB changes -> API update -> rollout -> readiness. When HPA owns scaling, continuously setting replicas from a chart can conflict with it, so the example omits replicas when autoscaling is enabled. PDB cannot guarantee survival of all node failures.

## 4. Real-world usage
Five environment-specific values files do not mean five unrelated charts. The resume's standardization claim should explain what is shared and how a change is tested before wide adoption. Manual Helm release history differs from ArgoCD using Helm as a renderer.

## 5. Hands-on lab
```bash
helm lint fixtures/helm/academy -f fixtures/helm/qa-values.yaml
helm template academy fixtures/helm/academy -f fixtures/helm/qa-values.yaml
helm template academy fixtures/helm/academy --set autoscaling.enabled=true
helm template academy fixtures/helm/academy --set-string replicaCount=two
```
The first renders QA with two replicas/PDB; the second variant renders HPA; the last intentionally fails the supplied schema and must not be deployed. If doing the installed release option instead, run `helm history academy --kube-context kind-academy -n academy-helm`, upgrade with QA values and verify the Deployment. Only after identifying a known-good prior revision use `helm rollback academy VERIFIED_REVISION --kube-context kind-academy -n academy-helm --wait`; replace that placeholder from actual history. Cleanup: uninstall the named training release after recording evidence.

## 6. Expected output
QA renders two replicas and PDB; autoscaling render includes HPA but no Deployment replicas field. `replicaCount=two` is rejected as a type error. An absent metrics API means HPA cannot obtain useful CPU metrics even though its YAML rendered successfully.

## 7. Troubleshooting
I20: a release timeout can come from probes/image/scheduling, not just Helm syntax. Inspect release status and Kubernetes events/logs, distinguish desired values from running state, and verify recovery with HTTP. Avoid blindly reusing old values that preserve obsolete settings. Prevention: environment render diffs, schema checks and staged validation.

## 8. Interview preparation
Q39/Q40: precedence and rollback limits. Explain what happens when two controllers manage the same field and why GitOps recovery differs from a local Helm rollback.

## 9. Independent practice
Add a typed optional setting and a small range-rendered non-secret environment map in a copy. Define acceptance tests for enabled/disabled cases. Challenge I20 -> H20 -> S20.

## 10. Revision
Validate all target environments, not just defaults. Never call a render a successful deployment. Revisit state locking: tools need clear ownership of desired state.