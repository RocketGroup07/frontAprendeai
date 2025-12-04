import React, { useEffect } from 'react'
import { IoMdShareAlt } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'
import { Link, useParams } from 'react-router'
import { LuCalendarClock } from "react-icons/lu";
import { toast } from 'react-toastify';
import { api } from '../lib/axios';

function CardHistorico() {

    const turmaId = useParams().turmaId;

    async function fetchHistorico() {
        try {
            const response = await api.get(`/api/dia-aula/turma/${turmaId}`); 
            console.log("Resposta da api: ", response.data);
        } catch (error) {
            toast.error("Erro ao carregar histórico");
        }
    }
    useEffect(() => {
        fetchHistorico();
    }, []);

    return (
        <div className="flex flex-wrap gap-4 font-neuli ">

            

            <Link

                className='cursor-pointer hover:scale-103 transition-transform relative group'
                to={`/geral/`}

            >
                <div className="w-80 h-40 bg-[var(--main)] text-white rounded-t-lg p-10 flex flex-col justify-between items-center text-center relative">



                    <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className='cursor-pointer absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10'
                        title="Deletar turma"
                    >
                        <MdDelete size={18} />
                    </button>

                    <div className='w-full flex-col justify-center items-center'>
                        <h2 className='text-3xl w-full items-center flex justify-between truncate overflow-hidden whitespace-nowrap text-center'>
                            <span><LuCalendarClock size={48} /></span>  07/08/2024
                        </h2>
                        <p className="text-[0.7rem] mt-3" >"Conteúdo da aula"</p>
                        <p className="text-[0.7rem] mt-3" >"Horas:"</p>
                    </div>
                </div>
                <div className='bg-[var(--primary)] w-full text-white rounded-b-lg p-1 flex items-center justify-end'>
                    <div className='flex flex-row text-[12px] items-center gap-2 pr-2'>
                        <div>
                            <h6>Clique aqui para saber mais</h6>
                        </div>
                        <div>
                            <IoMdShareAlt />
                        </div>
                    </div>
                </div>
            </Link>

        </div>
    )
}

export default CardHistorico