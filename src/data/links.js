// Linki kontaktowe i społecznościowe – wspólne dla menu i stopki.
export const EMAIL = "restdayblamage@gmail.com";

export const SOCIALS = [
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/blamaz.vc/" },
  { id: "strava", label: "Strava", url: "https://www.strava.com/clubs/1484947" },
  { id: "komoot", label: "Komoot", url: "https://www.komoot.com/user/4337639147933" },
  { id: "github", label: "GitHub", url: "https://github.com/RestDayBlamage" },
];

// Sekcje strony w menu. Bez osobnych ariaLabel – czytnik ekranu czyta widoczny tekst (WCAG 2.5.3).
export const NAV = [
  { label: "Home", link: "#home" },
  { label: "About", link: "#aboutus" },
  { label: "Camps", link: "#camps" },
  { label: "Trips", link: "#trips" },
  { label: "Contact", link: "#contact" },
  { label: "Email", link: `mailto:${EMAIL}` },
];
