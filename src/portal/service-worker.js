/* eslint-disable */

(function() {
	importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js');

	// DEV ENVIROMENT
	workbox.setConfig({ debug: true });
    
    // CACHE NAMES
	workbox.core.setCacheNameDetails({
        prefix: 'consul',
        suffix: 'PWACNS',
        precache: 'precache',
        runtime: 'run-time',
        googleAnalytics: 'ga',
      });
    
    // PRECACHE
    workbox.precaching.precacheAndRoute([
            { url: '../arquivos/consul2-style.css', revision: '/* @echo swVersion */'},
            { url: '../arquivos/consul2-app.min.js', revision: '/* @echo swVersion */'}
        ],
        {
            ignoreUrlParametersMatching: [/.*/]
        }
    );

    // ROUTERS

    // HOME
    workbox.routing.registerRoute(
        '/',
        workbox.strategies.staleWhileRevalidate()
    );

    workbox.skipWaiting();

	if (workbox) {
		console.log(`Yay! Workbox is loadeeed 🎉`);
	} else {
		console.log(`Boo! Workbox didn't load 😬`);
	}
})()
