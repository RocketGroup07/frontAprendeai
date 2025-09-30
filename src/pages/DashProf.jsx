import React from 'react'
import Header from "../components/Header"
import { LuCalendarClock } from "react-icons/lu";
import { FaUserCheck, FaSpellCheck } from "react-icons/fa";
import ProfFeat from "../components/ProfFeat"
import StaggeredMenu from '../components/StaggeredMenu';
import logo from '../../public/images/logoAprendeAi.png'
import CardPosts from '../components/CardPosts';


const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/geral' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];


function DashProf() {
    return (
        <div>
            <Header />
            <div style={{ height: '100vh', marginTop: '80px' }}>
                <StaggeredMenu
                    position="right"
                    items={menuItems}
                    displaySocials={true}
                    displayItemNumbering={true}
                    menuButtonColor="#fff"
                    openMenuButtonColor="#fff"
                    changeMenuColorOnOpen={true}
                    colors={['#B19EEF', '#5227FF']}
                    logoUrl={logo}
                    accentColor="#ff6b6b"
                >
                    
                </StaggeredMenu>
            </div>

        </div>
    )
}

export default DashProf
