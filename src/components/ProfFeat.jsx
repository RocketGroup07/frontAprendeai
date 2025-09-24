import React from 'react'
import { LuCalendarClock,  } from "react-icons/lu";
import { FaUserCheck } from "react-icons/fa";
function ProfFeat({tituloCard, iconName}) {
  return (
    <div className='w-[30%] border border-white h-18 flex items-center justify-center rounded-lg text-white text-2xl gap-3 cursor-pointer'>
      <div>{iconName}</div>
      <div><h2>{tituloCard}</h2></div>
    </div>
  )
}

export default ProfFeat