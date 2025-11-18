Create a self-signed cert and secret

MINIKUBE_IP=$(minikube ip)
HOST="bitcoin.${MINIKUBE_IP}.nip.io"

openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout tls.key \
  -out tls.crt \
  -subj "/CN=${HOST}/O=MoneyBank"

kubectl -n devops-2025 create secret tls backend-tls \
  --cert=tls.crt --key=tls.key
