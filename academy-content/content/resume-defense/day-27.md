# Day 27: Resume defense, Entra ID and access

Resume: R40-R42/R51-R56; claims C01-C24. Time: 20/40/20/10. Fictional access request and private evidence ledger; no tenant changes.

## 1. Learning objectives
Explain actual contributions without inventing employment. Separate identity, application assignment, provisioning and product-specific permissions.

## 2. Concepts
Entra ID manages identities and application access. Azure Portal is an administration interface; Azure resource RBAC does not automatically grant GitHub or Datadog roles. SSO proves identity; provisioning can synchronize accounts/groups when configured; the target product still enforces its authorization. A privileged request needs scope, approver, duration and audit/revocation evidence. SAML, SCIM or PIM use at work is not established by the audit.

## 3. How it works
Request -> identity/tenant validation -> approved application assignment/group -> configured product provisioning/role mapping -> test permitted and forbidden behavior -> expiry/review -> revoke and verify. Role names differ between products; translate intent into each product's actual scope rather than assuming one global admin role.

## 4. Real-world usage
The resume claims GitHub/Datadog access management, architecture discussions, documentation and coordination. Clarify what you approved, executed, supported or only observed. An account login is not evidence that you configured the identity integration.

## 5. Hands-on lab
Inspect the fictional request:
```bash
python3 -m json.tool fixtures/access/request.json
```
This formats local sample data; it makes no tenant request. Build a matrix for requester, application, requested role, minimum necessary role, approver, expiry, verification and revocation. Reject unnecessary administrator access with a scoped alternative. Then fill the blank contribution record in `content/resume-defense/defense.md` using only your real history and actual lab evidence. Keep private details outside tracked course files. Cleanup: no access was granted; do not invent an audit-log result.

## 6. Expected output
A least-privilege review and an evidence ledger with honest unconfirmed/observed/supported/lab distinctions. Missing evidence remains missing. Do not turn a completed local exercise into a past employment claim.

## 7. Troubleshooting
I27: successful SSO with denied product action suggests authorization/scope/provisioning questions, not necessarily a bad password. Check tenant, assignment, role mapping, membership synchronization/session refresh and product audit trail in an authorized environment. Never fix all access problems by granting global admin. Verify allowed and denied actions and expiry/revocation.

## 8. Interview preparation
Q53/Q54: actual responsibility and auth versus authorization. Use requirement -> architecture -> your role -> tools -> implementation -> verification -> possible failures -> diagnosis -> improvement. State remaining uncertainty clearly.

## 9. Independent practice
Write two truthful 90-second explanations from your evidence. Review a privileged request without AI and propose a minimum scope. Challenge I27 -> H27 -> S27. Employment-role/date clarification remains pending; do not rehearse an unsupported tenure claim.

## 10. Revision
Supported is not owned; observed is not implemented. Revisit day 24's evidence standards. A good runbook and ticket demonstrate skill without exposing employer data.