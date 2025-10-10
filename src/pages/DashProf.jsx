import React from 'react'
import { LuCalendarClock } from "react-icons/lu";
import { FaUserCheck, FaSpellCheck } from "react-icons/fa";
import ProfFeat from "../components/ProfFeat"
import StaggeredMenu from '../components/StaggeredMenu';
import CardPosts from '../components/CardPosts';

function DashProf() {

    return (
        <div>
            <div style={{ height: "10vh" }}>
                <StaggeredMenu/>
            </div>
        </div>
    )
}

export default DashProf