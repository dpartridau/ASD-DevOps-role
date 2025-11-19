# ASD DevOps Take-Home – Backend Solution

This repository contains a simple “Money Bank” backend, deployed to Kubernetes via Skaffold and Minikube.

The backend exposes a very small API:

- `GET /v1/bitcoins` – returns the current bitcoin total
- `POST /v1/bitcoins?bitcoins=<num>` – increments the bitcoin total by `<num>`
- `GET /healthz` – health check endpoint

The original implementation stored the `bitcoins` value in a process-local global variable, ran a single backend pod, and had a long readiness delay that made the app appear “slow” to start.

This solution focuses on three main improvements:

1. **Faster and more accurate startup behaviour** via proper readiness/liveness probes  
2. **Persistent and scalable state** using Redis and a Kubernetes PersistentVolumeClaim  
3. **TLS termination at the Ingress** using a self-signed certificate

---

## Architecture Overview

High-level components:

- **Backend** – Python / Flask application
  - Container image built with `python.Dockerfile` via Skaffold
  - Exposes HTTP on port 8080 inside the container
  - Uses Redis to store the `bitcoins` total

- **Redis** – key/value store for the bitcoin balance
  - Deployed as a single `Deployment` with a `Service` named `redis`
  - Uses a `PersistentVolumeClaim` for data persistence

- **Kubernetes resources** (in `k8s/`)
  - `deployment.yaml` – Backend Deployment (3 replicas, health probes, env vars)
  - `service.yaml` – Backend ClusterIP Service on port 80
  - `ingress.yaml` – NGINX Ingress, TLS-terminated, routing `/v1` to backend
  - `redis.yaml` – Redis Deployment, Service and PVC

- **Skaffold**
  - `skaffold.yaml` defines a `python` profile for building `dev.local/d22/backend`
  - Uses `kustomize` to apply manifests from `k8s/`
  - Deploys into the `devops-2025` namespace

---

## Backend Implementation

The backend is implemented in `main.py` using Flask.

Key characteristics:

- **State in Redis (not in memory)**  
  - The global `bitcoins` variable has been removed.  
  - The app now connects to Redis using:
    - `REDIS_HOST` (default: `redis`)
    - `REDIS_PORT` (default: `6379`)  
  - The total is stored under the key `bitcoins`.

- **API behaviour**

  ```http
  # Increment the balance
  POST /v1/bitcoins?bitcoins=5

  # Get the current balance
  GET /v1/bitcoins
