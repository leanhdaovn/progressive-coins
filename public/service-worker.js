importScripts('./sw-toolbox.js');

toolbox.router.get('/', toolbox.fastest);
toolbox.router.get('/[.](html|js|css)/', toolbox.cacheFirst);
toolbox.router.get('/[.](ico|svg)/', toolbox.cacheFirst);
toolbox.router.get('/static*', toolbox.cacheFirst);
toolbox.router.get('/v2/*', toolbox.fastest, { origin: 'https://api.bitfinex.com' });
