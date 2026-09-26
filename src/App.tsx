import React from "react";
import one from "./assets/1.jpg";
import two from "./assets/2.jpg";
import three from "./assets/3.jpg";
import four from "./assets/4.jpg";
import "./App.css";
import Map from "./components/Map";
import Wild from "./components/Wild";
import Header from "./components/header";
import Footer from "./components/Footer";
import ProjectTile from './components/ProjectTile';
import LazyModel from "./components/LazyModel";



// Na wąskim ekranie kamera dalej, żeby cały napis się zmieścił
const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

const App: React.FC = () => {

  return (
    <div>

<header>
  <Header />
</header>

<section className="hero-section" id="home">
  <div className="hero-card">
    <span className="hero-blob hero-blob--1" aria-hidden="true" />
    <span className="hero-blob hero-blob--2" aria-hidden="true" />
    <span className="hero-blob hero-blob--3" aria-hidden="true" />
    <h1 className="sr-only">BLaMaZ – Bikepacking, Wild Camps &amp; Euro Cycling Trips</h1>
    <div className="hero-model" role="img" aria-label="Interactive 3D BLaMaZ logo">
      <LazyModel
        url={`${import.meta.env.BASE_URL}models/blmz.glb`}
        height="100%"
        defaultZoom={isMobile ? 2.2 : 0.9}
        enableManualZoom={false}
        autoRotate={false}
        defaultRotationX={-12}
        defaultRotationY={8}
        toon
      />
    </div>
    <span className="pill pill--light hint hero-hint">Drag to rotate</span>
  </div>
</section>

<section className="section" id="aboutus">
  <div className="section-head">
    <h2 className="heading-1">About <span className="pill">us</span></h2>
    <p className="paragraph-large">
      Roughly translated from German, Blamage means “failure” or “embarrassment.”
      But <b>BLaMaZ</b> doesn’t mean defeat.
    </p>
  </div>

  <div className="about-gallery">
    <img className="media" src={one} alt="BLaMaZ cyclists on a bikepacking trip" loading="lazy" />
    <img className="media" src={two} alt="Loaded touring bikes on a gravel road" loading="lazy" />
    <img className="media" src={three} alt="Cycling through mountains in Southeastern Europe" loading="lazy" />
  </div>

  <div className="about-story">
    <h3 className="heading-3">
      Sometimes it’s <span className="nowrap"><span className="pill pill--light">smooth</span>,</span> sometimes it’s a <span className="pill pill--magenta">BLaMaZ</span>
    </h3>
    <p className="paragraph-large">
      It represents the beauty of wrong turns, unexpected storms, broken spokes, improvised camps, and all the chaotic moments that turn into the best stories. It’s about embracing imperfection, laughing at mistakes, and riding anyway.
    </p>
  </div>

  <img className="media media--wide" src={four} alt="Wild camp set up after a day of riding" loading="lazy" />
</section>

<section className="section" id="camps">
  <div className="section-head">
    <h2 className="heading-1">Wild <span className="pill pill--magenta">camps</span></h2>
    <p className="paragraph-large">
      During our travels, we created a <b>map of our overnight spots</b> across Southeastern Europe.
    </p>
  </div>

  <div className="map-card">
    <Wild/>
  </div>

  <div className="stats">
    <div className="stat">
      <span className="stat-dot stat-dot--black" aria-hidden="true" />
      <span className="stat-number">36</span>
      <p className="paragraph"><b>Black markers</b> show places where we camped in the wild, free stays surrounded by nature.</p>
    </div>
    <div className="stat">
      <span className="stat-dot stat-dot--white" aria-hidden="true" />
      <span className="stat-number">14</span>
      <p className="paragraph"><b>White markers</b> mark campsites, where we could finally take a hot shower after days on the road.</p>
    </div>
    <div className="stat">
      <span className="stat-dot stat-dot--orange" aria-hidden="true" />
      <span className="stat-number">1</span>
      <p className="paragraph"><b>And the orange one?</b> That’s our most memorable stop, the night we accidentally camped on a military training ground in Switzerland.</p>
    </div>
  </div>
</section>

<section className="section" id="trips">
  <div className="section-head">
    <h2 className="heading-1">Euro <span className="pill">trips</span></h2>
    <p className="paragraph-large">
      Four summers, thirteen countries and thousands of kilometres of routes, one GPX track at a time.
    </p>
  </div>

  <div className="map-card">
    <Map/>
  </div>

  <ProjectTile />
</section>

<div className="statement">
  <div className="statement-card">
    <p className="heading-1">Keep <span className="pill pill--magenta">riding</span></p>
    <p className="quote">“The only way to get good at cycling is to keep riding”</p>
  </div>
</div>

      <footer id="contact">
        <Footer />
      </footer>

    </div>
  );
};

export default App;
