import React, { useEffect, useState } from 'react';
import { getProjects, createProject, shareProject } from '../api';

export default function ProjectDashboard({ onSelect }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [shareUser, setShareUser] = useState('');

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

  const handleShare = (p) => {
    shareProject(p, shareUser).then(() => setShareUser(''));
  };

  return (
    <div>
      <h2>Projects</h2>
      {projects.map(p => (
        <div key={p} style={{ marginBottom: '0.5rem' }}>
          <button onClick={() => onSelect(p)}>{p}</button>
          <input
            style={{ marginLeft: '0.5rem' }}
            placeholder="Share with user"
            value={shareUser}
            onChange={e => setShareUser(e.target.value)}
          />
          <button onClick={() => handleShare(p)}>Share</button>
        </div>
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
