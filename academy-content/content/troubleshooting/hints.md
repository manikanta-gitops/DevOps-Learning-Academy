# Hint book: open only after an attempt

All incidents are synthetic. Record symptom, hypothesis, command/check, observed evidence and uncertainty first. Read one hint, retry, then consult the separate solution only if needed. Commands attached to cloud evidence cards describe checks in a simulation; they are not authorized commands against a real account.

## H01
Compare the client's destination port with the actual listener. A PID proves existence, not reachability.
## H02
Check traversal permission on every directory before file read permission. Which identity does the unit use?
## H03
What is the status of the last pipeline command? Capture component statuses immediately; later commands overwrite them.
## H04
Compare the exact hostname character by character, then check a known permitted name using the same resolver.
## H05
Compare application listener, target health-check port and the target SG's allowed source/port. Do not start with 0.0.0.0/0.
## H06
The container's loopback interface is not its externally reachable bridge interface.
## H07
STS success rules out one stage. Match the denied API action against the repository policy.
## H08
Which image tag was loaded into which runtime? Host and kind image stores are distinct.
## H09
Read the selector and labels before restarting anything. Port-forward may bypass the broken selection path.
## H10
A Pod needs a network address as well as CPU/memory. Compare subnet eligibility and available addresses.
## H11
A container that has never been scheduled cannot yet produce useful application logs.
## H12
A narrow permission denial can be correct behavior when a configuration points at the wrong environment.
## H13
The first failed step is more informative than skipped downstream stages. Reproduce its command/runtime.
## H14
An environment-based subject is not a branch-based subject. Compare the whole string and preserve restrictions.
## H15
Read the stated input contract. A local course guard intentionally rejects production-like values.
## H16
Variables select desired values; the backend selects which state is being managed. Inspect both.
## H17
Check whether the lock owner is still doing useful work before proposing any unlock.
## H18
Apply is not a database transaction. Which operations succeeded and were recorded before failure?
## H19
This failure occurs before Kubernetes contact. Preserve type validation rather than removing the schema.
## H20
Readiness and liveness answer different questions. Compare the rendered configuration with the probe response.
## H21
The repository path is relative to that repository root, not your local editor folder.
## H22
Determine the owner of the field and whether an HPA exists. Observe what Git says before making another live edit.
## H23
Inspect tags and timeframe after confirming ingestion. A query can filter out valid data.
## H24
Join by request/service/environment/version/time, then inspect the first exception and config change. Correlation is a clue requiring verification.
## H25
There are at least two commits: application source and desired deployment configuration. Which one changed?
## H26
Successful reconciliation can apply an unhealthy configuration perfectly. Check ready endpoints and the desired change.
## H27
Successful login and permission to edit are separate decisions. Which product enforces the denied action?
## H28
A completed HTTP transfer can contain an error status. What does curl's default exit behavior measure?
## H29
Break down request time by spans. More front-end workers do not increase an external dependency's quota.
## H30
The container has not started. Inspect referenced object and key names without dumping secret values.
## H31
Compare the requested hostname to certificate SANs and check validity/trust separately.
## H32
Which address and port appear in the proxy's error? Compare them with the upstream listener.
## H33
Compare upstream duration with the exact timeout phase. A higher timeout may mask, not solve, a slow dependency.
## H34
Read previous logs and termination reason. A command/path error is not repaired by adding memory.
## H35
Collectors forward signals; they do not invent spans when application instrumentation never runs.
## H36
Identify large files and retention ownership before removing data. A deleted-but-open file can still consume space.
## H37
Check inode accounting and file population. Do not create millions of files to reproduce the fixture.
## H38
Compare CPU, I/O wait, memory and traffic over time. One high snapshot is not the whole diagnosis.
## H39
Memory includes heap, stacks, native allocations and other overhead. Use termination reason plus trend evidence.
## H40
Host metrics missing together with app traces points toward a shared collection/submission boundary.