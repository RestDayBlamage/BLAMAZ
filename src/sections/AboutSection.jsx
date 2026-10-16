import Panel from "../components/common/Panel";
import camp from "../assets/images/about-camp.webp";
import wildfire from "../assets/images/about-wildfire.webp";
import mural from "../assets/images/about-mural.webp";
import "./AboutSection.css";

// O nas: karta ze zdjęciem + trzy kolumny z historią (wzór: lista korzyści na polymer.ws).
// Tekst to oryginalny opis projektu podzielony na trzy części, dopasowane do zdjęć.
const STORY = [
  {
    src: camp,
    alt: "Tents and loaded bikes at a wild camp in the hills",
    title: "The beauty of wrong turns",
    text: "Unexpected storms, broken spokes, improvised camps…",
  },
  {
    src: wildfire,
    alt: "Wildfire smoke on a hillside seen from the road",
    title: "Chaos makes the best stories",
    text: "…and all the chaotic moments that turn into the best stories.",
  },
  {
    src: mural,
    alt: "Cyclist with a loaded bike in front of a colourful mural",
    title: "Embrace imperfection, ride anyway",
    text: "Laughing at mistakes, and riding anyway.",
  },
];

export default function AboutSection() {
  return (
    <>
      <Panel
        id="aboutus"
        image={wildfire}
        alt="Wildfire smoke on a hillside seen from the road"
        title="Blamage means failure. BLaMaZ doesn’t mean defeat."
        tagline="Read our story"
        href="#story"
        linkLabel="Read our story"
      />

      <ul className="container story" id="story">
        {STORY.map((item) => (
          <li key={item.title} className="story__item">
            <h3 className="h3 story__title">{item.title}</h3>
            <img className="story__img" src={item.src} alt={item.alt} width="1200" height="720" loading="lazy" decoding="async" />
            <p className="pitch story__text">{item.text}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
