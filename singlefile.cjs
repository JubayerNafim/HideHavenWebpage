// Post-build script to inline JS and CSS into index.html for single-file deployment.
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('dist/index.html not found. Run `npm run build` first.');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');

// Inline CSS
html = html.replace(/<link[^>]+href="([^"]+\.css)"[^>]*>/g, (full, href) => {
  const cssFile = path.join(distDir, href.replace(/^\.\//,''));
  if (fs.existsSync(cssFile)) {
    const css = fs.readFileSync(cssFile, 'utf8');
    try { fs.unlinkSync(cssFile); } catch {}
    return `<style>${css}</style>`;
  }
  return full;
});

// Inline JS module scripts (allow extra attributes like crossorigin)
html = html.replace(/<script[^>]*type="module"[^>]*src="([^"]+\.js)"[^>]*><\/script>/g, (full, src) => {
  const jsFile = path.join(distDir, src.replace(/^\.\//,''));
  if (fs.existsSync(jsFile)) {
    const js = fs.readFileSync(jsFile, 'utf8');
    try { fs.unlinkSync(jsFile); } catch {}
    return `<script type="module">\n${js}\n</script>`;
  }
  return full;
});

// Inline any remaining non-module JS scripts (fallback)
html = html.replace(/<script(?![^>]*type="module")[^>]*src="([^"]+\.js)"[^>]*><\/script>/g, (full, src) => {
  const jsFile = path.join(distDir, src.replace(/^\.\//,''));
  if (fs.existsSync(jsFile)) {
    const js = fs.readFileSync(jsFile, 'utf8');
    try { fs.unlinkSync(jsFile); } catch {}
    return `<script>\n${js}\n</script>`;
  }
  return full;
});

// Remove modulepreload links pointing to removed JS
html = html.replace(/<link[^>]+rel="modulepreload"[^>]*>/g, '');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Single-file build created: dist/index.html now has inline CSS/JS.');
