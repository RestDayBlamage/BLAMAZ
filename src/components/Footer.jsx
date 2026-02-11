import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="logo">
            <img 
              src="https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/icons/blmzlogo.png" 
              alt="Untitled UI logo" 
              className="logo-icon" 
            />
          </div>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h4>T E C H</h4>
            <ul>
            <li>
              <a href="https://react.dev/" aria-label="React" className="footer-link">React</a>
            </li>
            <li>
              <a href="https://vite.dev/" aria-label="Vite" className="footer-link">Vite</a>
            </li>
            </ul>
          </div>      
          <div className="footer-col">
            <h4>F O N T S</h4>
            <ul>
            <li>
              <a href="https://fonts.google.com/specimen/Montserrat" aria-label="Montserrat" className="footer-link" style={{ fontFamily: "'Montserrat'" }}>Montserrat</a>
            </li>
            <li>
              <a href="https://www.dafont.com/boeotia.font" aria-label="Boeotia" className="footer-link" style={{ fontFamily: "'Boeotia'" }}>Boeotia</a>
            </li>
            <li>
              <a href="https://www.1001fonts.com/bestie-seventy-font.html" aria-label="Bestie Seventy" className="footer-link" style={{ fontFamily: "'Bestie Seventy'" }}>Bestie Seventy</a>
            </li>
            <li>
              <a href="https://fontm.com/popstar-font/" aria-label="Popstar" className="footer-link" style={{ fontFamily: "'Popstar'" }}>Popstar</a>
            </li>
            <li>
              <a href="https://www.dafont.com/boyrun.font" aria-label="Boyrun" className="footer-link" style={{ fontFamily: "'Boyrun'" }}>Boyrun</a>
            </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>S O C I A L</h4>
            <ul>
            <li>
              <a href="https://www.instagram.com/blamaz.vc/" aria-label="Email me" className="footer-link">Instagram</a>
            </li>
            <li>
              <a href="https://www.instagram.com/blamaz.vc/" aria-label="Email me" className="footer-link">GitHub</a>
            </li>
            </ul>
          </div>


        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Blamaż.vc</p>
        <div className="social-icons">
    <a href="https://www.instagram.com/blamaz.vc/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
      <img src="https://raw.githubusercontent.com/RestDayBlamage/APR/main/public/instagram.svg" alt="Instagram" />
    </a>
    <a href="https://www.strava.com/clubs/1484947" aria-label="Strava" target="_blank" rel="noopener noreferrer">
      <img src="https://raw.githubusercontent.com/RestDayBlamage/APR/main/public/strava.svg" alt="Strava" />
    </a>
    <a href="https://www.komoot.com/user/4337639147933" aria-label="Komoot" target="_blank" rel="noopener noreferrer">
      <img src="https://raw.githubusercontent.com/RestDayBlamage/APR/main/public/komoot.svg" alt="Komoot" />
    </a>
    <a href="https://github.com/RestDayBlamage" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
      <img src="https://raw.githubusercontent.com/RestDayBlamage/APR/main/public/github.svg" alt="Github" />
    </a>
        </div>
      </div>
<div className="counters">
<script src="https://elfsightcdn.com/platform.js" async></script>
<div class="elfsight-app-674025be-049e-42de-b11d-ee718c146af0" data-elfsight-app-lazy></div>
<br/><br/>
</div>
    </footer>
  );
}
