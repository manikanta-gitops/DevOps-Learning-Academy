# Day 22: GitOps promotion and recovery

Resume: R01/R27-R33/R53; C09/C12/C22. Time: 20/40/20/10. Reuse Project 4 or solve synthetic evidence; no new platform setup today.

## 1. Learning objectives
Track source commit, image digest and deployment-config commit separately. Recover desired state without fighting reconciliation.

## 2. Concepts
OutOfSync means desired/live comparison differs; it is not automatically an outage. Self-healing can undo live edits. Pruning can delete tracked resources absent from desired state; reviewing deletion scope is essential. Promotion should reuse a verified artifact with an explicit environment configuration change. A Git revert records a new change; resetting history is not the normal audited recovery path.

## 3. How it works
CI publishes immutable image -> reviewed config commit changes chart/image reference -> ArgoCD observes revision -> reconciles -> probes/telemetry establish recovery. If a desired configuration is bad, revert/correct it through review; a live-only rollback may be overwritten. Emergency manual action needs coordination and reconciliation of Git afterward.

## 4. Real-world usage
This connects the resume's pipelines, Helm values and per-environment ArgoCD applications. Deployment flow and runtime request flow are separate. A green sync cannot establish low error rate; a pushed image alone cannot establish deployment.

## 5. Hands-on lab
For a configured local Application:
```bash
kubectl --context kind-academy -n argocd get application academy -o jsonpath='{.status.sync.status}{" "}{.status.health.status}{"\n"}'
kubectl --context kind-academy -n academy-gitops get deployments,pods,services
git diff -- fixtures/helm/academy
git log -3 --oneline
```
Git commands apply only inside your separate authorized lab repository; do not run them against employer content. Review one proposed image-version/values change and its rendered diff before any push/sync. If no live repo/controller is available, I22 supplies desired/live/history evidence and the same decision task. Cleanup: return the local lab to a known-good desired configuration, then stop forwards; retain for Project 4 verification.

## 6. Expected output
In live mode actual statuses and Pod health; in fixture mode a documented mismatch and recovery proposal. `Synced Healthy` is only part of success: call the Service and inspect version/error evidence before declaring recovery.

## 7. Troubleshooting
I22: establish source revision and live change -> inspect diff -> identify owning controller -> choose Git correction or coordinated emergency action -> sync -> verify endpoints/telemetry. For unexpected pruning, stop automated destructive operations and inspect affected scope before approving anything. Do not blindly enable prune as an OutOfSync fix.

## 8. Interview preparation
Q43/Q44: explain why a manual change disappears and how to roll back a GitOps release. State any downtime/data-compatibility limitations rather than claiming instant universal rollback.

## 9. Independent practice
Draw a promotion from dev to QA using the same digest and separate config approvals. Write a recovery plan for a wrong image tag. Challenge I22 -> H22 -> S22 after evidence review.

## 10. Revision
Reconcile the source of truth; do not fight it. Distinguish image, chart, source and config versions. Revisit Helm's rendered values versus cluster state.