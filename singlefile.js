// Post-build script to inline JS and CSS into index.html to bypass hosts
// that block separate .js or .css uploads (e.g., some free hosts).
// Usage: run after normal `vite build` producing dist/.

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('dist/index.html not found. Run `npm run build` first.');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');

// Collect CSS files referenced in HTML
const cssLinks = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"[^>]*>/g)].map(m => m[0]);
for (const tag of cssLinks) {
  const hrefMatch = tag.match(/href="([^"]+)"/);
  if (!hrefMatch) continue;
  const cssFileRel = hrefMatch[1];
  const cssFile = path.join(distDir, cssFileRel.replace(/^\.\//,''));
  if (fs.existsSync(cssFile)) {
    const cssContent = fs.readFileSync(cssFile, 'utf8');
    const styleTag = `<style>${cssContent}</style>`;
    html = html.replace(tag, styleTag);
    fs.unlinkSync(cssFile);
  }
}

// Collect JS module script tags
const scriptTags = [...html.matchAll(/<script type="module" src="([^"]+\.js)"><\/script>/g)].map(m => m[0]);
for (const tag of scriptTags) {
  const srcMatch = tag.match(/src="([^"]+)"/);
  if (!srcMatch) continue;
  const jsRel = srcMatch[1];
  const jsFile = path.join(distDir, jsRel.replace(/^\.\//,''));
  if (fs.existsSync(jsFile)) {
    let jsContent = fs.readFileSync(jsFile, 'utf8');
    // Inline as ES module
    const inlineTag = `<script type="module">\n${jsContent}\n</script>`;
    html = html.replace(tag, inlineTag);
    fs.unlinkSync(jsFile);
  }
}

// Optional: remove any stray preload/prefetch tags referencing removed assets
html = html.replace(/<link[^>]+rel="modulepreload"[^>]*>/g, '');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully created single-file deployment (all CSS/JS inlined).');
