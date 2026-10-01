import {
  Component,
  DestroyRef,
  RESPONSE_INIT,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { CareersService } from '../../core/api/careers.service';
import { Job } from '../../core/models/careers.models';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-job-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.scss',
})
export class JobDetailComponent {
  private readonly api = inject(CareersService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly seo = inject(SeoService);
  private readonly response = inject(RESPONSE_INIT, { optional: true });
  readonly job = signal<Job | null>(null);
  readonly preview = signal(false);
  readonly loading = signal(true);
  readonly failed = signal(false);
  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading.set(true);
          this.job.set(null);
          return this.api.getCatalog();
        }),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (data) => this.accept(data.jobs, data.mode === 'preview'),
        error: () => {
          this.loading.set(false);
          this.failed.set(true);
        },
      });
  }
  retry(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.api
      .getCatalog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.accept(data.jobs, data.mode === 'preview'),
        error: () => {
          this.loading.set(false);
          this.failed.set(true);
        },
      });
  }
  private accept(jobs: Job[], preview: boolean): void {
    const job =
      jobs.find(
        (item) => item.slug === this.route.snapshot.paramMap.get('slug'),
      ) ?? null;
    this.job.set(job);
    this.preview.set(preview);
    this.loading.set(false);
    this.failed.set(false);
    if (!job && this.response) this.response.status = 404;
    this.seo.update({
      title: `${job?.title ?? 'Opportunity unavailable'} | The Howell Group`,
      description: job?.summary,
      canonicalPath: `/careers/${this.route.snapshot.paramMap.get('slug')}`,
      noIndex: preview || !job,
    });
  }
}
