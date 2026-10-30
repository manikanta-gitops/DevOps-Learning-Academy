# Day 26: Integrated incident investigation

Resume: R02-R04/R07/R08/R18-R23/R34-R39/R44/R55. Time: 20/40/20/10. Synthetic layered incident or the dedicated local training app.

## 1. Learning objectives
Build and falsify hypotheses, choose high-information checks, and verify recovery without broad restarts or unsafe privilege changes.

## 2. Concepts
A symptom is what users observe; a cause is an explanation supported by evidence. Correlated changes are clues, not proof. Blast radius is the set of affected users/resources. Mitigation reduces harm; root-cause repair addresses the underlying defect. Prevention must be specific and testable.

## 3. How it works
Record impact/time -> locate failing layer -> compare competing causes -> choose a check -> interpret result -> narrow cause -> propose scoped action -> verify request and telemetry -> document prevention. Treat log, trace, rollout, network and security evidence as different sources. An unrelated Snyk finding is not automatically the cause of an availability incident.

## 4. Real-world usage
The resume claims production diagnosis and applied fixes. This exercise builds the skill without asserting that you performed the historical work. A clear escalation with evidence is better than an unauthorized production change.

## 5. Hands-on lab
```bash
ruby -rjson -e 'puts JSON.pretty_generate(JSON.parse(File.read("content/troubleshooting/incidents.json")).find { |item| item["id"] == "I26" })'
```
Read only the symptom first. Select evidence cards in order, writing a hypothesis and expected discriminating result before each. In a local workload variant, use explicit-context `get`, `describe`, logs and an HTTP check from earlier days. Allocate 5 minutes impact, 20 investigation, 10 safe recovery proposal and 5 verification/prevention. Cleanup: restore only deliberately changed lab settings; do not leave a broken baseline.

## 6. Expected output
A timeline, at least two considered causes, evidence narrowing to one, a scoped action and a recovery check. Fixture evidence is synthetic; it does not prove a real service recovered. Do not mark the incident complete simply because the model solution sounds familiar.

## 7. Troubleshooting
I26 deliberately separates control-plane sync from unhealthy application behavior. Start with impact/response and backend readiness, compare release/config changes, then correlate traces/logs. Stop if target identity or permission is uncertain. After an approved lab correction, compare the same failed request and relevant signals over a stated window.

## 8. Interview preparation
Q51/Q52: "What would you inspect first?" and "How would you prove the fix worked?" Answer with a check that can disprove your initial theory. Do not tell a training scenario as a real production anecdote.

## 9. Independent practice
Complete I26 without opening hints for the first 10 minutes. Record a reasonable dead end and what changed your view. Then H26 -> retry -> S26. Write a short Slack-style update with impact, action, uncertainty and next update point.

## 10. Revision
No evidence, no root-cause claim. Include an owner and test for every prevention action. Revisit monitor scope and alert delivery from day 23.