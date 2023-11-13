const staticPlayer = "PWA-RadioKing-Player"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/main.js",
  "/js/settings.js",
  "/img/defaultArt.webp",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticPlayer).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })
  