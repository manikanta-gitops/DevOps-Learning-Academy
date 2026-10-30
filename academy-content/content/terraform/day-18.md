# Day 18: Drift, import and recovery

Resume: R24-R26/R55; C04/C16. Time: 20/40/20/10. Local record exercise plus synthetic cloud drift, not real AWS changes.

## 1. Learning objectives
Distinguish a desired configuration change, external drift, an untracked object and partial failure. Produce a safe recovery proposal before changing state.

## 2. Concepts
Drift is a difference caused outside the expected configuration workflow. Import associates an existing resource with a Terraform address; it does not automatically design correct configuration. Refresh-only plans update tracked observations but do not inherently fix the infrastructure. An apply is not an all-or-nothing transaction: earlier operations may succeed before a later one fails.

## 3. How it works
Plan compares configuration, state and provider observations. Unexpected actions require checking the working directory/backend/account/variables before interpreting resource differences. Lifecycle can alter replacement/update behavior, but ignore_changes is not a blanket cure for unexplained drift. Dependencies determine order, not transactional rollback.

## 4. Real-world usage
This defends the resume's version-controlled infrastructure claims. You should explain approval, backup/recovery boundaries and verification, not casually edit remote state. terraform_data has no real AWS object to drift, so the cloud scenario is explicitly synthetic.

## 5. Hands-on lab
Core: inspect current local agreement and I18:
```bash
terraform -chdir="$LAB_TF_DIR" plan
terraform -chdir="$LAB_TF_DIR" state list
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I18" })'
```
Optional alternative within the same 40-minute block: create a fresh temporary copy as day 15, init it, then use `terraform import 'module.service.terraform_data.record' academy-import-demo` **inside that fresh directory only**. This built-in resource imports local tracking data, not a cloud resource. Run plan afterward and explain why input reconciliation remains necessary. Do not use a resource address copied from work. Cleanup: review local destroy plans for your scratch directories; destroy only their terraform_data records and remove known local files privately.

## 6. Expected output
An unchanged dev configuration gives no changes. Import may leave input needing update; importing is not proof of correct desired state. The fixture shows a partial operation, so your recovery plan accounts for objects already created rather than retrying everything blindly.

## 7. Troubleshooting
I18: stop on unexpected delete/replace -> verify target -> compare intended change and observations -> determine what already succeeded -> choose reviewed configuration/import/moved-address/recovery action -> fresh plan -> controlled execution -> resource plus application verification. Avoid direct state-file editing, unreviewed state removal and disabling locks. Prevention: bounded plans, backups, reviewed migrations and drift detection.

## 8. Interview preparation
Q35/Q36: failed apply versus rollback, import versus provisioning, and how to investigate a suspicious plan. Explain the command's scope before offering a remediation.

## 9. Independent practice
Write a recovery note for a plan that proposes replacing an unrelated network. Include stop conditions, evidence, approval and verification, not a speculative apply command. Challenge I18 -> H18 -> S18.

## 10. Revision
Unexpected plan means investigate, not approve. Revisit day 15 state/configuration difference. Save only redacted plans from synthetic/local examples.