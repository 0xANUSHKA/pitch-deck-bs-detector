import React from 'react';
import Detector from './Detector';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Bullshit Detector 🔍</h1>
      <Detector />
    </div>
  );
}

export default App; 