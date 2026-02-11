import React from "react";
import topImage from "./assets/top.PNG";
import "./App.css";
import Map from "./components/Map";
import Wild from "./components/Wild";
import Header from "./components/header";
import Hero from "./components/hero";
import Footer from "./components/footer";



const App: React.FC = () => {

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      
<header>
  <Header />
</header>

<section className="hero-section" id="home">
  <Hero />
</section>


<section className="first-section">
  {/* Górny obraz */}
  <div className="layer top-layer">
    <img src={topImage} alt="Top" />
  </div>
</section>

<section className="section" id="aboutus">
<div>
<h1>A B O U T</h1>
<h3>
<h2>Bikepacking Velo Collective</h2>
<h2>“The only way to get good at cycling is to keep riding”</h2>
Most bikepackers describe the experience as <b>adventurous but meditative.</b>
It’s less about speed and more about exploration, self-reliance, and connecting with nature or remote communities.
<h2>Comfortable with:</h2>
- Navigation via GPS or maps<br/>
- Basic roadside repairs (flat tire, chain break, etc.)<br/>
- Carrying food/water for 1–2 days<br/>
-  Managing comfort and hygiene outdoors
<h2>Learning or improving at:</h2>
- Efficient packing and weight balance<br/>
- Nutrition and pacing for multi-day endurance<br/>
- Backcountry safety and weather management<br/><br/>

      <b>BLAMAGE</b> roughly translates from German as failure from blamieren +-age, coined by German students from two French components.
      Blâmer comes from Old French blasmer, which in turn derives from Late Latin blastēmāre (a variant of blasphēmāre, meaning “to blaspheme”)
      Czech: <b>blamáž</b> | Dutch: <b>blamage</b> | Polish: <b>blamaż</b> | Slovak: <b>blamáž</b>

</h3>
</div>
        </section>



      <section className="hero-section" id="home">
        <Hero />
      </section>

              <section className="section" id="trips">
          <h1>T R I P S</h1>
          <br/>
          <Map/>




        </section>

      <footer>
        <Footer />
      </footer>

    </div>
  );
};

export default App;
