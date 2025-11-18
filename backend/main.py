import os
import redis
from flask import Flask, request, jsonify

app = Flask(__name__)

# Redis connection – host/port from env, with sensible defaults
redis_client = redis.Redis(
    host=os.environ.get("REDIS_HOST", "redis"),
    port=int(os.environ.get("REDIS_PORT", "6379")),
    db=0,
)

BITCOIN_KEY = "bitcoins"


def get_bitcoins_value() -> int:
    value = redis_client.get(BITCOIN_KEY)
    if value is None:
        return 0
    return int(value)


@app.route("/healthz")
def health():
    """
    Health endpoint used by readiness/liveness probes.
    We also ping Redis so the pod only goes Ready when
    the backing store is available.
    """
    try:
        redis_client.ping()
        return "OK", 200
    except redis.exceptions.RedisError:
        return "Redis unavailable", 503


@app.route("/v1/bitcoins", methods=["POST"])
def set_bitcoins():
    """
    Accepts ?bitcoins=<num> as a query parameter, just like your original code.
    Instead of using a global, we increment the value stored in Redis.
    """
    num = request.args.get("bitcoins")
    if num is None:
        return jsonify({"error": "missing 'bitcoins' query parameter"}), 400

    try:
        delta = int(num)
    except ValueError:
        return jsonify({"error": "'bitcoins' must be an integer"}), 400

    current = get_bitcoins_value()
    new_value = current + delta

    redis_client.set(BITCOIN_KEY, new_value)
    print(f"banking {delta} bitcoins")
    print(f"total bitcoins: {new_value}")

    # Keep the 204 behaviour
    return "", 204


@app.route("/v1/bitcoins", methods=["GET"])
def get_bitcoins():
    """
    Returns the total as a simple string, same as before.
    """
    value = get_bitcoins_value()
    return str(value), 200
