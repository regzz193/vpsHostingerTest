import React from 'react';
import ReactDOM from 'react-dom/client';
import Portfolio from './components/Portfolio';

function App() {
  return (
    <Portfolio />
  );
}

// Check if the element exists before rendering
const element = document.getElementById('app');
if (element) {
  const root = ReactDOM.createRoot(element);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
