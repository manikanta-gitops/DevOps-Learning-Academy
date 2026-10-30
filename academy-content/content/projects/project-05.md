# Project 5: Monitoring and incident investigation

Resume links: R09/R34-R39/R45-R47/R54/R55; claims C14-C17/C23. All examples are training; do not invent a historical incident.

## Objective, architecture and prerequisites
Generate controlled logs/errors, optionally instrument one local Python handler, correlate supplied traces/Rollbar events, and verify a recovery narrative. Core uses Python and synthetic JSON; optional tracer installation requires internet and a compatible Python 3.11/3.12 environment. The sample is a deliberately small HTTP server, not a production web framework. It has no downstream service, so local instrumentation alone does not demonstrate distributed propagation.

Flow: handler -> log/manual span -> optional authorized Agent/backend; a separately instrumented application -> Rollbar events; monitors -> approved Slack destination. Metrics, logs, traces and exceptions have different collection and query paths.

## Guided local core
Run the sample, request `/health`, `/error` and `/slow`, and compare JSON status/duration. Do not call curl -I on this GET-only example. Read `fixtures/monitoring/evidence.json`; join by service/env/version/time and trace reference. That evidence is synthetic, not captured from a real Datadog/Rollbar account. Write an error timeline, competing hypothesis and falsifying check. A few requests teach signal meaning, not statistically meaningful SLO compliance.

## Optional local manual instrumentation
This is a replacement lab block, not extra compulsory work. Use a fresh venv with Python 3.11/3.12; review/install the declared package ranges, then record the resolved versions privately for reproducibility. Do not reuse a company Python environment:
```bash
python3 -m venv .venv-monitoring
.venv-monitoring/bin/python -m pip install -r fixtures/monitoring/requirements.txt
ENABLE_DDTRACE=1 DD_TRACE_ENABLED=false DD_INSTRUMENTATION_TELEMETRY_ENABLED=false DD_REMOTE_CONFIGURATION_ENABLED=false DD_PROFILING_ENABLED=false .venv-monitoring/bin/python fixtures/app/server.py
```
The first command creates an isolated environment; pip fetches optional tooling; the final command creates manual spans but deliberately disables exporting traces and ancillary telemetry. It binds to loopback by default. From another terminal request `/health` and `/error`. Inspect nonzero dd.trace_id/dd.span_id fields and error status. Tracing libraries vary by version; verify behavior against the installed version rather than treating this as a tested SaaS integration. Stop with Ctrl+C. Span creation is not Agent delivery or backend ingestion.

## Approved Datadog/Rollbar extension
Requires approved accounts, current compatible tooling, allowed data and cost review. Datadog logs/APM/custom metrics and Rollbar plans may incur charges; do not start a subscription or upload internal logs. For end-to-end Datadog delivery, an owner must supply a local or sandbox Agent installation, correct site/API key through a secret mechanism, APM receiver reachable only from the lab, and approved log collection. Set DD_TRACE_AGENT_URL to that endpoint, DD_ENV=lab, DD_SERVICE=academy and DD_VERSION to the test version; enable trace export only after approval. Confirm Agent status, generate one known request and verify it under the intended tags/time range. Never print the API key. The server's explicit JSON fields are training correlation data; verify the backend's parsing/correlation convention for the installed tracer version.

The Rollbar SDK is included as an optional dependency for a controlled training event. After obtaining an approved test-project token **privately** in ROLLBAR_ACCESS_TOKEN, this explicit send creates a real external event and must not run without approval:
```bash
.venv-monitoring/bin/python -c 'import os, rollbar; rollbar.init(os.environ["ROLLBAR_ACCESS_TOKEN"], environment="lab"); rollbar.report_message("Academy synthetic training event", "warning"); rollbar.wait()'
```
This verifies a test event path, not automatic application exception instrumentation. A real integration additionally needs framework hooks, version/environment metadata, scrubbing and verification. Do not claim the sample app is Rollbar-instrumented merely because the SDK test event was sent. Distributed tracing requires at least two instrumented services and supported context propagation; use the synthetic two-span example until that separate lab is approved.

## Independent and challenge stages
Independent: create a monitor decision table, a trace/log/exception timeline and a runbook with safe action, verification and prevention. Acceptance: explain what failed, how it was detected, why evidence supports the cause and which observation would disprove it. Challenge I23/I24/I35/I40 -> corresponding hint -> retry -> separate resolution. Do not change alert thresholds merely to silence a real incident.

## Verification, cleanup and evidence
Local core succeeds when logs/status/timing match deliberately generated requests and the synthetic diagnosis is justified. Optional SaaS mode succeeds only with verified received telemetry, known scope, controlled test-event/alert delivery and recovery. Stop the sample server, stop only your own lab Agent if installed, remove the disposable venv through the file manager, revoke temporary test tokens through the owner and remove lab-only monitors/data according to retention policy. Record which parts were never run. No live telemetry account or token has been accessed while authoring this project.