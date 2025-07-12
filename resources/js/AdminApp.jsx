import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminDashboard from './components/AdminDashboard';

function AdminApp() {
  return (
    <AdminDashboard />
  );
}

// Check if the element exists before rendering
const element = document.getElementById('admin-app');
if (element) {
  const root = ReactDOM.createRoot(element);
  root.render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
}
