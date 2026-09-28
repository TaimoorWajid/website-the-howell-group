(() => {
  const loader = document.getElementById('site-loader');
  const root = document.querySelector('app-root');
  if (!loader || !root) return;
  const track = loader.querySelector('.loader-track');
  const fill = loader.querySelector('.loader-fill');
  const percent = loader.querySelector('.loader-percent');
  const skip = loader.querySelector('.loader-skip');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startedAt = performance.now();
  const minimumVisibleTime = reduced ? 400 : 1500;
  const cleanups = [];
  let finished = false;
  let value = 0;
  let appReady = false;
  let windowReady = document.readyState === 'complete';
  let assetsReady = false;
  let timer;
  let completionTimer;
  const progress = next => {
    if (finished) return;
    value = Math.max(value, Math.min(100, Math.round(next)));
    fill.style.transform = `scaleX(${value / 100})`;
    percent.textContent = `${value}%`;
    track.setAttribute('aria-valuenow', String(value));
  };
  const dismiss = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    clearTimeout(completionTimer);
    cleanups.forEach(cleanup => cleanup());
    root.removeAttribute('inert');
    const hadFocus = loader.contains(document.activeElement);
    loader.classList.add('is-leaving');
    if (hadFocus) document.getElementById('main-content')?.focus({ preventScroll: true });
    setTimeout(() => loader.remove(), reduced ? 0 : 450);
  };
  const complete = () => {
    if (!finished && completionTimer === undefined && appReady && windowReady && assetsReady) {
      progress(100);
      // Cached reloads still show the brand moment; slow loads add no extra hold.
      const remaining = Math.max(0, minimumVisibleTime - (performance.now() - startedAt));
      completionTimer = setTimeout(dismiss, Math.max(reduced ? 0 : 180, remaining));
    }
  };
  const listen = (target, event, callback) => {
    target.addEventListener(event, callback, { once: true });
    cleanups.push(() => target.removeEventListener(event, callback));
  };
  const mediaReady = (element, success, failure, ready) => new Promise(resolve => {
    if (ready()) return resolve();
    const settle = () => {
      element.removeEventListener(success, settle);
      element.removeEventListener(failure, settle);
      resolve();
    };
    listen(element, success, settle);
    listen(element, failure, settle);
  });
  const onAppReady = () => {
    if (finished || appReady) return;
    appReady = true;
    progress(35);
    // Track a fixed set of first-screen assets, not offscreen lazy images or
    // the entire looping video. Percentages describe readiness, not byte counts.
    const images = [...root.querySelectorAll('img')].filter(image => {
      const rect = image.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.top < innerHeight && rect.bottom > 0;
    });
    const videos = [...root.querySelectorAll('video')].filter(video => {
      const rect = video.getBoundingClientRect();
      return video.getAttribute('src') && rect.top < innerHeight && rect.bottom > 0;
    });
    const tasks = [document.fonts ? document.fonts.ready : Promise.resolve(),
      ...images.map(image => mediaReady(image, 'load', 'error', () => image.complete)),
      ...videos.map(video => mediaReady(video, 'loadeddata', 'error', () => video.readyState >= 2 || !!video.error))];
    let settled = 0;
    tasks.forEach(task => Promise.resolve(task).catch(() => {}).then(() => {
      settled++;
      progress(35 + (settled / tasks.length) * 60);
      if (settled === tasks.length) { assetsReady = true; complete(); }
    }));
    complete();
  };
  // Fail open even when application boot or a media request never completes.
  timer = setTimeout(dismiss, 8000);
  loader.hidden = false;
  root.setAttribute('inert', '');
  skip.addEventListener('click', dismiss, { once: true });
  const preventScroll = event => event.preventDefault();
  loader.addEventListener('wheel', preventScroll, { passive: false });
  cleanups.push(() => loader.removeEventListener('wheel', preventScroll));
  listen(window, 'howell:app-ready', onAppReady);
  listen(window, 'howell:app-error', dismiss);
  listen(window, 'load', () => { windowReady = true; progress(appReady ? value : 20); complete(); });
  progress(windowReady ? 20 : 10);
})();
