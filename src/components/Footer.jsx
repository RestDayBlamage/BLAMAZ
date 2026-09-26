import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-card">
        <div className="footer-brand">
          <img
            src="https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/icons/blmzsticker.png"
            alt="BLaMaZ logo"
            loading="lazy"
            className="logo-icon"
          />
          <p className="footer-claim">Sometimes it’s smooth, sometimes it’s a BLaMaZ.</p>
        </div>
        <a className="btn" href="mailto:restdayblamage@gmail.com">Say hi</a>
      </div>

      <div className="footer-bar">
        <p>© 2025 Blamaż.vc</p>
        <div className="social-icons">
    <a href="https://www.instagram.com/blamaz.vc/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
      <img src="https://raw.githubusercontent.com/RestDayBlamage/BLAMAZ/main/public/instagram.svg" alt="Instagram" />
    </a>
    <a href="https://www.strava.com/clubs/1484947" aria-label="Strava" target="_blank" rel="noopener noreferrer">
      <img src="https://raw.githubusercontent.com/RestDayBlamage/BLAMAZ/main/public/strava.svg" alt="Strava" />
    </a>
    <a href="https://www.komoot.com/user/4337639147933" aria-label="Komoot" target="_blank" rel="noopener noreferrer">
      <img src="https://raw.githubusercontent.com/RestDayBlamage/BLAMAZ/main/public/komoot.svg" alt="Komoot" />
    </a>
    <a href="https://github.com/RestDayBlamage" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
      <img src="https://raw.githubusercontent.com/RestDayBlamage/BLAMAZ/main/public/github.svg" alt="Github" />
    </a>
        </div>
      </div>
<div className="counters">
<script src="https://elfsightcdn.com/platform.js" async></script>
<div class="elfsight-app-674025be-049e-42de-b11d-ee718c146af0" data-elfsight-app-lazy></div>
</div>
    </footer>
  );
}
