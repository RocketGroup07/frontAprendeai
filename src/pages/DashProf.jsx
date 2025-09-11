import React from 'react'
import Header from "../components/Header"
import { LuCalendarClock } from "react-icons/lu";
import { FaUserCheck, FaSpellCheck } from "react-icons/fa";
import ProfFeat from "../components/ProfFeat"

function DashProf() {
    return (
        <div>
            <Header/>
            <div className='w-[80%] mt-20 flex m-auto gap-9'>
                <ProfFeat
                tituloCard={"Programar Post"}
                iconName={<LuCalendarClock/>}
                />
                <ProfFeat
                tituloCard={"Programar Atividade"}
                iconName={<FaSpellCheck />}
                />
                <ProfFeat
                tituloCard={"Registrar Falta"}
                iconName={<FaUserCheck/>}
                />
            </div>
            


        </div>
    )
}

export default DashProf