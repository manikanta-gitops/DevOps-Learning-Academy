# Day 11: Resources, scaling, disruption and storage

Resume: R13/R20-R23; C13. Time: 20/40/20/10. Local kind; one bounded exercise today, scaling/storage are revisit options.

## 1. Learning objectives
Distinguish scheduling failure, CPU throttling and OOM. Explain prerequisites and limits of HPA/PDB without creating a load storm.

## 2. Concepts
Requests reserve scheduling capacity; limits constrain runtime use. CPU limits can throttle; memory overuse can lead to container termination. HPA adjusts replicas from metrics; CPU utilization targets require suitable requests and a working metrics source. PDB limits voluntary disruptions through supported eviction paths, not all failures or controller rollouts. PV/PVC separate storage provision from Pod lifetime; a pending volume can block scheduling.

## 3. How it works
Scheduler compares requests to available node capacity and constraints. Metrics API -> HPA calculation -> desired replicas -> Deployment -> scheduler. More replicas still need capacity. A PDB evaluates healthy replicas and allowed disruptions. StorageClass/PVC -> provisioner/PV -> mount; kind and EKS storage drivers differ.

## 4. Real-world usage
The resume claims requests/limits and HPA tuning. Evidence should show the measured bottleneck, not "increase all limits." Increasing CPU replicas cannot fix a downstream permission denial. A JVM heap below the container memory limit still leaves native/thread overhead to account for.

## 5. Hands-on lab
Inspect resource configuration and investigate I11 without exhausting the machine:
```bash
kubectl --context kind-academy -n academy describe deployment academy
kubectl --context kind-academy describe nodes
kubectl --context kind-academy -n academy get events --sort-by=.metadata.creationTimestamp
kubectl --context kind-academy -n academy get pvc
kubectl --context kind-academy get storageclass
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I11" })'
```
Explain requests/limits and compare the fixture's scheduler message with capacity. No PVCs is expected if none were created. Read `fixtures/kubernetes/scaling.yaml`; do not apply HPA merely to make a chart green if metrics-server is absent. Optional revisit: install a reviewed local metrics-server version, then apply that file with `--context kind-academy` and verify `get hpa`; setup counts as a separate session. Cleanup: no new objects in the core exercise.

## 6. Expected output
Resource requests of 50m/32Mi and limits of 250m/128Mi for the baseline. I11 provides `Insufficient cpu`; this is not OOMKilled. HPA unknown metrics is expected without its metrics source, not a reason to randomly change replicas.

## 7. Troubleshooting
Inspect Pending conditions and events before logs (an unscheduled container has no app logs). For OOM read last termination reason and memory trend; exit 137 alone is insufficient to establish OOM. For PVC Pending inspect claim/events/class/binding constraints. Fix the specific resource/constraint and verify scheduling, readiness and actual workload behavior. Prevention: resource baselines and capacity alerts.

## 8. Interview preparation
Q21/Q22: requests versus limits; PDB versus availability guarantee. State HPA prerequisites and why scaling is not a universal remedy.

## 9. Independent practice
Given two replicas requesting 100m each and 150m available on one eligible node, explain the scheduling result and two safe alternatives. Challenge I11 -> H11 -> S11; use fixtures rather than real memory exhaustion.

## 10. Revision
Requested, used and limited resources differ. Review day 8 lifecycle. Keep unsupported scaling/storage operations explicitly pending.