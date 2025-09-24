import React, { useState } from "react";
import Header from "../components/Header";
import CardTurmas from "../components/CardTurmas";
import { FaPlus } from "react-icons/fa";

function Turmas() {
  const [showInputCard, setShowInputCard] = useState(false);

  return (
    <div className="bg-[#212121] h-[100vh]">
      <Header />
      <div className="flex mt-6 radius-1 rounded-[2vh] justify-center text-white bg-[#2A2A2A] h-34 w-432 text-center items-center ml-19">
        <h1 className="text-[28px] font-bold">Suas Turmas</h1>
      </div>
      <div className="flex bg-[#D00909] rounded-[4px] ml-19 mt-9 text-white w-21 justify-center">
        <h2 className="text-[22px] font-[500]">Geral</h2>
      </div>
      <div className="flex ml-18 mt-5">


        <CardTurmas />


        <div
          className="w-80 h-46 ml-4 bg-[#2A2A2A] text-white rounded-lg p-10 flex flex-col justify-between items-center text-center border-dotted border-gray-500 border-2 cursor-pointer"
          onClick={() => setShowInputCard(true)}
        >
          <FaPlus size={42} className="text-gray-500 mt-5" />
          <p className="text-gray-500 text-[18px]">Entre em uma nova turma</p>
        </div>
        {showInputCard && (
          <div className="absolute top-1/2 left-1/2 transform shadow-[0_22px_70px_4px_rgba(0, 0, 0, 0.42)] -translate-x-1/2 -translate-y-1/2 bg-[#2a2a2a] p-6 rounded-lg shadow-lg flex flex-col items-center z-50">
            <h3 className="text-white text-lg mb-4">Insira o código da turma</h3>
            <input
              type="text"
              className="p-2 rounded border border-gray-500 mb-4 w-64 text-white"
              placeholder="Código da turma"
            />
            <div className="flex gap-4">
              <button
                className="bg-[#D00909] text-white w-20 p-2 py-2 rounded cursor-pointer text-[0.8rem]"
                onClick={() => setShowInputCard(false)}
              >
                Fechar
              </button>

              <button
                className="bg-[#278d27] text-white w-20 p-2 py-2 rounded cursor-pointer text-[0.8rem]">
                Entrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Turmas;