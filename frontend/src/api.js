import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // Flask backend

export const createProject = (name) =>
  axios.post(`${API_BASE}/create_project`, { name });

export const getProjects = () =>
  axios.get(`${API_BASE}/get_projects`);

export const sendQuery = (prompt) =>
  axios.post(`${API_BASE}/query`, { prompt });
