import StaggeredMenu from "./StaggeredMenu";

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/BLMZ/#home' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/BLMZ/#aboutus' },
  { label: 'Trips', ariaLabel: 'View our trips', link: '/BLMZ/#trips' },
  { label: 'Camps', ariaLabel: 'View our camps', link: '/BLMZ/#camps' },
  { label: 'contact', ariaLabel: 'Get in touch', link: '/BLMZ/#contact' },
  { label: "email", ariaLabel: "Email me", link: "mailto:restdayblamage@gmail.com" },
];

const socialItems = [
  { label: 'Instagram', link: 'https://www.instagram.com/blamaz.vc/' },
  { label: 'Koomot', link: 'https://www.komoot.com/user/4337639147933' },
  { label: 'GitHub', link: 'https://github.com/RestDayBlamage' }
];

export default function Header() {
  return (
    <header>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="#111"
        openMenuButtonColor="#111"
        changeMenuColorOnOpen={true}
        colors={['#d4ac1d', '#c91820']}
        logoUrl="https://raw.githubusercontent.com/RestDayBlamage/BLAMAZ/main/public/2027 logo.svg"
        accentColor="#ebb630"
      />
    </header>
  );
}
