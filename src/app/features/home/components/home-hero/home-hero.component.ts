import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { AnimationManagerService } from '../../../../core/animations/animation-manager.service';

@Component({
  selector: 'app-home-hero', imports: [RouterLink],
  templateUrl: './home-hero.component.html', styleUrl: './home-hero.component.scss'
})
export class HomeHeroComponent implements OnDestroy {
  @ViewChild('backgroundVideo', { static: true }) private backgroundVideo!: ElementRef<HTMLVideoElement>;
  protected readonly playing = signal(false);
  protected readonly videoReady = signal(false);
  protected readonly videoFailed = signal(false);
  private pausedByUser = false;
  private browserReady = false;
  private inView = true;
  private visibilityObserver?: IntersectionObserver;
  private readonly visibilityChanged = (): void => this.syncPlayback();
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly animations = inject(AnimationManagerService);
  private context?: gsap.Context | null;
  private headerObserver?: ResizeObserver;
  private motion?: MediaQueryList;
  private readonly motionChanged = (): void => {
    if (this.motion?.matches) this.context?.revert();
    this.syncPlayback();
  };

  protected togglePlayback(): void {
    this.pausedByUser = this.playing();
    if (this.pausedByUser) this.backgroundVideo.nativeElement.pause();
    else this.playVideo();
  }

  protected onVideoError(): void {
    this.videoFailed.set(true);
    this.videoReady.set(false);
    this.playing.set(false);
  }

  private playVideo(): void {
    const video = this.backgroundVideo.nativeElement;
    if (this.videoFailed()) return;
    if (!video.getAttribute('src')) video.src = '/videos/howell-hero.mp4';
    video.muted = true;
    void video.play().catch(() => this.playing.set(false));
  }

  private syncPlayback(): void {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (this.motion?.matches || saveData || this.pausedByUser || !this.inView || this.document.hidden) {
      this.backgroundVideo.nativeElement.pause();
    } else this.playVideo();
  }

  constructor() {
    afterNextRender(() => {
      this.browserReady = true;
      const header = this.document.querySelector<HTMLElement>('app-header .site-header');
      if (header) {
        const measure = (): void => this.host.nativeElement.style.setProperty('--hero-header-height', `${header.getBoundingClientRect().height}px`);
        measure();
        this.headerObserver = new ResizeObserver(measure);
        this.headerObserver.observe(header);
      }
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.motion.addEventListener('change', this.motionChanged);
      this.document.addEventListener('visibilitychange', this.visibilityChanged);
      this.visibilityObserver = new IntersectionObserver(entries => {
        this.inView = entries[0].isIntersecting;
        this.syncPlayback();
      });
      this.visibilityObserver.observe(this.host.nativeElement);
      this.syncPlayback();
      if (this.motion.matches) return;
      this.context = this.animations.createContext(this.host.nativeElement, () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.hero-eyebrow', { opacity: 0, y: 6, duration: .45 }, 0)
          .from('.heading-line > span', { yPercent: 105, duration: .75, stagger: .1 }, .08)
          .from('.hero-lede', { opacity: 0, y: 10, duration: .55 }, .32)
          .from('.hero-link', { opacity: 0, y: 8, duration: .45, stagger: .07 }, .45);
      });
    });
  }

  ngOnDestroy(): void {
    this.context?.revert();
    this.headerObserver?.disconnect();
    this.visibilityObserver?.disconnect();
    this.motion?.removeEventListener('change', this.motionChanged);
    this.document.removeEventListener('visibilitychange', this.visibilityChanged);
    if (!this.browserReady) return;
    this.backgroundVideo.nativeElement.pause();
    this.backgroundVideo.nativeElement.removeAttribute('src');
    this.backgroundVideo.nativeElement.load();
  }
}
