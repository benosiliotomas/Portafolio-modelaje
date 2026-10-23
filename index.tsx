import React from 'react';
import ReactDOM from 'react-dom/client';
import PublicApp from './PublicApp';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// The admin bundle (Firebase SDK, auth, uploads) is only downloaded on /admin.
const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin';

if (isAdminRoute) {
  import('./admin/AdminApp').then(({ default: AdminApp }) => {
    root.render(
      <React.StrictMode>
        <AdminApp />
      </React.StrictMode>
    );
  });
} else {
  root.render(
    <React.StrictMode>
      <PublicApp />
    </React.StrictMode>
  );
}
