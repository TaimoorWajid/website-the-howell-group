import { Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CareersService } from '../../core/api/careers.service';
import { Job, JobApplication, MAX_RESUME_BYTES, ResumeUpload } from '../../core/models/careers.models';
import { SeoService } from '../../core/services/seo.service';

@Component({ selector: 'app-job-application', imports: [RouterLink, ReactiveFormsModule], templateUrl: './job-application.component.html', styleUrl: './job-application.scss', host: { '(window:beforeunload)': 'beforeUnload($event)' } })
export class JobApplicationComponent {
  private readonly api = inject(CareersService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly job = signal<Job | null>(null);
  readonly preview = signal(false);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly step = signal(0);
  readonly pending = signal(false);
  readonly uploading = signal(false);
  readonly resume = signal<ResumeUpload | null>(null);
  readonly fileSize = signal('');
  readonly uploadError = signal('');
  readonly submitError = signal('');
  readonly steps = ['Your details', 'Your experience', 'Review & submit'];
  private requestId = '';
  private uploadVersion = 0;
  private submitted = false;
  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), Validators.maxLength(254)]],
    phone: ['', [Validators.required, Validators.pattern(/^(?=(?:\D*\d){7,})[+()\d\s.-]{7,40}$/)]],
    location: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(160)]],
    profile: ['', [Validators.pattern(/^https?:\/\/[^\s]+$/i), Validators.maxLength(500)]],
    introduction: ['', Validators.maxLength(4000)], consent: [false, Validators.requiredTrue], website: ['']
  });
  constructor() {
    inject(SeoService).update({ title: 'Your application | The Howell Group', canonicalPath: '/careers', noIndex: true });
    this.load();
  }
  load(): void {
    this.loading.set(true); this.failed.set(false);
    this.api.getCatalog().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: data => { this.job.set(data.jobs.find(job => job.slug === this.route.snapshot.paramMap.get('slug')) ?? null); this.preview.set(data.mode === 'preview'); this.loading.set(false); }, error: () => { this.failed.set(true); this.loading.set(false); } });
  }
  invalid(key: string): boolean { const control = this.form.get(key); return !!control?.invalid && !!control?.touched; }
  error(key: string): string {
    const control = this.form.get(key);
    if (control?.hasError('required')) return 'Please complete this field.';
    if (control?.hasError('maxlength')) return `Please use no more than ${control.errors!['maxlength'].requiredLength} characters.`;
    return key === 'email' ? 'Enter a valid email address.' : key === 'phone' ? 'Enter a phone number with at least 7 digits.' : key === 'profile' ? 'Use a full link starting with https:// or http://.' : 'Please enter a value, not only spaces.';
  }
  private validStep(index: number): boolean {
    const fields = index === 0 ? ['firstName', 'lastName', 'email', 'phone', 'location'] : ['profile', 'introduction'];
    fields.forEach(key => this.form.get(key)!.markAsTouched());
    if (index === 1 && !this.resume()) this.uploadError.set('Please attach your resume to continue.');
    return fields.every(key => this.form.get(key)!.valid) && (index !== 1 || !!this.resume() && !this.uploading());
  }
  go(index: number): void {
    if (this.pending() || this.uploading()) return;
    if (index > this.step()) {
      for (let i = 0; i < index; i++) if (!this.validStep(i)) { this.step.set(i); this.focus(true); return; }
    }
    this.step.set(index); this.focus(false);
  }
  private focus(invalid: boolean): void {
    setTimeout(() => {
      const target = this.host.nativeElement.querySelector<HTMLElement>(invalid ? '.form-step:not([hidden]) [aria-invalid="true"]' : '.form-step:not([hidden]) .step-title');
      target?.focus({ preventScroll: true }); target?.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
  }
  async chooseFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0]; if (!file) return;
    input.value = ''; await this.readFile(file);
  }
  drop(event: DragEvent): void { event.preventDefault(); if (this.pending() || this.uploading()) return; const file = event.dataTransfer?.files[0]; if (file) void this.readFile(file); }
  drag(event: DragEvent): void { event.preventDefault(); }
  private async readFile(file: File): Promise<void> {
    const version = ++this.uploadVersion;
    this.uploadError.set(''); this.resume.set(null);
    if (!/\.(pdf|docx)$/i.test(file.name) || file.name.length > 200 || !file.size || file.size > MAX_RESUME_BYTES) { this.uploadError.set('Choose a PDF or DOCX file under 5 MB.'); return; }
    this.uploading.set(true);
    try {
      const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file); });
      if (version !== this.uploadVersion) return;
      this.resume.set({ name: file.name, data }); this.fileSize.set(file.size < 1024 * 1024 ? `${Math.ceil(file.size / 1024)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`);
    } catch { if (version === this.uploadVersion) this.uploadError.set('We couldn’t read that file. Please select it again.'); }
    finally { if (version === this.uploadVersion) this.uploading.set(false); }
  }
  removeFile(): void { ++this.uploadVersion; this.resume.set(null); this.uploading.set(false); this.uploadError.set(''); }
  submit(): void {
    if (this.pending() || this.submitted || this.uploading()) return;
    if (this.step() < 2) { this.go(this.step() + 1); return; }
    for (let i = 0; i < 2; i++) if (!this.validStep(i)) { this.step.set(i); this.focus(true); return; }
    this.form.controls.consent.markAsTouched();
    if (this.form.invalid || !this.job() || !this.resume()) { this.focus(true); return; }
    this.pending.set(true); this.submitError.set('');
    this.requestId ||= crypto.randomUUID();
    const values = this.form.getRawValue();
    const application: JobApplication = { ...values, firstName: values.firstName.trim(), lastName: values.lastName.trim(), email: values.email.trim(), phone: values.phone.trim(), location: values.location.trim(), requestId: this.requestId, jobId: this.job()!.id, resume: this.resume()! };
    this.api.apply(application).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.pending.set(false))).subscribe({ next: receipt => {
      this.submitted = true; this.api.receipt.set(receipt);
      try { sessionStorage.setItem('howell-application-receipt', JSON.stringify(receipt)); } catch { /* Confirmation still works when browser storage is disabled. */ }
      this.resume.set(null); this.form.reset();
      void this.router.navigate(['/careers/application/success']);
    }, error: error => { this.submitError.set(typeof error.error?.message === 'string' ? error.error.message : 'We couldn’t confirm your submission. Please check your connection and try again. Your details are still here.'); setTimeout(() => this.host.nativeElement.querySelector<HTMLElement>('.submission-error')?.focus()); } });
  }
  hasChanges(): boolean { return !this.submitted && (this.form.dirty || !!this.resume()); }
  canLeave(): boolean { return !this.hasChanges() || window.confirm(this.pending() ? 'Your application is being sent. Leave this page before confirmation?' : 'Leave this application? Your unsent details will be lost.'); }
  beforeUnload(event: BeforeUnloadEvent): void { if (this.hasChanges()) { event.preventDefault(); event.returnValue = ''; } }
}
