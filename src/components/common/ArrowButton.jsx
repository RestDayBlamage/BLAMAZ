// Pigułka z opisem i strzałką. Opis jest widoczny (wcześniej sama strzałka – nie było wiadomo, czy przycisk
// przewija stronę, otwiera maila czy inną stronę). Po najechaniu strzałka „odjeżdża” w prawo.
// stretch: klikalny cały kafel nad przyciskiem (rodzic musi mieć position: relative).
// tone: "light" – półprzezroczysta biel na zdjęciach, "silver" – szara na jasnym tle, "accent" – kontakt.
// external: strzałka skośna ↗ i otwarcie w nowej karcie. Linki mailto: dostają ton "accent" automatycznie.
export default function ArrowButton({ href, label, tone, stretch = false, external = false }) {
  const isMail = href?.startsWith("mailto:");
  const resolvedTone = tone === undefined || isMail ? (isMail ? "accent" : "light") : tone;

  return (
    <a
      className={`arrow-btn arrow-btn--${resolvedTone} ${external ? "arrow-btn--external" : ""} ${stretch ? "arrow-btn--stretch" : ""}`}
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <span className="arrow-btn__label">{label}</span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
      <svg className="arrow-btn__icon" width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">
        <path
          d="M13.59 6.4 8.52 11.46a.56.56 0 0 1-.8-.8L11.83 6.56H.81a.56.56 0 0 1 0-1.12h11.02L7.73 1.34a.56.56 0 0 1 .8-.8l5.06 5.06a.56.56 0 0 1 0 .8Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}
