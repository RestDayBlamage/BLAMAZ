import { useEffect, useRef } from "react";
import Typewriter from "../components/common/Typewriter";
import ArrowButton from "../components/common/ArrowButton";
import { EMAIL } from "../data/links";
import "./StatementSection.css";

// Motto na całym ekranie na zapętlonym wideo (jak na polymer.ws): GoPro na kierownicy – wyprzedzanie kolarza
// w turkusowej koszulce na zjeździe, Rest Day Blamage 2023. Dwie wersje pliku – pozioma na komputer i pionowa
// na telefon (przeglądarka wybiera po <source media>). Oryginał w media-src/2023/ (poza gitem): fragment 0:16,9–0:28,9
// w normalnym tempie (30 kl./s), 0,4 s przyciemnienia na końcu i rozjaśnienia na początku – czysty restart pętli.
const MEDIA = `${import.meta.env.BASE_URL}media`;

export default function StatementSection() {
  const videoRef = useRef(null);

  // Przy włączonym „ogranicz ruch” wideo stoi na pierwszej klatce
  useEffect(() => {
    const video = videoRef.current;
    if (video && window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.pause();
  }, []);

  return (
    <section className="statement" aria-label="Motto" data-light-ui>
      <video
        ref={videoRef}
        className="statement__video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={`${MEDIA}/keep-riding-desktop.webp`}
        aria-hidden="true"
      >
        <source media="(max-width: 639px)" src={`${MEDIA}/keep-riding-mobile.mp4`} type="video/mp4" />
        <source src={`${MEDIA}/keep-riding-desktop.mp4`} type="video/mp4" />
      </video>
      <div className="statement__body">
        <Typewriter as="p" className="pitch" text="Keep riding" />
        <h2 className="h2 statement__text">The only way to get good at cycling is to keep riding.</h2>
        <ArrowButton href={`mailto:${EMAIL}`} label="Email us" tone="silver" />
      </div>
    </section>
  );
}
