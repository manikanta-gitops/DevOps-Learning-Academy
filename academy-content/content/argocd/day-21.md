# Day 21: ArgoCD and reconciliation

Resume: R15/R27/R30/R33; C12. Time: 20/40/20/10. Local optional installation; otherwise Application/render evidence. Repository access must be authorized.

## 1. Learning objectives
Explain source, destination, reconciliation, sync and health. Distinguish application operation from administering ArgoCD itself.

## 2. Concepts
GitOps keeps desired state in Git and reconciles it through a controller. ArgoCD's API/server handles user interaction, repository components retrieve/render sources, and the application controller compares/reconciles cluster state. An Application selects repoURL, targetRevision, path and destination. Sync means agreement with desired manifests; health is resource/application readiness assessment, not an end-to-end availability guarantee.

## 3. How it works
Read source revision -> render chart -> compare live objects -> display differences -> authorized sync -> observe resource health. The example uses manual sync and a local destination, with namespace creation enabled. No automated pruning/self-healing is silently enabled. Helm templating under ArgoCD does not necessarily create a Helm release with ordinary Helm history.

## 4. Real-world usage
The resume claims monitoring sync and health and diagnosing failures. Repository credentials, incorrect paths and destination RBAC fail at different stages. Do not infer the real platform's automatic sync policy from the word GitOps.

## 5. Hands-on lab
Core, no controller required:
```bash
helm template gitops fixtures/helm/academy --namespace academy-gitops
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I21" })'
```
Read `fixtures/argocd/application.yaml` and resolve every field. The REPLACE repository must not be applied. For the optional live local path use Project 4's version-reviewed installation and authorized Git repository instructions. Once its prerequisites are fulfilled, inspect with `kubectl --context kind-academy -n argocd get application academy -o yaml`; avoid copying credentials or repository Secrets. Setup consumes the lab block and can carry over. Cleanup: preserve the lab controller for day 22, then use Project 4's cleanup.

## 6. Expected output
Rendered GitOps-named Service/Deployment and a mapped Application contract. Live mode should display source comparison and health; if no controller is installed, an Application CRD error is expected and must not be described as a completed GitOps deployment.

## 7. Troubleshooting
I21: check repo reachability/auth, target revision/path and Helm rendering before destination access. ComparisonError differs from a successful sync with unhealthy Pods. Fix source/config at its owning layer, refresh comparison and verify workload behavior. Do not widen destination RBAC to cluster-admin without a justified lab-only requirement.

## 8. Interview preparation
Q41/Q42: Synced versus Healthy and Git as desired-state source. Explain the controller's responsibilities without placing it in the runtime HTTP request path.

## 9. Independent practice
Write an Application for a fictional approved repository and explain the consequences of changing path, revision and namespace. Do not push or register that repo during content work. Challenge I21 -> H21 -> S21.

## 10. Revision
Repo/render/destination/app failures are different. Record whether your evidence came from local rendering, fixtures or an actual authorized local controller. Revisit Terraform partial failure reasoning.