# Day 16: Terraform modules and environment separation

Resume: R01/R25/R26/R56; C04/C21. Time: 20/40/20/10. Local terraform_data; day 15 prerequisite.

## 1. Learning objectives
Explain a module's inputs, outputs and resource ownership. Separate reusable logic from per-environment values and state.

## 2. Concepts
A module is a directory of Terraform configuration called by another configuration. Variables form its input contract; outputs form its exported contract. Provider configuration supplies API context; modules should not secretly select a production account. Two variable values in one state are not two independent environments. Versioning and compatibility matter when many services share a module.

## 3. How it works
Root caller passes environment/image -> child resource uses inputs -> child output returns recorded data -> root output exposes a value. Dependencies follow references. Changing a module interface affects callers; a state address change can look like destroy/create unless migration is planned. Terraform CLI workspaces separate states but are not, by themselves, an authorization boundary.

## 4. Real-world usage
The resume claims reusable modules across accounts. Good evidence is one comprehensible module, two separated callers and an explanation of what must differ: credentials, region, state address, configuration and approvals. Do not claim "every AWS service" from this single demonstration.

## 5. Hands-on lab
Keep day 15's dev copy. Create a separate QA working directory:
```bash
export LAB_TF_QA_DIR="$(mktemp -d "${TMPDIR:-/tmp}/academy-tf-qa.XXXXXX")"
cp -R fixtures/terraform/. "$LAB_TF_QA_DIR/"
terraform -chdir="$LAB_TF_QA_DIR" init -backend=false
terraform -chdir="$LAB_TF_QA_DIR" validate
terraform -chdir="$LAB_TF_QA_DIR" plan -var=environment=qa -out=qa.tfplan
terraform -chdir="$LAB_TF_QA_DIR" show qa.tfplan
```
Explain why this plan creates a separate local record rather than replacing dev. Apply only after confirming terraform_data is the sole resource, using `terraform -chdir="$LAB_TF_QA_DIR" apply qa.tfplan`. Compare `output release_record` from each directory. Cleanup: keep both until day 18; destroy only their local records afterward.

## 6. Expected output
Each state contains one record with its own environment. Passing `-var=environment=prod` should fail the intentionally restricted validation. Separate local directories demonstrate state separation, not AWS account enforcement.

## 7. Troubleshooting
I16: wrong environment/key/credentials can cause an unexpected replacement plan. Stop, inspect caller values and state/backend context, and verify intended target before applying. Do not reuse a dev plan in QA or assume filename identifies the account. Prevention: environment guards, explicit state addresses and reviewed module versions.

## 8. Interview preparation
Q31/Q32: reusable interface versus duplication, and state separation versus access separation. Explain provider aliases conceptually for distinct approved accounts without configuring a live provider here.

## 9. Independent practice
Design a module interface for service name/image/environment with input validation. Show two callers and state boundaries in a diagram. Challenge I16 -> H16 -> S16. Do not copy an entire AWS module from AI.

## 10. Revision
Reusable implementation; explicit inputs; isolated state; reviewed changes. Revisit GitHub workflows: shared logic must not hide dangerous environment assumptions.