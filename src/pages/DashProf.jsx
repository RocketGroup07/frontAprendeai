import React from 'react'
import Header from "../components/Header"
import { LuCalendarClock } from "react-icons/lu";
import { FaUserCheck, FaSpellCheck } from "react-icons/fa";
import ProfFeat from "../components/ProfFeat"
import StaggeredMenu from '../components/StaggeredMenu';

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
            <div style={{ height: '87vh', background: '#1a1a1a' }}>
                <StaggeredMenu position="left"
                    items={menuItems}
                    displaySocials={false}
                    displayItemNumbering={false}
                    menuButtonColor="#fff"
                    openMenuButtonColor="#fff"
                    changeMenuColorOnOpen={true}
                    colors={['#B19EEF', '#fff']}
                    accentColor="#ff6b6b"
                    onMenuOpen={() => console.log('Menu opened')}
                    onMenuClose={() => console.log('Menu closed')}>


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

                </StaggeredMenu>
            </div>

        </div>
    )
}

export default DashProf
