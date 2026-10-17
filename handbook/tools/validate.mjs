// Checks the Starter Handbook before an update is proposed.
// Usage: node handbook/tools/validate.mjs [path-to-handbook.html]
// Exits non-zero (and prints why) if anything would break the live page.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const file = process.argv[2] || new URL('../riftbound-starter-handbook.html', import.meta.url);
const html = readFileSync(file, 'utf8');
const problems = [];

// 1. Every <script> must be valid JavaScript
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
if (scripts.length < 2) problems.push(`expected at least 2 <script> blocks, found ${scripts.length}`);
scripts.forEach((code, i) => {
  try { new vm.Script(code, { filename: `script-${i}` }); }
  catch (e) { problems.push(`script ${i} has a syntax error: ${e.message}`); }
});

// 2. The data script must run and build RIFT
let RIFT;
try {
  const sandbox = {};
  sandbox.window = sandbox; // in a browser, window is the global object
  vm.createContext(sandbox);
  vm.runInContext(scripts[0], sandbox);
  RIFT = sandbox.window.RIFT || sandbox.RIFT;
  if (!RIFT) problems.push('the data script did not define window.RIFT');
} catch (e) { problems.push(`the data script failed to run: ${e.message}`); }

// 3. Every section in the menu must exist on the page
if (RIFT && Array.isArray(RIFT.sections)) {
  for (const [id] of RIFT.sections) {
    if (!new RegExp(`<section[^>]*\\bid="${id}"`).test(html)) problems.push(`menu links to #${id} but no <section id="${id}"> exists`);
  }
}

// 4. Element ids the page script fills in must exist
const scriptRefs = new Set([...(scripts[1] || '').matchAll(/getElementById\('([^']+)'\)/g)].map(m => m[1]));
for (const id of scriptRefs) {
  if (!html.includes(`id="${id}"`)) problems.push(`page script needs an element with id="${id}", but none exists`);
}

// 5. Basic HTML balance for the tags that most often break layouts
for (const tag of ['section', 'table', 'script']) {
  const open = (html.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
  const close = (html.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
  if (open !== close) problems.push(`<${tag}> tags are unbalanced (${open} opened, ${close} closed)`);
}

if (problems.length) {
  console.error('Handbook check FAILED:\n - ' + problems.join('\n - '));
  process.exit(1);
}
console.log(`Handbook check passed: ${scripts.length} scripts, ${RIFT.sections.length} sections, ${scriptRefs.size} element hooks.`);
