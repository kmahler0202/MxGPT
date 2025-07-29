import React, { useEffect, useState } from 'react';
import { getProjects, createProject } from '../api';

export default function ProjectDashboard({ onSelect }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    getProjects().then(res => {
      setProjects(res.data.projects || []);
    });
  }, []);

  const handleCreate = () => {
    createProject(name).then(() => {
      setProjects(prev => [...prev, name]);
      setName('');
    });
  };

  return (
    <div>
      <h2>Projects</h2>
      {projects.map(p => (
        <button key={p} onClick={() => onSelect(p)}>{p}</button>
      ))}
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="New project name"
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
