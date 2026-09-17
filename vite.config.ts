import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, type Plugin } from 'vite';

function generateStandaloneHtmlPlugin(): Plugin {
  return {
    name: 'generate-standalone-html',
    closeBundle() {
      try {
        const distDir = path.resolve(__dirname, 'dist');
        const assetsDir = path.resolve(distDir, 'assets');

        if (!fs.existsSync(assetsDir)) {
          return;
        }

        const files = fs.readdirSync(assetsDir);
        const jsFileName = files.find((f) => f.endsWith('.js'));
        const cssFileName = files.find((f) => f.endsWith('.css'));

        if (!jsFileName) {
          return;
        }

        const jsBuffer = fs.readFileSync(path.join(assetsDir, jsFileName));
        const cssContent = cssFileName
          ? fs.readFileSync(path.join(assetsDir, cssFileName), 'utf-8')
          : '';

        const jsBase64 = jsBuffer.toString('base64');

        const standaloneHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GANS HR Weyak - Learning Needs Analysis (LNA)</title>
  <meta name="description" content="Enterprise Learning Needs Analysis (LNA) portal for GANS HR Weyak supporting Employee Self-Assessment, Manager Review & Endorsement, and Centralized HR Monitoring & Analytics." />
  <meta property="og:title" content="GANS HR Weyak - Learning Needs Analysis (LNA)" />
  <meta property="og:description" content="Enterprise Learning Needs Analysis (LNA) portal for GANS HR Weyak supporting Employee Self-Assessment, Manager Review & Endorsement, and Centralized HR Monitoring & Analytics." />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
${cssContent}
  </style>
</head>
<body class="bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#0275a8] selection:text-white">
  <div id="root"></div>
  <script>
    (function() {
      try {
        var b64 = "${jsBase64}";
        var bin = atob(b64);
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
          bytes[i] = bin.charCodeAt(i);
        }
        var js = new TextDecoder("utf-8").decode(bytes);
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.textContent = js;
        document.body.appendChild(s);
      } catch (err) {
        console.error("Failed to bootstrap GANS LNA standalone prototype:", err);
        var errDiv = document.createElement("div");
        errDiv.style.padding = "24px";
        errDiv.style.fontFamily = "system-ui, -apple-system, sans-serif";
        errDiv.style.color = "#b91c1c";
        errDiv.innerHTML = "<h3>Initialization Error</h3><p>" + (err && err.message ? err.message : err) + "</p>";
        document.body.appendChild(errDiv);
      }
    })();
  </script>
</body>
</html>`;

        // Write standalone file into project root and dist
        const rootTargetPath = path.resolve(__dirname, 'GANS_LNA_Standalone_Prototype.html');
        const distTargetPath = path.resolve(distDir, 'GANS_LNA_Standalone_Prototype.html');

        fs.writeFileSync(rootTargetPath, standaloneHtml, 'utf-8');
        fs.writeFileSync(distTargetPath, standaloneHtml, 'utf-8');
        console.log('✅ Generated standalone single-file prototype at GANS_LNA_Standalone_Prototype.html');
      } catch (e) {
        console.error('Failed to generate standalone HTML:', e);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), generateStandaloneHtmlPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
