import React from 'react';
import '../styles/Header.css';
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";



function Header() {
  return (
    <header className="header">

      <div className="logoHeader">
        <img src="../images/logoAP.png" alt="" className='logoSenai' />
      </div>

      <div className="right">
        <p>Ciclano</p>

        <div className="user">
            <FaUserCircle size={35}/>
            </div>

        <div className="hamburguer">
          <GiHamburgerMenu size={35}/>
        </div>

      </div>
    </header>
  );
}

export default Header;