
from flask import Flask, render_template, request, jsonify
from checker import analyze_password
from breach import check_password_breach
from generator import generate_password, generate_passphrase

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or {}
    password = data.get("password", "")

    if not isinstance(password, str):
        return jsonify({"error": "Invalid password input"}), 400

    if len(password) > 256:
        return jsonify({"error": "Password is too long"}), 400

    try:
        result = analyze_password(password)
        return jsonify(result)
    except Exception:
        app.logger.exception("Password analysis failed")
        return jsonify({"error": "Analysis failed"}), 500


@app.route("/api/breach", methods=["POST"])
def breach():
    data = request.get_json(silent=True) or {}
    password = data.get("password", "")

    if not isinstance(password, str):
        return jsonify({"error": "Invalid password input"}), 400

    if len(password) > 256:
        return jsonify({"error": "Password is too long"}), 400

    result = check_password_breach(password)
    status = 200 if result["checked"] else 503

    return jsonify(result), status


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}
    mode = data.get("mode", "password")

    try:
        if mode == "password":
            length = data.get("length", 16)

            if type(length) is not int:
                return jsonify({"error": "Length must be an integer"}), 400

            password = generate_password(length)
        elif mode == "passphrase":
            word_count = data.get("word_count", 4)

            if type(word_count) is not int:
                return jsonify({"error": "Word count must be an integer"}), 400

            password = generate_passphrase(word_count)
        else:
            return jsonify({"error": "Unknown generation mode"}), 400

        return jsonify({"password": password})

    except (TypeError, ValueError) as error:
        return jsonify({"error": str(error)}), 400


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)