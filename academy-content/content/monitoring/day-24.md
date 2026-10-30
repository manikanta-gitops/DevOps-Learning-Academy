# Day 24: APM, traces, Rollbar and incident evidence

Resume: R34-R38/R45-R47/R54/R55; C14-C16/C23. Time: 20/40/20/10. Synthetic trace bundle; optional instrumentation in Project 5.

## 1. Learning objectives
Follow a request through spans and correlate logs/exceptions without mistaking correlation for cause. Write a concise recovery runbook.

## 2. Concepts
APM describes application requests and performance. A trace contains spans, each measuring an operation with parent/child context. Instrumentation creates spans; propagation carries context across calls; sampling decides which traces are retained. Rollbar groups exception events, helping identify recurrence and affected versions. A grouped exception is not a full distributed trace.

## 3. How it works
Instrumented handler -> child operation -> propagated context -> Agent/backend -> trace view. Logs include correlation fields, service/env/version and timestamps. Rollbar events carry error/stack/environment/version information through its SDK/integration. Our sample has optional manual ddtrace spans, but no downstream service, so it is a single-service tracing exercise, not a distributed tracing implementation.

## 4. Real-world usage
The resume claims cross-referencing Datadog and Rollbar. Match request/service/environment/version/time, compare competing causes and verify the proposed fix. Do not fabricate a production incident from the sample's intentionally generated error.

## 5. Hands-on lab
Read the synthetic evidence bundle and I24:
```bash
python3 -m json.tool fixtures/monitoring/evidence.json
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I24" })'
```
Build a timeline with symptom, affected version, failing span, correlated log and exception. Identify which observation rules out DNS and which supports the application cause. Write a runbook with first checks, stop conditions, safe recovery, verification and prevention. Project 5 gives optional local manual instrumentation and approved Datadog/Rollbar extension steps. Cleanup: none for fixtures.

## 6. Expected output
A synthetic request/trace/exception correlation with explicit evidence limits. Zero/missing trace IDs from the uninstrumented server are expected, not proof Datadog is broken. A local span does not prove remote ingestion or trace retention.

## 7. Troubleshooting
I24 and I35: check process launched with instrumentation, supported framework/manual spans, Agent endpoint, connectivity, sampling/filters, tags and time window. Compare application errors with collector errors. Apply a scoped instrumentation/configuration fix only in an approved lab; generate a known request, verify a span/log pair and inspect the backend if available. Prevention: a telemetry smoke test after deployments.

## 8. Interview preparation
Q47/Q48: trace versus exception, missing span versus a failed request, and evidence-backed recovery. Explain context propagation as the link between services, not "Datadog guesses which logs belong together."

## 9. Independent practice
Write your diagnosis without the solution book, including a competing hypothesis and falsifying check. Draft a truthful "In this training simulation..." incident explanation. I24/I35 -> hints -> retry -> solutions.

## 10. Revision
Instrumentation, propagation, collection and query are separate. Record the evidence that supports the cause and the evidence still missing. Revisit ArgoCD: sync status alone cannot prove application recovery.