import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log('index.tsx: Starting React app...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('index.tsx: Root element not found!');
  throw new Error("Could not find root element to mount to");
}

console.log('index.tsx: Root element found, creating root...');
const root = createRoot(rootElement);

console.log('index.tsx: Rendering App component...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
console.log('index.tsx: App component rendered');
