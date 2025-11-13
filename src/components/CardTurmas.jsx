import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdShareAlt } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { api } from "../lib/axios";
import { useAuth } from "./UserAuth";
import { toast } from "react-toastify";

function CardTurmas({ turmas }) {
    const { selecionarTurma } = useAuth();

    const handleCopiarCodigo = (e, codigo) => {
        e.preventDefault();
        e.stopPropagation();
        
        navigator.clipboard.writeText(codigo).then(() => {
            toast.success("Código copiado!");
        }).catch(() => {
            toast.error("Erro ao copiar código");
        });
    };

    return (
        <div className="flex flex-wrap gap-4 font-neuli ">
            {turmas.map((item) => (
                <Link
                    key={item.id}
                    className='cursor-pointer hover:scale-103 transition-transform relative group'
                    to={`/geral/${item.id}`}
                    onClick={() => selecionarTurma(item.id, item.nome)}
                >
                    <div className="w-80 h-40 bg-[var(--main)] text-white rounded-t-lg p-10 flex flex-col justify-between items-center text-center relative">
                        <button
                            onClick={(e) => handleCopiarCodigo(e, item.codigo)}
                            className='absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10'
                            title="Copiar código"
                        >
                            <MdContentCopy size={18} />
                        </button>

                        <div className='w-full flex-col justify-center items-center'>
                            <h2 className='mt-5 text-3xl w-full truncate overflow-hidden whitespace-nowrap text-center'>
                                {item.nome}
                            </h2>
                            <p className="text-[0.7rem] mt-3" >Código da turma: {item.codigo}</p>
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
            ))}
        </div>
    );
}

export default CardTurmas;