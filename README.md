# DevOps Take Home Assignment

Below is a take-home assignment before the interview for the position.

## Situation

Money Bank Inc. recently discovered that Cryptocurrency is a thing and wants to take advantage of Cloud-native practices to build a system for collecting Bitcoins.
As the DevOps Engineer on the project, your task is to deploy and improve the prototype.

Testers have noticed the following issues:

* The application takes a very long time to start even though the developer team says that it starts almost instantly.
* If the application restarts, we lose all our Bitcoins.
* Firefox and Chrome both show a warning saying that the site is insecure.

Your objectives are:

* Resolve the slow startup issue.
* Store the `bitcoins` counter in any database (e.g. PostgreSQL, Redis) and increase the number of backend replicas **above 1**.
* Make the application accessible using TLS (you can self-sign a certificate).

### Tips

* We are looking for the most Cloud-native design *within reason*. If the best solution takes too much time, take note of what you would have done and go with a simpler solution that works.
* If you can't complete the tasks, think about how you would. **Allowing the interviewer to understand your thought process is more important than completing the assignment.**


## Prerequisites

* [Docker](https://docs.docker.com/engine/install/)
* [Minikube](https://minikube.sigs.k8s.io/docs/start/)
* [Kubectl](https://kubernetes.io/docs/tasks/tools/)
* [Skaffold](https://skaffold.dev/docs/install/#standalone-binary)

### Starting Minikube

```shell
minikube start --driver=docker
minikube addons enable ingress
kubectl create namespace devops-2025

minikube ip # usually outputs 192.168.49.2
```

If `minikube ip` outputs a different result, make sure to edit [`backend/k8s/ingress.yaml`](backend/k8s/ingress.yaml) and [`frontend/k8s/ingress.yaml`](frontend/k8s/ingress.yaml) to contain the actual IP.

### Starting the backend

Since a bulk of the work will take place here, the backend is written in multiple languages.
Choose the one you are most comfortable with.

#### Go

```shell
cd backend/
skaffold run
```

#### Python

```shell
cd backend/
skaffold run -p python
```

#### Java

```shell
cd backend/
skaffold run -p java
```

### Starting the frontend

```shell
cd frontend/
skaffold run
```

After a minute or two, the application should be accessible via your web browser at [`http://bitcoin.192.168.49.2.nip.io`](http://bitcoin.192.168.49.2.nip.io).
