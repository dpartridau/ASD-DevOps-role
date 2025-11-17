from flask import Flask
from flask import request

app = Flask(__name__)

bitcoins = 0


@app.route("/healthz")
def health():
    return "OK"


@app.route("/v1/bitcoins", methods=["POST"])
def set_bitcoins():
    global bitcoins

    num = request.args.get("bitcoins")

    print(f"banking {num} bitcoins")
    bitcoins = bitcoins + int(num)
    print(f"total bitcoins: {bitcoins}")

    # return a 204
    return "", 204


@app.route("/v1/bitcoins", methods=["GET"])
def get_bitcoins():
    global bitcoins

    return str(bitcoins)
