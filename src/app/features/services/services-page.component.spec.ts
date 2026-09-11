import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ServicesPageComponent } from './services-page.component';
import { SERVICE_CHAPTERS, SERVICE_CAPABILITIES, ENGAGEMENT_STAGES } from './services.data';
import { ThreeRendererService } from '../../core/three/three-renderer.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { routes } from '../../app.routes';

describe('Services landing page',()=>{
  let fixture:ComponentFixture<ServicesPageComponent>;
  let root:HTMLElement;
  let reduced:boolean;
  let queries:MediaQueryList[];
  let frame:HTMLElement;
  let frameStyle:string;
  const scroll= {scrollTo:jasmine.createSpy('scrollTo')};
  const tick=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  const create=async()=>{fixture=TestBed.createComponent(ServicesPageComponent);root=fixture.nativeElement;fixture.detectChanges();await fixture.whenStable();await tick();fixture.detectChanges();};
  beforeEach(async()=>{
    frame=window.frameElement as HTMLElement;frameStyle=frame.style.cssText;frame.style.width='1440px';frame.style.height='900px';
    reduced=true;queries=[];scroll.scrollTo.calls.reset();
    const match=window.matchMedia.bind(window);
    spyOn(window,'matchMedia').and.callFake(query=>{
      const media=match(query);
      if(query.includes('prefers-reduced-motion')) { Object.defineProperty(media,'matches',{get:()=>query.includes('no-preference')?!reduced:reduced});queries.push(media); }
      return media;
    });
    await TestBed.configureTestingModule({imports:[ServicesPageComponent],providers:[provideZonelessChangeDetection(),provideRouter(routes),{provide:ThreeRendererService,useValue:{create:()=>null}},{provide:SmoothScrollService,useValue:scroll}]}).compileComponents();
  });
  afterEach(()=>{fixture?.destroy();window.scrollTo(0,0);frame.style.cssText=frameStyle;history.replaceState(history.state,'',location.pathname);});
  it('renders the complete copy, contact destinations and no duplicate global shell',async()=>{
    await create();expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('h1')?.textContent).toBe('Complex projects.Clear direction.');
    for(const chapter of SERVICE_CHAPTERS){expect(root.textContent).toContain(chapter.title);expect(root.textContent).toContain(chapter.body);}
    for(const item of [...SERVICE_CAPABILITIES,...ENGAGEMENT_STAGES]){expect(root.textContent).toContain(item.title);expect(root.textContent).toContain(item.body);}
    expect(root.querySelectorAll('.chapter-link').length).toBe(4);
    root.querySelectorAll('.chapter-link,.red-button,.contact-link').forEach(link=>expect(link.getAttribute('href')).toBe('/contact'));
    expect(root.querySelector('app-header')).toBeNull();expect(root.querySelector('app-footer')).toBeNull();
    expect(routes.find(route=>route.path==='services')?.loadComponent).toBeDefined();expect(routes.find(route=>route.path==='services/:slug')?.component).toBeDefined();
    expect(document.title).toBe('Services | The Howell Group');
  });
  it('fits requested desktop and mobile widths with paired images and usable anchors',async()=>{
    await create();
    for(const width of [1600,1440,1280,1024,900,768,430,390,360]){
      frame.style.width=`${width}px`;await tick();
      expect(document.documentElement.scrollWidth).withContext(`${width}px overflow`).toBeLessThanOrEqual(width);
      root.querySelectorAll('.service-nav a,.red-button,.accordion button').forEach(link=>expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44));
      expect(root.querySelectorAll('.mobile-image').length).toBe(4);
      if(width<768){expect(getComputedStyle(root.querySelector('.service-nav')!).position).toBe('relative');expect(getComputedStyle(root.querySelector('.story-frame')!).display).toBe('none');expect(getComputedStyle(root.querySelector('.capabilities-grid')!).gridTemplateColumns.split(' ').length).toBe(1);}
    }
  });
  it('exposes the poster without camera animation with reduced motion',async()=>{
    await create();expect(root.querySelector('canvas')).toBeNull();
    expect(root.querySelector('.hero-architecture img')?.getAttribute('src')).toBe('/images/services/portal-poster.svg');
    expect(ScrollTrigger.getAll().filter(trigger=>root.contains(trigger.trigger!)).every(trigger=>!trigger.vars.pin)).toBeTrue();
    expect(ScrollTrigger.getAll().some(trigger=>trigger.trigger===root.querySelector('app-services-hero'))).toBeFalse();
    root.querySelectorAll('.capability').forEach(card=>expect(card.hasAttribute('tabindex')).toBeFalse());
  });
  it('provides an initially open accordion with keyboard traversal and correct panels',async()=>{
    await create();const buttons=Array.from(root.querySelectorAll<HTMLButtonElement>('.accordion button'));
    expect(buttons.map(button=>button.getAttribute('aria-expanded'))).toEqual(['true','false','false']);
    buttons[1].click();fixture.detectChanges();expect(buttons[1].getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('#engagement-panel-0')?.hasAttribute('inert')).toBeTrue();
    expect(root.querySelector('#engagement-panel-1')?.hasAttribute('inert')).toBeFalse();
    buttons[1].dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true}));expect(document.activeElement).toBe(buttons[2]);
    buttons[2].dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true}));expect(document.activeElement).toBe(buttons[0]);
    buttons[1].click();fixture.detectChanges();expect(buttons.every(button=>button.getAttribute('aria-expanded')==='false')).toBeTrue();
  });
  it('uses native reduced-motion anchors and transfers focus without hiding the destination',async()=>{
    await create();const native=spyOn(window,'scrollTo');
    root.querySelector<HTMLAnchorElement>('.service-nav a[href="#design-management"]')!.click();
    expect(native).toHaveBeenCalled();expect(document.activeElement).toBe(root.querySelector('#design-management h3'));
    expect(scroll.scrollTo).not.toHaveBeenCalled();
  });
  it('uses the existing scrolling service and reverses chapter image state',async()=>{
    reduced=false;await create();
    root.querySelector<HTMLAnchorElement>('.service-nav a[href="#construction-management"]')!.click();expect(scroll.scrollTo).toHaveBeenCalled();
    const story=root.querySelector('app-service-story')!;
    const trigger=ScrollTrigger.getAll().find(candidate=>candidate.trigger===story)!;
    expect(trigger).toBeDefined();
    const chapters=Array.from(root.querySelectorAll<HTMLElement>('.service-chapter'));
    for(const index of [0,1,2,3,2,1,0]){
      window.scrollTo(0,chapters[index].getBoundingClientRect().top+window.scrollY-200);
      trigger.vars.onUpdate!(trigger);fixture.detectChanges();
      expect(root.querySelector('.service-nav .is-active')?.textContent).toContain(SERVICE_CHAPTERS[index].name);
      expect(root.querySelector('.image-counter')?.textContent).toContain(SERVICE_CHAPTERS[index].number);
    }
    expect(getComputedStyle(root.querySelector('.story-frame')!).position).toBe('sticky');
    const mission=root.querySelector<HTMLElement>('.mission')!;
    window.scrollTo(0,mission.getBoundingClientRect().top+window.scrollY+100);await tick();
    expect(root.querySelector('.service-nav')!.getBoundingClientRect().bottom).toBeLessThanOrEqual(mission.getBoundingClientRect().top+1);
    expect(root.querySelectorAll('.pin-spacer').length).toBe(0);
    fixture.destroy();expect(ScrollTrigger.getAll().some(candidate=>root.contains(candidate.trigger!))).toBeFalse();
    await create();expect(root.querySelectorAll('.story-frame').length).toBe(1);
  });
  it('limits informational-card tilt and restores it after pointer exit',async()=>{
    reduced=false;await create();const card=root.querySelector<HTMLElement>('.capability')!;const rect=card.getBoundingClientRect();
    card.dispatchEvent(new PointerEvent('pointermove',{pointerType:'mouse',clientX:rect.right,clientY:rect.bottom}));
    expect(card.classList.contains('pointer-active')).toBeTrue();
    expect(Math.abs(parseFloat(card.style.getPropertyValue('--tilt-x')))).toBeLessThanOrEqual(2);
    expect(Math.abs(parseFloat(card.style.getPropertyValue('--tilt-y')))).toBeLessThanOrEqual(2);
    card.dispatchEvent(new PointerEvent('pointerleave'));expect(card.classList.contains('pointer-active')).toBeFalse();
    card.dispatchEvent(new PointerEvent('pointermove',{pointerType:'touch',clientX:rect.right,clientY:rect.bottom}));expect(card.classList.contains('pointer-active')).toBeFalse();
    expect(card.querySelector('a,button')).toBeNull();
  });
});
