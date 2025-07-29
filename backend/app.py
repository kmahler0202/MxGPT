from flask import Flask, request, jsonify
import os
from flask_cors import flask_cors
import base64, requests, jsonify
from flask import current_app

app = Flask(__name__)

@app.route('/')
def index():
    return 'MxChat is Running...'

@app.route('/create_project', methods=['POST'])
def create_project():
    return 'Creating Project...'

@app.route('/get_projects', methods['GET'])
def get_projects():
    return 'Getting Projects'

@app.route('/query', methods['POST'])
def query():
    return 'Sending GPT Query'