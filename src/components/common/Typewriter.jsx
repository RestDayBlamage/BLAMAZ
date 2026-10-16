import { useEffect, useRef, useState } from "react";

// Napis „pisany na maszynie” (jak na polymer.ws): litery pojawiają się po kolei, gdy tekst wjedzie
// na ekran, a pod ostatnią wpisaną literą miga kreska-kursor. Animacja w CSS (global.css, .tw).
// Najechanie na link/przycisk, w którym stoi napis, odtwarza animację od nowa.
export default function Typewriter({ text, as: Tag = "span", className = "" }) {
  const ref = useRef(null);
  const [run, setRun] = useState(0); // 0 – czeka na wejście w ekran, >0 – numer odtworzenia

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun((r) => r || 1);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    const host = el.closest("a, button");
    const replay = () => setRun((r) => r + 1);
    host?.addEventListener("mouseenter", replay);
    return () => {
      io.disconnect();
      host?.removeEventListener("mouseenter", replay);
    };
  }, []);

  const chars = [...text];

  return (
    <Tag ref={ref} className={`tw ${run ? "is-on" : ""} ${className}`} style={{ "--tw-n": chars.length }}>
      <span className="sr-only">{text}</span>
      {/* key = numer odtworzenia: nowe elementy restartują animację CSS */}
      <span key={run} aria-hidden="true">
        {chars.map((c, i) => (
          <span key={i} className="tw-char" style={{ "--i": i }}>
            {c}
          </span>
        ))}
      </span>
    </Tag>
  );
}
