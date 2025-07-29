import React, { useState } from 'react';
import { sendQuery } from '../api';

export default function ChatInterface() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    const res = await sendQuery(prompt);
    setResponse(res.data);
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
      <button onClick={handleSend}>Send</button>
      <pre>{response}</pre>
    </div>
  );
}
