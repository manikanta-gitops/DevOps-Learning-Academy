# Day 8: Kubernetes workload lifecycle

Resume: R04/R12-R17/R23; claim C10. Time: 20/40/20/10. Dedicated local kind cluster only. Setup may consume the entire lab block.

## 1. Learning objectives
Explain how declared state becomes running containers. Verify readiness and understand configuration scope; do not equate resource creation with service health.

## 2. Concepts
The API stores desired state. Controllers reconcile it. A Deployment manages ReplicaSets, which maintain Pods. The scheduler selects a node; kubelet starts containers via a runtime. Namespaces scope names and many permissions, not hard isolation. ConfigMaps hold non-secret settings; Secrets require protection even though their API representation is encoded. Readiness removes unhealthy backends from service traffic; liveness can restart a stuck container; startup probes protect slow initialization.

## 3. How it works
Manifest -> API validation -> Deployment controller -> ReplicaSet -> scheduled Pod -> image pull/start -> probes -> ready endpoint. Configuration injected as environment is fixed for that process; changing a ConfigMap does not update existing process environment. A mounted file may update later but the app must reread it.

## 4. Real-world usage
These resources appear explicitly in the resume. EKS runs upstream Kubernetes with AWS-specific operations; kind demonstrates API/workload mechanics but not managed-control-plane or AWS networking behavior.

## 5. Hands-on lab
Prerequisites: Docker, kind, kubectl, day 6 image. Create only if no cluster named academy exists:
```bash
kind get clusters
kind create cluster --name academy
kubectl --context kind-academy cluster-info
kind load docker-image academy:1 --name academy
kubectl --context kind-academy apply -f fixtures/kubernetes/workload.yaml
kubectl --context kind-academy -n academy rollout status deployment/academy --timeout=90s
kubectl --context kind-academy -n academy get pods,services
kubectl --context kind-academy -n academy port-forward service/academy 18080:80
```
Confirm the cluster is the Docker-created lab before apply. Port-forward stays foreground; another terminal runs `curl --fail http://127.0.0.1:18080/ready`. Read the manifest fields and explain label/selector agreement, container port, resources, probes and dummy secret reference. Stop port-forward with Ctrl+C. Retain the cluster for later days; final cleanup is `kind delete cluster --name academy` only after all labs and ownership checks.

## 6. Expected output
Rollout succeeds, Pod becomes `1/1 Running`, Service has a ClusterIP, readiness returns `{"status":"ready"}` with whitespace variations. `Pending`, `ImagePullBackOff` or `CrashLoopBackOff` require different checks. Image loading must use the same name/tag as the manifest.

## 7. Troubleshooting
I08 and I34: `kubectl --context kind-academy -n academy describe pods` shows scheduling/pull events. `kubectl --context kind-academy -n academy logs deployment/academy --tail=20` shows current output; add `--previous` for a restarted container when available. Scope the cause, fix the lab manifest, reapply and verify rollout plus HTTP. Do not repeatedly delete Pods without evidence.

## 8. Interview preparation
Q15/Q16: controller versus scheduler versus kubelet; readiness versus liveness. Explain which stage failed using evidence instead of saying Kubernetes is down.

## 9. Independent practice
Create a separate working-copy configuration that runs APP_VERSION=2 using a ConfigMap, without editing the shared example. Verify the served version and explain the required rollout. Challenge I08/I34 -> hints -> retry -> solutions.

## 10. Revision
Desired state is not observed health. Record context, namespace, image and verification. Stop at 40 minutes if setup is unfinished; do not pretend subsequent labs are ready.