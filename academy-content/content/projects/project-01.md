# Project 1: Linux and networking troubleshooting

Resume links: R07/R08/R23/R48/R55; claims C06/C08/C16. S01/S02/S10 are prerequisites, not extra employment claims.

## Objective, architecture and prerequisites
Run the shared app, diagnose layered failures and verify repairs. Core architecture: client -> loopback listener -> app. Proxy extension: client:18081 -> Nginx -> Docker bridge -> app:8080. Use the VM for systemd and host tools; use Docker only after day 6. Required: copied content, Python 3.11+, curl, optional Docker. Never fill disks, generate unbounded load, capture unrelated traffic or modify host system services.

## Guided stages
Days 1-3 already supply app startup, service installation, health script and cleanup. Day 4 supplies DNS/TLS/HTTP checks. Repeat only unfinished tasks. For the optional proxy block after the image is built, ensure academy-app/academy-proxy/academy-net names are unused and ports 8080/18081 are free:
```bash
docker network create academy-net
docker run -d --rm --name academy-app --network academy-net -p 127.0.0.1:8080:8080 academy:1
docker run -d --rm --name academy-proxy --network academy-net -p 127.0.0.1:18081:8080 -v "$PWD/fixtures/networking/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:1.28-alpine
docker exec academy-proxy nginx -t
curl -i --max-time 4 http://127.0.0.1:18081/health
curl -i --max-time 4 http://127.0.0.1:18081/slow
docker logs --tail 20 academy-proxy
```
Network create isolates the two containers on a named bridge. Run starts only the named sample and proxy. The bind mount supplies a reviewed config read-only. nginx -t validates syntax. curl tests proxy paths; logs show which upstream boundary failed. The expected health is 200; `/slow` should produce 504 because the intentionally slow handler takes two seconds while the proxy read timeout is one. Image pulls need internet; no cloud account is used. Version tag is a teaching baseline, not a production security recommendation.

For a guided refusal experiment, stop only this lab's academy-app container, request `/health` through the proxy, and inspect its error log. The proxy should fail rather than receive an app response; classify the status using the log, not by memorizing a universal 502 cause. Restore the exact named app with the prior run command, then verify both direct and proxy health. No broad Docker stop/prune is permitted.

## Independent stage
Requirements: a loopback-only service, an evidence script that rejects HTTP 500, a diagram of DNS/TCP/TLS/HTTP, and a diagnosis table for refused, timeout and HTTP failure. Explain which component generated each observed error. Do not copy the guided script; write yours first. Acceptance: known health passes, HTTP error and closed port fail, and the script preserves useful exit status.

## Troubleshooting challenge
Choose I04, I31, I32 or I33 without opening solutions. Record symptom, causes, simplest test, command/output, interpretation, narrowed cause, safe correction, repeated verification and prevention. H04/H31-H33 are staged help. For host pressure use I36-I39 rather than manufacturing a full disk or memory crisis.

## Common errors and cleanup
Occupied ports: identify ownership rather than killing unrelated processes. Wrong container bind: inspect inside/outside addresses. Proxy DNS/name errors: verify both containers use academy-net. TLS: check hostname/trust/time; never make -k permanent. Cleanup only the resources created above:
```bash
docker stop academy-proxy academy-app
docker network rm academy-net
```
`--rm` removes stopped containers; keep academy:1 for Kubernetes. Complete day 2's unit cleanup inside the VM when no longer needed. Expected learning: explain the failing layer and prove recovery with the original operation, not a blind restart.