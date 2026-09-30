/* Language of the site.
   - Slovak and English live together on the main pages and switch with the SK / EN buttons.
   - Czech, German, French, Italian and Polish have their own pages in /cs/, /de/, /fr/, /it/, /pl/.
   The choice is remembered. Priority: ?lang= in the URL, then the saved choice, then the browser
   language (Slovak → Slovak, one of the own languages → its pages, anything else → English). */
(function () {
  var root = document.documentElement;
  var OWN = ['cs', 'de', 'fr', 'it', 'pl'];
  var KEY = 'zzzentinel-lang';
  var script = document.currentScript;
  // Site base (dzanino.github.io/Zzzentinel/) derived from the address of this script.
  var base = script && script.src ? script.src.replace(/lang\.js(\?.*)?$/, '') : location.origin + '/';

  function save(code) { try { localStorage.setItem(KEY, code); } catch (e) {} }
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  // Language links remember the chosen language.
  document.querySelectorAll('.langbar a[data-lang-link]').forEach(function (a) {
    a.addEventListener('click', function () { save(a.getAttribute('data-lang-link')); });
  });

  // A single-language page (/cs/, /de/ …): nothing to switch here.
  var fixed = root.getAttribute('data-fixed-lang');
  if (fixed) { save(fixed); return; }

  var buttons = document.querySelectorAll('.langbar button[data-set]');
  if (!buttons.length) return;

  function setLang(code) {
    root.setAttribute('data-lang', code);
    root.setAttribute('lang', code);
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.set === code)); });
    save(code);
  }

  var query = (location.search.match(/[?&]lang=([a-z]{2})\b/) || [])[1];
  var browser = (navigator.language || 'en').toLowerCase().slice(0, 2);
  var wanted = query || saved() || browser;

  // Own language pages exist → go there (unless the person just picked SK/EN with ?lang=).
  if (!query && OWN.indexOf(wanted) >= 0 && location.href.indexOf(base) === 0) {
    var rest = location.href.slice(base.length).replace(/[?#].*$/, '').replace(/^index\.html$/, '');
    location.replace(base + wanted + '/' + rest);
    return;
  }

  var initial = (query === 'sk' || query === 'en') ? query
              : (saved() === 'sk' || saved() === 'en') ? saved()
              : (browser === 'sk') ? 'sk' : 'en';
  setLang(initial);
  buttons.forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.set); }); });
})();
