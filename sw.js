const cacheName = 'TRISHUL_1';
const filesToCache = [
    '/',
    '/index.html',
];

self.addEventListener('install', function(e) {
    console.info('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            cache.addAll(filesToCache).then(()=>{
                return self.clients.claim();
            });
        }).catch(e => {
            console.log(e)
        })
    );
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(key => {
                if (key !== cacheName) {
                    console.info('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        }).catch(e => {
            console.log(e)
        })
    );
});

self.addEventListener('activate',  event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  console.info('[ServiceWorker] Fetch', event.request.cache, event.request.mode);
    event.respondWith(
      caches.open(cacheName).then(function (cache) {
        console.log("cache when fetch: ", cache, cacheName, );
        return caches.match(event.request).then(response => {
          console.log("response for ", event.request, response)
          return response || fetch(event.request.clone());
        }).catch(e => {
            console.log("service-woeker fetch ERROR= ", e)
        })
      })
    );
});