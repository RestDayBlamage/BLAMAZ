// Pigułka ze strzałką (jak na polymer.ws) – po najechaniu rośnie lewy padding i strzałka „odjeżdża” w prawo.
// stretch: klikalny cały kafel nad przyciskiem (rodzic musi mieć position: relative).
// tone: "light" – półprzezroczysta biel na zdjęciach, "silver" – szara na jasnym tle.
export default function ArrowButton({ href, label, tone = "light", stretch = false, external = false }) {
  return (
    <a
      className={`arrow-btn arrow-btn--${tone} ${stretch ? "arrow-btn--stretch" : ""}`}
      href={href}
      aria-label={label}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">
        <path
          d="M13.59 6.4 8.52 11.46a.56.56 0 0 1-.8-.8L11.83 6.56H.81a.56.56 0 0 1 0-1.12h11.02L7.73 1.34a.56.56 0 0 1 .8-.8l5.06 5.06a.56.56 0 0 1 0 .8Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}
