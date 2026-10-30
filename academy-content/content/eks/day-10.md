# Day 10: EKS-specific architecture and failures

Resume: R02-R04/R19/R23; C03/C10. Time: 20/40/20/10. Local observations plus synthetic EKS evidence; no AWS provisioning.

## 1. Learning objectives
Identify AWS-managed and customer-managed responsibilities. Separate node readiness, Pod networking, DNS, authentication and authorization failures.

## 2. Concepts
EKS manages the Kubernetes control plane. You still manage version decisions, workloads, permissions, add-ons and node capacity/configuration according to the chosen compute mode. EC2-backed managed node groups supply workers; EKS support does not mean you personally provisioned them. VPC CNI allocates networking addresses; CoreDNS resolves names; kube-proxy handles Service rules in common configurations. Managed does not mean maintenance-free.

## 3. How it works
An authenticated client reaches the EKS API, then Kubernetes authorization decides allowed actions. Access entries or legacy mappings depend on cluster configuration. A Pod's AWS identity is separate from the human's cluster access; compare IRSA and EKS Pod Identity without claiming either was used at work. Node registration, runtime health, network setup and DNS have distinct evidence sources.

## 4. Real-world usage
The resume claims one cluster per account/environment. Failure isolation and identity boundaries are important follow-ups. A namespace cannot replace account-level policies. An IP-exhausted subnet can block new Pods despite available CPU; scaling nodes may worsen address pressure.

## 5. Hands-on lab
Inspect analogous local components, then study I10:
```bash
kubectl --context kind-academy get nodes -o wide
kubectl --context kind-academy -n kube-system get deployments,daemonsets
kubectl --context kind-academy -n kube-system logs deployment/coredns --tail=20
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I10" })'
```
List what exists locally and what does not: kind does not have AWS VPC CNI simply because it has Pods. Build a node -> CNI -> DNS -> workload checklist from the evidence cards. Cleanup: none.

## 6. Expected output
Local nodes and CoreDNS plus a fixture containing `FailedCreatePodSandBox` and AWS CNI address-allocation evidence. A CoreDNS log can be quiet without being broken. The expected deliverable is a reasoned failure boundary and targeted next check, not a successful EKS deployment claim.

## 7. Troubleshooting
I10: Node NotReady suggests conditions/kubelet/runtime; sandbox creation suggests CNI; name failure with working IP suggests DNS. In an approved nonproduction EKS cluster, read aws-node logs and subnet free-address metadata only with explicit context/account checks. Propose verified capacity/address remediation, not blind restart of all system Pods. Retest scheduling, DNS and application path separately.

## 8. Interview preparation
Q19/Q20: explain control-plane responsibility and why spare CPU does not prove schedulability. Discuss identity permission failures separately from network timeouts.

## 9. Independent practice
Draw EKS API access, Pod AWS API access and user-to-app traffic as three paths. Label actors and permissions. Challenge I10 -> H10 -> S10. Optional approved EKS commands and costs are in Project 2; no paid resources are required today.

## 10. Revision
Do not equate kind with EKS. Record uncertainties about the resume's actual node type, add-ons and auth mode. Revisit IAM's actor/action/resource model.