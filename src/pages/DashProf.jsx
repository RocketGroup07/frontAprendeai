import React from 'react'
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
            <div style={{ height: "10vh" }}>
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

        {/* container */}
        <div className='flex flex-col pt-10 w-[100%]'>
            {/* botões */}
            <div className='flex justify-center items-center'>
                <div className="h-auto flex gap-5 w-[60%]">
                    <ProfFeat tituloCard={'Programar Post'} iconName={<LuCalendarClock/>}/>
                    <ProfFeat tituloCard={'Programar Atividade'} iconName={<FaSpellCheck/>}/>
                    <ProfFeat tituloCard={'Registrar Falta'} iconName={<FaUserCheck/>}/>
                </div>
            </div>
            {/* tabela */}
            <div>
                
            </div>
        </div>
          
        </div>


    )
}

export default DashProf