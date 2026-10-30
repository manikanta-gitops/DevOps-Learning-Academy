# Day 15: Terraform foundations

Resume: R24/R26; C04. Time: 20/40/20/10. Fresh local directory with built-in terraform_data only; no AWS provider or cloud resources.

## 1. Learning objectives
Explain configuration, plan and state. Predict the operation before applying a saved local plan.

## 2. Concepts
Configuration declares desired resources. Providers implement resource APIs; the built-in terraform provider supplies terraform_data without an external download. Variables are inputs, outputs expose selected results, and data sources read existing information rather than declaring ownership. State maps resource addresses to tracked objects and metadata. A plan compares desired configuration and observed/tracked state; it is not an automatic approval.

## 3. How it works
Init prepares the working directory/modules/backend -> validate checks configuration structure -> plan builds a dependency graph and proposed actions -> apply executes the reviewed plan -> state records results. References create dependencies; add explicit depends_on only for dependencies not expressed by data references. Sensitive marking hides some display but does not encrypt state.

## 4. Real-world usage
This is the foundation of the resume's AWS modules and remote state. The local example records environment/image data; it does **not** create an EKS cluster or validate AWS behavior.

## 5. Hands-on lab
Prerequisite Terraform 1.10+. Create a fresh isolated copy and keep LAB_TF_DIR for days 16-18:
```bash
export LAB_TF_DIR="$(mktemp -d "${TMPDIR:-/tmp}/academy-tf.XXXXXX")"
cp -R fixtures/terraform/. "$LAB_TF_DIR/"
terraform -chdir="$LAB_TF_DIR" init -backend=false
terraform -chdir="$LAB_TF_DIR" fmt -check -recursive
terraform -chdir="$LAB_TF_DIR" validate
terraform -chdir="$LAB_TF_DIR" plan -out=lab.tfplan
terraform -chdir="$LAB_TF_DIR" show lab.tfplan
```
Read the plan and confirm the only resource type is terraform_data before manually continuing:
```bash
terraform -chdir="$LAB_TF_DIR" apply lab.tfplan
terraform -chdir="$LAB_TF_DIR" state list
terraform -chdir="$LAB_TF_DIR" output release_record
```
`show` here displays only the deliberately non-sensitive local plan; never use this to share a company plan. Apply writes local state. Retain the folder; final cleanup is a reviewed `terraform -chdir="$LAB_TF_DIR" destroy` against this local-only copy, then remove the known lab directory using your file manager. Do not use global or wildcard deletion.

## 6. Expected output
Validate succeeds; the first plan proposes one terraform_data record under module.service; output contains dev and academy:1. A second plan after apply should show no changes. No account credentials are needed.

## 7. Troubleshooting
I15: invalid variable/input and unsupported version are configuration errors, not AWS outages. Read the first diagnostic, verify directory/version/input and rerun validate. A no-change plan proves agreement for this configuration, not that an application is healthy.

## 8. Interview preparation
Q29/Q30: init versus plan/apply and state versus configuration. Explain the limits of this local demonstration before relating it to AWS providers.

## 9. Independent practice
In another fresh copy, add a validated non-secret service-name input and expose it through the module output. Predict the plan before applying. Challenge I15 -> H15 -> S15 after an attempt.

## 10. Revision
Read every plan; check directory/backend; keep generated plans/state out of Git. Record your local-only evidence, not professional provisioning claims.