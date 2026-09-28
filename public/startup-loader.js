(() => {
  const loader = document.getElementById('site-loader');
  const root = document.querySelector('app-root');
  if (!loader || !root) return;
  const track = loader.querySelector('.loader-track');
  const fill = loader.querySelector('.loader-fill');
  const percent = loader.querySelector('.loader-percent');
  const skip = loader.querySelector('.loader-skip');
  const cleanups = [];
  let finished = false;
  let value = 0;
  let appReady = false;
  let windowReady = document.readyState === 'complete';
  let timer;
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
    cleanups.forEach(cleanup => cleanup());
    root.removeAttribute('inert');
    const hadFocus = loader.contains(document.activeElement);
    loader.remove();
    if (hadFocus) document.getElementById('main-content')?.focus({ preventScroll: true });
  };
  const complete = () => {
    if (!finished && appReady && windowReady) {
      progress(100);
      dismiss();
    }
  };
  const listen = (target, event, callback) => {
    target.addEventListener(event, callback, { once: true });
    cleanups.push(() => target.removeEventListener(event, callback));
  };
  const onAppReady = () => {
    if (finished || appReady) return;
    appReady = true;
    // Background video and lazy assets must not hold an otherwise ready page.
    progress(95);
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
