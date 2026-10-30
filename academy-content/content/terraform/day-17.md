# Day 17: Remote state and locking

Resume: R06/R26; C04. Time: 20/40/20/10. Read-only local/backend design; approved S3 use is optional and chargeable.

## 1. Learning objectives
Explain why shared state needs access control, locking and recovery. Investigate lock ownership before considering unlock.

## 2. Concepts
A backend stores state; a lock coordinates concurrent writers. S3 versioning retains versions, encryption protects storage, IAM controls access, and locking prevents overlapping operations; these solve different problems. Terraform 1.10+ supports native S3 lockfiles through use_lockfile. The audit does not establish that the real platform used lockfiles or DynamoDB.

## 3. How it works
Init configures backend -> Terraform reads state -> acquires appropriate lock for a write operation -> performs work -> saves state -> releases lock. An interrupted writer may leave a lock, but a lock can also represent an active legitimate operation. Deleting a lock while a writer is active risks inconsistent updates.

## 4. Real-world usage
Reusable modules do not solve concurrent access by themselves. CI and engineers need the same state address and coordinated permissions, and separate environments must not accidentally share one key. State can contain secret values even if CLI output masks them.

## 5. Hands-on lab
Read `fixtures/terraform/backend-example.hcl` locally and inspect I17:
```bash
terraform version
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I17" })'
terraform -chdir="$LAB_TF_DIR" state list
```
The state-list command shows local addresses, not state contents. Annotate bucket, key, region, encrypt and use_lockfile. The supplied .hcl is an example of backend arguments, not an active backend block. Enabling S3 requires an explicitly reviewed `backend "s3" {}` block, a preapproved bucket, restricted permissions (including required lock-object permissions), and a deliberate migration; do **not** run backend migration in this exercise. Cleanup: none.

## 6. Expected output
Terraform version and the existing local resource address. I17 shows a lock with owner/time and a corresponding active run. Your output is a decision tree: active writer, abandoned operation or wrong backend. No lock is removed.

## 7. Troubleshooting
Identify backend/key/account -> examine lock metadata -> contact owner/check runner -> determine whether work is active -> inspect state/resource consequences -> approved recovery -> fresh plan. Never teach force-unlock as the first command. AccessDenied may concern state or the lock object; wrong keys may show an unexpectedly empty state. Prevention: controlled CI concurrency, least privilege and tested restore procedures.

## 8. Interview preparation
Q33/Q34: why versioning is not locking, why encryption is not authorization, and why force-unlock cannot repair corrupted state. State actual platform details only after clarification.

## 9. Independent practice
Design separate dev/QA state keys, identities, versioning and lock permissions. Given I17, decide whether to wait, escalate or propose recovery, with evidence. H17 then S17 after your attempt.

## 10. Revision
Lock ownership first. Do not print or commit state. Revisit OIDC: an authenticated CI role still needs the backend's specific permissions.