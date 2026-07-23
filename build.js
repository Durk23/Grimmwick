// Bundle Grimmwick into a single self-contained HTML file.
// Maximum-compatibility build: classic inline <script> tags only —
// no ES modules, no top-level await, no blob imports (Safari/WKWebView/sandbox safe).
// Usage: node build.js  →  dist/grimmwick.html + dist_cap/index.html
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
// every src/*.js, concatenated in filename order (single shared scope)
const SRC_ORDER = fs.readdirSync(path.join(ROOT,'src')).filter(f=>f.endsWith('.js')).sort();

// 1) three.js as a plain global (IIFE) via esbuild
const entry = path.join(ROOT, '.three-entry.js');
const out = path.join(ROOT, '.three-global.js');
fs.writeFileSync(entry, "import * as T from 'three'; window.THREE = T;\n");
execSync(`npx esbuild ${JSON.stringify(entry)} --bundle --minify --format=iife --outfile=${JSON.stringify(out)}`, {cwd: ROOT, stdio: 'pipe'});
let threeGlobal = fs.readFileSync(out, 'utf8');

// 2) game sources, concatenated in order (single shared scope)
let game = '';
for(const f of SRC_ORDER){
  const code = fs.readFileSync(path.join(ROOT,'src',f),'utf8');
  game += '\n// ======== '+f+' ========\n'+code+'\n';
}

// guard against accidental script-tag termination inside JS strings
const sanitize = s => s.replace(/<\/script/gi, '<\\/script');
threeGlobal = sanitize(threeGlobal);
game = sanitize(game);

const html = [
'<!DOCTYPE html>',
'<html lang="en">',
'<head>',
'<meta charset="utf-8">',
'<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">',
'<meta name="apple-mobile-web-app-capable" content="yes">',
'<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
'<title>Grimmwick — Relight the Night</title>',
'<style>html,body{margin:0;background:#0d0a18;height:100%;overflow:hidden}canvas{display:block;position:fixed;inset:0}',
'#glfail{display:none;position:fixed;inset:0;color:#fff;font-family:system-ui,sans-serif;align-items:center;justify-content:center;text-align:center;padding:30px;background:#1b1438}',
'#glfail .in{max-width:420px}#glfail h2{color:#ffb35e;margin-bottom:10px}</style>',
'</head>',
'<body>',
'<div id="glfail"><div class="in"><h2>🎃 Grimmwick needs 3D</h2><p>This viewer can\'t run WebGL. Save this file and open it in Safari or Chrome — double-click it in Finder and the game starts right up.</p></div></div>',
'<script>',
threeGlobal,
'</'+'script>',
'<script>',
'try{',
game,
'}catch(e){',
'  console.error(e);',
'  var f=document.getElementById("glfail"); if(f){f.style.display="flex";}',
'}',
'</'+'script>',
'</body>',
'</html>',
].join('\n');

fs.mkdirSync(path.join(ROOT,'dist'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'dist','grimmwick.html'), html);
fs.mkdirSync(path.join(ROOT,'dist_cap'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'dist_cap','index.html'), html);
fs.unlinkSync(entry); fs.unlinkSync(out);
console.log('built dist/grimmwick.html + dist_cap/index.html', (html.length/1024).toFixed(0)+'KB');
