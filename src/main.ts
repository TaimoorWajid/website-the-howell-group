import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';

bootstrapApplication(App, appConfig)
  .then(app => {
    const router = app.injector.get(Router);
    const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => window.dispatchEvent(new Event('howell:app-ready'))));
    if (router.navigated) ready();
    else router.events.pipe(filter(event => event instanceof NavigationEnd), take(1)).subscribe(ready);
  })
  .catch(err => {
    window.dispatchEvent(new Event('howell:app-error'));
    console.error(err);
  });
