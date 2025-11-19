## Frontend Solution

The frontend is a small React / Vite single-page application that:

- Displays the current bitcoin total
- Allows the user to “bank” additional bitcoins
- Talks to the backend over HTTPS using the same host and TLS configuration

It is built into static assets and served by NGINX inside a container. The container is deployed to Kubernetes and exposed via an Ingress on the same host as the backend.

---

### Implementation Overview

**Tech stack**

- React 18 + TypeScript
- Vite for bundling
- NGINX (serving `/var/www/html`)
- Kubernetes Deployment + Service + Ingress
- Skaffold for build and deploy

**Key files**

- `src/App.tsx` – main UI and API integration
- `src/main.tsx` – React entry point
- `Dockerfile` – multi-stage Node (build) + NGINX (runtime)
- `nginx.conf` – static file serving and `/healthz` endpoint
- `k8s/deployment.yaml` – frontend Deployment
- `k8s/service.yaml` – frontend Service
- `k8s/ingress.yaml` – frontend Ingress

---

### React Application Behaviour

The React app mounts into `#root` in `index.html` and uses a very simple state model:

- `GET /v1/bitcoins` to fetch the current total (on initial load and on “Refresh”)
- `POST /v1/bitcoins?bitcoins=<N>` to add `N` bitcoins to the total

The API base path is configured as a **relative path**:

```ts
const API_BASE = '/v1';
