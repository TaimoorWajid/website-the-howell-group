import { afterNextRender, Component, ElementRef, inject, Injector, NgZone, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { prefersReducedMotion } from '../../core/animations/animation.util';
import type { ServicesPortalScene } from './services-portal.scene';

@Component({ selector:'app-services-hero',imports:[RouterLink],templateUrl:'./services-hero.component.html',styleUrl:'./services-hero.component.scss' })
export class ServicesHeroComponent implements OnDestroy {
  readonly ready = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly animations = inject(AnimationManagerService);
  private readonly scrolling = inject(SmoothScrollService);
  private readonly zone = inject(NgZone);
  private media?: gsap.MatchMedia;
  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      this.animations.setup(); this.media = gsap.matchMedia();
      this.media.add('(min-width: 48rem) and (prefers-reduced-motion: no-preference)', () => {
        let disposed = false;
        let scene: ServicesPortalScene | undefined;
        const state = { progress:0 };
        const animation = gsap.to(state,{progress:1,ease:'none',scrollTrigger:{trigger:this.host.nativeElement,start:'top top',end:'bottom top',scrub:.5},onUpdate:()=>scene?.setProgress(state.progress)});
        let visible = false;
        const observer = new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;scene?.setVisible(visible);}); observer.observe(this.host.nativeElement);
        void import('./services-portal.scene').then(({ServicesPortalScene})=>{
          if (disposed) return;
          scene = new ServicesPortalScene(this.host.nativeElement.querySelector<HTMLElement>('.portal-canvas')!,this.injector,ready=>this.ready.set(ready));
          if (scene.initialize()) { scene.setProgress(state.progress); scene.setVisible(visible); }
        }).catch(()=>this.ready.set(false));
        return ()=>{disposed=true;animation.kill();observer.disconnect();scene?.destroy();this.ready.set(false);};
      });
    }));
  }
  explore(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById('service-story'); if (!target) return;
    event.preventDefault();
    if (prefersReducedMotion()) target.scrollIntoView({behavior:'instant'}); else this.scrolling.scrollTo('#service-story');
    target.querySelector<HTMLElement>('a')?.focus({preventScroll:true});
    history.replaceState(history.state,'','#service-story');
  }
  ngOnDestroy(): void { this.media?.revert(); }
}
