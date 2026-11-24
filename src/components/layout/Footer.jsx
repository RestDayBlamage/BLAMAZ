import { useState } from "react";
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
];

export default function Footer() {
  // Kopiowanie adresu – dla osób bez skonfigurowanego programu pocztowego (mailto: wtedy nic nie robi)
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* brak dostępu do schowka – adres i tak jest widoczny i da się go zaznaczyć */
    }
  };

  return (
    <footer className="footer">
      <div className="footer__logo" role="img" aria-label="3D BLaMaZ logo">
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

      {/* Kontakt na widoku: zaproszenie + adres e-mail jako tekst (wcześniej tylko link mailto: ukryty pod „Email”) */}
      <div className="footer__contact" id="contact">
        <h2 className="h2">Ride with us, or just say hi.</h2>
        <div className="footer__email">
          <a className="footer__email-link" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <button type="button" className="footer__copy pitch" onClick={copyEmail}>
            {copied ? "Copied" : "Copy"}
          </button>
          <span className="sr-only" role="status">
            {copied ? "Email address copied" : ""}
          </span>
        </div>
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
        <p className="pitch">Blamaż.vc © {new Date().getFullYear()} All rights reserved</p>
      </div>
    </footer>
  );
}
