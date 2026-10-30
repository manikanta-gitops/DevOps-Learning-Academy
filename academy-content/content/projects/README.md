# Five integrated projects

These are personal training projects, not claimed employment. They reuse daily artifacts; they are not five extra weekends hidden inside the 90-minute schedule. A project can remain partly simulated until its optional prerequisites/approval exist.

| Project | Days contributing work | Core deliverable | Optional boundary |
| --- | --- | --- | --- |
| [1. Linux and networking](project-01.md) | 1-4, Docker extension after 6 | Running service, evidence script, layered failure diagnosis | Privileged changes only in the dedicated VM |
| [2. AWS/EKS deployment](project-02.md) | 5, 7-12, 25-26 | Local workload/Service, AWS architecture and EKS incident evidence | Real EKS/ALB uses an explicitly approved paid sandbox |
| [3. Terraform and GitHub Actions](project-03.md) | 13-18, 25 | Local reusable module, state reasoning, test/build workflow, OIDC policy analysis | Real ECR publish and S3 backend need account/repository approval |
| [4. Helm and ArgoCD GitOps](project-04.md) | 19-22, 25 | Chart, environment renders and controlled reconciliation/recovery | Live controller/repo setup may need another session and approved Git access |
| [5. Monitoring and incidents](project-05.md) | 23-24, 26 | Logs, optional local spans, correlated synthetic incident and runbook | SaaS ingestion/notifications require approved accounts and cost review |

Guided procedures are examples. Independent acceptance criteria have no immediate solution. Pick one challenge, write your attempt, use its hint, retry, then consult its separate resolution. The final project record should identify live versus simulated integrations and every untested assumption.

## Architecture reference

These are generic training designs, not verified employer diagrams. Local/simulated boundaries are identified in each project; arrows show different kinds of flow rather than implying every tool carries user traffic.

Delivery and provisioning:
```mermaid
flowchart LR
	Source[Source revision] --> Checks[Tests and reviewed scan gate]
	Checks --> Image[Image and digest]
	Image --> Registry[Local registry or approved ECR]
	Registry --> Config[Reviewed deployment configuration commit]
	Config --> Argo[ArgoCD reconciliation]
	Argo --> Workload[Kubernetes workload]
	Module[Terraform module and inputs] --> Plan[Reviewed infrastructure plan]
	Plan --> Infrastructure[Approved infrastructure lifecycle]
	Infrastructure -. provides platform .-> Workload
```

Runtime network path in the AWS reference:
```mermaid
flowchart LR
	Client[Client] -. resolves name .-> DNS[Route 53 DNS]
	Client --> ALB[ALB listener and rules]
	ALB --> Targets[Configured target mode and healthy targets]
	Targets --> Pod[Application Pod and handler]
	Controller[AWS Load Balancer Controller] -. configures .-> ALB
	Ingress[Ingress desired configuration] --> Controller
	Service[Service backend selection] -. informs target reconciliation .-> Controller
```
IP targets can address Pod IPs directly; instance targets use the node/NodePort path. This drawing deliberately does not assert that every ALB request traverses a ClusterIP. Readiness, security groups, routes and target health all affect availability.

Telemetry and response:
```mermaid
flowchart LR
	App[Application] --> Logs[Structured logs]
	App --> Spans[Instrumentation and spans]
	Host[Host or workload metrics] --> Agent[Approved Agent or collector]
	Logs --> Agent
	Spans --> Agent
	Agent --> DD[Datadog backend and scoped queries]
	App --> Exceptions[Approved Rollbar exception integration]
	DD --> Monitor[Monitor evaluation]
	Monitor --> Notify[Slack or approved notification route]
	Exceptions --> Investigation[Correlated incident investigation]
	Notify --> Investigation
	Investigation --> Verify[Controlled correction and recovery checks]
```
Local logs, a synthetic dossier, optional local spans and actual backend ingestion are separate evidence levels. No arrow in this reference is a claim that the external integration has been executed.