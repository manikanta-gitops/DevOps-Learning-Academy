# Project 4: Helm and ArgoCD GitOps

Resume links: R13/R20-R22/R27/R30-R33/R53/R56; claims C09-C13/C21/C22.

## Objective and boundaries
Create/render a chart, define Git desired state, reconcile locally when setup exists, and recover through Git. Architecture: approved repo -> chart renderer -> ArgoCD Application -> local namespace -> Service/Pods. Reuse day 6 image and kind-academy. ArgoCD installation and repo access are prerequisites that may take a full extra study block; do not hide that setup in 40 minutes. A static render alternative is valid learning but is **not** a completed GitOps deployment.

## Guided chart work
Days 19-20 provide exact lint/render/upgrade commands and schema-failure exercise. Verify QA values separately and explain replicas versus HPA ownership. Use distinct namespaces: academy for raw manifests, academy-helm for manual Helm releases, academy-gitops for ArgoCD. Never let Helm CLI and ArgoCD independently own the same objects.

## Optional local controller setup
Prerequisites: a reviewed stable ArgoCD release tag from official releases, a compatible local Kubernetes version, sufficient local memory, and installation permission for the local cluster. Set ARGOCD_VERSION yourself to that reviewed tag (not a moving stable/latest URL). Download and inspect the manifest before applying it:
```bash
: "${ARGOCD_VERSION:?Choose and review an official release tag first}"
export ARGOCD_INSTALL="$(mktemp "${TMPDIR:-/tmp}/academy-argocd.XXXXXX")"
curl --fail --location "https://raw.githubusercontent.com/argoproj/argo-cd/${ARGOCD_VERSION}/manifests/install.yaml" --output "$ARGOCD_INSTALL"
kubectl --context kind-academy cluster-info
```
Review downloaded RBAC/CRDs/controllers locally; do not apply unreviewed content or trust a successful download alone. Only after the explicit local-context check and review:
```bash
kubectl --context kind-academy create namespace argocd
kubectl --context kind-academy -n argocd apply -f "$ARGOCD_INSTALL"
kubectl --context kind-academy -n argocd get deployments,statefulsets,pods
kubectl --context kind-academy -n argocd rollout status deployment/argocd-server --timeout=180s
```
Other components must also become ready; a server-only readiness check is not sufficient. If the namespace/controller already exists, stop and inspect ownership instead of overwriting it. No UI password or repository token is dumped by these instructions. Authentication setup, if needed, is performed privately following the chosen release's official instructions.

## Repository and Application
Use a separately approved personal repository with `fixtures/helm/academy` at its root-relative path. Do not assume a repository exists, make it public, push code or register private credentials during this content stage. A private repo requires an owner-approved ArgoCD credential mechanism; avoid embedding tokens in URLs/manifests.

Copy application.yaml to a private working file, replace the REPLACE repo URL, and verify path/revision/destination/namespace. Set LAB_ARGO_APPLICATION to that reviewed copy. Do not apply a placeholder file. For a live authorized local exercise:
```bash
kubectl --context kind-academy -n argocd apply -f "$LAB_ARGO_APPLICATION"
kubectl --context kind-academy -n argocd get application academy -o jsonpath='{.status.sync.status}{" "}{.status.health.status}{"\n"}'
```
Review the desired diff before requesting the explicit manual sync. This example does not automatically prune:
```bash
kubectl --context kind-academy -n argocd patch application academy --type merge -p '{"operation":{"sync":{"prune":false}}}'
kubectl --context kind-academy -n academy-gitops get deployments,pods,services
kubectl --context kind-academy -n academy-gitops port-forward service/gitops-academy 18082:80
```
In another terminal `curl --fail --max-time 3 http://127.0.0.1:18082/ready` verifies the forwarded app; also test its in-cluster Service path as day 9 teaches. Expected: comparison succeeds, sync completes, workload becomes healthy and requests succeed. Image academy:1 must already be loaded into this kind cluster. The patch sets an Application operation, not an automated-sync policy.

## Independent and challenge stages
Independent: author a small chart with two environments, a constrained Application and a promotion/recovery record linking source/image/config versions. Acceptance: rendered contracts plus actual controller/HTTP evidence if live mode is available. Challenge I19-I22/I25/I26: choose one bad values/path/revision/health scenario, attempt first, then hint and separate resolution. To recover a live desired-state mistake, review and revert/correct the Git commit; do not claim a local-only Helm rollback repaired GitOps desired state.

## Cleanup and common failures
Stop port-forwards. Review finalizers/ownership before deleting Applications: cascading deletion can delete workloads, and non-cascading deletion can leave them behind. For this dedicated disposable cluster, the clearest end-of-course cleanup is deleting only the verified `academy` kind cluster; this removes its controller/CRDs/workloads together. Do not copy that approach to shared infrastructure. Remove only the downloaded local manifest afterward. No public repo or cloud resource is automatically cleaned up; owner review remains required. Common failures: wrong repo path, private repo auth, absent image, conflicting Helm ownership and healthy sync with unready application.