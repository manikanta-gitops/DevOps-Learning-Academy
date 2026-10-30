# Project 2: AWS/EKS deployment and accessibility

Resume links: R01-R04/R07/R08/R12-R23/R53; claims C03/C05/C06/C10/C13/C22. EC2 nodes, CNI, CoreDNS, probes and storage are supporting knowledge.

## Objective and architecture
Deploy the sample locally and explain its AWS extension. Local: kind -> Deployment/ConfigMap/dummy Secret -> Pod -> Service. AWS reference: separate environment account -> VPC/subnets -> EKS nodes/Pod networking -> AWS Load Balancer Controller -> internal ALB targets. Route 53 answers DNS; it is not a request proxy. ALB IP targets reach Pod IPs; instance targets use node/NodePort routing. ArgoCD is not in this runtime path.

## Guided local stage
Prerequisites: days 6-8 image and local cluster; Docker, kind, kubectl. Day 8 gives exact creation/load/apply commands. Do not create a second cluster if academy already exists. Verify actual Service routing, not only port-forward:
```bash
kubectl --context kind-academy -n academy rollout status deployment/academy --timeout=90s
kubectl --context kind-academy -n academy get endpointslices -l kubernetes.io/service-name=academy
kubectl --context kind-academy -n academy exec deployment/academy -- python -c 'import urllib.request; print(urllib.request.urlopen("http://academy/ready", timeout=3).read().decode())'
```
Rollout checks controller availability, EndpointSlices show selected ready backends, and the final call uses cluster DNS plus the Service path. Expected: ready endpoint and 200 readiness JSON. Read scaling.yaml to explain requests/HPA/PDB; live HPA requires a reviewed metrics-server install and enough capacity. Use a fixture if unavailable. This is not a real EKS test.

## Optional real EKS extension: explicit approval and charges
Do not run without an owner-approved **nonproduction sandbox** and a cleanup plan. EKS control plane, EC2 nodes, EBS, ALB, NAT, logging, ECR storage and transfer can incur charges. This course does not auto-create an AWS account, cluster or network. Prerequisites: an existing approved cluster, approved ECR image from Project 3, configured AWS Load Balancer Controller with correct IAM/subnet discovery, private client reachability, and verified kubeconfig access. Do not infer the real platform used any particular identity mode.

Set non-secret LAB_PROFILE, LAB_REGION, LAB_CLUSTER, APPROVED_ACCOUNT_ID and LAB_EKS_CONTEXT locally to owner-verified values. Set REVIEWED_EKS_MANIFEST to a working copy of workload.yaml where `academy:1` is replaced by the exact approved ECR image; keep the Service name academy, reviewed requests and dedicated namespace. Do not paste credentials or kubeconfig into the workbook. Before any mutation:
```bash
export AWS_PAGER=""
: "${LAB_PROFILE:?Set the approved sandbox profile}"
: "${LAB_REGION:?Set the approved region}"
: "${LAB_CLUSTER:?Set the approved cluster name}"
: "${APPROVED_ACCOUNT_ID:?Set the owner-verified account ID}"
: "${LAB_EKS_CONTEXT:?Set the owner-verified context}"
aws sts get-caller-identity --profile "$LAB_PROFILE"
aws eks describe-cluster --name "$LAB_CLUSTER" --profile "$LAB_PROFILE" --region "$LAB_REGION" --query 'cluster.{name:name,status:status,endpoint:endpoint}'
kubectl --context "$LAB_EKS_CONTEXT" cluster-info
```
Compare account to APPROVED_ACCOUNT_ID and Kubernetes server to the approved cluster endpoint; stop on mismatch or uncertainty. Do not assume a context's name proves its identity. Only after explicit permission for these sandbox mutations:
```bash
set -euo pipefail
export AWS_PAGER=""
: "${LAB_PROFILE:?Repeat the sandbox identity check first}"
: "${APPROVED_ACCOUNT_ID:?Set the approved account ID}"
: "${LAB_EKS_CONTEXT:?Confirm the cluster endpoint before proceeding}"
: "${REVIEWED_EKS_MANIFEST:?Set the reviewed working-copy manifest path}"
test "$(aws sts get-caller-identity --profile "$LAB_PROFILE" --query Account --output text)" = "$APPROVED_ACCOUNT_ID"
kubectl --context "$LAB_EKS_CONTEXT" apply -f "$REVIEWED_EKS_MANIFEST"
kubectl --context "$LAB_EKS_CONTEXT" -n academy rollout status deployment/academy --timeout=180s
kubectl --context "$LAB_EKS_CONTEXT" apply -f fixtures/aws/alb-ingress.yaml
kubectl --context "$LAB_EKS_CONTEXT" -n academy get ingress academy
kubectl --context "$LAB_EKS_CONTEXT" -n academy describe ingress academy
```
Run the mutation block as a reviewed Bash script so strict error handling stops at a failed check; it is not a request for the assistant to execute it. The STS comparison verifies the AWS CLI profile, not the kubeconfig's credentials or destination: the preceding endpoint/context verification remains mandatory. The Ingress is intentionally internal and HTTP-only for a small sandbox; it is not a public production TLS baseline. Controller reconciliation can create a **billable ALB**. It will not be reachable from an arbitrary public phone/Mac unless private connectivity exists. For HTTPS, the owner must approve a certificate, listener/hostname/Route 53 design; do not make a public ingress just to bypass reachability. Verify target health, then a request from an approved reachable client. Empty ADDRESS without a controller is not success.

## Independent and challenge stages
Independent: write a manifest/diagram with consistent selectors, correct targetPort, meaningful probes and non-secret configuration; explain actual identity/network boundaries. Acceptance: rollout plus Service response, with limitations recorded. Challenge: I08/I09/I10/I11/I26/I30/I34; choose one. Explain evidence before consulting its hint and solution.

## Cleanup and learning evidence
Local: preserve for later projects or delete only `kind delete cluster --name academy` at the course end, after verifying ownership. Cloud: delete the lab Ingress first using the explicit approved context; have the owner verify AWS ALB/target/security resources actually disappear, because stuck finalizers may leave charges. Delete only the newly created academy workload/namespace after confirming it contains no shared resources. Do not delete the pre-existing cluster/network/controller. Verify billing/resource inventory afterward. Record local deployment and AWS simulation/live extension separately; never claim an unexecuted EKS deployment.