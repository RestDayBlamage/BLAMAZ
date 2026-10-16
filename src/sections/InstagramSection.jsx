import Panel from "../components/common/Panel";
import mural from "../assets/images/about-mural.webp";
import { SOCIALS } from "../data/links";

const instagram = SOCIALS.find((s) => s.id === "instagram");

// Karta z odnośnikiem do Instagrama (u Polymera w tym miejscu karty z filmami)
export default function InstagramSection() {
  return (
    <Panel
      image={mural}
      alt="BLaMaZ cyclist with a loaded bike in front of a colourful mural"
      title="Sometimes it’s smooth, sometimes it’s a BLaMaZ"
      tagline="Follow the ride on Instagram"
      href={instagram.url}
      linkLabel="BLaMaZ on Instagram"
      external
      align="end"
    />
  );
}
