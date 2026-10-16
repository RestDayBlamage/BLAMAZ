import { useEffect, useRef, useState } from "react";
import { LOGO_LETTERS, LOGO_VIEWBOX } from "./logoPaths";

// Logo u góry na środku (jak na polymer.ws). Po zniknięciu ekranu ładowania litery rysują się konturem jedna
// po drugiej, a na końcu wypełniają (animacja w global.css, .brand-logo). Nad zdjęciami logo jest białe,
// na jasnym tle ciemne – sekcje ze zdjęciem pod spodem mają atrybut data-light-ui.
export default function BrandLogo() {
  const ref = useRef(null);
  const [light, setLight] = useState(true);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const logo = ref.current;
      if (!logo) return;
      const r = logo.getBoundingClientRect();
      const y = r.top + r.height / 2;
      const x = r.left + r.width / 2;
      const under = [...document.querySelectorAll("[data-light-ui]")].some((el) => {
        const b = el.getBoundingClientRect();
        return b.top <= y && b.bottom >= y && b.left <= x && b.right >= x;
      });
      setLight(under);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <a ref={ref} className={`brand-logo ${light ? "brand-logo--light" : ""}`} href="#home" aria-label="BLaMaZ – home">
      <svg viewBox={LOGO_VIEWBOX} aria-hidden="true">
        {LOGO_LETTERS.map((d, i) => (
          <path key={i} d={d} pathLength="100" style={{ "--i": i }} />
        ))}
      </svg>
    </a>
  );
}
