import { afterNextRender, Component, DestroyRef, ElementRef, inject, OnDestroy, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MARKETS } from '../../core/data/markets.data';
import gsap from 'gsap';
import { ContactApiService } from '../../core/api/contact-api.service';
import { ContactInquiry } from '../../core/models/content.models';
import { prefersReducedMotion } from '../../core/animations/animation.util';
import { INQUIRY_ROLES, INQUIRY_STEPS, PHONE_COUNTRIES, PROJECT_SELECT_FIELDS, normalizedPhone } from './contact-form.config';

const requiredText: ValidatorFn = (control: AbstractControl): ValidationErrors | null => typeof control.value === 'string' && control.value.trim() ? null : { required: true };
const phoneValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => normalizedPhone(group.get('country')?.value ?? '', group.get('number')?.value ?? '') ? null : { phone: true };
const approvedSelection = (key: string): ValidatorFn => control => PROJECT_SELECT_FIELDS.find(field => field.key === key)?.options.some(option => option.value === control.value) ? null : { selection: true };

@Component({ selector: 'app-contact-inquiry', imports: [ReactiveFormsModule], templateUrl: './contact-inquiry.component.html', styleUrl: './contact-inquiry.component.scss' })
export class ContactInquiryComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly api = inject(ContactApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly steps = INQUIRY_STEPS;
  readonly roles = INQUIRY_ROLES;
  readonly countries = PHONE_COUNTRIES;
  readonly selections = PROJECT_SELECT_FIELDS;
  readonly missingSelections = PROJECT_SELECT_FIELDS.filter(field => !field.options.length);
  readonly step = signal(0);
  readonly furthest = signal(0);
  readonly pending = signal(false);
  readonly marketContextEnabled = signal(false);
  readonly status = signal<'idle' | 'error' | 'success'>('idle');
  private transition?: gsap.core.Tween;
  private focusFrame: number | null = null;
  private browserReady = false;
  readonly form = this.fb.group({
    marketContext: ['', Validators.maxLength(100)],
    personal: this.fb.group({
      firstName: ['', requiredText], lastName: ['', requiredText], role: ['', [Validators.required, Validators.pattern(/^(Owner|Developer|Architect|Designer|Other)$/)]],
      phone: this.fb.group({ country: ['US', Validators.required], number: ['', requiredText] }, { validators: phoneValidator }),
      company: ['', requiredText], email: ['', [requiredText, Validators.email]]
    }),
    project: this.fb.group({
      projectType: ['', [Validators.required, approvedSelection('projectType')]],
      estimatedValue: ['', [Validators.required, approvedSelection('estimatedValue')]],
      projectStage: ['', [Validators.required, approvedSelection('projectStage')]],
      targetStart: ['', [Validators.required, approvedSelection('targetStart')]],
      state: ['', [Validators.required, approvedSelection('state')]],
      city: ['', [requiredText, Validators.maxLength(250)]]
    }),
    discussion: this.fb.group({ projectDetails: [''], additionalInformation: ['', Validators.maxLength(1000)] })
  });

  constructor() {
    inject(ActivatedRoute).queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const market = MARKETS.find(item => item.slug === params.get('market'));
      if (!market) return;
      this.marketContextEnabled.set(true);
      if (this.form.controls.marketContext.pristine) this.form.controls.marketContext.setValue(market.name);
      const option = this.selections.find(field => field.key === 'projectType')?.options.find(item => item.value.toLowerCase() === market.slug || item.label.toLowerCase() === market.name.toLowerCase());
      const projectType = this.form.controls.project.controls.projectType;
      if (option && projectType.pristine) projectType.setValue(option.value);
    });
    afterNextRender(() => { this.browserReady = true; });
  }
  control(path: string): AbstractControl { return this.form.get(path)!; }
  invalid(path: string): boolean { const control = this.control(path); return control.invalid && control.touched; }
  get phoneHint(): string { return this.countries.find(country => country.code === this.form.controls.personal.controls.phone.controls.country.value)!.hint; }
  get phoneInvalid(): boolean { const phone = this.form.controls.personal.controls.phone; return phone.invalid && (phone.touched || phone.controls.number.touched); }
  error(path: string): string {
    const errors = this.control(path).errors;
    if (errors?.['required']) return 'Please complete this field.';
    if (errors?.['email']) return 'Enter a valid email address.';
    if (errors?.['maxlength']) return `Use no more than ${errors['maxlength'].requiredLength} characters.`;
    return 'Please choose an available option.';
  }
  private groups() { return [this.form.controls.personal, this.form.controls.project, this.form.controls.discussion]; }
  next(): void {
    if (this.pending() || this.step() >= 2) return;
    const group = this.groups()[this.step()]; group.markAllAsTouched();
    if (group.invalid) { this.queueFocus(true); return; }
    this.furthest.update(value => Math.max(value, this.step() + 1)); this.changeStep(this.step() + 1);
  }
  previous(): void { if (!this.pending() && this.step() > 0) this.changeStep(this.step() - 1); }
  visit(index: number): void {
    if (this.pending() || index > this.furthest()) return;
    if (index > this.step()) {
      for (let i = 0; i < index; i++) {
        const group = this.groups()[i]; group.markAllAsTouched();
        if (group.invalid) { this.changeStep(i, true); return; }
      }
    }
    this.changeStep(index);
  }
  private changeStep(index: number, invalid = false): void { this.transition?.kill(); this.step.set(index); this.queueFocus(invalid, true); }
  private queueFocus(invalid: boolean, animate = false): void {
    if (!this.browserReady) return;
    if (this.focusFrame !== null) cancelAnimationFrame(this.focusFrame);
    this.focusFrame = requestAnimationFrame(() => {
      this.focusFrame = null;
      const root = this.host.nativeElement;
      const target = invalid ? root.querySelector<HTMLElement>('[aria-invalid="true"]') : root.querySelector<HTMLElement>('.step-heading');
      target?.focus({ preventScroll: true });
      if (animate && !prefersReducedMotion()) this.transition = gsap.fromTo(root.querySelector('.step-content'), { opacity: .5, y: 4 }, { opacity: 1, y: 0, duration: .2, clearProps: 'opacity,transform' });
    });
  }
  enter(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.isComposing || this.step() === 2 || ['BUTTON', 'SELECT'].includes((event.target as HTMLElement).tagName)) return;
    event.preventDefault(); this.next();
  }
  submit(): void {
    if (this.step() !== 2) { this.next(); return; }
    if (this.pending() || this.status() === 'success') return;
    this.form.markAllAsTouched();
    if (this.form.controls.marketContext.invalid) { this.queueFocus(true); return; }
    const invalid = this.groups().findIndex(group => group.invalid);
    if (invalid >= 0) { this.changeStep(invalid, true); return; }
    this.pending.set(true); this.status.set('idle');
    this.api.submitInquiry(this.payload()).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.pending.set(false))
    ).subscribe({ next: () => this.status.set('success'), error: () => this.status.set('error') });
  }
  private payload(): ContactInquiry {
    const { personal, project, discussion, marketContext } = this.form.getRawValue();
    const selectionLines = this.selections.map(field => {
      const option = field.options.find(item => item.value === project[field.key]);
      return `${field.label}: ${option?.label ?? project[field.key]} [${project[field.key]}]`;
    });
    // The existing API has a single message field, not a structured project DTO.
    // Explicitly include every step there, while retaining its top-level contact fields.
    return {
      name: `${personal.firstName.trim()} ${personal.lastName.trim()}`, email: personal.email.trim(), company: personal.company.trim(),
      phone: normalizedPhone(personal.phone.country, personal.phone.number)!,
      message: [
        ...(marketContext.trim() ? [`Market: ${marketContext.trim()}`] : []),
        `First name: ${personal.firstName.trim()}`, `Last name: ${personal.lastName.trim()}`, `I am a: ${personal.role}`,
        `Phone country: ${personal.phone.country}`, `Dial code: ${this.countries.find(country => country.code === personal.phone.country)!.dial}`,
        `Phone as entered: ${personal.phone.number}`, ...selectionLines, `City: ${project.city.trim()}`,
        '', 'Project details:', discussion.projectDetails, '', 'Additional information:', discussion.additionalInformation
      ].join('\n')
    };
  }
  ngOnDestroy(): void { this.transition?.kill(); if (this.focusFrame !== null) cancelAnimationFrame(this.focusFrame); }
}
