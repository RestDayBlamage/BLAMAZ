import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import TripsSection from "./sections/TripsSection";
import CampsSection from "./sections/CampsSection";
import InstagramSection from "./sections/InstagramSection";
import StatementSection from "./sections/StatementSection";

// Strona składa się z sekcji – każda ma własny komponent w src/sections/.
// Układ i rytm wzorowane na polymer.ws: zdjęcia na cały ekran przeplatane kartami 16:9.
export default function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <TripsSection />
        <CampsSection />
        <InstagramSection />
        <StatementSection />
      </main>
      <Footer />
    </>
  );
}
