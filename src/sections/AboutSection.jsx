import Panel from "../components/common/Panel";
import { TRIPS } from "../data/trips";
import { COLORS } from "../styles/tokens";
import { PHOTOS } from "../data/photos";
import "./AboutSection.css";

// O nas: karta ze zdjęciem, a pod nią trzy prawdziwe historie z wypraw połączone „objazdem” –
// przerywaną linią trasy, która skręca nie tam, gdzie trzeba (każdy odcinek ma wzór kreski swojej wyprawy,
// ten sam co na mapie tras). Fakty pochodzą z danych, nie z wyobraźni:
// - Chur: nocleg „Military Base Chur” w src/data/camps.js (wyprawa 2024),
// - Učka: najwyższy punkt śladu GPX 2023 (ok. 1 347 m, nad Opatiją, nocleg w Ičići),
// - Splügen: wyprawa 2024, wrzesień – całodniowy podjazd i śnieg na górze (relacja ekipy); ślad GPX 2024
//   dochodzi do ok. 1 982 m między Thusis a Chiavenną (uproszczony ślad ścina szczyt przełęczy, stąd „ponad 2 000 m”).
// Zdjęcia ilustrują nastrój historii – nie twierdzimy, że zrobiono je dokładnie w tych miejscach.
const trip = (year) => TRIPS.find((t) => t.year === year);

const STORY = [
  {
    year: 2024,
    photo: PHOTOS.camp,
    alt: "Tents and loaded bikes at a wild camp in the hills",
    title: "The beauty of wrong turns",
    meta: "2024 · Chur, Switzerland · wild camp",
    text: "One night near Chur we pitched the tents and called it a wild camp. It was a military training ground.",
  },
  {
    year: 2023,
    photo: PHOTOS.wildfire,
    alt: "Wildfire smoke on a hillside seen from the road",
    title: "Chaos makes the best stories",
    meta: "2023 · Učka, Croatia · 1 347 m",
    text: "1 886 km through seven countries, from Poland down to the Adriatic, and then up to 1 347 m on Učka. Because the sea was too flat.",
  },
  {
    year: 2024,
    photo: PHOTOS.mural,
    alt: "Cyclist with a loaded bike in front of a colourful mural",
    title: "Embrace imperfection, ride anyway",
    meta: "2024 · Splügen Pass · over 2 000 m",
    text: "September, the Splügen Pass. We climbed all day, and at the top the snow was waiting for us. Laughing at mistakes, and riding anyway.",
  },
];

// Odcinek „objazdu” między historiami: krzywa z jednej strony na drugą, wzorem kreski wyprawy z niższej historii
function Detour({ flip, dash }) {
  return (
    <svg className={`story__detour ${flip ? "story__detour--flip" : ""}`} viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M120 0 C 120 70, 260 20, 330 64 S 480 120, 480 120"
        fill="none"
        stroke={COLORS.dark}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={dash ?? "1 0"}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function AboutSection() {
  return (
    <>
      <Panel
        id="aboutus"
        image={PHOTOS.wildfire}
        alt="Wildfire smoke on a hillside seen from the road"
        title="Blamage means failure. BLaMaZ doesn’t mean defeat."
        tagline="Read our story"
        href="#story"
        linkLabel="Read our story"
      />

      <ol className="container story" id="story">
        {STORY.map((item, i) => (
          <li key={item.title} className={`story__item ${i % 2 ? "story__item--flip" : ""}`}>
            {i > 0 && <Detour flip={i % 2 === 0} dash={trip(item.year)?.dash} />}
            <figure className="story__figure">
              <img
                className="story__img"
                src={item.photo.src}
                srcSet={item.photo.srcSet}
                sizes="(min-width: 768px) 55vw, 100vw"
                alt={item.alt}
                width={item.photo.width}
                height={item.photo.height}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="story__body">
              <h3 className="h2 story__title">{item.title}</h3>
              <p className="pitch story__meta">{item.meta}</p>
              <p className="story__text">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
