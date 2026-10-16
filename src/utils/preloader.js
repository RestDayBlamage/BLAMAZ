// Ekran ładowania z index.html (#preloader). Chowamy go, gdy pierwsze zdjęcie w hero jest gotowe,
// a awaryjnie po FALLBACK_MS – żeby nigdy nie zablokował strony (wolne łącze).
// Przebieg (jak na polymer.ws): tło przechodzi w kolor spod zdjęć i znak gaśnie (is-done) → po TINT_MS ekran
// znika (is-out) i zdejmujemy is-loading z <html> – dopiero wtedy startują animacje zdjęć i pisanie tekstów (global.css).
const FALLBACK_MS = 10000;
const TINT_MS = 500;
const FADE_MS = 400;

export function hidePreloader() {
  const el = document.getElementById("preloader");
  if (!el || el.classList.contains("is-done")) return;
  el.classList.add("is-done");
  el.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    el.classList.add("is-out");
    document.documentElement.classList.remove("is-loading");
  }, TINT_MS);
  setTimeout(() => el.remove(), TINT_MS + FADE_MS);
}

export function startPreloaderFallback() {
  setTimeout(hidePreloader, FALLBACK_MS);
}
