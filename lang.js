/* Language switch (SK / EN). The choice is remembered across all pages.
   Priority: ?lang= in the URL, then the saved choice, then the browser language. */
(function () {
  var root = document.documentElement;
  var KEY = 'zzzentinel-lang';

  function setLang(code) {
    root.setAttribute('data-lang', code);
    root.setAttribute('lang', code);
    document.querySelectorAll('.langbar button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.set === code));
    });
    try { localStorage.setItem(KEY, code); } catch (e) {}
  }

  var fromUrl = (new URLSearchParams(location.search).get('lang') || '').toLowerCase();
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var browser = (navigator.language || 'en').toLowerCase();
  var initial = (fromUrl === 'sk' || fromUrl === 'en') ? fromUrl
              : (saved === 'sk' || saved === 'en') ? saved
              : (browser.indexOf('sk') === 0 || browser.indexOf('cs') === 0) ? 'sk' : 'en';
  setLang(initial);

  document.querySelectorAll('.langbar button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.set); });
  });
})();
