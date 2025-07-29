import React, { useState } from 'react';
import ProjectDashboard from './components/ProjectDashboard';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import SharedQueries from './components/SharedQueries';
import LoginForm from './components/LoginForm';

function App() {
  const [currentProject, setCurrentProject] = useState(null);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <div style={{ padding: '2rem' }}>
      <h1>MxChat</h1>
      {!loggedIn ? (
        <LoginForm onLoggedIn={() => setLoggedIn(true)} />
      ) : !currentProject ? (
        <ProjectDashboard onSelect={setCurrentProject} />
      ) : (
        <>
          <button onClick={() => setCurrentProject(null)}>← Back to Projects</button>
          <h2>Project: {currentProject}</h2>
          <ChatInterface project={currentProject} />
          <FileUpload />
          <SharedQueries />
        </>
      )}
    </div>
  );
}

export default App;

