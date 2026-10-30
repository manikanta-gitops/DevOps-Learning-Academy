# Day 7: IAM, access and secret boundaries

Resume: R01/R03/R10/R17/R42; claim C05. Time: 20/40/20/10. Synthetic policy review; no account or fee required.

## 1. Learning objectives
Separate authentication, role trust, action permissions and secret delivery. Explain the effective permission decision rather than looking for any one Allow statement.

## 2. Concepts
A principal is an acting identity. A role is assumable identity with permissions; its trust policy controls who may assume it. Identity policies permit actions on resources; resource policies and additional boundaries may also matter. An explicit deny overrides applicable allows. A secret is sensitive data, not a permission grant. Kubernetes Secret base64 encoding is not encryption.

## 3. How it works
Caller authenticates -> may assume a trusted role -> request action/resource/context is evaluated -> service allows or denies -> application handles the result. STS temporary credentials expire. Secrets Manager retrieval separately depends on identity, network/service reachability and possibly KMS authorization; rotating a value does not guarantee an already-running process reloads it.

## 4. Real-world usage
The resume claims least-privilege AWS access and supported OIDC. EKS administrator access, Pod AWS identity and a CI role are different identities. Do not give a workload a node's broad role to solve one denied action. Entra/product RBAC is a different authorization system, revisited on day 27.

## 5. Hands-on lab
Read the supplied narrow publishing policy and incident:
```bash
python3 -m json.tool fixtures/aws/ecr-publish-policy.json
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I07" })'
```
The JSON command validates/formats a **dummy** policy, not AWS authorization. For each statement write principal, action, resource and relevant conditions. Explain why ECR token retrieval uses resource `*`, while repository actions are scoped. Identify the placeholder account/region and do not install this policy. Draw the separate dummy Secret and Secrets Manager retrieval paths. Cleanup: none.

## 6. Expected output
Two readable policy statements and synthetic evidence. Your result is an action/resource matrix and a reasoned denial, not an IAM simulator verdict. A syntactically valid policy can still be wrong or dangerously broad.

## 7. Troubleshooting
I07: verify actual principal before checking trust or permissions; compare exact API action/resource, policy conditions and explicit denies. In an approved sandbox, `aws sts get-caller-identity --profile "$LAB_PROFILE"` is an identity check, not proof of permission to other services. Also consider organization policies, boundaries and endpoint policies when applicable. Safe fix: minimum approved permission change, then test both permitted and forbidden behavior.

## 8. Interview preparation
Q13/Q14: role versus policy, trust versus permissions, and secrets versus authorization. Explain why OIDC is not "no credentials": it replaces long-lived keys with short-lived credentials.

## 9. Independent practice
Design permissions for a CI job that can publish to one repository but not delete repositories. List the denied operations and test strategy. Challenge I07 -> H07 -> retry -> S07. Do not widen a real policy.

## 10. Revision
Identify actor, action, resource and conditions. Base64 is reversible. Never print real Secret values, Terraform state or environment dumps. Revisit network layering before blaming IAM for a timeout.