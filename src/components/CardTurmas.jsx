import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdShareAlt } from "react-icons/io";
import { api } from "../lib/axios";
import { useAuth } from "./UserAuth";

function CardTurmas() {
    const [turmas, setTurmas] = useState([]);
    const { turmaId, selecionarTurma } = useAuth();

    useEffect(() => {
        async function fetchTurmas() {
            try {
                const response = await api.get("alunos/minhas-turmas");
                console.log("Resposta da API:", response.data);
                setTurmas(response.data);

                if (response.data.length && !turmaId) {
                    selecionarTurma(response.data[0].id);
                }
            } catch (error) {
                console.error("Erro ao buscar turmas:", error);
            }
        }
        fetchTurmas();
    }, []);

    return (
        <div className="flex flex-wrap gap-4 font-neuli ">
            {turmas.map((item) => (
                <Link
                    key={item.id}
                    className='cursor-pointer hover:scale-103 transition-transform'
                    to={`/geral/${item.id}`}
                >
                    <div className="w-80 h-40 bg-[#2A2A2A] text-white rounded-t-lg p-10 flex flex-col justify-between items-center text-center">
                        <div className='w-full flex-col justify-center items-center'>
                            <h2 className='mt-5 text-3xl w-full truncate overflow-hidden whitespace-nowrap text-center'>
                                {item.nome}
                            </h2>
                            <p className="text-[0.7rem] mt-3" >Código da turma: {item.codigo}</p>
                        </div>

                    </div>
                    <div className='bg-[#D00909] w-full text-white rounded-b-lg p-1 flex items-center justify-end'>
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