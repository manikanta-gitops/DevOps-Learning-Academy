# Day 5: VPC, ALB and environment boundaries

Resume: R01-R03/R07/R08/R53; claims C03/C06/C22. Time: 20/40/20/10. Core lab is synthetic data analysis, free and local. No AWS credentials needed.

## 1. Learning objectives
Trace a request and its return path across network and identity boundaries. Explain five environments as a resume claim requiring evidence, not five environments you must provision for practice.

## 2. Concepts
A VPC is a logically isolated network; subnets occupy availability zones. Route tables select a next hop. An internet gateway enables eligible public connectivity; a NAT gateway commonly enables private IPv4 outbound access, not unsolicited inbound traffic. Security groups are stateful allow rules; NACLs are stateless allow/deny rules that need return-path reasoning. Separate accounts improve isolation but add management cost.

## 3. How it works
Client resolves Route 53 alias -> connects to ALB listener -> rule selects target group -> healthy target receives request -> response returns. Routes, addresses, SGs and NACLs must agree. ALB IP targets reach Pod IPs; instance targets use node/NodePort routing. EC2 worker nodes are supporting EKS knowledge, not an explicit standalone service claim. A public subnet route does not itself assign a public IP.

## 4. Real-world usage
This is the foundation of the resume's networking/DNS and multi-account responsibilities. Architecture diagrams must distinguish environment, account, cluster and namespace; two namespaces do not simulate five-account isolation. Secrets and Terraform state need their own environment boundaries too.

## 5. Hands-on lab
Read incident I05 from the dossier with this local JSON inspection command:
```bash
ruby -rjson -e 'items=JSON.parse(File.read("content/troubleshooting/incidents.json")); puts JSON.pretty_generate(items.find { |item| item["id"] == "I05" })'
```
This prints synthetic observations only, not the solution. Draw subnet routes, ALB/target ports and return traffic; label the identity that configures resources separately from packet filtering. Select one evidence card, record what it rules out, then request the next. Allocate 10 minutes to the drawing, 20 to diagnosis, 10 to verification/prevention design. Cleanup: none; save your drawing privately.

## 6. Expected output
The fixture describes a successful DNS/TCP-to-ALB path and an unhealthy backend. Your output is a diagram plus a justified failed boundary, not a guessed AWS CLI response. Record whether the problem is routing, security filtering, application listener or health path; more than one can coexist.

## 7. Troubleshooting
Use symptom -> possible causes -> target health reason -> listener/port -> route/SG/NACL -> narrowed cause -> scoped proposal -> repeated health and request checks -> prevention. In an approved sandbox only, `aws elbv2 describe-target-health --target-group-arn "$LAB_TARGET_GROUP_ARN" --profile "$LAB_PROFILE" --region "$LAB_REGION"` reads health metadata. Set AWS_PAGER and verify caller identity first. Never fix this by opening all inbound traffic.

## 8. Interview preparation
Q09/Q10: explain route versus permission, stateful versus stateless, and account versus namespace isolation. Discuss availability and costs rather than asserting five clusters are always the best design.

## 9. Independent practice
Draw one alternative that keeps workloads private but serves public HTTPS. Explain management access separately. Challenge I05 -> H05 -> retry -> S05. No resource creation is required or authorized.

## 10. Revision
Reachability needs every layer, and return traffic matters. DNS is not a request proxy. ALB, NAT, EC2 and EKS cost money when provisioned. Revisit day 2: identity/configuration differs from network connectivity.