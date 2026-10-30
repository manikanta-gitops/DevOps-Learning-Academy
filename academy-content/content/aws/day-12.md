# Day 12: S3, ECR, Secrets Manager and CloudWatch

Resume: R05/R06/R09/R10; C04/C05/C14. Time: 20/40/20/10. Local fixture analysis; optional AWS reads require an approved sandbox.

## 1. Learning objectives
Explain each service's responsibility and fully investigate one access failure. Do not attempt four separate cloud implementations in 40 minutes.

## 2. Concepts
S3 stores objects identified by keys; versioning can help recover overwritten objects but is not a complete recovery process. ECR stores container manifests/layers; tags are names and digests identify content. Secrets Manager manages secret versions and rotation workflows. CloudWatch collects AWS metrics/logs and evaluates alarms by dimensions, period and threshold. Each service evaluates identity and may incur storage/API/ingestion costs.

## 3. How it works
Caller identity -> service endpoint -> authorization/context -> operation -> response. S3 state access is not the same as owning the infrastructure represented by state. A secret can rotate while an application keeps an old cached value. An alarm needs a matching metric stream, correct evaluation and a configured notification path.

## 4. Real-world usage
These services explicitly support the resume's delivery, configuration and monitoring. Terraform state in S3 can contain secrets even when outputs are marked sensitive. Datadog and CloudWatch can complement one another without assuming identical collection paths.

## 5. Hands-on lab
Analyze I12 and create four rows: stored data, caller, verification and likely failure:
```bash
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I12" })'
python3 -m json.tool fixtures/aws/ecr-publish-policy.json
```
Choose one S3 or ECR denial and explain which identity/action/resource to check. Optional metadata-only examples, after setting verified LAB_PROFILE/LAB_REGION/LAB_BUCKET/LAB_SECRET_ID in your own approved shell:
```bash
export AWS_PAGER=""
aws sts get-caller-identity --profile "$LAB_PROFILE"
aws s3api get-bucket-versioning --bucket "$LAB_BUCKET" --profile "$LAB_PROFILE" --region "$LAB_REGION"
aws secretsmanager describe-secret --secret-id "$LAB_SECRET_ID" --profile "$LAB_PROFILE" --region "$LAB_REGION"
```
These read metadata, not secret values; redact identifiers before sharing. Skip them without authorization. Cleanup: no resources created; retain only sanitized local reasoning.

## 6. Expected output
Core output is a four-service boundary map and one justified denial. Approved S3 metadata may show Enabled or no versioning status; neither is universal. DescribeSecret should not return the secret payload. Do not invent successful AWS results.

## 7. Troubleshooting
I12 uses a wrong environment resource reference. Start with identity and exact name/region, then policies and explicit denies; include relevant KMS and endpoint conditions only when evidence warrants. For missing CloudWatch data distinguish absent ingestion from a wrong dimension/query. Verify with the original operation after an approved fix, plus a forbidden operation that must remain denied.

## 8. Interview preparation
Q23/Q24: tag versus digest and secret rotation versus app refresh. Explain state confidentiality and how a metric alarm can miss a real incident due to scope or evaluation settings.

## 9. Independent practice
Design a release evidence record linking image digest, environment, secret reference (not value) and monitoring tags. Challenge I12 -> H12 -> S12. No actual bucket, registry or secret must be created.

## 10. Revision
Service purpose, identity, network and configuration are separate. Revisit Service routing from day 9 and explain why an API AccessDenied differs from a TCP timeout.