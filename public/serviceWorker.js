const CACHE_NAME = "api-cache-v1";

addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.origin === "https://fakestoreapi.com") {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      )
    );
  }
});
