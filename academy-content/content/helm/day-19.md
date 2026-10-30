# Day 19: Helm chart fundamentals

Resume: R13/R16/R17/R31/R32; C11. Time: 20/40/20/10. Local rendering requires Helm only; deployment uses the named kind cluster.

## 1. Learning objectives
Explain how chart metadata, templates and values become Kubernetes resources. Inspect rendered output before applying it.

## 2. Concepts
A chart packages templates/defaults/metadata. Chart.yaml describes chart name/version/type; appVersion describes the app but does not automatically change the image. Values configure templates. Helpers share naming logic. A release is an installed Helm instance; chart version, release revision and image version are different identifiers. Quotes matter when a value such as an image tag must remain a string.

## 3. How it works
Load defaults -> merge supplied values -> validate schema -> evaluate templates/functions -> produce YAML -> Kubernetes validates/applies when installing. `include` calls a helper; `toYaml` serializes objects; `nindent` manages indentation. A render can be syntactically valid but point at the wrong port/image or lack a required API.

## 4. Real-world usage
The resume's chart-authoring claim requires understanding the templates, not only running helm upgrade. Reuse should preserve meaningful differences between services. Do not template real credentials into a chart or commit rendered Secrets.

## 5. Hands-on lab
Read every file in `fixtures/helm/academy` and render locally:
```bash
helm lint fixtures/helm/academy
helm template academy fixtures/helm/academy --namespace academy-helm
helm template academy fixtures/helm/academy --set-string image.tag=2
```
Lint checks common chart problems; template renders without cluster contact; set-string overrides just the image tag. Trace the helper-generated name `academy-academy`, Service selector and Pod label. Compare output to the day 8 workload. Optional install alternative after loading image academy:1 into kind:
```bash
helm upgrade --install academy fixtures/helm/academy --kube-context kind-academy --namespace academy-helm --create-namespace --wait --timeout 90s
kubectl --context kind-academy -n academy-helm get deployments,services
```
This separate namespace avoids ownership conflicts with day 8's manually managed resources. Cleanup when finished with Helm lessons: `helm uninstall academy --kube-context kind-academy -n academy-helm`; retain it until day 20 if continuing.

## 6. Expected output
Lint passes; render includes a Deployment and Service with matching selectors, port 80 -> named http/8080 and ready/health probes. A tag override changes image reference, not appVersion metadata. Installation must also prove rollout/readiness; rendering alone does not.

## 7. Troubleshooting
I19: distinguish template parsing, schema validation, YAML structure, API rejection and runtime failure. Inspect the first error and affected rendered field. Correct the smallest type/indent/value issue and rerender before any cluster retry. Use `--debug` only with non-secret lab values; it can expose content.

## 8. Interview preparation
Q37/Q38: chart versus release versus app version; how helper scope, quoting and values affect output. Explain why successful lint is necessary but insufficient.

## 9. Independent practice
Add a non-secret environment setting in a working copy, with a default and a verified rendered change. Write a helper yourself. Challenge I19 -> H19 -> S19 after an attempt; do not copy the guided template as your independent artifact.

## 10. Revision
Values are inputs, manifests are output, cluster state is observation. Revisit Terraform module contracts and avoid treating reuse as hidden configuration magic.