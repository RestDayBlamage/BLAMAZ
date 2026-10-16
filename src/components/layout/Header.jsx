import StaggeredMenu from "./StaggeredMenu";
import BrandLogo from "./BrandLogo";
import { NAV, SOCIALS } from "../../data/links";
import { COLORS } from "../../styles/tokens";

const socialItems = SOCIALS.map((s) => ({ label: s.label, link: s.url }));

export default function Header() {
  return (
    <header className="site-header">
      <BrandLogo />
      <StaggeredMenu
        position="right"
        items={NAV}
        socialItems={socialItems}
        displaySocials
        menuButtonColor={COLORS.dark}
        openMenuButtonColor={COLORS.dark}
        changeMenuColorOnOpen
        colors={[COLORS.silver, COLORS.bg]}
        accentColor={COLORS.muted}
      />
    </header>
  );
}
