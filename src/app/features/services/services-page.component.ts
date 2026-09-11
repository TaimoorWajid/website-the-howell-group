import { afterNextRender, Component, ElementRef, inject, NgZone, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { SeoService } from '../../core/services/seo.service';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { ServicesHeroComponent } from './services-hero.component';
import { ServiceStoryComponent } from './service-story.component';
import { ServicesCapabilitiesComponent } from './services-capabilities.component';
import { ENGAGEMENT_STAGES } from './services.data';

@Component({selector:'app-services-page',imports:[RouterLink,ServicesHeroComponent,ServiceStoryComponent,ServicesCapabilitiesComponent],templateUrl:'./services-page.component.html',styleUrl:'./services-page.component.scss'})
export class ServicesPageComponent implements OnDestroy {
  readonly stages=ENGAGEMENT_STAGES;
  readonly opened=signal<number|null>(0);
  readonly enhanced=signal(false);
  private readonly host=inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations=inject(AnimationManagerService);
  private readonly zone=inject(NgZone);
  private media?:gsap.MatchMedia;
  constructor() {
    inject(SeoService).update({title:'Services | The Howell Group',description:'Program, design and construction management, with experienced partnership wherever your project needs it.',canonicalPath:'/services'});
    afterNextRender(()=>{
      this.enhanced.set(true);
      this.zone.runOutsideAngular(()=>{
        this.animations.setup(); this.media=gsap.matchMedia();
        this.media.add('(prefers-reduced-motion: no-preference)',()=>{
          const root=this.host.nativeElement;
          gsap.from(root.querySelectorAll('.closing-copy > *'),{y:16,opacity:0,duration:.7,stagger:.12,scrollTrigger:{trigger:root.querySelector('.closing'),start:'top 85%',once:true}});
        });
      });
    });
  }
  toggle(index:number):void {this.opened.update(open=>open===index?null:index);}
  accordionKey(event:KeyboardEvent,index:number):void {
    let next:number;
    if(event.key==='ArrowDown') next=(index+1)%this.stages.length;
    else if(event.key==='ArrowUp') next=(index+this.stages.length-1)%this.stages.length;
    else if(event.key==='Home') next=0;
    else if(event.key==='End') next=this.stages.length-1;
    else return;
    event.preventDefault();this.host.nativeElement.querySelector<HTMLButtonElement>(`#engagement-button-${next}`)?.focus();
  }
  ngOnDestroy():void {this.media?.revert();}
}
