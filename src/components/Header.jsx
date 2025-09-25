import React, { useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import StaggeredMenu from './StaggeredMenu';
import { useAuth } from './UserAuth';

function Header() {
  const auth = useAuth();
  const usuario = auth?.usuario;
  const userName = usuario?.nome || "Usuário";
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  return (
    <>
      <header className="flex bg-[#D00909] justify-between p-6 items-center">
        <div className="object-contain w-54 ml-12"> 
          <img src="../images/logoAP.png" />
        </div>
        <div className="flex items-center justify-between gap-6">
          <p className='text-white text-[25px] font-[400]'>{userName}</p>
          <div className="cursor-pointer text-white">
            <FaUserCircle size={35}/>
          </div>
          <div
            className="cursor-pointer text-white"
            onClick={() => setShowMenu(!showMenu)}
          >
            <GiHamburgerMenu size={35}/>
          </div>
        </div>
      </header>
      {showMenu && (
  <div className="fixed top-[80px] left-0 w-full flex justify-center z-50">
    <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials={true}
      displayItemNumbering={true}
      menuButtonColor="#fff"
      openMenuButtonColor="#fff"
      changeMenuColorOnOpen={true}
      colors={['#B19EEF', '#5227FF']}
      logoUrl="/path-to-your-logo.svg"
      accentColor="#ff6b6b"
      onMenuOpen={() => console.log('Menu opened')}
      onMenuClose={() => console.log('Menu closed')}
    />
  </div>
      )}
    </>
  );
}

export default Header;