import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // Flask backend

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const register = (username, password) =>
  axios.post(`${API_BASE}/register`, { username, password });

export const login = (username, password) =>
  axios.post(`${API_BASE}/login`, { username, password });

export const createProject = (name) =>
  axios.post(`${API_BASE}/create_project`, { name }, { headers: authHeaders() });

export const getProjects = () =>
  axios.get(`${API_BASE}/get_projects`, { headers: authHeaders() });

export const shareProject = (project, user) =>
  axios.post(`${API_BASE}/share_project`, { project, user }, { headers: authHeaders() });

export const sendQuery = (prompt, project, includeFiles) =>
  axios.post(
    `${API_BASE}/query`,
    { prompt, project, include_files: includeFiles },
    { headers: authHeaders() }
  );
