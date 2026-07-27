import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const publicDir = path.join(root, "public");

await mkdir(dist, { recursive: true });
await cp(publicDir, dist, { recursive: true, force: true });

async function listFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(absolute, relative));
    else if (!["sw.js"].includes(relative)) files.push(relative);
  }
  return files;
}

const files = (await listFiles(dist)).sort();
const fingerprint = createHash("sha256");
for (const file of files) fingerprint.update(await readFile(path.join(dist, file)));
const cacheName = `dovesono-${fingerprint.digest("hex").slice(0, 12)}`;

const serviceWorker = `const CACHE_NAME = ${JSON.stringify(cacheName)};
const FILES = ${JSON.stringify(files)};
const scopedUrl = (file) => new URL(file, self.registration.scope).toString();

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES.map(scopedUrl))));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(scopedUrl("index.html")))
    );
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
`;

await writeFile(path.join(dist, "sw.js"), serviceWorker);
await writeFile(path.join(dist, ".nojekyll"), "");

const indexPath = path.join(dist, "index.html");
let html = await readFile(indexPath, "utf8");
html = html.replace(
  "</head>",
  `  <meta name="theme-color" content="#101826">
  <meta name="description" content="Posizione e progressiva chilometrica sulle tratte ferroviarie configurate.">
  <link rel="manifest" href="./manifest.webmanifest">
</head>`
);
html = html.replace(
  "</body>",
  `  <script>
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
    }
  </script>
</body>`
);
await writeFile(indexPath, html);

console.log(`PWA pronta: ${files.length} file, cache ${cacheName}`);
