// workbox 2.x 是将 workbox 核心内容放在 workbox-sw node_modules 包里维护的
// workbox 3.x 开始是将 workbox 核心 lib 放在 CDN 维护
// 当然也可以挪到自己的 CDN 维护
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-alpha.3/workbox-sw.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! workbox is loaded 🎉`);
  // HTML，如果你想让页面离线可以访问，使用 NetworkFirst，如果不需要离线访问，使用 NetworkOnly，其他策略均不建议对 HTML 使用。
  workbox.routing.registerRoute(
    new RegExp('.*\.html'),
    new workbox.strategies.NetworkFirst()
  );
  // 如果你的 CSS，JS 与站点在同一个域下，并且文件名中带了 Hash 版本号，那可以直接使用 Cache First 策略。
  workbox.routing.registerRoute(
    new RegExp('.*\.(?:js|css)'),
    new workbox.strategies.CacheFirst({
      cacheName: 'my-static-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60, // 最大的缓存数，超过之后则走 LRU 策略清除最老最少使用缓存
          maxAgeSeconds: 60, // 这只最长缓存时间为 60s
        })
      ]
    })
  );
  // 图片建议使用 Cache First，并设置一定的失效时间，请求一次就不会再变动了。
  workbox.routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif)/g,
    new workbox.strategies.CacheFirst({
      cacheName: 'my-image-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60, // 最大的缓存数，超过之后则走 LRU 策略清除最老最少使用缓存
          maxAgeSeconds: 60, // 这只最长缓存时间为 60s
        })
      ]
    })
  );
  // 缓存第三方请求的结果
  workbox.routing.registerRoute(
    'https://www.baidu.com/img/bd_logo1.png',
    new workbox.strategies.CacheFirst({
      plugins: [
        // 这个插件是让匹配的请求的符合开发者指定的条件的返回结果可以被缓存
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        })
      ]
    })
  );
} else {
  console.log(`Boo! workbox didn't load 😬`);
}
