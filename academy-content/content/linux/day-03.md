# Day 3: Bash and host failure handling

Resume: R48/R29, claim C08. Time: 20/40/20/10. macOS Bash or Ubuntu; GNU resource commands only on Ubuntu.

## 1. Learning objectives
Write a small reliable script and preserve error signals. Distinguish syntax validation from behavioral testing.

## 2. Concepts
A shell expands variables and executes commands. Quoting keeps a path with spaces as one argument. `$?` is the most recent exit status; another command overwrites it. A pipeline normally reports its last command's status, so use `pipefail` when that matches the desired contract. `set -e` has contextual exceptions; explicit error handling is easier to explain for health checks. Disk-full and inode-full are different failures.

## 3. How it works
Input endpoint -> validate scope -> run curl with deadline -> inspect status -> print a concise result -> return meaningful status. The sample captures curl's status immediately in the failure branch. `curl --fail` makes HTTP 4xx/5xx fail; without it an HTTP 500 can still be a successful transfer.

## 4. Real-world usage
CI steps use shell status to decide whether to publish a release. A script that prints an error then exits zero can promote a broken build. This is a practical prerequisite for the resume's Bash and pipeline debugging claims.

## 5. Hands-on lab
Start the shared server in terminal A. In terminal B:
```bash
bash -n fixtures/linux/health-check.sh
bash fixtures/linux/health-check.sh http://127.0.0.1:8080/health
bash fixtures/linux/health-check.sh http://127.0.0.1:8080/error
printf 'exit=%s\n' "$?"
bash fixtures/linux/health-check.sh http://127.0.0.1:8089/health
printf 'exit=%s\n' "$?"
```
`bash -n` parses without running. The other invocations exercise success, HTTP failure and connection failure. `printf` must follow the tested command immediately. Read each script line and explain why it exists. Cleanup: Ctrl+C the server; no resources were provisioned.

## 6. Expected output
Health returns JSON, `healthy` and exit 0. `/error` yields curl exit 22 and a nonzero script status. Closed loopback port normally gives curl exit 7. A timeout is generally exit 28. These meanings differ; do not normalize all failures to "server down."

## 7. Troubleshooting
I03 includes `curl ... | tee evidence.txt` without pipefail. Predict both component statuses and the aggregate status before reviewing evidence. For a slow/full host use `ps`, `free -m`, `df -h`, `df -i` and targeted service logs, not disk-filling or fork-bomb drills. Fix error propagation, repeat both success and failure tests, and prevent regression with assertions.

## 8. Interview preparation
Attempt Q05/Q06. Explain input validation, quoting, timeouts and the difference between shell and HTTP success. Mention what information you deliberately avoid logging, such as authenticated headers and environment secrets.

## 9. Independent practice
Write your own loopback-only checker with a three-second deadline and distinct success/failure messages. It must reject external URLs and exit nonzero on HTTP 500. Test against the same three endpoints without AI. Challenge I03 -> H03 -> retry -> S03; do not open the guided script while attempting the independent version.

## 10. Revision
Quote variables; capture status immediately; syntax is not behavior; transfer success is not HTTP success. Revisit permissions from day 2. Keep the tests with your script as evidence of independent work.