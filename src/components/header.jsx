import StaggeredMenu from "./StaggeredMenu";

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/BLAMAZ/#home' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/BLAMAZ/#aboutus' },
  { label: 'Trips', ariaLabel: 'View our trips', link: '/BLAMAZ/#trips' },
  { label: 'Camps', ariaLabel: 'View our camps', link: '/BLAMAZ/#camps' },
  { label: 'contact', ariaLabel: 'Get in touch', link: '/BLAMAZ/#contact' },
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
        menuButtonColor="#061a1e"
        openMenuButtonColor="#061a1e"
        changeMenuColorOnOpen={true}
        colors={['#6dfa00', '#f000ef']}
        logoUrl="https://raw.githubusercontent.com/RestDayBlamage/BLAMAZ/main/public/2027 logo.svg"
        accentColor="#f000ef"
      />
    </header>
  );
}
