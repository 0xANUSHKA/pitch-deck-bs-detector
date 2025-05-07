import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5001';

const getBullshitEmoji = (score) => {
  if (score > 75) return '💩';
  if (score > 50) return '🚩';
  if (score > 25) return '🤨';
  return '✅';
};

const getSassyMessage = (score) => {
  if (score > 75) return "Holy shit, this is pure corporate garbage!";
  if (score > 50) return "Nice try, but we can smell the BS from here.";
  if (score > 25) return "Meh, bit wanky but could be worse.";
  return "Surprisingly not complete bullshit!";
};

export default function Detector() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(API_URL, {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        console.log('Backend response:', response.data);  // Debug log
        setBackendMessage(response.data.message);
      } catch (error) {
        console.error('Backend connection error details:', error);
        setBackendMessage(
          `Failed to connect to backend: ${error.message}`
        );
      }
    };

    checkBackend();
    // Poll every 5 seconds to check backend connection
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/analyze`, { text });
      setResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
      setResult({ error: 'backend not responding 😭' });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl bg-gray-900 p-8 rounded-xl shadow-2xl text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
        Corporate Bullshit Detector
      </h1>
      
      <div className="mb-4 text-sm text-gray-400 italic text-center">
        {backendMessage === "Backend is running!" 
          ? "Ready to call out some corporate BS!" 
          : backendMessage}
      </div>

      <textarea
        className="w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-lg mb-6 font-mono text-gray-100 placeholder-gray-500"
        placeholder="Paste that corporate nonsense here... (e.g., 'We leverage synergistic blockchain solutions to disrupt paradigms')"
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button
        className="w-full py-3 bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold rounded-lg mb-6 
                   hover:from-red-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-200"
        onClick={analyze}
        disabled={loading}
      >
        {loading ? 'Analyzing this BS...' : 'Analyze This Bullshit'}
      </button>

      {result && (
        <div className="text-center">
          {result.error ? (
            <p className="text-red-500 font-bold text-xl">{result.error}</p>
          ) : (
            <div className="space-y-6">
              <div className="text-7xl font-black mb-2">
                {getBullshitEmoji(result.bullshit_percentage)}
              </div>
              
              <div className={`text-6xl font-black mb-2 ${
                result.bullshit_percentage > 75 ? 'text-red-500' :
                result.bullshit_percentage > 50 ? 'text-orange-500' :
                result.bullshit_percentage > 25 ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {result.bullshit_percentage}%
              </div>

              <div className="text-xl font-bold mb-6">
                {getSassyMessage(result.bullshit_percentage)}
              </div>

              <div className="bg-gray-800 rounded-lg p-6 text-left">
                <h3 className="text-xl font-bold mb-4 text-red-400">The Dirt:</h3>
                <ul className="space-y-3">
                  {result.reasons.map((r,i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2">🎯</span>
                      <span className="text-gray-300">{r}</span>
                    </li>
                  ))}
                </ul>

                {result.detailed_analysis && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="font-bold mb-3 text-purple-400">The Deep Dive:</h3>
                    <pre className="text-sm text-gray-400 whitespace-pre-line font-mono">
                      {result.detailed_analysis}
                    </pre>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="bg-gray-800 p-3 rounded-lg">
                  Words: {result.total_words}
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  Buzzwords: {result.buzzword_count}
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  Fillers: {result.filler_count}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}