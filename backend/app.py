from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
from api.open_ai import query as openai_query
import json
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx', 'py', 'js', 'html', 'css', 'json', 'xml', 'csv', 'md'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Store projects and their files in memory (in production, use a database)
projects_data = {
    "Alpha": {"files": []},
    "Beta": {"files": []},
    "Gamma": {"files": []}
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def read_file_content(filepath):
    """Read file content based on file type"""
    try:
        file_ext = filepath.suffix.lower()
        
        if file_ext in ['.txt', '.py', '.js', '.html', '.css', '.json', '.xml', '.csv', '.md']:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        elif file_ext == '.pdf':
            # For PDF files, you might want to use PyPDF2 or similar
            return "[PDF file - content extraction not implemented yet]"
        elif file_ext in ['.doc', '.docx']:
            # For Word files, you might want to use python-docx
            return "[Word document - content extraction not implemented yet]"
        else:
            return "[Unsupported file type]"
    except Exception as e:
        return f"[Error reading file: {str(e)}]"

@app.route('/')
def index():
    return jsonify(message='MxChat is Running...')

@app.route('/create_project', methods=['POST'])
def create_project():
    try:
        data = request.get_json()
        project_name = data.get("name", "Unnamed Project").strip()
        
        if not project_name:
            return jsonify(error="Project name cannot be empty"), 400
            
        if project_name in projects_data:
            return jsonify(error="Project already exists"), 400
            
        projects_data[project_name] = {"files": []}
        return jsonify(status="ok", message=f"Created project: {project_name}")
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/get_projects', methods=['GET'])
def get_projects():
    try:
        return jsonify(projects=list(projects_data.keys()))
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/upload_file', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify(error='No file provided'), 400
            
        file = request.files['file']
        project_name = request.form.get('project')
        
        if not project_name or project_name not in projects_data:
            return jsonify(error='Invalid project'), 400
            
        if file.filename == '':
            return jsonify(error='No file selected'), 400
            
        if not allowed_file(file.filename):
            return jsonify(error=f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'), 400
            
        # Create project-specific directory
        project_dir = os.path.join(UPLOAD_FOLDER, secure_filename(project_name))
        os.makedirs(project_dir, exist_ok=True)
        
        # Save file
        filename = secure_filename(file.filename)
        filepath = os.path.join(project_dir, filename)
        file.save(filepath)
        
        # Store file info
        file_info = {
            'filename': filename,
            'filepath': filepath,
            'size': os.path.getsize(filepath)
        }
        
        projects_data[project_name]['files'].append(file_info)
        
        return jsonify(
            status='ok', 
            message=f'File {filename} uploaded successfully',
            file_info=file_info
        )
        
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/get_project_files/<project_name>', methods=['GET'])
def get_project_files(project_name):
    try:
        if project_name not in projects_data:
            return jsonify(error='Project not found'), 404
            
        return jsonify(files=projects_data[project_name]['files'])
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/query', methods=['POST'])
def query():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "").strip()
        project_name = data.get("project", "")
        include_files = data.get("include_files", False)
        
        if not prompt:
            return jsonify(error="Query cannot be empty"), 400
            
        # Build context from uploaded files if requested
        context = ""
        if include_files and project_name and project_name in projects_data:
            files = projects_data[project_name]['files']
            if files:
                context = "\n\n=== UPLOADED FILES CONTEXT ===\n"
                for file_info in files:
                    filepath = Path(file_info['filepath'])
                    content = read_file_content(filepath)
                    context += f"\n--- File: {file_info['filename']} ---\n{content}\n"
                context += "\n=== END CONTEXT ===\n\n"
        
        # Combine context with user prompt
        full_prompt = context + prompt if context else prompt
        
        # Query OpenAI
        response = openai_query(full_prompt)
        
        return jsonify(
            response=response,
            files_included=len(projects_data.get(project_name, {}).get('files', [])) if include_files else 0
        )
        
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
