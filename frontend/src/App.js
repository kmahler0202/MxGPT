import React, { useState } from 'react';
import ProjectDashboard from './components/ProjectDashboard';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import SharedQueries from './components/SharedQueries';

function App() {
  const [currentProject, setCurrentProject] = useState(null);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>MxChat</h1>
      {!currentProject ? (
        <ProjectDashboard onSelect={setCurrentProject} />
      ) : (
        <>
          <button onClick={() => setCurrentProject(null)}>← Back to Projects</button>
          <h2>Project: {currentProject}</h2>
          <ChatInterface />
          <FileUpload />
          <SharedQueries />
        </>
      )}
    </div>
  );
}

export default App;

