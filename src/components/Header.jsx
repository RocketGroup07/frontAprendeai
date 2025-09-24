import React, { useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import MenuDropdown from './MenuDropdown';

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="flex bg-[#D00909] justify-between p-6 items-center">
      <div className="object-contain w-54 ml-12"> 
        <img src="../images/logoAP.png" />
      </div>
      <div className="flex items-center justify-between gap-6">
        <p className='text-white text-[25px] font-[400]'>Ciclano</p>
        <div className="cursor-pointer text-white">
          <FaUserCircle size={35}/>
        </div>
        <div
          className="cursor-pointer text-white"
          onClick={() => setShowMenu(!showMenu)}
        >
          <GiHamburgerMenu size={35}/>
        </div>
        {showMenu && <MenuDropdown />}
      </div>
    </header>
  );
}

export default Header;