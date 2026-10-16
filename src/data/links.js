// Linki kontaktowe i społecznościowe – wspólne dla menu i stopki.
export const EMAIL = "restdayblamage@gmail.com";

export const SOCIALS = [
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/blamaz.vc/" },
  { id: "strava", label: "Strava", url: "https://www.strava.com/clubs/1484947" },
  { id: "komoot", label: "Komoot", url: "https://www.komoot.com/user/4337639147933" },
  { id: "github", label: "GitHub", url: "https://github.com/RestDayBlamage" },
];

// Sekcje strony w menu
export const NAV = [
  { label: "Home", ariaLabel: "Go to home page", link: "#home" },
  { label: "About", ariaLabel: "Learn about us", link: "#aboutus" },
  { label: "Camps", ariaLabel: "View our camps", link: "#camps" },
  { label: "Trips", ariaLabel: "View our trips", link: "#trips" },
  { label: "Contact", ariaLabel: "Get in touch", link: "#contact" },
  { label: "Email", ariaLabel: "Email us", link: `mailto:${EMAIL}` },
];
