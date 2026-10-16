import { afterNextRender, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CareersService } from '../../core/api/careers.service';
import { ApplicationReceipt } from '../../core/models/careers.models';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-application-success',
  imports: [RouterLink, DatePipe],
  templateUrl: './application-success.component.html',
  styleUrl: './application-success.scss',
})
export class ApplicationSuccessComponent {
  readonly receipt = inject(CareersService).receipt;
  readonly ready = signal(false);
  constructor() {
    inject(SeoService).update({
      title: 'Application confirmation | The Howell Group',
      canonicalPath: '/careers/application/success',
      noIndex: true,
    });
    afterNextRender(() => {
      if (!this.receipt()) {
        try {
          const receipt: ApplicationReceipt = JSON.parse(
            sessionStorage.getItem('howell-application-receipt') ?? 'null',
          );
          if (
            receipt &&
            /^THG-[A-F0-9]{12}$/.test(receipt.reference) &&
            typeof receipt.jobTitle === 'string' &&
            Number.isFinite(Date.parse(receipt.submittedAt)) &&
            ['preview', 'live'].includes(receipt.mode)
          )
            this.receipt.set(receipt);
        } catch {
          /* Direct visits without a receipt never claim a submission succeeded. */
        }
      }
      this.ready.set(true);
    });
  }
}
