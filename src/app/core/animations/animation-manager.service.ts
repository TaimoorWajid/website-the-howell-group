import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class AnimationManagerService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private registered = false;

  setup(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    if (!this.registered) {
      gsap.registerPlugin(ScrollTrigger);
      this.registered = true;
    }
    return true;
  }

  createContext(scope: Element | null, animation: (context: gsap.Context) => void): gsap.Context | null {
    if (!this.setup()) return null;
    return gsap.context(animation, scope ?? this.document.body);
  }

  refresh(): void { if (this.setup()) ScrollTrigger.refresh(); }
}
