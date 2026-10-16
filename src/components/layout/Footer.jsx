import LazyModel from "../logo3d/LazyModel";
import Typewriter from "../common/Typewriter";
import { EMAIL, NAV, SOCIALS } from "../../data/links";
import { isMobile } from "../../utils/device";
import "./Footer.css";

// Stopka na cały ekran (jak na polymer.ws): u góry duże logo – tu interaktywny model 3D w stylu toon,
// pod nim linki wielkimi literami „z maszyny”, na dole prawa autorskie.
const LINKS = [
  ...NAV.filter((n) => n.link.startsWith("#") && n.link !== "#contact").map((n) => ({ label: n.label, url: n.link })),
  ...SOCIALS.map((s) => ({ label: s.label, url: s.url, external: true })),
  { label: "Email", url: `mailto:${EMAIL}` },
];

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__logo" role="img" aria-label="Interactive 3D BLaMaZ logo">
        <LazyModel
          url={`${import.meta.env.BASE_URL}models/blmz.glb`}
          height="100%"
          defaultZoom={isMobile ? 1.3 : 0.85}
          enableManualZoom={false}
          autoRotate={false}
          defaultRotationX={-12}
          defaultRotationY={8}
          toon
          playground={isMobile ? { count: 8 } : { count: 16, scale: 0.6 }}
        />
      </div>

      <nav className="footer__nav pitch" aria-label="Footer">
        <ul>
          {LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.url} {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}>
                <Typewriter text={l.label} />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="footer__legal">
        <p>Sometimes it’s smooth, sometimes it’s a BLaMaZ.</p>
        <p className="pitch">Blamaż.vc © {new Date().getFullYear()} All rights reserved</p>
      </div>

      {/* Licznik Elfsight – <script> wpisany w JSX nie wykonuje się w React, więc widget się nie ładuje */}
      <div className="counters">
        <div className="elfsight-app-674025be-049e-42de-b11d-ee718c146af0" data-elfsight-app-lazy></div>
      </div>
    </footer>
  );
}
