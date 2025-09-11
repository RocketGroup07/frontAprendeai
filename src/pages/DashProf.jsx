import React from 'react'
import Header from "../components/Header"
import { LuCalendarClock } from "react-icons/lu";
import { FaUserCheck, FaSpellCheck } from "react-icons/fa";
import ProfFeat from "../components/ProfFeat"
import StaggeredMenu from '../components/StaggeredMenu';

const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
];

function DashProf() {
    return (
        <div>
            <Header />

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
                accentColor="#ff6b6b">
                <div className='w-[80%] mt-20 flex m-auto gap-9'>
                    <ProfFeat
                        tituloCard={"Programar Post"}
                        iconName={<LuCalendarClock />}
                    />
                    <ProfFeat
                        tituloCard={"Programar Atividade"}
                        iconName={<FaSpellCheck />}
                    />
                    <ProfFeat
                        tituloCard={"Registrar Falta"}
                        iconName={<FaUserCheck />}
                    />
                </div>
            </StaggeredMenu>
        </div>
    )
}

export default DashProf
