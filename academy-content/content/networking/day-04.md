# Day 4: DNS, TCP, TLS and HTTP

Resume: R07/R08/R18/R55; supporting Nginx/network knowledge S02. Time: 20/40/20/10. macOS or Ubuntu, loopback HTTP; example.com probes contact public infrastructure.

## 1. Learning objectives
Locate a failure at the correct layer before proposing a fix. Explain a reverse proxy without confusing DNS with traffic forwarding.

## 2. Concepts
DNS translates a name into records. TCP establishes a connection to an address/port. TLS authenticates the server and encrypts bytes; the client checks trust and hostname. HTTP gives requests/statuses meaning. NXDOMAIN is a DNS answer, connection refused is a TCP symptom, and HTTP 502 proves some HTTP-speaking component responded. Nginx is a supporting proxy example, not a resume ownership claim.

## 3. How it works
Resolver -> TCP handshake -> TLS negotiation/certificate check -> HTTP request -> proxy -> upstream. A reverse proxy forwards requests and can terminate TLS. Connect timeout and upstream read timeout occur at different boundaries. Routing and firewall rules affect packet reachability; a certificate change cannot repair a missing route.

## 4. Real-world usage
ALB, Ingress and application failures cross these layers. A proxy may return 502 after an upstream refusal, or 504 after a configured upstream deadline. Those are examples, not exhaustive definitions. A service can answer `/health` while `/slow` violates the proxy deadline.

## 5. Hands-on lab
Prerequisites: curl, a DNS utility and OpenSSL. Run the sample server in terminal A. In B:
```bash
dig example.com A
nslookup example.com
curl -i --max-time 3 http://127.0.0.1:8080/health
curl -i --max-time 3 http://127.0.0.1:8089/health
curl -i --max-time 1 http://127.0.0.1:8080/slow
curl -I --max-time 5 https://example.com
openssl s_client -connect example.com:443 -servername example.com -verify_return_error </dev/null
```
DNS tools query records; curl shows request/status boundaries and enforces a deadline; `-I` uses HEAD, which the training Python handler does not implement, so use it only on the public example here. `s_client` exposes the chain and verification result; hostname checking is also required, and curl performs it normally. A successful chain check alone is not hostname verification. Cleanup: Ctrl+C the local server.

## 6. Expected output
DNS answers vary; local health is HTTP 200, closed port is a connection error, `/slow` times out at one second, and HTTPS reports a valid response if your network permits it. Public egress may be blocked; that is a limitation to record, not evidence that the site is down.

## 7. Troubleshooting
Investigate I04 (DNS), I31 (TLS), I32 (502), I33 (504). First compare hostname, resolved IP, port and exact error; then query DNS, check listener, inspect certificate/time/name and proxy error logs. `curl --resolve example.com:443:APPROVED_TEST_IP https://example.com` is a diagnostic pattern preserving SNI/hostname, not a command with a supplied real target. Do not use `-k` as a fix. On Ubuntu, `ss -lnt` is preferred to legacy netstat; `traceroute` may encounter filtered hops, and packet capture requires approval and redaction.

## 8. Interview preparation
Q07/Q08 ask for layer-by-layer reasoning. Explain why TLS can fail after TCP succeeds, and why DNS caching/TTL makes a record change differ from instant recovery.

## 9. Independent practice
For three observed errors, write the last successful layer and next discriminating check without asking AI. Challenge: use the supplied proxy errors in I32/I33. H04/H31-H33 give hints; the solution book explains verification after your attempt. Project 1 later runs actual local Nginx faults using the image from day 6.

## 10. Revision
DNS answers; TCP connects; TLS authenticates/encrypts; HTTP reports application/proxy behavior. Keep the deployment path separate. Revisit shell failure handling and preserve curl's status.