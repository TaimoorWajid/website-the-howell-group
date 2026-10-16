import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { FoundationPageComponent } from './shared/components/foundation-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    data: {
      footerInvitation: false,
      title: 'The Howell Group | We Deliver Your Mission',
    },
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/projects-page.component').then(
        (module) => module.ProjectsPageComponent,
      ),
    data: { title: 'Projects | The Howell Group' },
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./features/projects/project-detail-page.component').then(
        (module) => module.ProjectDetailPageComponent,
      ),
    data: { title: 'Project | The Howell Group' },
  },
  {
    path: 'markets',
    loadComponent: () =>
      import('./features/markets/markets-page.component').then(
        (module) => module.MarketsPageComponent,
      ),
    data: { title: 'Markets | The Howell Group', footerInvitation: false },
  },
  { path: 'markets/healthcare', redirectTo: 'markets', pathMatch: 'full' },
  {
    path: 'markets/:slug',
    loadComponent: () =>
      import('./features/markets/market-detail-page.component').then(
        (module) => module.MarketDetailPageComponent,
      ),
    data: { title: 'Market | The Howell Group', footerInvitation: false },
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./features/services/services-page.component').then(
        (module) => module.ServicesPageComponent,
      ),
    data: { footerInvitation: false, title: 'Services | The Howell Group' },
  },
  {
    path: 'services/partnership-consulting',
    redirectTo: 'services',
    pathMatch: 'full',
  },
  {
    path: 'services/:slug',
    loadComponent: () =>
      import('./features/services/service-detail-page.component').then(
        (module) => module.ServiceDetailPageComponent,
      ),
    data: { footerInvitation: false, title: 'Service | The Howell Group' },
  },
  {
    path: 'our-approach',
    loadComponent: () =>
      import('./features/approach/approach-page.component').then(
        (module) => module.ApproachPageComponent,
      ),
    data: { footerInvitation: false, title: 'Our Approach | The Howell Group' },
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about-page.component').then(
        (module) => module.AboutPageComponent,
      ),
    data: { footerInvitation: false, title: 'About | The Howell Group' },
  },
  {
    path: 'careers',
    loadComponent: () =>
      import('./features/careers/careers-page.component').then(
        (m) => m.CareersPageComponent,
      ),
    data: { title: 'Careers | The Howell Group', footerInvitation: false },
  },
  {
    path: 'careers/jobs',
    loadComponent: () =>
      import('./features/careers/careers-page.component').then(
        (m) => m.CareersPageComponent,
      ),
    data: {
      title: 'Open opportunities | The Howell Group',
      listing: true,
      footerInvitation: false,
    },
  },
  {
    path: 'careers/application/success',
    loadComponent: () =>
      import('./features/careers/application-success.component').then(
        (m) => m.ApplicationSuccessComponent,
      ),
    data: { footerInvitation: false },
  },
  {
    path: 'careers/:slug/apply',
    loadComponent: () =>
      import('./features/careers/job-application.component').then(
        (m) => m.JobApplicationComponent,
      ),
    canDeactivate: [
      (component: { canLeave: () => boolean }) => component.canLeave(),
    ],
    data: { footerInvitation: false },
  },
  {
    path: 'careers/:slug',
    loadComponent: () =>
      import('./features/careers/job-detail.component').then(
        (m) => m.JobDetailComponent,
      ),
    data: { footerInvitation: false },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact-page.component').then(
        (module) => module.ContactPageComponent,
      ),
    data: { footerInvitation: false, title: 'Contact | The Howell Group' },
  },
  {
    path: '**',
    component: FoundationPageComponent,
    data: { title: 'Page not found | The Howell Group', notFound: true },
  },
];
