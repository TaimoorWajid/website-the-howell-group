import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { FoundationPageComponent } from './shared/components/foundation-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, data: { footerInvitation: false, title: 'The Howell Group | Building what matters.' } },
  { path: 'projects', component: FoundationPageComponent, data: { title: 'Projects | The Howell Group' } },
  { path: 'projects/:slug', component: FoundationPageComponent, data: { title: 'Project | The Howell Group' } },
  { path: 'services', loadComponent: () => import('./features/services/services-page.component').then(module => module.ServicesPageComponent), data: { footerInvitation: false, title: 'Services | The Howell Group' } },
  { path: 'services/:slug', component: FoundationPageComponent, data: { title: 'Service | The Howell Group' } },
  { path: 'about', loadComponent: () => import('./features/about/about-page.component').then(module => module.AboutPageComponent), data: { footerInvitation: false, title: 'About | The Howell Group' } },
  { path: 'insights', component: FoundationPageComponent, data: { title: 'Insights | The Howell Group' } },
  { path: 'insights/:slug', component: FoundationPageComponent, data: { title: 'Insight | The Howell Group' } },
  { path: 'careers', component: FoundationPageComponent, data: { title: 'Careers | The Howell Group' } },
  { path: 'careers/:slug', component: FoundationPageComponent, data: { title: 'Career | The Howell Group' } },
  { path: 'contact', loadComponent: () => import('./features/contact/contact-page.component').then(module => module.ContactPageComponent), data: { footerInvitation: false, title: 'Contact | The Howell Group' } },
  { path: '**', component: FoundationPageComponent, data: { title: 'Page not found | The Howell Group', notFound: true } }
];
