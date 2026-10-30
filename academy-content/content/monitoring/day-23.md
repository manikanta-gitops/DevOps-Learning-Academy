# Day 23: Metrics, logs, dashboards and alerts

Resume: R09/R34/R36/R37/R39; C14/C17. Time: 20/40/20/10. Synthetic Datadog/CloudWatch evidence and local app logs; paid account optional.

## 1. Learning objectives
Explain what each signal answers and distinguish absent data from a misleading query. Define an actionable alert without inventing production baselines.

## 2. Concepts
Metrics are measurements over time; logs are timestamped events; traces describe a request's spans. A dashboard displays selected data; a monitor evaluates conditions and routes notifications. service/env/version tags enable grouping but must match emitted data. Aggregation and evaluation windows can hide brief failures or overreact to noise. No-data behavior is a policy choice, not necessarily zero errors.

## 3. How it works
Host/container/app signals -> Agent or supported ingestion -> backend processing -> scoped query -> monitor evaluation -> notification destination. CloudWatch dimensions select AWS metric streams; Datadog tags/query rules are different. A Slack delivery failure does not prove monitor evaluation failed. Agents need correct network/auth/site settings; app logs need collection and parsing configuration.

## 4. Real-world usage
The resume describes detecting abnormal errors and responding to Slack channels. Explain which signal established impact, what timeframe and tags were selected, and how recovery was observed. Viewing a dashboard does not establish that you installed the Agent or designed all alerts.

## 5. Hands-on lab
Start the sample in a terminal and send three controlled requests from another:
```bash
curl --silent --show-error http://127.0.0.1:8080/health
curl --silent --show-error http://127.0.0.1:8080/error
curl --silent --show-error http://127.0.0.1:8080/
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I23" })'
```
Inspect the sample's stdout JSON: service/env/version, path, status and duration. Compute the error count for these synthetic requests and explain why three requests are not a meaningful production alert baseline. Build a monitor decision table for sustained errors, recovery and no data. Cleanup: Ctrl+C the server; do not send synthetic alerts to a real Slack channel.

## 6. Expected output
Two healthy endpoint responses and one intentional 500 with corresponding JSON logs. `dd.trace_id=0` is expected without tracing enabled. The fixture contains emitted data that a wrong query scope hides; distinguish this from genuine missing ingestion.

## 7. Troubleshooting
I23: verify app emission, Agent health/config, network/site/auth, ingestion and query scope in that order as evidence dictates. Approved Datadog Agent diagnostic syntax is `datadog-agent status` on a host install; container/Kubernetes execution depends on the installation. Do not dump API keys. Verify data appears under the intended scope and that a controlled alert/recovery routes correctly only in an approved sandbox.

## 8. Interview preparation
Q45/Q46: logs versus metrics/traces; collection versus query versus notification failure. Explain a recovery window and avoid claiming an invented availability or response-time improvement.

## 9. Independent practice
Design an error-rate monitor with minimum traffic, duration, recovery threshold, owner and runbook link. Use a sample table to test whether it would fire. Challenge I23 -> H23 -> S23.

## 10. Revision
No data is not zero; tags/time windows matter; a green deployment is not recovery proof. Revisit Helm resource limits and the signals they affect.