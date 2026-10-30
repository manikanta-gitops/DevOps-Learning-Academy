# Day 9: Kubernetes traffic and Ingress

Resume: R02/R07/R08/R14/R18/R19/R23. Time: 20/40/20/10. Local kind; AWS controller behavior uses fixtures, not a fabricated ALB deployment.

## 1. Learning objectives
Trace DNS, Service and endpoint selection. Explain why a healthy Pod can be unreachable through a Service or ingress rule.

## 2. Concepts
A Service gives selected Pods a stable endpoint. Its selector must match Pod labels, `port` is the Service port, and `targetPort` is the backend port/name. EndpointSlices represent endpoint addresses and readiness. CoreDNS resolves cluster names. Ingress declares HTTP routing; a controller must implement it. NetworkPolicy requires a supporting network implementation, not just a YAML object.

## 3. How it works
In-cluster client -> cluster DNS -> Service virtual address -> configured dataplane -> ready endpoint -> application. kube-proxy can implement Service forwarding rules; some dataplanes use alternatives. ALB controller reconciles Kubernetes intent into AWS resources. With IP targets ALB can reach Pod IPs directly; do not force a Service proxy hop into that diagram.

## 4. Real-world usage
The resume lists Services, Ingress, ALB and the AWS Load Balancer Controller. Distinguish Kubernetes intent, controller reconciliation and AWS target health. Merely applying an Ingress does not create routing when its controller is absent.

## 5. Hands-on lab
Prerequisite: healthy day 8 workload. Inspect first:
```bash
kubectl --context kind-academy -n academy get service academy -o yaml
kubectl --context kind-academy -n academy get pods --show-labels
kubectl --context kind-academy -n academy get endpointslices -l kubernetes.io/service-name=academy
kubectl --context kind-academy -n academy exec deployment/academy -- python -c 'import socket; print(socket.gethostbyname("academy"))'
kubectl --context kind-academy -n academy exec deployment/academy -- python -c 'import urllib.request; print(urllib.request.urlopen("http://academy/health", timeout=3).read().decode())'
```
These commands inspect the real Service path, unlike port-forward which can bypass it. Read the selected non-secret Service YAML; do not generalize to dumping Secrets. Compare selectors, endpoint readiness and ports, then draw the path. Cleanup: no new objects; preserve the working baseline.

## 6. Expected output
At least one ready endpoint, resolvable ClusterIP and health JSON through `http://academy/health`. Cluster DNS names can include `academy.academy.svc.cluster.local`; do not assume every cluster uses that domain. A successful port-forward alone is insufficient Service-path verification.

## 7. Troubleshooting
I09 starts with direct-Pod success and no Service endpoints. Check labels/selector, readiness, targetPort and policies; then inspect CoreDNS only if resolution fails. Apply the smallest local manifest fix and test via Service again. A timeout versus refusal versus no DNS answer changes the next test. Prevention: selector consistency tests and end-to-end Service checks.

## 8. Interview preparation
Q17/Q18: compare Service and Ingress; explain what creates an ALB. State what your local test proves and what still needs an approved AWS environment.

## 9. Independent practice
On a copied manifest, rename a label and keep the selector coherent without using AI. Predict the EndpointSlice change before applying. For a broken challenge, use I09 first rather than randomly modifying the cluster. H09 then S09 after a recorded attempt.

## 10. Revision
Labels, ready endpoints, ports and dataplane must agree. Distinguish control plane from traffic path. Revisit Docker's internal bind versus host publication.