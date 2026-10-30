# Secondary resume tools: bounded implementation and defense

These are real audit entries, not optional omissions. Choose a relevant exercise **instead of** the normal 40-minute lab or revisit it later. Each section gives a guided example, independent requirement and challenge. Hints/solutions for linked incidents remain separate. No company credentials, accounts or source are used.

## Java, Spring Boot, Maven and Gradle: R45/R46/R49/R50

**What/why/problem:** Java runs bytecode on the JVM. Spring Boot supplies application configuration and server integration, reducing repetitive setup. Maven describes a project and lifecycle through a POM; Gradle defines tasks and dependencies through a build script. These tools compile/test/package the service before Docker runs it. They do not build Python merely because both languages are in the resume.

**Architecture/workflow:** source -> compiler -> test runner -> packaged JAR -> JVM process -> HTTP handler. The supplied Java app has one `/health` endpoint; its unit test checks method output, while an HTTP check verifies server integration. `groupId/artifactId/version` identify Maven coordinates. `java.version`/toolchain select the Java level; dependencies select libraries; plugins add build/package behavior. Gradle's `test` task uses JUnit Platform explicitly. A wrapper pins a build-tool distribution, but no unverified wrapper binary is fabricated here.

**Guided alternative:** install an approved JDK 17 and Maven 3.9 or Gradle 8.14-compatible toolchain from official sources, then choose one path, not both in a single lab. Downloads require internet. The pinned Spring Boot 3.5.0 example is a reproducible teaching version, not a claim of current production support or security. Review current supported patch versions before external deployment.
```bash
java -version
mvn -f fixtures/java/pom.xml -B verify
java -jar fixtures/java/target/academy-service-1.0.0.jar --server.address=127.0.0.1 --server.port=8083
```
The first checks runtime, Maven resolves dependencies/compiles/tests/packages, and the final command starts only the local sample. In another terminal, `curl --fail http://127.0.0.1:8083/health` should return alive JSON. Stop with Ctrl+C. Gradle alternative:
```bash
gradle -p fixtures/java test bootJar
java -jar fixtures/java/build/libs/academy-service-1.0.0.jar --server.address=127.0.0.1 --server.port=8083
```
Its test/build directories differ from Maven's. The Java Dockerfile demonstrates multi-stage compilation, with tests retained, and a smaller separate runtime stage. Building it downloads images/dependencies; it is not required for the Python path. Do not mix it into the Kubernetes baseline without adapting the readiness endpoint, because this minimal Java sample exposes `/health`, not `/ready`.

**Expected/verification:** build/test success, JAR and local HTTP 200. A passing unit test alone does not establish a running HTTP service. Cleanup only generated target/build directories in your own training copy; retain source. **Mistakes/diagnosis:** wrong JDK, missing dependencies/repository access, failed test versus failed compiler, executable JAR versus plain JAR, wrong profile/port and JVM heap equal to container memory. Inspect the first causal build error and report path; I13 and I39 give synthetic challenges. **Independent:** add a non-sensitive version endpoint and its test without copying an AI implementation. **Interview:** explain source/artifact/runtime boundaries and memory headroom; distinguish operating a service from writing its business logic.

## Snyk: R44

**What/why:** dependency/image scanning identifies known vulnerability matches and remediation information. The problem is finding and prioritizing risky components, not proving every reported item is exploitable or that a green scan means secure software. **Workflow:** select supported target -> resolve dependency/image inventory -> compare advisory information -> apply policy -> report -> remediate/retest. Snyk requires approved account/project/token handling; CLI operation can transmit dependency metadata.

**Guided local evidence:** fictional finding A is a transitive Java package introduced through a parent dependency; finding B is an OS library in the container base image. For A, inspect the dependency graph and supported parent upgrade; for B, examine the base-image update/rebuild path. Both require compatibility tests. Do not invent CVE numbers or fixed versions. If an authorized Snyk test account and CLI are available, commands are:
```bash
snyk test --file=fixtures/java/pom.xml
snyk container test academy:1 --file=fixtures/app/Dockerfile
```
These may contact external services and consume plan allowance. Snyk authentication must be established privately, never echoed or added to Git. `snyk test` may exit nonzero because findings meet policy, not because the scanner crashed; consult the installed CLI's exit-code documentation and report before deciding. Never mask all nonzero exits with `|| true`.

**Independent:** write a gate policy with severity/context, owner, expiry and justified exceptions; explain how a false-positive review differs from ignoring risk. **Challenge:** I13's failed step plus a fictional vulnerability report: determine whether the failure is test regression, scanner error or policy decision before any remedy. **Verification/cleanup:** record scan target/version and retest after an approved fix; revoke temporary tokens and remove lab-only integrations. **Interview:** running a scan is different from owning vulnerability policy or claiming a measured reduction.

## CloudWatch, Secrets Manager and Rollbar: R09/R10/R38

**CloudWatch:** metrics use namespaces/dimensions; logs use groups/streams; alarms evaluate statistic/period/threshold and missing-data behavior. An EC2 CPU metric is not a request error-rate metric. Guided exercise: design an alarm table for a chosen synthetic metric, including no-data and recovery. Optional approved metadata reads use `aws cloudwatch describe-alarms --alarm-names "$LAB_ALARM" --profile "$LAB_PROFILE" --region "$LAB_REGION"` after caller identity verification. Expected output is configuration, not proof the alarm fires. Independent: change one dimension in a fixture and explain why it selects a different/no series. Challenge I23/I40; verify collection, query and notification separately.

**Secrets Manager:** stores/version-controls secrets and supports rotation; the application must authenticate to fetch and decide when to refresh. IAM/resource/KMS permissions and network reachability are separate checks. Guided task: draw secret creation -> approved reference -> workload retrieval -> rotation -> refresh/recovery using only the dummy Kubernetes Secret as an analogy. Do not imply the supplied sample fetches Secrets Manager or installs a CSI/external-secret controller. Independent: propose cache expiry/reload and rollback without logging values. Challenge I12/I30; verify metadata/reference/behavior rather than dumping secrets. `describe-secret` is metadata; `get-secret-value` is intentionally not prescribed.

**Rollbar:** groups exception events by configured fingerprint/context and tracks occurrences/releases. It complements traces, not replaces them. Guided: correlate evidence.json service/env/version/time with its synthetic exception and trace. Project 5 supplies an optional explicit test-event send; automatic exception hooks still require separate implementation. Independent: define what stack/context is useful and what must be scrubbed (tokens, request bodies, personal data). Challenge I24; verify the exception's causal relationship through a controlled retest rather than assuming correlation is causation. No actual SaaS ingestion is claimed.

## Entra ID, Azure Portal and RBAC: R40-R42

**What/why/problem:** identity providers authenticate and manage application access; role-based authorization limits actions to approved responsibilities. Azure Portal is a UI, not a separate permission system that can automatically grant all downstream roles. **Workflow:** tenant/user -> enterprise application assignment -> configured SSO/provisioning -> target product role -> approved action -> audit/revoke. SAML/SCIM/PIM are concepts to compare, not verified mechanisms from the resume.

**Guided:** read access/request.json and complete a least-privilege matrix. Separate directory role, application assignment, product role and Kubernetes Role/RoleBinding; each has its own scope. No tenant CLI/API is required. **Expected output:** approval proposal, role mapping, expiry and positive/negative tests, not an actual granted role. **Independent:** design a seven-day dashboard-editor request that cannot administer identities. **Challenge:** I27, with hints after attempt. **Verification/cleanup:** the hypothetical plan must include revocation/session considerations and evidence; real execution requires tenant-owner approval. **Interview:** say exactly which product/role you supported and which decisions belonged to another administrator.

## Jira, Confluence, Slack, diagrams and runbooks: R39/R51-R54

**Purpose:** coordinate work and preserve reproducible operational knowledge. A ticket expresses scope, risk, acceptance criteria and dependencies; a runbook gives prerequisites, safe checks/actions, rollback, verification and escalation; a diagram explains boundaries and flows; Slack provides timely coordination, not a durable substitute for evidence.

**Guided artifact exercise:** use I26 to write a private Markdown issue with title, impact, owner, hypothesis, proposed change, approval, validation and next action. Write a matching runbook and three flow diagrams (delivery/runtime/telemetry). A fictional Slack update should state known impact, investigation/action, uncertainty and next update point; do not invent customer counts or a recovery time.

**Independent:** ask whether another engineer could follow the runbook without hidden context. Have them identify the correct target, stop condition and success check. **Challenge:** a runbook says "restart everything and confirm green"; identify missing scope, evidence, approval and rollback. Hint: distinguish desired-state sync from request recovery. Reference resolution: replace vague actions with explicit lab target, hypothesis-driven checks, smallest action, repeatable request/telemetry validation and escalation. **Cleanup:** keep only sanitized lab documentation; do not export internal Jira/Confluence/Slack content. **Interview:** contribution to documentation/discussions is not sole architecture ownership or tool administration.

## Kubernetes supporting access and storage practice: S05

RBAC separates verbs/resources/scope: a Role is namespaced permissions and RoleBinding associates a subject. `kubectl --context kind-academy -n academy auth can-i get pods` queries authorization without changing roles. `auth can-i delete namespaces` is cluster-scoped; a positive answer in kind is not approval to delete anything. Independent: design read-only Pod access without Secret reads. Challenge I27's authentication/authorization distinction transfers conceptually, but Entra product roles are not Kubernetes roles.

For storage, inspect `kubectl --context kind-academy get storageclass` and `kubectl --context kind-academy -n academy get pvc`. A PVC requests capacity/access mode/class; a provisioner supplies a PV; binding and scheduling can interact. A class using WaitForFirstConsumer may intentionally wait for an eligible consuming Pod. Do not assume a StorageClass or CSI driver exists, and do not claim the resume mentions a specific storage implementation. Independent: explain how a Pod can be Pending due to storage despite free CPU. Use scheduler/claim events rather than inventing a disk failure.

## Linux/network tool boundaries: S01/S02

On Ubuntu, `ss -lnt` inspects listening TCP sockets; legacy `netstat -lnt` may require net-tools. On macOS use `lsof -nP -iTCP:8080 -sTCP:LISTEN` for the local port rather than assuming Linux flags. `dig`/`nslookup` examine DNS, not HTTP. `traceroute example.com` sends network probes and filtered/missing hops do not prove the destination is down. In an approved isolated Ubuntu VM with only synthetic traffic, `sudo tcpdump -ni lo 'tcp port 8080' -c 10` captures a bounded loopback sample; generate the sample request in another terminal. Do not use payload printing or capture work interfaces. tcpdump may require privileges; packet headers can still be sensitive. Stop with Ctrl+C if ten packets never arrive. Cleanup: no capture file is written. Independent: explain SYN/refusal/timeout evidence and what encrypted payloads cannot reveal.