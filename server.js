// Root entry point for hosting providers (such as Hostinger Node.js Web App)
// Ensures the compiled Angular SSR application starts seamlessly

if (!process.env['PORT']) {
  process.env['PORT'] = '4000';
}

import('./dist/the-howell-group/server/server.mjs').catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

