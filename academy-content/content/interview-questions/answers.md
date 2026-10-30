# Interview answer references

Attempt the question first. These are models for reasoning, not stories to claim as personal experience. Each reference gives expected points, a model with a concrete example, and a common mistake. Follow-ups are in questions.json. Use the audit rubric only on an actual answer; no scores or learner status are supplied here. Q61-Q100 deepen specific weaknesses rather than add forty compulsory answers to the schedule.

## Q01
**Expected:** process, address/port, request evidence, limits. **Model:** A PID proves a program exists, not that it accepts the intended connection. I would compare the requested host/port with `ss -lnt` in the Linux lab, then make a bounded HTTP request. A process on 8080 does not serve a client requesting 8089. After reaching it I still need application/dependency checks; a listener alone is insufficient. **Avoid:** restarting first or treating an unrelated open port as success.

## Q02
**Expected:** distinct resource observations and causal evidence. **Model:** I compare CPU/process activity, available memory and OOM evidence, filesystem block usage, and inode usage. `df -h` and `df -i` answer different questions; many tiny files can exhaust inodes while bytes remain. Cache is reclaimable, so low unused RAM does not alone prove memory exhaustion. I correlate the symptom with the relevant metric before changing anything. **Avoid:** one universal utilization threshold or indiscriminate cache deletion.

## Q03
**Expected:** user, paths, environment, journal. **Model:** systemd may run a different user, working directory, PATH and environment from my shell. I inspect the lab unit's User, WorkingDirectory, ExecStart and Environment, then its journal and exit code. An absolute Python path can solve a missing executable, but not a missing file permission. I test the smallest relevant difference and verify the service request after restart. **Avoid:** assuming an interactive shell profile is loaded.

## Q04
**Expected:** traversal, ownership/group, minimal mode. **Model:** I identify the failing pathname and service identity, then inspect each parent directory's execute permission and the file's read/execute need. A readable script behind a non-traversable home directory remains inaccessible. In the dedicated VM I place the sample in the intended service directory or adjust only its needed owner/group permissions, then retest as the service. **Avoid:** world-writable permissions or changing an entire home tree.

## Q05
**Expected:** pipeline status, HTTP semantics, immediate capture. **Model:** Bash normally returns the last pipeline command's status, so successful tee can hide curl failure. `set -o pipefail` makes a failing pipeline member affect the pipeline result; `$?` must be captured before another command overwrites it. curl also needs `--fail` or explicit status checking to turn HTTP 500 into a failure. I test transport error, HTTP error and success separately. **Avoid:** assuming pipefail makes HTTP status handling automatic.

## Q06
**Expected:** quoting, target restriction, timeouts, failure propagation. **Model:** A small checker accepts only intended lab targets, quotes inputs, sets a timeout, distinguishes expected success from failure and exits nonzero when the check fails. The sample uses loopback HTTP and a three-second bound. I test `/health`, `/error` and a closed port, verifying both output and exit status. Cleanup must affect only its own resources. **Avoid:** unbounded retries, arbitrary shell evaluation or success messages after ignored failures.

## Q07
**Expected:** ordered network layers. **Model:** NXDOMAIN is a DNS negative answer; refusal normally means the target/path actively rejected TCP, often no listener. A timeout is lack of a timely response and needs routing/filtering/server evidence. TLS failure occurs after enough connectivity to negotiate and may involve hostname, trust chain or time. I start at the earliest failing layer and preserve hostname/SNI when testing HTTPS. **Avoid:** calling all failures a firewall issue or bypassing certificates as a fix.

## Q08
**Expected:** status source, upstream evidence, verification. **Model:** I identify which component returned the status and inspect its request/upstream logs. A 502 commonly reflects an unusable upstream response, a 503 unavailable capacity/service, and a 504 an upstream timeout, but applications can also generate these statuses. In the proxy fixture, a one-second timeout versus a two-second handler explains 504. I verify timings and direct upstream behavior before changing thresholds. **Avoid:** asserting one universal root cause from a status code.

## Q09
**Expected:** blast radius, identity/billing boundaries, costs. **Model:** Accounts can isolate identities, quotas, billing and resource changes between environments. They add policy, deployment and operational overhead, and shared CI credentials or modules can still spread mistakes. Namespaces organize resources inside a cluster but do not replicate account or control-plane isolation. I would make production access and deployment approvals explicit rather than assume naming alone protects it. **Avoid:** presenting the resume's five accounts as my verified personal provisioning work.

## Q10
**Expected:** DNS separate from listener/target health/network. **Model:** Once DNS is correct, I check the intended listener/rule, target registration, health path/port and network path. IP targets route to Pod IPs; instance targets typically use nodes and NodePorts. An ALB security group allowing 8080 is ineffective if the target-side rule only permits 80 for an 8080 listener. I examine target-health reason and return-path rules, then repeat the same request after an approved repair. **Avoid:** changing DNS when target connectivity is the failing boundary.

## Q11
**Expected:** distinct immutable and runtime objects. **Model:** Source is editable code; a Java JAR is a build artifact; an image packages runtime files and metadata; a container is a running instance with a writable layer. The Python sample packages source and interpreter, while Java builds bytecode and a bootable JAR. A new container can use the same image, but its writable layer is not durable application storage. **Avoid:** confusing a source commit, image tag and image digest.

## Q12
**Expected:** process, internal bind, mapping and logs. **Model:** I check the container process/logs, its internal listener, and the host-to-container mapping. Binding the app to 127.0.0.1 inside its network namespace prevents the published port from reaching it through the container interface. In this lab the app binds internally to 0.0.0.0 while Docker exposes it only on host loopback. EXPOSE documents a port but does not publish it. **Avoid:** opening public host access to repair an internal bind problem.

## Q13
**Expected:** three distinct decisions. **Model:** Authentication establishes identity. An AWS role trust policy defines which principal/token conditions may assume the role. Its permissions govern subsequent actions on resources. Successful STS exchange can therefore be followed by denied ECR upload because the assumed role lacks one repository operation. I inspect identity and the denied action/resource separately. **Avoid:** treating OIDC success as authorization for every AWS API.

## Q14
**Expected:** correct identity/resource/conditions and deny boundaries. **Model:** I verify caller account/role, action, resource and relevant conditions. An explicit deny, permissions boundary, organization policy, session policy or resource/KMS policy can restrict the effective result. A policy for dev does not authorize an identically named QA object. I use metadata and sanitized errors rather than printing secret values. **Avoid:** adding administrator permissions before locating the governing restriction.

## Q15
**Expected:** API, controllers, scheduler, node runtime, probes. **Model:** The API accepts desired state; Deployment and ReplicaSet controllers maintain Pods; the scheduler assigns an eligible node; kubelet coordinates image/runtime, volumes and configuration there. Readiness determines whether the Pod should receive normal Service traffic. The scheduler does not pull the image, and resource creation does not mean startup succeeded. I verify rollout, events and an actual request. **Avoid:** skipping node prerequisites or treating apply output as application health.

## Q16
**Expected:** stage-specific evidence. **Model:** Pending can involve unscheduled resources or startup preparation, so I read conditions/events rather than the short label alone. ImagePullBackOff points to image retrieval; CreateContainerConfigError often involves missing configuration references; CrashLoopBackOff follows repeated process exits. Previous logs help when a container started and then failed, not when it never existed. In the missing Secret-key fixture, configuration inspection precedes application debugging. **Avoid:** restarting a workload that cannot obtain its configuration.

## Q17
**Expected:** selector, endpoints, ports, DNS and actual path. **Model:** I compare Pod labels with the Service selector, inspect ready EndpointSlices and map Service port to targetPort. Then I test DNS and HTTP from within the cluster. Direct Pod reachability narrows the problem but does not establish Service routing. Port-forward may bypass the ordinary virtual-IP path, so it is useful but insufficient. **Avoid:** changing the application when an empty endpoint list shows a selector mismatch.

## Q18
**Expected:** declarative resource and reconciling implementation. **Model:** Ingress describes routing intent; an appropriate controller interprets it and creates/configures the relevant data path. The AWS Load Balancer Controller reconciles AWS load-balancer resources using suitable identity and subnet discovery; user traffic goes through the ALB, not through the controller process as an HTTP proxy. A bare Ingress in kind does not automatically provision an ALB. **Avoid:** assuming every cluster has the same ingress implementation.

## Q19
**Expected:** managed control plane versus chosen compute/add-ons/workloads. **Model:** EKS manages the hosted Kubernetes control-plane service, while customers retain responsibility for workload configuration, access, networking and the selected node/compute/add-on lifecycle according to their deployment model. I would clarify managed node groups versus other compute before assigning ownership. kind can teach controllers and Service behavior but does not reproduce AWS account policies, VPC CNI IP allocation or an EKS managed control plane. **Avoid:** saying AWS manages everything or claiming a local cluster proves EKS operations.

## Q20
**Expected:** sandbox/CNI events versus DNS queries/CoreDNS. **Model:** An IP-allocation failure often appears while creating a Pod sandbox and in CNI evidence, before a usable Pod network exists. DNS failure is investigated through actual name-resolution attempts, CoreDNS health/logs and reachability from an already running Pod. In the supplied case, exhausted subnet addresses support the CNI hypothesis. More replicas may consume more addresses and worsen it. **Avoid:** restarting CoreDNS because any Kubernetes network operation failed.

## Q21
**Expected:** scheduling reservation, runtime controls, utilization denominator. **Model:** Requests guide placement; limits constrain runtime CPU/memory behavior. CPU-utilization HPA compares measured CPU against requested CPU, so missing relevant requests can prevent useful utilization calculation. A Pod using 100m with a 200m request is at 50% request-based utilization, not 50% of a whole core. HPA also needs a working metrics source and capacity for new Pods. **Avoid:** equating request with current usage or assuming desired replicas can always schedule.

## Q22
**Expected:** voluntary eviction scope and limitations. **Model:** A PDB constrains supported voluntary disruptions through the eviction mechanism, such as a drain. It does not prevent node failure, application crashes or every deletion/update path. With one available replica and minAvailable one, voluntary eviction may be blocked; that is an availability trade-off, not extra redundancy. Deployment rollout settings independently affect update behavior. **Avoid:** claiming a PDB guarantees zero downtime or creates replacement capacity.

## Q23
**Expected:** service roles and immutable identity. **Model:** ECR stores container images; S3 stores objects such as configuration or state; Secrets Manager manages secrets and versions; CloudWatch provides AWS telemetry/alarms. They have separate access and lifecycle semantics. An image tag can move, while a digest identifies specific content, so deployment traceability should record a digest as well as a readable tag. **Avoid:** storing credentials in a public image or assuming any S3 object is safe to share.

## Q24
**Expected:** target and principal before policy expansion. **Model:** I compare the configured environment with caller identity, region, account, bucket/key or repository ARN. The same key name in a different bucket is a different object, and the expected permission may correctly exclude it. In I12 the wrong environment target is the useful clue. I correct an approved reference only after verifying intent, then retest the original operation. **Avoid:** broadening access to make a misdirected request succeed.

## Q25
**Expected:** event, filters, jobs, runners, steps and artifacts. **Model:** An event matching workflow/branch/path conditions schedules jobs; each runner checks out source and executes steps. Tests should precede packaging/publishing, and an artifact preserves a result needed later. If no run exists, I check trigger and repository/workflow location before debugging a test command that never executed. Hosted publication requires explicit permissions and environment gates. **Avoid:** putting AWS write credentials into every PR job.

## Q26
**Expected:** first causal stage and reproducible verification. **Model:** I read the earliest relevant failed command and its report: compilation errors differ from assertion failures, dependency resolution failures and a scanner policy rejection. I reproduce the bounded failure, make the smallest justified correction, rerun the failing test and check nearby behavior. A rerun that merely flakes green does not explain the cause. **Avoid:** skipping tests, masking scanner errors or attributing a fictional failure to an employer incident.

## Q27
**Expected:** token issuance, claims, trust, STS and permissions. **Model:** id-token: write lets a job request a GitHub OIDC token. AWS validates the provider and trust conditions such as audience sts.amazonaws.com and a restricted subject, then STS returns temporary role credentials. Environment-bound subjects differ from branch-bound ones. The role's permissions still control ECR actions. OIDC removes the need to store long-lived AWS access keys in GitHub, not every credential in the system. **Avoid:** wildcard repository trust or assuming token permission grants AWS administrator rights.

## Q28
**Expected:** caller, region/registry, repository and specific upload action. **Model:** I confirm the assumed role/account and intended registry/repository, then inspect the denied API. ECR login only obtains authorization material; pushing layers/manifests requires repository-scoped operations such as CompleteLayerUpload and PutImage. I also verify that the repository exists and that resource/organization policies allow the operation. **Avoid:** redoing OIDC blindly when STS succeeded and the error identifies a missing upload permission.

## Q29
**Expected:** distinct Terraform stages and state mapping. **Model:** init prepares backend/modules/providers, validate checks configuration consistency, plan proposes changes using configuration and available state/remote observations, and apply executes approved changes. State maps resource addresses to tracked objects and metadata; it is not the configuration and may contain sensitive values. validate does not prove cloud authorization or application health. In the course, terraform_data allows these concepts without cloud resources. **Avoid:** applying a plan you cannot explain.

## Q30
**Expected:** references create graph edges; explicit dependencies only when needed. **Model:** Referencing a resource output lets Terraform infer ordering. depends_on expresses a real dependency not evident from values, but excessive dependencies reduce useful parallelism and can make more values unknown during planning. A module should expose the necessary outputs rather than rely on undocumented execution order. **Avoid:** thinking file order is resource execution order or adding dependency links merely to hide a design issue.

## Q31
**Expected:** focused purpose, inputs, validation, outputs and versioning. **Model:** A good module exposes meaningful decisions, validates inputs and returns useful outputs without hiding account credentials or unrelated ownership. The local service module accepts environment/image and returns a release record. A breaking input change needs a versioned rollout and caller tests, not a simultaneous surprise across all environments. **Avoid:** claiming reuse when callers must edit the module's internal files for each environment.

## Q32
**Expected:** state and identity plus workflow guardrails. **Model:** I separate backend keys/state, use explicit target identity/provider configuration and enforce environment approvals. Different variable files alone can still write the same state or use the same production credentials. I verify caller account and selected state before planning, then review resource addresses and targets. Local directories demonstrate separation but are not an enterprise access-control boundary. **Avoid:** assuming a dev filename guarantees a dev deployment.

## Q33
**Expected:** access, encryption, versioning, locking and recovery. **Model:** State needs restricted access, encryption, recovery/versioning, explicit environment keys and compatible locking. This course's Terraform 1.10+ example uses S3 native lockfiles through use_lockfile; simply placing state in S3 does not establish a lock configuration. State and lock-object permissions must match their required operations. Backups and an owner-reviewed recovery process remain necessary. **Avoid:** sharing state files or inventing a required DynamoDB dependency for this example.

## Q34
**Expected:** owner, active operation, exact state, controlled unlock. **Model:** I identify the lock ID, state target, owner and associated job, and confirm whether it is still running. If active, I coordinate or wait through the team's process rather than removing its protection. Only an authorized owner should unlock a verified abandoned lock after excluding concurrent writers and assessing recovery. **Avoid:** force-unlock as a generic first step or killing unrelated jobs.

## Q35
**Expected:** three-way relationship and reviewed plan. **Model:** Drift is a change between intended/tracked and remote reality. Refresh reads current remote attributes into Terraform's view; import associates an existing object with a resource address. Neither automatically makes configuration correct. After import I review the plan for unexpected replacement/destruction and reconcile the intended ownership. **Avoid:** assuming import is a backup or that imported resources can safely be applied without configuration review.

## Q36
**Expected:** partial apply, preservation and replan. **Model:** Terraform apply is not a global transaction. Earlier operations may succeed before a later one fails. I preserve state and logs securely, identify completed versus failed actions, inspect actual resources and correct the causal permission/configuration issue. Then I generate a fresh reviewed plan and verify the recovered state. **Avoid:** deleting state, blindly rerunning destruction or assuming all changes were undone.

## Q37
**Expected:** chart metadata, input values, rendered output and validation layers. **Model:** Chart.yaml describes the chart; values supply configurable inputs; templates render Kubernetes resources; helpers centralize repeated names/labels. lint and template help find chart/schema/render problems, but they do not prove admission, scheduling or runtime health. In this chart, matching helper-generated labels connects Deployment and Service. **Avoid:** storing real secrets in values or treating a successful template command as a deployment.

## Q38
**Expected:** effective values, field types, API and events. **Model:** I inspect the rendered resource that was rejected and compare its field with the API schema. A quoted replica count can become a string where an integer is required; values.schema.json can reject it earlier. Other failures depend on cluster API versions, admission rules or missing CRDs. I fix the governing value/template and render again before an authorized retry. **Avoid:** random indentation changes without reading the actual error.

## Q39
**Expected:** precedence, type and effective render. **Model:** Chart defaults are overridden by supplied values files, with later files winning conflicting values, and command-line settings override them for those keys. I inspect the final render rather than reason from one file alone; arrays and nulls also deserve care. QA may change replicas/resources while retaining one common template. **Avoid:** copying an entire chart per environment or assuming a value file describes current live state.

## Q40
**Expected:** workload evidence, ownership and recovery constraints. **Model:** I check Helm status/history and the workload's events, probes and logs. A timeout could reflect an unready application, unavailable image or scheduling problem. If rollback is appropriate, I verify the prior version is compatible and that Helm owns the release; GitOps-managed desired state needs recovery through its authority. With HPA enabled the chart should avoid continually imposing a fixed replica count. **Avoid:** rollback as a substitute for diagnosing cause or assuming it reverses external data changes.

## Q41
**Expected:** source/revision/path, renderer, destination and controller. **Model:** An Application names a Git/chart source and revision/path, destination cluster/namespace and sync policy. ArgoCD's repository/rendering components obtain manifests; its application controller compares and reconciles desired versus live state using permitted destination access. Repository authentication, rendering and Kubernetes authorization can fail separately. **Avoid:** confusing the Application resource with a running application process or assuming automatic prune is enabled.

## Q42
**Expected:** sync versus health and request verification. **Model:** Synced means the compared live resources match desired manifests, not that their application behavior works. A Deployment can match Git yet have unready Pods, making the Application Degraded. I inspect readiness/configuration and test the actual service path, then observe errors and recovery. **Avoid:** closing an incident merely because the ArgoCD sync indicator is green.

## Q43
**Expected:** three identities and reviewed promotion. **Model:** A source revision produces tested/scanned artifacts and an image digest. An approved configuration commit selects that artifact for an environment; ArgoCD reconciles it and runtime verification proves the outcome. Publishing an ECR tag alone does not change a Deployment referencing an older artifact. Source commit, image digest and config commit may differ and should all be traceable. **Avoid:** mutable latest tags as the only release evidence.

## Q44
**Expected:** desired-state authority, self-heal, prune and recovery. **Model:** If Git still requests the bad version, reconciliation/self-heal may restore it after a manual cluster edit. I correct or revert the reviewed desired-state commit and verify reconciliation plus application recovery. Self-heal addresses live drift; prune removes resources no longer desired when enabled. Both need scope and deletion safeguards. **Avoid:** enabling pruning casually or assuming a CLI rollback permanently changes Git.

## Q45
**Expected:** aggregate, event and request-path evidence. **Model:** Metrics show trends such as error rate or saturation; logs capture individual events/context; traces connect request spans and timings. Their collectors and filters can differ, so working log ingestion does not establish APM instrumentation. I use service/env/version/time to compare signals and avoid treating high CPU alone as user impact. **Avoid:** claiming a dashboard proves all telemetry is collected correctly.

## Q46
**Expected:** generation, collection, query, evaluation and delivery. **Model:** I generate a known safe event, verify collection/ingestion, inspect its tags/time range and query, then inspect monitor evaluation and notification delivery. An env:prod filter cannot find env:lab events. A triggered monitor with no Slack message points later in the chain than an empty metric series. **Avoid:** lowering thresholds before confirming the signal or exposing API keys while debugging.

## Q47
**Expected:** shared trace context and parent linkage. **Model:** A span records one operation within a trace; parent IDs link nested or downstream operations. Instrumented clients inject supported context and servers extract it to continue the trace. Logs can include matching IDs for correlation. Two services emitting unrelated local traces do not demonstrate distributed propagation. The sample's optional manual span is a local instrumentation exercise, not a multi-service system. **Avoid:** confusing a trace ID with authentication or fabricating correlation from timestamps alone.

## Q48
**Expected:** scoped correlation, hypothesis and retest. **Model:** In the synthetic bundle, matching environment/version and trace/span references connect an HTTP failure with a missing PRICE_MODE exception after a configuration change. That supports a hypothesis, but I still inspect the actual config and rule out unrelated errors. A controlled restoration and repeat request should remove the failure while telemetry confirms recovery. **Avoid:** asserting temporal coincidence proves root cause or claiming the fixture is a real production incident.

## Q49
**Expected:** separate control/delivery and request flows. **Model:** Delivery is source -> tests/scan -> image registry -> reviewed configuration -> ArgoCD -> Kubernetes. Runtime is client resolution/connection -> ALB/ingress data path -> Service/Pod -> handler/dependencies. Telemetry flows from runtime collectors/instrumentation to monitoring separately. GitHub Actions and ArgoCD are not normal user-request hops. **Avoid:** a diagram that connects every product in a single request chain.

## Q50
**Expected:** reusable interface, measured scope, review and handover. **Model:** I show what was duplicated, the shared interface and the remaining environment-specific inputs, then verify multiple callers and compatibility. A handover includes target, risk, approval, validation, rollback and unresolved dependencies. Without historical measurements I can describe reduced duplicated fields in a local example, not claim a percentage production improvement. **Avoid:** claiming sole ownership for a supported team change.

## Q51
**Expected:** impact, context, hypotheses, cheap discriminating check and safe action. **Model:** I establish affected endpoint/environment/time and preserve the failed request. I compare recent changes and form alternatives such as wrong routing, unready Pods or application regression. The first check should distinguish them, for example endpoints/readiness versus application error logs, rather than restart everything. I record what observation would falsify my leading idea before changing the smallest authorized scope. **Avoid:** treating temporal proximity to deployment as proof.

## Q52
**Expected:** original operation, sustained evidence, known uncertainty. **Model:** I repeat the failing path, check readiness/error/latency and watch an appropriate recovery interval, including negative paths when relevant. One successful request may miss intermittent or partial failure. My update states confirmed impact, action taken, current evidence, uncertainty and next review point. Closing includes remaining risk and prevention ownership. **Avoid:** invented customer counts, recovery durations or certainty unsupported by observations.

## Q53
**Expected:** specific verbs, scope, others' work and evidence. **Model:** I say exactly what I changed and verified, what I supported and what another engineer owned. A safe truthful example is: "In my local lab I corrected a Service selector and verified in-cluster HTTP; I have not independently operated this in production." Employment dates and counts require the learner's real clarification, not a generated story. **Avoid:** converting study or observation into professional implementation experience.

## Q54
**Expected:** target tenant/org, role mapping and least privilege. **Model:** Successful SSO proves authentication through the configured route, not permission to edit a dashboard. I verify the intended organization, assignment/provisioning and product-specific role, then the approval and scope of the requested action. Entra directory administrator access is not the default remedy for a Datadog product permission. I propose the narrow role with expiry and revocation tests. **Avoid:** granting broad identity privileges to bypass product authorization.

## Q55
**Expected:** concise flow, evidence and bounded correction. **Model:** I describe the event, runner, tests, build and artifact, then identify the failed stage from its actual output. For the supplied readiness regression, a failed assertion is application behavior evidence, not proof the CI runner is broken. I reproduce the test, correct the contract, rerun it and check the release path remains gated. **Avoid:** reciting tool names without explaining an input/output or claiming unexecuted tests passed.

## Q56
**Expected:** curl semantics, exit status and negative retest. **Model:** curl can exit successfully after transferring an HTTP 500 response unless HTTP failure handling is requested. I compare status and process exit code, update the checker with --fail or explicit accepted-status logic, and verify health, HTTP error and closed-port cases. If tee is involved, I also inspect pipeline propagation. **Avoid:** assuming any received response means healthy.

## Q57
**Expected:** requirements first, blast radius, costs and explicit compromises. **Model:** I clarify environment sensitivity, availability needs, team access and budget before choosing account/cluster boundaries. Shared nonproduction compute can reduce costs but creates shared capacity/control-plane risk; production identities and approval boundaries may justify stronger separation. Reusable modules/workflows should expose environment differences without sharing state or credentials implicitly. **Avoid:** one architecture presented as universally correct or uncosted multi-cluster sprawl.

## Q58
**Expected:** request breakdown, dependency behavior and queue/resource evidence. **Model:** I inspect latency distribution and traces to locate waiting versus CPU work, then dependency rate limits, retries, queues and saturation. In the fictional dependency-429 case, more callers can worsen overload. I would consider bounded retries/backoff and concurrency limits with the dependency owner, validating effect under approved load. **Avoid:** automatic horizontal scaling as the only response to latency.

## Q59
**Expected:** independent attempt and observable acceptance. **Model:** I repeat the task in its safe environment without hints, record commands/observations and meet the original acceptance criteria, including a failure path. I explain why the fix worked and what would disprove it. The first attempt and any assisted retry remain separate records; unread topics remain unassessed. **Avoid:** marking all days complete because content was generated or reporting guessed confidence scores.

## Q60
**Expected:** truthful scope, evidence, limitations and next experiment. **Model:** I introduce the actual sample, my personal lab actions and verified outputs, then explicitly identify simulated EKS/OIDC/telemetry pieces. My next task targets an observed gap, such as an approved sandbox OIDC publish, with prerequisites, cost limits and cleanup. I clarify employment/ownership independently of this coursework. **Avoid:** presenting 30 days of study as equivalent to years of professional operation.

## Q61
**Expected:** blocks versus inodes plus other restrictions. **Model:** Filesystems can run out of file metadata entries before bytes; compare df -i with df -h. Also inspect the exact error for quota, read-only mount or permissions instead of assuming inode pressure. I37 supplies a safe inode-exhaustion example without creating millions of files. **Avoid:** deleting unknown files to test a guess.

## Q62
**Expected:** heap plus non-heap/process memory and exit evidence. **Model:** JVM memory includes heap, metaspace, thread stacks, direct buffers and runtime overhead. A heap near the cgroup limit leaves insufficient headroom even if the heap graph alone looks acceptable. I distinguish Kubernetes OOMKilled evidence from a Java OutOfMemoryError and investigate usage/configuration before increasing limits. **Avoid:** setting Xmx equal to the container memory limit.

## Q63
**Expected:** runnable work and uninterruptible waits. **Model:** Linux load includes runnable tasks and tasks in uninterruptible sleep, often waiting for I/O. I compare CPU use, process states and I/O evidence; high load with modest CPU can mean storage waiting. A busy retry loop instead shows application CPU work and repeated requests. **Avoid:** interpreting load as CPU percentage.

## Q64
**Expected:** requested hostname, SAN, chain, time and SNI. **Model:** I inspect the certificate presented for the intended hostname using appropriate SNI, then compare its subject alternative names, trust chain and validity interval. A certificate for api.training.example does not validate wrong.training.example simply because both resolve to one IP. I correct hostname/certificate configuration through its owner. **Avoid:** curl -k as a permanent repair or bypassing the actual hostname during a supposedly equivalent test.

## Q65
**Expected:** CIDR capacity, AWS reservations and CNI consumption. **Model:** A /24 contains 256 total IPv4 addresses, but AWS reserves some and workloads/infrastructure consume the remainder. EKS CNI allocation varies with mode, node types and settings, so I examine actual available addresses and supported limits rather than multiply a generic number blindly. Capacity planning should include growth and rollout overlap. **Avoid:** assuming CPU headroom guarantees schedulable network capacity.

## Q66
**Expected:** routes and reachability conditions. **Model:** A public subnet has routing to an internet gateway; an instance also needs suitable addressing and security to communicate publicly. A NAT gateway provides an outbound translation path for private IPv4 clients, not unsolicited inbound application access. Names like public-a do not establish routes. **Avoid:** adding NAT as a fix for clients that need an inbound service endpoint.

## Q67
**Expected:** stateful SG versus stateless ACL. **Model:** Security groups track permitted connections and their response traffic; network ACL rules independently evaluate inbound/outbound subnet traffic. An allowed service port can still fail if a stateless return-path rule blocks the client's ephemeral port. I trace source/destination and both directions with the actual protocol and target mode. **Avoid:** opening all ports before identifying the blocked direction.

## Q68
**Expected:** endpoint type, DNS/routes, policy and IAM. **Model:** VPC endpoints can provide private service access through gateway or interface mechanisms depending on the service. Route associations or private DNS/security groups matter accordingly. Endpoint policies add a control layer but do not replace caller IAM or resource policies. An ECR pull can involve several service paths, including image layers in S3. **Avoid:** declaring a private registry reachable solely because one endpoint exists.

## Q69
**Expected:** compatible enforcement and selected flows. **Model:** NetworkPolicy resources require a network implementation that enforces them. An accepted manifest alone is not proof of isolation. I identify the policy engine, namespace/Pod selection and ingress/egress rules, then test one allowed and one denied flow from known sources. **Avoid:** claiming the baseline kind lab demonstrates NetworkPolicy enforcement without checking its networking implementation.

## Q70
**Expected:** startup gating, readiness traffic, liveness restart. **Model:** A startup probe allows slow initialization before normal liveness/readiness evaluation proceeds; readiness controls traffic eligibility; liveness can restart an unhealthy container. A temporary downstream outage in liveness can cause restart storms without repairing the dependency. For the sample, /health stays alive while /ready can deliberately reject traffic. **Avoid:** using one deep dependency check for every probe without considering failure behavior.

## Q71
**Expected:** claim events, class/provisioner, topology and scheduler. **Model:** I inspect PVC and Pod events, storage class, requested capacity/access mode and provisioner health. WaitForFirstConsumer can intentionally defer binding until a consuming Pod's placement is known; it is not automatically a storage outage. CPU eligibility and volume topology must agree. **Avoid:** deleting a claim that might contain valuable data or assuming a CSI implementation from the resume.

## Q72
**Expected:** Role, RoleBinding, subject and deny tests. **Model:** I choose only needed namespaced read verbs/resources and bind them to the intended subject. Pod visibility does not require Secret read permissions. I verify allowed reads and denied writes using authorized test identities and auth can-i, while recognizing that a permissive local administrator is not a least-privilege proof. **Avoid:** cluster-admin to solve a narrow namespace task.

## Q73
**Expected:** conditions/events, kubelet/runtime/network and controlled response. **Model:** I inspect node conditions and recent events, API connectivity/heartbeats, runtime health and pressure signals using authorized access. I assess affected workloads and capacity before considering cordon/drain; a drain can worsen an incident if replacements cannot run or disruption constraints block them. **Avoid:** deleting or rebooting a node as the first diagnostic step.

## Q74
**Expected:** execution model and node/runtime identity. **Model:** Image retrieval happens before the application can run. For common EKS worker-node deployments, node/runtime credentials and repository permissions govern the pull, not simply the application's IRSA role. Other compute models have their own execution identities. I inspect the actual model, image name, registry path and pull error. **Avoid:** attaching broad ECR permissions to an app role without checking who performs the pull.

## Q75
**Expected:** recoverable versions and reconciliation caution. **Model:** S3 versioning can retain earlier state objects, but restoring one may lose knowledge of real resources created afterward. I inventory actual resources, operation history and state lineage with the owner before a controlled recovery. Recovery is followed by a reviewed plan, not an automatic apply. **Avoid:** restoring a convenient old state version while another job is running.

## Q76
**Expected:** retrieval/cache/reload and delivery mechanism. **Model:** Rotation changes the secret source, not necessarily every application's cached value. Environment variables in an existing process do not refresh themselves; file-mounted updates have their own timing and application reload behavior. I design and verify the complete delivery/refresh path with dummy values, including rollback compatibility. **Avoid:** dumping secret contents to prove freshness or assuming the sample integrates Secrets Manager automatically.

## Q77
**Expected:** metric identity, evaluation, threshold, missing data and action. **Model:** I define namespace/dimensions, statistic, period, evaluation count, threshold and treatment of missing data, then an actionable notification/owner. CPU and request error rate answer different questions. A synthetic event should test detection and recovery behavior; configuration existence alone does not prove delivery. **Avoid:** arbitrary thresholds detached from a workload baseline.

## Q78
**Expected:** layer inputs, invalidation and context hygiene. **Model:** Docker can reuse a layer when relevant instruction/input state is unchanged. Separating stable dependency metadata from frequently changed source can improve cache reuse, but dependency updates must still invalidate appropriately. A .dockerignore keeps credentials, generated files and unrelated content out of the build context. **Avoid:** treating a cached image as automatically patched or copying a whole work directory with secrets.

## Q79
**Expected:** compiler/build tools separate from runtime. **Model:** A build stage can compile/test/package with Maven and a JDK, then copy only the executable JAR into a JRE runtime stage. This reduces unnecessary runtime contents, but base image/dependencies, user privileges and configuration still need review and scanning. The Java fixture keeps tests in the build. **Avoid:** deleting tests for speed and calling that a secure optimization.

## Q80
**Expected:** lifecycle and host access. **Model:** A container's writable layer belongs to that container; a bind mount exposes a chosen host path; a Docker volume is managed persistent storage separate from the container layer. Read-only config mounts reduce accidental changes. The course mounts Nginx config read-only and does not rely on its writable layer for durable data. **Avoid:** assuming --rm deletes all external storage or mounting sensitive host directories unnecessarily.

## Q81
**Expected:** language-specific artifacts/tests/runtimes and ownership. **Model:** Java compiles into bytecode and a packaged JAR for a JVM; Spring Boot supplies application/server integration. Python runs the supplied source with an interpreter and unittest checks. Both can become images, but Maven/Gradle are not the Python build mechanism here. Operating startup/configuration and diagnosing logs does not prove authorship of business logic. **Avoid:** claiming one universal build command for all services.

## Q82
**Expected:** coordinates, dependency graph, plugin behavior and ordered lifecycle. **Model:** groupId/artifactId/version identify a Maven artifact; dependencies provide libraries; plugins implement goals bound to lifecycle phases. verify includes earlier lifecycle stages such as compilation/tests/package and configured verification checks. A successful compile alone does not imply tests passed or a bootable artifact exists. **Avoid:** confusing Maven's install into a local repository with deploying the service to production.

## Q83
**Expected:** task graph, plugins and reproducible tool version. **Model:** Gradle executes a task graph configured by build scripts/plugins. A Java toolchain chooses the Java version; Spring Boot's plugin adds bootJar. The wrapper selects a Gradle distribution for consistent invocation but its files and distribution integrity must be reviewed. The fixture has no fabricated wrapper, so it states its external Gradle prerequisite. **Avoid:** assuming a wrapper makes dependencies trusted or every task runs tests automatically.

## Q84
**Expected:** target, dependency path, exposure, compatible remedy and retest. **Model:** I distinguish an application dependency from an OS/base-image library, identify its introduction path and assess severity with exposure/context. Remediation may require a parent dependency upgrade or rebuilt base image plus tests. Exceptions need an owner, rationale and expiry. A scanner execution error differs from a policy-rejected finding. **Avoid:** ignoring all nonzero exits or inventing numerical vulnerability reductions.

## Q85
**Expected:** additive history and operational compatibility. **Model:** revert creates a new commit reversing selected changes, preserving shared history and review traceability. Force-rewriting shared history can disrupt collaborators and audit trails. However, reverting manifests/code does not necessarily undo data migrations or external side effects; those need a separate compatible recovery plan. **Avoid:** declaring every previous release safe to restore.

## Q86
**Expected:** acceleration versus retained output and trust. **Model:** Caches accelerate rebuilds and may be absent or stale; artifacts preserve specific outputs for later use. A dependency cache key should reflect relevant OS/runtime and dependency lock/manifest inputs, with safe restoration rules. Neither should leak secrets or allow untrusted PR data to poison privileged release steps. **Avoid:** relying on a cache as the only authoritative release artifact.

## Q87
**Expected:** shared implementation, explicit inputs/permissions and versioned adoption. **Model:** Shared logic can standardize tests and artifact handling, while callers supply approved environment details and gate privileged jobs. Interfaces should validate inputs and keep secrets/permissions explicit. Two callers and a targeted change test demonstrate reuse; a breaking central update needs controlled rollout. **Avoid:** hiding production credentials inside a shared workflow or claiming standardization from one copied job.

## Q88
**Expected:** resolved versions, integrity/provenance and update process. **Model:** Constraints describe acceptable versions; lock data records a selected dependency set, often with integrity information. Verified sources/action commits and reviewed updates improve reproducibility and supply-chain control. Locked vulnerable versions remain vulnerable, so repeatable does not mean secure. The optional telemetry requirements are ranges and need resolved-version recording before a reproducible deployment. **Avoid:** claiming ranges alone produce identical builds forever.

## Q89
**Expected:** lifecycle rules and their limits. **Model:** prevent_destroy can block planned destruction while the configured rule applies, but is not a complete backup/security boundary. create_before_destroy changes replacement ordering and may fail with fixed unique names, capacity limits or incompatible dependencies. ignore_changes deliberately suppresses differences and can hide meaningful drift. **Avoid:** adding lifecycle rules to silence an unexplained destructive plan.

## Q90
**Expected:** explicit provider target and caller-controlled credentials. **Model:** Root configuration should choose authenticated accounts/regions and pass the intended provider configuration into modules, using aliases where multiple targets are truly needed. The module defines its requirements and resource interface, not hidden production access. I verify identity and planned resource targets before apply. **Avoid:** assuming a variable named environment automatically selects the right AWS account.

## Q91
**Expected:** declared versions, locked resolution and rendered review. **Model:** Chart dependencies add subcharts and their values contracts; changing them can change resources, defaults and required APIs. Chart.lock records dependency resolution for repeatable builds, and reviewed dependency build/update workflows should preserve intended versions. I render and inspect the combined output before release. **Avoid:** a floating dependency update silently affecting every environment.

## Q92
**Expected:** source/destination constraints, user actions and cluster authority. **Model:** AppProjects constrain permitted sources, destinations and resource kinds; ArgoCD RBAC governs user actions; destination credentials/Kubernetes RBAC govern what controllers can do in clusters. All layers matter. The local default project is convenient teaching scope, not a least-privilege production design. **Avoid:** assuming a restricted UI user makes an overprivileged controller harmless.

## Q93
**Expected:** collection/instrumentation, sampling and query. **Model:** Missing traces can come from absent hooks, incompatible instrumentation, dropped context, sampling, transport/ingestion failures or a wrong query/time window. I generate one known request and inspect the collection path before changing sampling. A sampled system does not promise every request is retained. **Avoid:** inferring no request occurred from one absent trace.

## Q94
**Expected:** supported context, validation and data minimization. **Model:** Propagation carries trace/span relationships and supported sampling metadata, not passwords or unrestricted personal/request data. Baggage needs deliberate review because it can spread across services. Trace IDs correlate operations; they must never authorize requests. I verify client/server format compatibility and trust-boundary handling. **Avoid:** logging full headers merely to find a trace ID.

## Q95
**Expected:** authentication, account lifecycle and temporary privilege. **Model:** SSO establishes a login route; provisioning synchronizes account/group lifecycle, often through mechanisms such as SCIM; privileged activation provides controlled elevated access where configured. They are distinct. The resume names Entra/product access, but does not prove SAML, SCIM or PIM were the actual mechanisms. **Avoid:** inventing a tenant architecture to make an interview answer sound complete.

## Q96
**Expected:** independent tests and fallback ownership. **Model:** I test a controlled condition, confirm monitor evaluation, verify destination delivery, then acknowledgement/escalation according to approved policy. Slack failure should have a defined alternative route and owner, not silently convert an incident to healthy. Receiving a message demonstrates one boundary, not the entire detection chain. **Avoid:** creating real paging noise without an approved test window.

## Q97
**Expected:** scope, prerequisites, safe commands, checks and maintenance. **Model:** A ticket states impact, ownership, acceptance and dependencies. A runbook includes target/context, prerequisites, diagnostic branches, approved actions, stop/rollback conditions, verification and escalation. I test it in the local lab and record version/assumptions so another person can identify stale instructions. **Avoid:** "restart everything" without evidence or copying internal documentation into a public portfolio.

## Q98
**Expected:** boundaries and direction with operational meaning. **Model:** I show components, directed flows, protocols/ports where useful, identity/ownership boundaries and failure points. Separate delivery, runtime and telemetry diagrams keep control traffic from being mistaken for user traffic. I label proposed and verified parts distinctly. **Avoid:** logo collections or presenting an inferred employer design as a confirmed architecture.

## Q99
**Expected:** before/after evidence and attribution. **Model:** I compare a real baseline with the reusable interface, show which repeated decisions were removed and verify multiple callers. Quantitative claims need actual measurement and context; without that I can describe qualitative or local-example differences only. I identify my contribution and reviewers rather than claim sole ownership. **Avoid:** invented percentages, deployment frequency or time savings.

## Q100
**Expected:** transfer limits and prioritized approved validation. **Model:** Local tests do not establish real AWS identity/network behavior, EKS operations, hosted OIDC trust, SaaS ingestion, tenant roles or production change handling. I select the highest-priority unproven boundary, define an authorized sandbox test, cost/cleanup plan and objective evidence. Untested integrations stay unassessed. **Avoid:** converting a complete curriculum into a completed learner record or a job-readiness guarantee.