# Day 14: OIDC, ECR and secure publishing

Resume: R03/R05/R28/R29/R43/R44; C07/C19/C20. Time: 20/40/20/10. Core policy/log simulation; real ECR publishing is optional, approved and chargeable.

## 1. Learning objectives
Explain temporary AWS credentials, restricted trust, repository permissions and image identity. Separate authentication failure from denied ECR access.

## 2. Concepts
OIDC is signed identity assertion. GitHub issues a token with audience (`aud`) and subject (`sub`) describing the workload context. STS exchanges an accepted token for temporary role credentials. `id-token: write` permits requesting a GitHub token; it does not grant AWS API permissions. A job using environment `lab` has a different subject from a branch-only job.

## 3. How it works
Approved job -> token -> IAM trust evaluation -> STS credentials -> ECR login -> build/push -> digest -> reviewed deployment-config change. Trust and repository permissions are separate policies. An environment-subject trust policy should be paired with GitHub environment branch restrictions and required reviewers; the subject alone does not constrain the branch.

## 4. Real-world usage
The resume explicitly says **supported** OIDC. Explain your actual contribution without claiming sole architecture ownership. CI should not need permanent AWS keys. A successfully pushed image does not automatically change Helm or ArgoCD desired state.

## 5. Hands-on lab
```bash
python3 -m json.tool fixtures/aws/oidc-trust.json
python3 -m json.tool fixtures/aws/ecr-publish-policy.json
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I14" })'
```
Compare synthetic token aud/sub with trust conditions. Inspect the inactive `publish.yml`: manual approval boolean, main guard, lab environment, narrow permissions, account check, credential action, password-stdin login and source-SHA tag. Identify every REPLACE/000000000000 placeholder. Do not copy a company role ARN. Project 3 contains the approved-account procedure; today's task stops at policy reasoning. Cleanup: none.

Alternative 40-minute local publishing block after day 6: verify Docker is ready, port 5001 and container name academy-registry are unused, and keep the registry loopback-only. Downloading the registry image consumes setup time and requires internet:
```bash
docker run -d --rm --name academy-registry -p 127.0.0.1:5001:5000 registry:2.8.3
docker tag academy:1 localhost:5001/academy:1
docker push localhost:5001/academy:1
curl --fail --max-time 3 http://127.0.0.1:5001/v2/academy/tags/list
docker pull localhost:5001/academy:1
```
The tag chooses a registry/repository/tag; push uploads content and reports a digest; the HTTP request lists stored tags; pull verifies registry retrieval. Record the reported digest, not a fabricated value. This disposable unauthenticated HTTP registry is for loopback teaching only and demonstrates neither AWS identity nor OIDC. Never expose it publicly or globally weaken Docker TLS settings if your installation rejects it. Cleanup only the lab registry with `docker stop academy-registry`; its unmounted registry storage is disposable. The original academy:1 image remains for later lessons. Do not run both this block and the full policy exercise as hidden extra homework.

## 6. Expected output
Valid dummy JSON and an evidence-backed mismatch diagnosis. Syntax success does not prove a trusted provider exists. For a later approved push, success means a registry manifest/digest is retrievable, not simply that `docker login` succeeded.

## 7. Troubleshooting
I14: check job token permission, expected aud/sub, correct provider/role and trust restrictions before repository permissions. If STS works but push fails, inspect ECR region, repository, authorization token and upload actions. Do not fix trust with `repo:*`. Verify the intended job succeeds and an unintended repo/environment cannot assume the role.

## 8. Interview preparation
Q27/Q28: explain all authentication steps and why credentials still exist temporarily. Describe how to pin reviewed action SHAs and protect the job environment in a real deployment; the examples use readable version tags for teaching, not a production supply-chain guarantee.

## 9. Independent practice
Draft trust for one fictional repository/environment and a separate ECR publish policy. Predict how the subject changes when you remove `environment: lab`. Challenge I14 -> H14 -> S14 after your attempt.

## 10. Revision
Trust decides who assumes; role policy decides what they do. Never print tokens or run an authenticated curl with verbose headers into evidence. Revisit HPA prerequisites as a separate permission/metrics boundary.