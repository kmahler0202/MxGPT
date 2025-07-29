from flask import Flask, request, jsonify
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify(message='MxChat is Running...')

@app.route('/create_project', methods=['POST'])
def create_project():
    data = request.get_json()
    project_name = data.get("name", "Unnamed Project")
    return jsonify(status="ok", message=f"Created project: {project_name}")

@app.route('/get_projects', methods=['GET'])
def get_projects():
    # For now just return dummy list
    return jsonify(projects=["Alpha", "Beta", "Gamma"])

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    prompt = data.get("prompt", "")
    return jsonify(response=f"Fake GPT response to: {prompt}")

if __name__ == '__main__':
    app.run(debug=True)
