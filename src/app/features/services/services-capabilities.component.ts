import { afterNextRender, Component, ElementRef, inject, NgZone, OnDestroy } from '@angular/core';
import gsap from 'gsap';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { SERVICE_CAPABILITIES } from './services.data';

@Component({selector:'app-services-capabilities',templateUrl:'./services-capabilities.component.html',styleUrl:'./services-capabilities.component.scss'})
export class ServicesCapabilitiesComponent implements OnDestroy {
  readonly capabilities = SERVICE_CAPABILITIES;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly animations = inject(AnimationManagerService);
  private media?: gsap.MatchMedia;
  constructor() {
    afterNextRender(()=>this.zone.runOutsideAngular(()=>{
      this.animations.setup();this.media=gsap.matchMedia();
      this.media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',()=>{
        const cleanups: Array<()=>void> = [];
        this.host.nativeElement.querySelectorAll<HTMLElement>('.capability').forEach(card=>{
          const move = (event: PointerEvent): void => {
            if(event.pointerType==='touch') return;
            const bounds=card.getBoundingClientRect();
            const x=Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width));
            const y=Math.max(0,Math.min(1,(event.clientY-bounds.top)/bounds.height));
            card.style.setProperty('--light-x',`${x*100}%`);card.style.setProperty('--light-y',`${y*100}%`);
            card.style.setProperty('--tilt-x',`${(y-.5)*-4}deg`);card.style.setProperty('--tilt-y',`${(x-.5)*4}deg`);
            card.classList.add('pointer-active');
          };
          const leave=():void=>{card.classList.remove('pointer-active');card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');};
          card.addEventListener('pointermove',move);card.addEventListener('pointerleave',leave);
          cleanups.push(()=>{card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);leave();card.style.removeProperty('--light-x');card.style.removeProperty('--light-y');});
        });
        return ()=>cleanups.forEach(cleanup=>cleanup());
      });
    }));
  }
  ngOnDestroy():void {this.media?.revert();}
}
