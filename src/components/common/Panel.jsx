import { useEffect, useRef, useState } from "react";
import Typewriter from "./Typewriter";
import ArrowButton from "./ArrowButton";

// Kafel ze zdjęciem i podpisem u dołu: duży tytuł, linijka „z maszyny” i przycisk-strzałka (wzór: polymer.ws).
// variant: "full" – na całą szerokość i wysokość ekranu, "card" – zaokrąglona karta 16:9 (na telefonie 9:16).
// Zdjęcie wchodzi efektem „prześwietlenia” (zoom-expose), gdy kafel pojawi się na ekranie.
export default function Panel({
  id,
  image,
  alt = "",
  title,
  tagline,
  href,
  linkLabel,
  external = false,
  align = "start",
  variant = "card",
  eager = false,
  onImageLoad,
  className = "",
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tile = (
    <div ref={ref} className={`panel panel--${variant} panel--${align} ${inView ? "is-in" : ""} ${className}`} data-light-ui>
      <img
        className="panel__img"
        src={image}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={onImageLoad}
        onError={onImageLoad}
      />
      <div className="panel__body">
        <h2 className="h2 panel__title">{title}</h2>
        {tagline && <Typewriter as="p" className="pitch panel__tagline" text={tagline} />}
        {href && <ArrowButton href={href} label={linkLabel ?? title} external={external} stretch />}
      </div>
    </div>
  );

  if (variant === "card") {
    return (
      <section id={id} className="container block">
        {tile}
      </section>
    );
  }
  return (
    <section id={id} className="panel-wrap">
      {tile}
    </section>
  );
}
