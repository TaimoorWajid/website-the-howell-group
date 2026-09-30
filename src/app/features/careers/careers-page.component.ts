import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CareersService } from '../../core/api/careers.service';
import { CareersCatalog } from '../../core/models/careers.models';
import { SeoService } from '../../core/services/seo.service';

@Component({ selector: 'app-careers-page', imports: [RouterLink], templateUrl: './careers-page.component.html', styleUrl: './careers.scss' })
export class CareersPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(CareersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly seo = inject(SeoService);
  readonly listing = this.route.snapshot.data['listing'] === true;
  readonly catalog = signal<CareersCatalog | null>(null);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly query = signal('');
  readonly department = signal('');
  readonly location = signal('');
  readonly departments = computed(() => [...new Set(this.catalog()?.jobs.map(job => job.department) ?? [])].sort());
  readonly locations = computed(() => [...new Set(this.catalog()?.jobs.map(job => job.location) ?? [])].sort());
  readonly filtered = computed(() => (this.catalog()?.jobs ?? []).filter(job => (!this.department() || job.department === this.department()) && (!this.location() || job.location === this.location()) && `${job.title} ${job.department} ${job.location} ${job.id}`.toLowerCase().includes(this.query().trim().toLowerCase())));
  readonly hasFilters = computed(() => !!(this.query() || this.department() || this.location()));
  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.query.set(params.get('q') ?? ''); this.department.set(params.get('department') ?? ''); this.location.set(params.get('location') ?? '');
    });
    this.load();
  }
  load(): void {
    this.loading.set(true); this.failed.set(false);
    this.seo.update({ title: `${this.listing ? 'Open opportunities' : 'Careers'} | The Howell Group`, canonicalPath: this.listing ? '/careers/jobs' : '/careers', description: 'Bring your perspective. Explore opportunities to help deliver meaningful places with The Howell Group.' });
    this.api.getCatalog().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: data => {
      this.catalog.set(data); this.loading.set(false);
      if (data.mode === 'preview') this.seo.update({ title: `${this.listing ? 'Open opportunities' : 'Careers'} | The Howell Group`, canonicalPath: this.listing ? '/careers/jobs' : '/careers', noIndex: true });
    }, error: () => { this.loading.set(false); this.failed.set(true); } });
  }
  filter(key: string, event: Event): void { void this.router.navigate([], { relativeTo: this.route, queryParams: { [key]: (event.target as HTMLInputElement).value || null }, queryParamsHandling: 'merge', replaceUrl: true }); }
  reset(): void { void this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true }); }
}
