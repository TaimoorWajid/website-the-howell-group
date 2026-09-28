const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const source = readFileSync('public/startup-loader.js', 'utf8');
class Element extends EventTarget {
  attrs = {}; style = {}; hidden = true; removed = false;
  classList = { add: () => {} };
  setAttribute(k, v) { this.attrs[k] = v; }
  removeAttribute(k) { delete this.attrs[k]; }
  contains() { return false; }
  remove() { this.removed = true; }
}
function setup() {
  let now = 0;
  const loader = new Element(), root = new Element(), track = new Element(), fill = new Element(), percent = new Element(), skip = new Element();
  loader.querySelector = s => ({ '.loader-track':track, '.loader-fill':fill, '.loader-percent':percent, '.loader-skip':skip })[s];
  root.querySelectorAll = () => [];
  const window = new EventTarget();
  const timers = [];
  runInNewContext(source, {
    document: { getElementById: () => loader, querySelector: () => root, readyState: 'loading', fonts: {ready: Promise.resolve()} },
    window, matchMedia: () => ({matches:false}), innerHeight:800,
    performance: { now: () => now },
    setTimeout: (fn, delay) => { const timer = {fn, delay}; timers.push(timer); return timer; },
    clearTimeout: timer => { if (timer) timer.cancelled = true; }
  });
  return {loader, root, track, skip, window, timers, advance: ms => { now += ms; }};
}
const flush = async () => { for(let i=0; i<8; i++) await Promise.resolve(); };
test('dismisses immediately after application and window readiness', async () => {
  const s = setup();
  assert.equal(s.loader.hidden, false); assert.ok('inert' in s.root.attrs);
  s.window.dispatchEvent(new Event('howell:app-ready')); await flush();
  assert.equal(s.track.attrs['aria-valuenow'], '95');
  assert.equal(s.timers.some(t=>t.delay===180), false);
  s.window.dispatchEvent(new Event('load'));
  assert.equal(s.track.attrs['aria-valuenow'], '100');
  assert.equal(s.loader.removed, true);
  assert.equal('inert' in s.root.attrs, false);
});
test('window loading first dismisses immediately when the app is ready', async () => {
  const s = setup(); s.advance(2500);
  s.window.dispatchEvent(new Event('load'));
  assert.equal(s.loader.removed, false);
  s.window.dispatchEvent(new Event('howell:app-ready')); await flush();
  assert.equal(s.loader.removed, true);
  assert.equal(s.timers.some(t=>t.delay===180), false);
  assert.equal(s.timers.some(t=>t.delay===1500), false);
});
test('a stalled boot releases the page without claiming 100 percent', () => {
  const s = setup(); s.timers.find(t=>t.delay===8000).fn();
  assert.equal('inert' in s.root.attrs, false);
  assert.notEqual(s.track.attrs['aria-valuenow'], '100');
});
test('manual skip releases the page and ignores later readiness events', async () => {
  const s = setup(); s.skip.dispatchEvent(new Event('click'));
  const progress = s.track.attrs['aria-valuenow'];
  s.window.dispatchEvent(new Event('howell:app-ready')); s.window.dispatchEvent(new Event('load')); await flush();
  assert.equal('inert' in s.root.attrs, false);
  assert.equal(s.track.attrs['aria-valuenow'], progress);
});
test('bootstrap failure immediately clears the loading screen', () => {
  const s = setup(); s.window.dispatchEvent(new Event('howell:app-error'));
  assert.equal('inert' in s.root.attrs, false);
  assert.ok(s.timers.find(t=>t.delay===8000).cancelled);
});
