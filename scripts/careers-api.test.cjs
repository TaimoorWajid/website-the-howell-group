const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { mkdtemp, readFile, readdir, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { randomUUID } = require('node:crypto');
const ts = require('typescript');
const Module = require('node:module');
const express = require('express');
function loadTs(path) {
  const file = resolve(path);
  const compiled = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = new Module(file, moduleParent);
  module.filename = file; module.paths = Module._nodeModulePaths(resolve('src'));
  const original = module.require.bind(module);
  module.require = name => name.startsWith('.') ? loadTs(resolve(require('node:path').dirname(file), name + '.ts')) : original(name);
  module._compile(compiled, file); return module.exports;
}
const moduleParent = module;
const { createCareersRouter } = loadTs('src/server/careers-api.ts');
const { PREVIEW_JOBS } = loadTs('src/app/core/data/careers-preview.data.ts');
const payload = () => ({ requestId: randomUUID(), jobId: 'THG-101', firstName: 'Test', lastName: 'Applicant', email: 'test@example.com', phone: '+1 555 010 0123', location: 'Test City', profile: '', introduction: '', consent: true, website: '', resume: { name: 'test-resume.pdf', data: Buffer.from('%PDF-1.4\nTest resume fixture\n%%EOF').toString('base64') } });
async function fixture(t, options = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'howell-careers-test-'));
  const app = express(); app.use('/api/careers', createCareersRouter({ storageDir: directory, ...options }));
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/api/careers`;
  return { directory, get: () => fetch(url), post: (body, headers = {}) => fetch(url + '/applications', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }) };
}
test('preview catalog is explicitly identified and contains linked role details', async t => {
  const f = await fixture(t); const res = await f.get(); const data = await res.json();
  assert.equal(res.status, 200); assert.equal(data.mode, 'preview'); assert.equal(data.jobs.length, 4);
  assert.ok(data.jobs.every(job => job.slug && job.responsibilities.length && job.qualifications.length));
});
test('valid application is durably saved and repeated requests return the same receipt', async t => {
  const f = await fixture(t); const body = payload();
  const responses = await Promise.all([f.post(body), f.post(body)]);
  assert.ok(responses.every(res => res.status === 201));
  const receipts = await Promise.all(responses.map(res => res.json()));
  assert.deepEqual(receipts[0], receipts[1]); assert.match(receipts[0].reference, /^THG-[A-F0-9]{12}$/);
  const files = await readdir(f.directory); assert.equal(files.length, 1);
  const stored = JSON.parse(await readFile(join(f.directory, files[0]), 'utf8'));
  assert.equal(stored.application.email, body.email); assert.deepEqual(stored.application.resume, body.resume);
  assert.equal((await f.post({ ...body, firstName: 'Changed' })).status, 409);
});
test('invalid contact fields, consent, spam and disguised uploads are rejected', async t => {
  const f = await fixture(t);
  for (const patch of [ { firstName: '  ' }, { email: 'invalid' }, { phone: 'abc' }, { consent: false }, { website: 'spam' }, { profile: 'javascript:alert(1)' }, { resume: { name: 'fake.pdf', data: Buffer.from('not a pdf').toString('base64') } }, { resume: { name: 'tiny.docx', data: 'UA==' } }, { resume: { name: '../bad.pdf', data: payload().resume.data } } ]) {
    const response = await f.post({ ...payload(), ...patch }); assert.equal(response.status, 400, JSON.stringify(patch));
  }
  assert.equal((await readdir(f.directory)).length, 0);
});
test('closed roles and cross-origin requests do not create applications', async t => {
  const f = await fixture(t);
  assert.equal((await f.post({ ...payload(), jobId: 'closed-role' })).status, 410);
  assert.equal((await f.post(payload(), { Origin: 'https://unrelated.example' })).status, 403);
});
test('live mode fails closed without approved catalog configuration', async t => {
  const f = await fixture(t, { mode: 'live' }); assert.equal((await f.get()).status, 503); assert.equal((await f.post(payload())).status, 503);
});
test('live catalog excludes expired jobs and saves a live receipt', async t => {
  const path = join(await mkdtemp(join(tmpdir(), 'howell-jobs-test-')), 'jobs.json');
  await writeFile(path, JSON.stringify([PREVIEW_JOBS[0], { ...PREVIEW_JOBS[1], closingDate: '2000-01-01' }]));
  const f = await fixture(t, { mode: 'live', jobsFile: path });
  const catalog = await (await f.get()).json(); assert.equal(catalog.mode, 'live'); assert.equal(catalog.jobs.length, 1);
  assert.equal((await (await f.post(payload())).json()).mode, 'live');
  assert.equal((await f.post({ ...payload(), jobId: 'THG-102' })).status, 410);
});
test('application storage cannot be located under public assets', async t => {
  const f = await fixture(t, { storageDir: resolve('public/applications') }); assert.equal((await f.get()).status, 503);
});
