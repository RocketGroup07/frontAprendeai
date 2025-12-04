import React from 'react'
import StaggeredMenu from "../components/StaggeredMenu.jsx";
import CardHistorico from '../components/CardHistorico.jsx';

function HistoricoChamada() {
  return (
    <div className="">
        <div style={{ height: "10vh" }}>
                <StaggeredMenu />
        </div>

        <div className="w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold m-auto mt-10">
        <h1 className="text-[28px] font-bold">O progresso do curso está em x%</h1>
      </div>
        
    <div className=" w-[90%] mt-20 font-bold text-[24px] text-[var(--text)] m-auto items-center p-2 rounded">
          <h2>Chamadas Anteriores:</h2>
        </div>

        <div className="flex m-auto mt-5 w-[90%]">
            
            <CardHistorico />
        </div>
    </div>

    
  )
}

export default HistoricoChamada