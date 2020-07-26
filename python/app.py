from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/hello")
def hello_route():
    return jsonify({"message":"hello world"})

if __name__ == "__main__":
    app.run()
