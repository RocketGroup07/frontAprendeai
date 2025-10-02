import React from 'react'
import Header from "../components/Header"
import { LuCalendarClock } from "react-icons/lu";
import { FaUserCheck, FaSpellCheck } from "react-icons/fa";
import ProfFeat from "../components/ProfFeat"
import StaggeredMenu from '../components/StaggeredMenu';
import CardPosts from '../components/CardPosts';


const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/geral' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];


function DashProf() {

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
                    colors={['#B19EEF', '#5227FF']}
                    accentColor="#d3d3d3"
                />
            </div>
        </div>


    )
}

export default DashProf