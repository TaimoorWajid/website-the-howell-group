import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { createCareersRouter } from './server/careers-api';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use('/api/careers', createCareersRouter());
const maintenanceMode = /^(1|true|yes)$/i.test(
  process.env['MAINTENANCE_MODE'] ?? '',
);
// Dynamically determine allowed hosts from environment or defaults
const envAllowedHosts =
  process.env['ALLOWED_HOSTS'] || process.env['NG_ALLOWED_HOSTS'];
const defaultAllowedHosts = [
  'localhost',
  '127.0.0.1',
  'thehowellgroup.co',
  'www.thehowellgroup.co',
  '*.thehowellgroup.co',
  '*.hostingersite.com',
  '*.hstgr.cloud',
];

const allowedHosts = envAllowedHosts
  ? envAllowedHosts.split(',').map((h) => h.trim())
  : defaultAllowedHosts;

const angularApp = new AngularNodeAppEngine({
  allowedHosts,
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

if (maintenanceMode) {
  app.use((req, res) => {
    res
      .status(503)
      .set('Retry-After', '3600')
      .type('html')
      .send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Maintenance | The Howell Group</title>
  <style>
    :root { color-scheme: light; font-family: Arial, sans-serif; color: #202b2c; background: #f7f7f3; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 2rem; }
    main { width: min(100%, 42rem); text-align: center; }
    img { width: min(18rem, 70vw); height: auto; margin-bottom: 3.5rem; }
    p { color: #607171; font-size: .8rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
    h1 { margin: 1rem 0; font-size: clamp(2.5rem, 8vw, 4.5rem); line-height: 1.05; letter-spacing: -.045em; }
    .message { max-width: 34rem; margin: 1.25rem auto 0; color: #566263; font-size: 1.1rem; line-height: 1.7; }
    a { display: inline-block; margin-top: 2rem; color: inherit; text-underline-offset: .25em; }
  </style>
</head>
<body>
  <main>
    <img src="/images/brand/howell-group-logo-client.png" alt="The Howell Group">
    <p>We’ll be back soon</p>
    <h1>We’re making improvements.</h1>
    <div class="message">Our website is temporarily unavailable while we make a few updates. Please check back soon.</div>
    <a href="mailto:info@thehowellgroup.co">Contact our team</a>
  </main>
</body>
</html>`);
  });
}

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point or if a PORT is assigned by the host.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
const port = Number(process.env['PORT'] || 4000);

app.listen(port, '0.0.0.0', (error) => {
  if (error) {
    console.error('Failed to start Express server:', error);
    process.exit(1);
  }

  console.log(`Node Express server listening on port ${port}`);
});

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
export { app };
