'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) throw new Error('Query failed');

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.answer };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Query error:', error);
      alert('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      setUploadedFiles(prev => [...prev, file.name]);
      setUploadVisible(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col h-screen max-h-screen">
          {/* Header with title and upload button */}
          <div className="flex items-center justify-between pb-4 border-b">
            <h1 className="text-2xl font-bold">StudyBuddy</h1>
            <button
              onClick={() => setUploadVisible(!uploadVisible)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload PDF
            </button>
          </div>

          {/* Upload area */}
          {uploadVisible && (
            <div className="border-2 border-dashed rounded-lg p-6 my-4 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer block"
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drop your PDF here or click to browse
                </p>
              </label>
            </div>
          )}

          {/* Uploaded files list */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Uploaded PDFs:</h3>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((fileName, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {fileName}
                    <button
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 ml-auto max-w-[80%]'
                    : 'bg-gray-100 max-w-[80%]'
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-100 p-4 rounded-lg max-w-[80%]">
                Thinking...
              </div>
            )}
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="pt-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}