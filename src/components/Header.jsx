import React from 'react';
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from './UserAuth';
 
 
 
function Header() {
  const auth = useAuth();
  const usuario = auth?.usuario;
  const userName = usuario?.nome || "Usuário"
 
  return (
    <header className="flex bg-[#D00909] justify-between p-6 items-center">
 
      <div className="object-contain w-54 ml-12">
        <img src="../images/logoAP.png" />
      </div>
 
      <div className="flex items-center justify-between gap-6">
        <p className='text-white text-[25px] font-[400]'>{userName}</p>
 
        <div className="cursor-pointer text-white">
          <FaUserCircle size={35} />
        </div>
 
        <div className="cursor-pointer text-white">
          <GiHamburgerMenu size={35} />
        </div>
 
      </div>
    </header>
  );
}
 
export default Header;