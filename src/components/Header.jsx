import React from 'react';
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";



function Header() {
  return (
    <header className="flex bg-[#D00909] justify-between p-[25px]">

      <div className="object-contain w-[180px]">
        <img src="../images/logoAP.png" alt="" className='logoSenai' />
      </div>

      <div className="flex items-center justify-between gap-[25px]">
        <p className='text-white text-[25px] font-[400]'>Ciclano</p>

        <div className="cursor-pointer text-white">
            <FaUserCircle size={35}/>
            </div>

        <div className="cursor-pointer text-white">
          <GiHamburgerMenu size={35}/>
        </div>

      </div>
    </header>
  );
}

export default Header;