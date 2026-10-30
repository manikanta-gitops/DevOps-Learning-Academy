# Solution book: open after attempt, hint and retry

These are **training resolutions**, not historical production incidents. For every case use the same nine steps: (1) state symptom/impact; (2) list plausible causes from the dossier; (3) choose the simplest discriminating check; (4) run/review its scoped diagnostic evidence; (5) interpret what it proves and cannot prove; (6) narrow to the supported cause; (7) apply/propose the smallest authorized fix; (8) repeat the original failure check plus relevant health evidence; (9) prevent recurrence with a concrete test/owner. Cloud/tenant fixes below are proposals requiring approval, not instructions to change real systems. The case entries specify the evidence order, cause, safe action, verification and prevention; use the dossier for commands and raw output.

## S01
Check client destination, then listener, then process/host pressure. The client uses 8089 while the service listens on 8080. Correct the local URL and repeat `/health`; verify the intended client config rather than opening a second listener. Prevent with endpoint/config validation. Interview: "I separated process existence from the client's actual target."
## S02
Read unit identity, path permissions and journal. Root-only traversal on /opt/academy blocks nobody before Python reads the world-readable file. In the dedicated VM, use appropriate directory traversal/read permissions for this non-sensitive app, not chmod 777 or root execution. Restart only the lab unit and check status plus HTTP. Prevent by testing under the service identity and declaring installation modes.
## S03
Inspect the command, component statuses and CI continuation. tee succeeds while curl fails; the pipeline reports the last command without pipefail. Use explicit error handling or reviewed pipefail behavior, and ensure the final script exits nonzero. Test health, HTTP 500, refusal and timeout. Prevent by retaining negative-path tests, not merely syntax checks.
## S04
Inspect exact hostname, DNS result and comparison name. The synthetic client uses ap1 instead of api. Correct the client name; query the intended record and retry DNS/TCP/TLS/HTTP in order. Never invent real records for .invalid examples. Prevent with configuration validation and a deployment smoke check; explain that no TCP attempt occurred at first.
## S05
Verify app listener/health, then ALB target reason and network rules. The target permits 8081 but the real health traffic uses 8080. Propose a narrowly scoped 8080 rule from the ALB SG only, after validating routing/return path. In an approved lab, retest target health and HTTP; remove obsolete permissions only after review. Prevent with a documented port contract and health-path check.
## S06
Compare host publication with the container listener. Binding the app to the container's 127.0.0.1 excludes bridge-interface traffic. Use APP_HOST=0.0.0.0 inside this training container while keeping host publication on 127.0.0.1. Recreate only the named lab container and curl health. Prevent by checking bind/publication separately in container smoke tests.
## S07
STS identity succeeds; the denied action is CompleteLayerUpload. Add only the required scoped repository action after policy review, not administrator access or wildcard repository grants. Verify push completes and disallowed repository operations remain denied. Prevent with a documented API-action matrix and least-privilege integration tests. No real policy is changed by this exercise.
## S08
Read image-pull events, manifest and build/load record. academy:2 is unavailable in the kind runtime; only academy:1 exists. Correct the intended image reference or independently build/load the intended tag into the named cluster; do not hide genuine registry failures by changing every pull policy. Verify rollout and served version. Prevent by recording image identity across build and runtime.
## S09
Direct Pod health and readiness are good; Service selector has a spelling mismatch. Correct the selector in the local desired manifest, apply only with kind-academy/academy scope, and check EndpointSlices plus an in-cluster request to the Service. A port-forward alone is not the acceptance test. Prevent by testing label/selector consistency and the actual Service path.
## S10
Sandbox events and CNI logs identify address allocation, not application DNS or image failure. Eligible subnet addresses are exhausted. Propose reviewed subnet/IP-allocation/capacity changes based on actual VPC/CNI mode; adding nodes blindly may consume more IPs. Verify new Pod networking, DNS and app requests after authorized remediation. Prevent with free-address capacity monitoring and planning. kind cannot validate this AWS fix.
## S11
Scheduler explicitly reports insufficient requested CPU before assigning a node. Compare requests to eligible capacity and constraints. For a lab, right-size a demonstrably excessive request or add approved capacity; do not remove all requests as a universal fix. Verify scheduling, readiness and actual resource behavior. Prevent with realistic baselines/capacity planning, not arbitrary CPU limits.
## S12
The identity is correct and QA denial is intentional; the config points to the wrong bucket. Restore the intended dev reference through the configuration workflow rather than granting cross-environment access. Verify the original read succeeds and QA remains denied. Prevent with environment-specific validation and reviewed resource references. The fixture proves reasoning, not real S3 access.
## S13
A run exists and the test fails before build/publish. The readiness implementation regressed. Correct and retest that behavior in the training source, then run the workflow's tests before rebuilding. Do not weaken the assertion or ignore the step. Verify the affected success/failure paths and that publishing remains blocked on failure. Prevent through regression tests and review.
## S14
Permission and audience are correct; the token carries an environment subject but trust expects a branch subject. Align exact approved trust with the intended environment-based identity, retaining repository restriction and protected-environment branch/reviewer controls. Verify intended assumption and rejected unintended contexts. Never use repo:* to bypass the mismatch. Preserve the resume's supported-versus-owned distinction.
## S15
Validation rejects prod before actions occur. Use a permitted training environment or propose a separately reviewed contract change when requirements genuinely change; do not disable safeguards to get green output. Re-run validate and plan. Prevent with explicit allowed inputs and environment identity checks in callers.
## S16
The QA caller uses dev's backend key. Stop before apply and establish correct account, backend and state ownership. Provision/review a distinct QA state configuration; any existing state migration needs explicit backup and approval. Re-plan and verify no unrelated dev actions remain. Prevent with per-environment backend checks and credentials; variable names alone are not isolation.
## S17
The lock owner is active and progressing. Wait/coordinate rather than force-unlock or disabling locking. Confirm that run finishes and releases the lock, then create a fresh plan because state may have changed. If genuinely abandoned, investigate state/resource consequences before an owner-approved unlock. Prevent overlapping writers with CI concurrency and clear operational ownership.
## S18
Successful network creation remains tracked after the later failure. Resolve the specific quota/configuration issue through the approved owner, inspect actual/state agreement and review a fresh plan for remaining work. Do not recreate or delete successful resources merely because the overall apply failed. Verify all intended resources and dependent application health. Prevent with prerequisite/quota checks and documented partial-failure recovery.
## S19
Schema validation rejects a string where replicaCount requires an integer. Supply a valid integer and retain schema protection; rerender/lint and inspect output before any install. No cluster action happened. Prevent by testing default and environment-specific values, including deliberately invalid inputs.
## S20
The rendered override intentionally makes readiness fail while liveness stays healthy. Correct mode to the intended value through the local release/config workflow, then verify Ready replicas and actual requests. Longer Helm timeouts or container restarts cannot repair persistent wrong desired config. Prevent with rendered-value review and a readiness smoke test.
## S21
Repository path is wrong, so rendering never happens. Correct Application source.path to the chart location relative to the approved repository root, verify revision/repo access, refresh comparison and sync only after review. Check application requests afterward. Prevent with source-path/render validation; destination privileges and Pod resource tuning do not solve this source error.
## S22
Self-healing reconciles the successful live edit back to Git's value; HPA is absent. Make an intended permanent change in reviewed Git desired state. For emergency live action, coordinate reconciliation controls and update Git afterward through an approved process. Verify desired/live agreement and application behavior. Prevent competing owners and undocumented live-only changes.
## S23
Collection succeeds but the dashboard filters env:stage while emitted data is env:lab. Correct the query or intended tagging contract, then verify the exact window/signal and monitor scope. Do not regenerate API keys or restart healthy collectors without evidence. Prevent by testing standard service/env/version tags and saved queries during release verification.
## S24
The synthetic handler fails on missing PRICE_MODE before reaching a dependency; matching version, exception and config change support the diagnosis. Correct/revert the required config through the reviewed workflow and test success and malformed-input paths. Verify HTTP error rate, matching traces and absence of recurrent exception under controlled traffic. Prevent with config validation and release smoke tests; correlation alone would not have proved the cause without these checks.
## S25
The image publish succeeded but desired deployment config never changed. Update the reviewed config to the intended verified image/digest and reconcile it; do not rebuild an already correct image. Verify source/config revision, running image and served version. Prevent with an explicit publish-to-promotion handoff and evidence record.
## S26
The controller successfully applied mode:unready; all ready backends disappeared. Restore the intended Git configuration, reconcile and verify target/endpoints, HTTP and telemetry. A live-only patch may be overwritten. Prevent with readiness tests before promotion and health-based acceptance after sync. Interview: "Synced describes agreement; it does not mean the requested state is healthy."
## S27
SSO succeeds; product authorization is read-only. Determine the minimum dashboard-edit scope, obtain the correct owner's approval, map it through the configured product-role process and set review/expiry. Verify intended edit permission, continued denial of unrelated admin actions and later revocation. Never grant Entra global admin to solve a Datadog dashboard permission issue.
## S28
Curl successfully transfers an HTTP error response, so exit 0 does not prove a healthy app. Use --fail or an explicit accepted-status check and propagate the status correctly. Test 200, 500, refused and timeout paths, then verify the pipeline blocks an unhealthy release. Prevent with negative-path checks rather than a misleading success message.
## S29
Traces show shared dependency wait/rate limits rather than app CPU saturation. Consider bounded concurrency, backoff, request reduction/caching only where semantics permit, or an approved dependency-capacity change. Verify latency/error/throughput and dependency load, not only replica count. Prevent with dependency-level telemetry and retry budgets. No new technology or measured improvement is claimed.
## S30
The referenced Secret key name does not exist; container creation stops before application startup. Correct the reference or intended dummy key through local desired state without printing values. Verify container creation, readiness and behavior. Prevent with object/key contract tests and typed configuration. This differs from a crashing app and cannot be diagnosed using nonexistent app logs.
## S31
TCP and chain/date checks succeed; the new requested hostname is absent from SANs. Use an appropriately issued certificate for the intended name or restore the intended hostname/routing through approved changes. Verify full hostname/trust/date validation and HTTPS behavior. Do not use curl -k as a repair. Prevent with certificate inventory, renewal and pre-change hostname checks.
## S32
Nginx reaches the correct container name but wrong upstream port 8089; the app listens on 8080. Correct only the lab upstream port, validate Nginx config, reload the named proxy and repeat the original request. Preserve loopback host binding. Prevent with a port contract and a proxy-to-upstream smoke check; 502 alone did not uniquely establish this cause.
## S33
The supplied /slow endpoint deliberately takes two seconds while proxy read timeout is one. Determine the required response-time contract before choosing: reduce upstream delay/fix a bottleneck, or deliberately change a justified local timeout. Verify duration and status through the proxy as well as directly. Prevent with latency budgets, deadline alignment and slow-dependency tests; simply raising all timeouts can increase resource exhaustion.
## S34
The container command references a nonexistent file and exits before probes run. Correct the training command to the intended image entrypoint/path, then verify rollout, stable restart count and health. Raising memory or changing probes cannot repair a missing file. Prevent with image/entrypoint smoke tests and avoiding unnecessary command overrides.
## S35
The sample's optional tracing flag was never enabled, so no spans were created. In a separate lab environment with a compatible tracer installed, enable manual instrumentation and set the approved Agent endpoint/tags. Verify a known request creates nonzero correlation fields and, separately, reaches the authorized backend. Prevent with instrumentation/telemetry smoke tests; do not confuse log collection with APM creation.
## S36
Block capacity is exhausted while inodes remain. Inspect approved directory usage/retention and open deleted files before cleanup. Archive/remove only explicitly disposable lab data through a reviewed plan; do not truncate arbitrary system logs. Verify writes, free blocks and service behavior. Prevent with rotation/retention and capacity alerts. Do not reproduce this by filling the Mac's disk.
## S37
Inodes are exhausted despite free bytes. Identify the owner/lifecycle of the many tiny files; remove only known expired lab entries after review, then verify inode availability and file creation. Increasing byte storage alone may not address inode layout. Prevent cache TTL/cleanup and inode monitoring. Do not create millions of files for the exercise.
## S38
Repeated samples show one retry loop saturating CPU with unchanged incoming traffic and low I/O wait. Inspect the recent code/config and correct bounded backoff/termination in the training implementation. Verify CPU, request latency and functional behavior over repeated samples. Prevent runaway retries with budgets and regression tests; do not kill an unidentified process as the first action.
## S39
OOMKilled plus the usage trend supports a memory-bound termination; heap equal to limit leaves no native/thread overhead. Measure working memory and adjust JVM/container settings or fix a leak in an approved lab, respecting node capacity. Verify stable memory, restart count and behavior. Prevent with realistic memory budgets and alerts. Exit 137 alone would not prove this diagnosis.
## S40
All signals share a submission timeout while collection continues; the egress change is supported by network evidence. Restore the minimum approved endpoint/port path after review, keeping authentication/site checks separate. Verify successful Agent submission, fresh metrics/logs/traces and intended alert routing. Prevent with controlled network changes and ingestion-health monitoring. Never expose API keys during diagnosis.