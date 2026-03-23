const CACHE_NAME = 'portfolio-assets-v3';
const ASSETS_TO_CACHE = [
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771360409/main_background_qck2gt.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771360409/main_background_2_dk0hen.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771360409/main_background_3_bcvpkx.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/hero_selection_loud_bdty1t.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488779/Game_Over_bpawbn.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%D1%86%D0%B8%D1%8F_luobxd.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%92%D1%8B%D0%B1%D0%BE%D1%80_%D0%B3%D0%B5%D1%80%D0%BE%D1%8F_jval80.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B7%D0%B2%D1%83%D0%BA_%D1%84%D0%B0%D0%BA%D1%82%D0%B0_n1qwe2.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488771/%D0%9E%D1%82%D1%81%D1%87%D0%B5%D1%82_%D1%80%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B0_odewjy.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488774/%D0%BF%D1%80%D1%8B%D0%B6%D0%BE%D0%BA_juaj6a.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488777/%D0%A0%D0%B5%D0%BF%D0%BB%D0%B8%D0%BA%D0%B0_%D0%B2_%D1%80%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B5_nymdvj.mp3',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771491171/game_logo_yex451.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490572/%D0%9C%D1%83%D0%B4%D0%B1%D0%BE%D1%80%D1%8F_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_yakafm.png',
  '/assets/Мудборя_mini.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/SMM%D0%B0%D1%80%D0%B8%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_jfrqki.png',
  '/assets/SMMарио_mini.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/%D0%91%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D1%8C%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_b3cxqq.png',
  '/assets/Брендиньо_миниатюра.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771491172/road_newest_wbc37l.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771491172/city_final_upd_wygefa.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490597/%D0%A4%D0%BE%D0%BD_nllusy.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490810/about_icon_fi3b5s.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490813/resume_icon_sdpmqk.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490810/contacts_icon_pgy4ei.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Service Worker: Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/assets/') || event.request.url.includes('res.cloudinary.com')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }).catch(() => {
          return caches.match(event.request);
        });
      })
    );
  }
});
