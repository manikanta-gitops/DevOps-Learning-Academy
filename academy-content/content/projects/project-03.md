# Project 3: Terraform and GitHub Actions

Resume links: R01/R03/R05/R06/R24-R29/R43/R44/R56; claims C04/C07-C09/C19-C21.

## Objective, prerequisites and architecture
Build one reusable local module, separate state, validate a CI workflow and reason through approved OIDC/ECR publishing. Prerequisites: days 13-18, Terraform 1.10+, Python, Docker, optional authorized personal GitHub repo. Local Terraform uses terraform_data only, not AWS resources. Flow: local module inputs -> reviewed plan -> state; separate source PR -> tests -> image -> approved OIDC role -> ECR -> digest. Infrastructure lifecycle need not run on every app commit.

## Guided local stages
Use day 15's fresh LAB_TF_DIR and day 16's separate LAB_TF_QA_DIR. Execute init/validate/plan, inspect terraform_data-only actions, and apply only your local example after review. Compare dev/QA outputs, then review the inactive checks.yml and publish.yml. Run the exact local verification steps:
```bash
python3 -m unittest discover -s fixtures/app -v
docker build -t academy:project3 fixtures/app
terraform -chdir="$LAB_TF_DIR" validate
terraform -chdir="$LAB_TF_DIR" plan
python3 -m json.tool fixtures/aws/oidc-trust.json
python3 -m json.tool fixtures/aws/ecr-publish-policy.json
```
Tests verify application contracts, build produces an image, validate checks configuration, plan compares desired/local tracked state, and JSON checks show policy syntax. They do not authenticate to AWS. Expected: known tests pass, unchanged local module plan shows no changes, and policy placeholders remain clearly non-runnable.

## Optional hosted workflow and ECR extension
Approval is required for repository creation/push, AWS trust/policy setup and ECR storage costs. Use your own repository with this content at its root, not an assumed username from the resume. Copy the reviewed teaching workflows to its `.github/workflows` only after approval. Pin reviewed action commit SHAs for a maintained deployment; the examples use readable tags for instruction. Configure an environment named lab with main-only branch rules and required reviewers, then set non-secret LAB_REGION, LAB_AWS_ACCOUNT_ID and LAB_ROLE_ARN repository/environment variables.

An AWS owner must pre-create the approved `academy` ECR repository, GitHub OIDC provider and scoped role. Replace example account/region/repository conditions with those approved values, not wildcards. Apply no policy from this course blindly. The role needs ECR token retrieval plus repository upload actions; it does not need EKS administrator access or permission to create repositories. The example runs manually on main only after its approved checkbox, tests first, checks caller account and publishes a source-SHA tag. It does not update GitOps configuration automatically and does not claim a Snyk gate exists unless one is configured.

Equivalent approved local publish commands, using explicit profile/region and an owner-created repository, are:
```bash
set -euo pipefail
export AWS_PAGER=""
: "${LAB_PROFILE:?Set the approved sandbox profile}"
: "${LAB_REGION:?Set the approved commercial AWS region}"
: "${APPROVED_ACCOUNT_ID:?Set the owner-verified account ID}"
: "${LAB_ECR_REGISTRY:?Set the approved registry hostname}"
: "${LAB_IMAGE_TAG:?Set the reviewed training image tag}"
aws sts get-caller-identity --profile "$LAB_PROFILE"
test "$(aws sts get-caller-identity --profile "$LAB_PROFILE" --query Account --output text)" = "$APPROVED_ACCOUNT_ID"
test "$LAB_ECR_REGISTRY" = "$APPROVED_ACCOUNT_ID.dkr.ecr.$LAB_REGION.amazonaws.com"
aws ecr get-login-password --profile "$LAB_PROFILE" --region "$LAB_REGION" | docker login --username AWS --password-stdin "$LAB_ECR_REGISTRY"
docker tag academy:1 "$LAB_ECR_REGISTRY/academy:$LAB_IMAGE_TAG"
docker push "$LAB_ECR_REGISTRY/academy:$LAB_IMAGE_TAG"
aws ecr describe-images --repository-name academy --image-ids imageTag="$LAB_IMAGE_TAG" --profile "$LAB_PROFILE" --region "$LAB_REGION" --query 'imageDetails[0].imageDigest'
docker logout "$LAB_ECR_REGISTRY"
```
Run this as a reviewed Bash script; strict error handling stops after a failed account, registry or command check. The hostname check assumes the commercial AWS partition used by this example; do not weaken it to accommodate an unreviewed target. Password is piped, not echoed. These local commands use your approved profile, **not GitHub OIDC**; only a verified hosted job tests that integration. Do not substitute long-lived keys for OIDC to claim completion.

## Safe remote-state design
Read backend-example.hcl: Terraform 1.10+ native lockfile, unique key, encryption and approved bucket. An owner must configure restricted state/lock-object access, versioning, retention and recovery. No backend migration is prescribed. A real S3 backend test needs an approved empty training state and reviewed migration procedure; company state is never a teaching artifact. I16-I18 supply safe alternatives.

## Independent and challenge stages
Independent: create a module input/output contract and two isolated callers; design a workflow with tests-before-publish, no AWS permissions on PRs, and immutable artifact evidence. Acceptance: validated local module and correct policy reasoning, plus separate live evidence only when authorized. Challenges: choose I13/I14/I16/I17/I18. Hints first, separate solutions after retry. Security task: distinguish an app dependency finding from a base-image finding and document a policy decision rather than hiding scan failures.

## Cleanup and evidence
Review/destroy only local terraform_data records; remove temporary state/plan directories privately. Delete only images/tags created for this approved sandbox, and have the owner review role access/repository retention if ending the lab. Do not remove shared state buckets or identities. Actions, registry storage/API/transfer and S3 may incur costs. Evidence: module interface, plan reasoning, test result, image identity, policy rationale and explicitly untested integrations. No CI workflow or AWS operation has been run by authoring these files.