# Day 28: Service-based mock interview

Resume: R23/R28/R55; claims C08/C10/C16. Time: 20/40/20/10. No scores until an answer/task is attempted.

## 1. Learning objectives
Explain fundamentals concisely and diagnose one operational failure independently. Identify actual weaknesses rather than a self-reported confidence number.

## 2. Concepts
A good answer defines the term, explains its use, gives a truthful example and describes verification. Breadth does not replace evidence. A clarification question about environment or impact is useful engineering behavior, not a failure to memorize.

## 3. How it works
Choose a question -> answer aloud -> identify expected points -> score first attempt -> take one hint -> retry -> record assisted score separately. For the practical task use symptom/hypothesis/check/result/fix/verification. Avoid opening model answers before the attempt.

## 4. Real-world usage
Service-based interviews vary. This mock prioritizes the resume's Linux/Kubernetes/CI operations rather than claiming exact company question frequency. Professional experience still needs truthful role attribution.

## 5. Hands-on lab
Choose one prior incomplete lab, not a new stack. Before running it verify the local context:
```bash
kubectl --context kind-academy cluster-info
python3 -m unittest discover -s fixtures/app -v
```
Use only the command relevant to the selected task; cluster absence is not a reason to provision a cloud cluster. Repeat the task for 40 minutes with no AI-generated implementation. The interviewer may supply the I28 fixture instead. Record command purpose and output interpretation. Cleanup: restore the previous local baseline and stop any foreground processes.

## 6. Expected output
A verified artifact or a documented blocker, not automatic completion. Timed questions should produce explanations and reasoning, not command recitation. Scores stay blank for unattempted questions.

## 7. Troubleshooting
I28 provides an unfamiliar error on a familiar path. Establish what still works, choose the simplest layer check and distinguish signals from assumptions. Correct the bounded lab issue, repeat the original request and propose a regression check. If blocked by missing tools, log the blocker and use a fixture without calling it a live fix.

## 8. Interview preparation
Start Q55, then Q56 only after finishing the first response/review. Use the README's /10 rubric; mark self-assessment as such. Add one follow-up from the relevant answer reference, not 15 rushed questions.

## 9. Independent practice
Explain the task again in two minutes without notes. Do not read H28 until you have written the first hypothesis and test; retry before S28. Choose one weak topic for next-session revision.

## 10. Revision
Record first attempt, hint used, retry and next action. Revisit day 25's handoff evidence. No interview score can substitute for hands-on verification.