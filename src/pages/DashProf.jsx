import React, { useState } from 'react';
import StaggeredMenu from '../components/StaggeredMenu';
import ReactGrid from '../components/ReactGrid';

function DashProf() {
    const [codigoTurma, setCodigoTurma] = useState(''); // Estado para armazenar o código da turma
    const [turmaSelecionada, setTurmaSelecionada] = useState(null); // Estado para armazenar a turma selecionada

    const handleInputChange = (e) => {
        setCodigoTurma(e.target.value); // Atualiza o estado com o valor do input
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // Quando o usuário pressiona Enter, atualiza a turma selecionada
            setTurmaSelecionada(codigoTurma);
            console.log('Código da turma enviado:', codigoTurma);
        }
    };

    return (
        <div className='w-[100%] flex flex-col'>
            <div style={{ height: "10vh" }}>
                <StaggeredMenu />
            </div>

            {/* Container principal */}
            <div className="flex flex-col w-[100%] items-center mt-20">
                {/* Container menor */}
                <div className="flex flex-col w-[89%] gap-4">
                    <div className="flex justify-between w-[100%] mb-6">
                        <h1 className='text-5xl text-white'>Nome Turma</h1>
                        <button className='bg-[var(--primary)] text-white cursor-pointer w-[14%] rounded-[4px] h-8'>Voltar Para a Home</button>
                    </div>
                    <div className="">
                        <button className='bg-[var(--primary)] text-white w-[12%] rounded-[4px] mb-3'>Gerar Relatório</button>
                    </div>
                    <div className="flex g-4 bg-blue-600 gap-6">
                        <div className='bg-pink-500 w-[12%] text-white'>04/09/2025</div>
                        <div className='bg-green-600 w-[12%] text-white'>8h nesse dia</div>
                        <input
                            className='bg-amber-400 w-[40%]'
                            type="text"
                            placeholder='Digite o código da turma e pressione Enter'
                            value={codigoTurma}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <ReactGrid codigoTurma={turmaSelecionada} /> {/* Passa a turma selecionada como prop */}
                </div>
            </div>
        </div>
    );
}

export default DashProf;