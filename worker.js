const filesToCache = [
	"Chess.htm",
	"Chess.json",
	"Chess.png",
	"ChessES.htm",
	"ChessES.json",
	"ChessFavIcon_16x16.png",
	"ChessFavIcon_192x192.png",
	"ChessFavIcon_512x512.png"
];

const staticCacheName = "chess-v1";

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(staticCacheName)
		.then(cache => {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener("fetch", event => {
	event.respondWith(
		caches.match(event.request)
		.then(response => {
			if (response) {
				return response;
			}
			return fetch(event.request)
		}).catch(error => {
		})
	);
});