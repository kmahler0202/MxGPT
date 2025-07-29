import React, { useState } from 'react';
import { sendQuery } from '../api';

export default function ChatInterface({ project }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [includeFiles, setIncludeFiles] = useState(false);

  const handleSend = async () => {
    const res = await sendQuery(prompt, project, includeFiles);
    setResponse(res.data.response || res.data);
  };

  return (
    <div>
      <h2>GPT Chat</h2>
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        rows={4}
        cols={60}
        placeholder="Ask GPT something..."
      />
      <br />
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeFiles}
            onChange={e => setIncludeFiles(e.target.checked)}
          />
          Include project files
        </label>
      </div>
      <button onClick={handleSend}>Send</button>
      <pre>{response}</pre>
    </div>
  );
}
