

var staticCacheName = 'restaurant-static-v1';

/* On install, create a cache of the webpage so that users can access it offline */

self.addEventListener('install', function(event) {

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/skeleton',
        '/',
        '/index.html',
        '/restaurant.html',
        'css/styles.css',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'data/restaurants.json'
      ]);
    })
  );
});

/* Update the cache when website changes are may */

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/* When a cache request is made, display the page skeleton from the cache */

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
  
  if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/') {
          event.respondWith(caches.match('/skeleton'));
          return;
      }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
