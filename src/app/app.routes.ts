import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { FoundationPageComponent } from './shared/components/foundation-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, data: { title: 'The Howell Group | Building what matters.' } },
  { path: 'projects', component: FoundationPageComponent, data: { title: 'Projects | The Howell Group' } },
  { path: 'projects/:slug', component: FoundationPageComponent, data: { title: 'Project | The Howell Group' } },
  { path: 'services', loadComponent: () => import('./features/services/services-page.component').then(module => module.ServicesPageComponent), data: { title: 'Services | The Howell Group' } },
  { path: 'services/:slug', component: FoundationPageComponent, data: { title: 'Service | The Howell Group' } },
  { path: 'about', component: FoundationPageComponent, data: { title: 'About | The Howell Group' } },
  { path: 'insights', component: FoundationPageComponent, data: { title: 'Insights | The Howell Group' } },
  { path: 'insights/:slug', component: FoundationPageComponent, data: { title: 'Insight | The Howell Group' } },
  { path: 'careers', component: FoundationPageComponent, data: { title: 'Careers | The Howell Group' } },
  { path: 'careers/:slug', component: FoundationPageComponent, data: { title: 'Career | The Howell Group' } },
  { path: 'contact', component: FoundationPageComponent, data: { title: 'Contact | The Howell Group' } },
  { path: '**', component: FoundationPageComponent, data: { title: 'Page not found | The Howell Group', notFound: true } }
];
