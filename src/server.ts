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
if (isMainModule(import.meta.url) || Boolean(process.env['PORT'])) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
export { app };
