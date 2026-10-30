# Day 1: Linux process and resource evidence

Resume: R23, R48, R55; prerequisites S01/S10. Time: 20/40/20/10 minutes. Environment: dedicated Ubuntu VM; inspection only. No cloud cost.

## 1. Learning objectives
Distinguish a process, a service, a listener and a healthy endpoint. Collect evidence before restarting anything. If VM setup takes 40 minutes, stop and carry this lesson forward.

## 2. Concepts
Linux's kernel manages CPU, memory, devices and permissions; programs run in user space. A process is a running program with a PID. A service is a managed background activity. CPU percentage measures work; load also includes tasks waiting for uninterruptible I/O. Available memory is more useful than treating all cache as waste. Disk blocks store bytes; inodes represent files. A system can run out of either.

## 3. How it works
Client -> TCP listener -> process -> handler -> response. The scheduler shares CPU time; virtual memory maps process address space; filesystem metadata locates file data. A process can exist while not listening, listening on the wrong address, or failing requests. Use each observation to test a different boundary.

## 4. Real-world usage
The resume's Kubernetes and production diagnostics rest on host evidence. An OOM event, CPU throttling and disk exhaustion need different remedies. A simple example is a healthy Python PID on port 8080 that cannot be reached because the client uses port 8089. Later Kubernetes namespaces/cgroups add isolation and resource accounting; they do not remove the need for host reasoning.

## 5. Hands-on lab
Prerequisite: copy this content folder into the VM and open its root directory. In terminal A, start the sample; leave it foreground:
```bash
python3 fixtures/app/server.py
```
In terminal B, on Ubuntu:
```bash
uname -s
ps -eo pid,ppid,comm,%cpu,%mem --sort=-%cpu
uptime
free -m
df -h .
df -i .
ss -lnt
curl --fail --max-time 3 http://127.0.0.1:8080/health
```
`uname` identifies the OS; `ps` lists process identity and sampled resource use; `uptime` reports load; `free` reports memory; the two `df` forms show blocks and inodes; `ss` shows TCP listeners; curl makes a real HTTP request and fails on HTTP errors. Record the PID, listener address, available memory and response. These commands do not change resource limits. Cleanup: Ctrl+C in terminal A only.

## 6. Expected output
`Linux`, a Python process row, `LISTEN ... 127.0.0.1:8080`, and `{"status": "alive"}` are expected. Exact PIDs and memory numbers vary. `df -h` with free space does not prove inodes are available. Compare observations, not guessed universal percentage thresholds.

## 7. Troubleshooting
Use incident I01. Symptom -> competing CPU/memory/disk/I/O causes -> simplest process/listener check -> resource checks -> interpret evidence -> isolate the boundary -> propose the smallest safe change -> repeat the failed request -> prevent recurrence. `Address already in use` means another listener owns 8080; inspect it, do not kill an unknown process. An HTTP response proves more than a PID but less than full dependency health.

## 8. Interview preparation
Attempt Q01 and Q02 before opening the answer reference. Explain what every command proves and what it cannot prove. Never say "Linux was slow, so I restarted it" without a hypothesis and pre/post evidence.

## 9. Independent practice
Without AI, build a four-row table for process, listener, resource pressure and HTTP behavior. Each row needs an observation, interpretation and one alternative explanation. Challenge: I01 presents a running process and a failed request. Write your first check before opening H01; the resolution is separate as S01.

## 10. Revision
Say PID, listener, load, available memory, blocks and inodes in plain English. Re-run the successful request before cleanup. Save only sanitized evidence, with status "attempted" until verified. Tomorrow revisit the weakest explanation.