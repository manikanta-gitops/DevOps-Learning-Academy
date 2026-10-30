# Day 6: Build one service and Docker image

Resume: R05/R11/R29/R45-R50. Time: 20/40/20/10. Local Docker Desktop; image downloads need internet and disk space. No cloud resources.

## 1. Learning objectives
Build and run one service, explain its entrypoint, and distinguish source, artifact, image and process. Choose Python hands-on today; Java alternatives are in the secondary-tools reference, not extra required builds.

## 2. Concepts
An image is a filesystem/configuration template; a container is an isolated running process using that image. Layers support reuse and caching. Build context is the set of files available to COPY; .dockerignore reduces accidental inclusion. A volume stores data beyond the container's writable layer. EXPOSE documents a port but does not publish it. Multi-stage builds separate compilation from the final runtime; this small standard-library Python example needs no compiler stage.

## 3. How it works
Docker CLI -> daemon -> Dockerfile instructions -> image -> configured process. On macOS Linux containers run inside Docker Desktop's VM. Java normally builds a JAR with Maven or Gradle; Python here runs source with no third-party dependency. USER restricts runtime identity; CMD uses exec form so signals reach Python directly. The process must bind 0.0.0.0 inside the container for published connections.

## 4. Real-world usage
The resume describes CI publishing images to ECR and EKS pulling them. Immutable digests identify bytes; a mutable tag can point elsewhere later. Never bake credentials into ENV, build arguments or COPY layers. Runtime memory must account for the language process, not only its heap setting.

## 5. Hands-on lab
Prerequisites: Docker running, port 8080 free. From the content root:
```bash
python3 -m unittest discover -s fixtures/app -v
docker build -t academy:1 fixtures/app
docker run --rm --name academy-app -p 127.0.0.1:8080:8080 academy:1
```
Keep the last command foreground; in another terminal:
```bash
curl --fail --max-time 3 http://127.0.0.1:8080/health
docker inspect --format '{{.Config.User}} {{.State.Running}}' academy-app
docker logs --tail 10 academy-app
docker image inspect --format '{{.Id}}' academy:1
```
Tests check behavior; build creates an image; run publishes only loopback; inspect reads selected fields instead of dumping environment; logs show request evidence. Cleanup: Ctrl+C the foreground container (`--rm` removes it). Keep the image for kind. Do not use global prune commands.

## 6. Expected output
Three passing tests, a built image ID, HTTP health JSON, and `10001:10001 true` while the container runs. Logs contain JSON request status/duration. A local image ID is not necessarily a registry manifest digest; record the appropriate identity when later publishing.

## 7. Troubleshooting
I06: distinguish build failure, startup exit, wrong bind address and wrong publication. Check first failing layer, CMD, selected state and logs. A missing image in kind is not fixed by rebuilding in the host daemon alone; load it in day 8. Verify a response after the smallest fix.

## 8. Interview preparation
Q11/Q12: explain image/container, build versus runtime, non-root, cache and multi-stage purpose. Use the actual lab as evidence; do not claim you built all resume services independently.

## 9. Independent practice
Build a second image tag from a working copy, change only APP_VERSION at runtime and verify it on `/`. Explain what changed in image identity versus container configuration. Challenge I06 -> H06 -> S06 after a recorded attempt.

## 10. Revision
EXPOSE is not publish; localhost inside a container is not the Mac; tags and digests differ. Save the verified command and selected evidence, not full inspect output or secrets.