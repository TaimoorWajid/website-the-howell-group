import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { FOOTER_LINKS } from './footer.data';
import { BrandLogoComponent } from '../../shared/components/brand-logo.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, BrandLogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private readonly router = inject(Router);
  private readonly scroll = inject(SmoothScrollService);
  protected readonly year = new Date().getFullYear();
  protected readonly links = FOOTER_LINKS;
  protected readonly showInvitation = toSignal(this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => {
      let route = this.router.routerState.snapshot.root;
      let show = true;
      while (route) {
        if (route.data['footerInvitation'] !== undefined) show = route.data['footerInvitation'];
        if (!route.firstChild) break;
        route = route.firstChild;
      }
      return show;
    })
  ), { requireSync: true });

  protected backToTop(): void { this.scroll.backToTop(); }
}
