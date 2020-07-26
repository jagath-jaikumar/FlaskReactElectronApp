from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)

@app.route("/hello")
def hello_route():
    return jsonify({"message":"hello world"})


@app.route("/parse_dict", methods=['POST'])
@cross_origin(origin='localhost', headers=['Access-Control-Allow_Origin'])
def parse_dict_route():
    data = json.loads(request.data.decode('utf-8'))
    print(data)
    return jsonify({"message":"success"})

if __name__ == "__main__":
    app.run(debug=True)
