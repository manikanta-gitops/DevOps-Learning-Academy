# Day 29: Product-based design interview

Resume: R01/R20/R25/R33/R53; claims C03/C13/C21/C22. Time: 20/40/20/10. Diagram and local configuration checks only.

## 1. Learning objectives
Justify design trade-offs under explicit constraints and name what you would measure before acting. Avoid presenting one architecture as universally correct.

## 2. Concepts
Reliability includes detecting and recovering from failure, not only replica count. Isolation, cost, complexity and deployment speed compete. Reusable modules/charts reduce duplication but increase shared-change impact. Capacity must include requests, availability zones, dependencies and failure conditions.

## 3. How it works
Clarify load/availability/security/budget -> propose bounded architecture -> describe alternatives -> identify failure boundaries -> choose validation signals -> plan rollout/recovery. Separate account/cluster/namespace isolation and separate deployment/runtime/telemetry flows.

## 4. Real-world usage
Product-based interviews often explore reasoning, but company practices vary. The resume's five-account design is a topic to explain, not a prescription to reproduce. No invented request volume, uptime or cost savings should appear in your answer.

## 5. Hands-on lab
Choose a design change to the local chart and verify its implications without deployment:
```bash
helm template academy fixtures/helm/academy -f fixtures/helm/qa-values.yaml
helm template academy fixtures/helm/academy --set autoscaling.enabled=true
```
Compare replica ownership/PDB/HPA, and annotate required metrics/capacity. Use I29's constraints to propose a small test and rollback plan. If choosing Terraform design instead, use `terraform -chdir="$LAB_TF_DIR" validate` and inspect a local plan, not an AWS apply. Cleanup: no live objects changed by rendering/validation.

## 6. Expected output
A diagram, two alternatives, an explicit chosen trade-off and a measurable validation plan. A rendered PDB/HPA is not proof of resilience under load. Unknown load or budget stays unknown until clarified.

## 7. Troubleshooting
I29 challenges the assumption that more replicas solve every latency incident. Check saturation and downstream limits, compare time spent in spans, and test the actual bottleneck. A safe proposal includes blast radius, baseline and rollback instead of an immediate global scale-up.

## 8. Interview preparation
Q57/Q58: explain an isolation or scaling trade-off and a shared-module change strategy. State limits honestly and ask targeted clarification questions before designing.

## 9. Independent practice
Give a five-minute architecture explanation without AI, then argue for the strongest alternative. Challenge I29 -> H29 -> S29. Record what evidence could change your recommendation.

## 10. Revision
Trade-offs need constraints and measurements. Revisit day 26's hypothesis testing. Keep assumed numbers labeled assumptions, not resume achievements.