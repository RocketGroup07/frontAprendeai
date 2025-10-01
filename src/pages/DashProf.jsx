import React from 'react'
import Header from "../components/Header"
import { LuCalendarClock } from "react-icons/lu";
import { FaUserCheck, FaSpellCheck } from "react-icons/fa";
import ProfFeat from "../components/ProfFeat"
import StaggeredMenu from '../components/StaggeredMenu';
import logo from '../../public/images/logoAp.png'
import CardPosts from '../components/CardPosts';
import TextType from '../components/TextType';
import { useAuth } from '../components/UserAuth.jsx';


const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/geral' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];


function DashProf() {

    const auth = useAuth();
    const usuario = auth?.usuario;
    const userName = usuario?.nome || "Usuário";

    return (

        <div className=''>
            <div style={{ height: "15vh" }}>
                <StaggeredMenu
                    position="right"
                    items={menuItems}
                    displaySocials={false}
                    displayItemNumbering={false}
                    menuButtonColor="#fff"
                    openMenuButtonColor="#fff"
                    changeMenuColorOnOpen={true}
                    colors={['#B19EEF', '#5227F1']}
                    logoUrl={logo}
                    accentColor="#d3d3d3"
                />
            </div>
        </div>


    )
}

export default DashProf
