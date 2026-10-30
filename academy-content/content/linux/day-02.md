# Day 2: Permissions and systemd

Resume: R48, R55; claims C08/C16. Time: 20/40/20/10. Ubuntu VM only. Local system configuration changes, never macOS or a work host.

## 1. Learning objectives
Explain why the same command behaves differently under another user or service manager. Read a unit and journal before changing permissions.

## 2. Concepts
Owner/group/other permission bits control access. A directory needs execute permission to traverse its name; file read permission alone is insufficient. systemd starts a process with a declared user, executable, directory and environment. Exit status zero means success by that program's contract, not universal application health.

## 3. How it works
systemd loads the unit -> resolves dependencies -> switches user/group -> enters WorkingDirectory -> executes ExecStart -> collects logs -> applies Restart policy. This solves repeatable service startup instead of relying on an interactive shell. `After` orders startup but does not prove a network dependency is ready. `Restart=on-failure` does not cure a bad path.

## 4. Real-world usage
A CI runner, container or system service often lacks your shell's environment and permissions. This supports truthful diagnosis of the resume's build and workload failures. The supplied unit uses Ubuntu's `nobody:nogroup` for a disposable example; a real service normally gets its own managed identity.

## 5. Hands-on lab
Prerequisites: day 1 sample, dedicated VM, permission to administer it, port 8080 free. Read the supplied unit first. Run these yourself inside that VM only; sudo may prompt locally:
```bash
sudo install -d -m 755 /opt/academy
sudo install -m 644 fixtures/app/server.py /opt/academy/server.py
sudo install -m 644 fixtures/linux/academy.service /etc/systemd/system/academy.service
sudo systemctl daemon-reload
sudo systemctl start academy.service
systemctl status academy.service --no-pager
systemctl cat academy.service
journalctl -u academy.service -n 30 --no-pager
curl --fail --max-time 3 http://127.0.0.1:8080/health
```
`install` creates only the named lab directory/file with explicit modes. `daemon-reload` rereads units; `start` runs this lab unit; status/cat/journal inspect its state and source. No enable-at-boot is needed. Verify HTTP, not merely `active`. Cleanup after saving evidence:
```bash
sudo systemctl stop academy.service
sudo rm /etc/systemd/system/academy.service
sudo systemctl daemon-reload
sudo rm /opt/academy/server.py
sudo rmdir /opt/academy
```
Remove these paths only if this lesson created them. Do not remove pre-existing content.

## 6. Expected output
`Active: active (running)` plus a successful health JSON. Failure codes such as `203/EXEC` point toward executable/path permissions; application errors can instead give an ordinary nonzero process exit. Do not assume one status code identifies every cause.

## 7. Troubleshooting
I02 supplies a permission failure. Inspect `id`, `ls -ld /opt /opt/academy`, `ls -l /opt/academy/server.py`, the unit user and journal. On Ubuntu `namei -l /opt/academy/server.py` shows each path component. Narrow file, directory, executable and working-directory causes before changing one. Verify under the service identity and repeat HTTP. Avoid chmod 777, root-as-a-fix and printing environment secrets.

## 8. Interview preparation
Q03/Q04 ask about execution context and service state. A strong answer identifies the unit user, path, working directory, environment and evidence source, then proposes a scoped correction and verification.

## 9. Independent practice
Write a unit for port 8082 using the existing app and an explicit APP_PORT; explain every field without copying the complete guided unit. Challenge: diagnose I02's supplied unit/journal. Attempt -> H02 -> retry -> S02. Do not intentionally change permissions on a shared system.

## 10. Revision
Directory execute means traversal; reload is not restart; active is not ready. Record the exact cause and permission boundary, then revisit day 1 evidence limits.