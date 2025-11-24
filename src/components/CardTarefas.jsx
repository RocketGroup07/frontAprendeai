import { IoMdShareAlt } from "react-icons/io";
import beca from '../assets/images/school-svgrepo.svg'
import star from '../assets/images/star.svg'
import starFill from '../assets/images/star-fill.svg'
import { Link } from "react-router-dom";
import { useAuth } from "./UserAuth";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { api } from "../lib/axios";

function CardTarefas({ id, turmaId, titulo, descricao, ano, onDelete }) {
    const { isProfessor } = useAuth();

    function alteraEstrela() {

        console.log("Clicou na estrela")
    }


    async function handleDelete(e) {
        e.preventDefault();
        e.stopPropagation();

        const ConfirmDelete = () => (
            <div className="flex gap-2">
                <button
                    onClick={async () => {
                        try {
                            await api.delete(`/atividades/${id}`);
                            toast.success("Atividade deletada com sucesso!");
                            if (onDelete) onDelete();
                        } catch (error) {
                            console.error("Erro ao deletar a atividade:", error);
                            toast.error("Erro ao deletar a atividade");
                        }
                    }}
                    className="bg-[var(--primary)] hover:bg-[var(--secondary)] text-white hover:text-[var(--primary)] px-3 py-1 rounded text-sm hover:cursor-pointer"
                >
                    Deletar
                </button>
                <button
                    onClick={() => toast.dismiss()}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm hover:cursor-pointer"
                >
                    Cancelar
                </button>
            </div>
        );

        toast.warning(<ConfirmDelete />, {
            position: "bottom-right",
            autoClose: false,
            closeButton: false,
        });
    }

    return (
        <div className='cursor-pointer hover:scale-103 transition-transform font-neuli w-80 relative group'>
            {isProfessor && (
                <button
                    onClick={handleDelete}
                    className='absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer'
                    title="Deletar post"
                >
                    <MdClose size={20} />
                </button>
            )}




            <Link to={`/atividades/${turmaId}/${id}`} className='cursor-pointer hover:scale-103 transition-transform font-neuli w-80'>
                <div className='cursor-pointer hover:scale-103 transition-transform font-neuli w-80'>
                    {/* AQUI ESTÁ A MUDANÇA: 'flex', 'flex-col' e 'justify-between' */}
                    <div
                        className="h-44 bg-[var(--main)] text-white rounded-t-lg p-5 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-3">
                                <div>
                                    <img src={beca} alt="ícone de formatura" className="w-10 h-10 mb-2" />
                                </div>
                                <div>
                                    <h2 className='text-[2rem] line-clamp-1 font-medium '>{titulo}</h2>
                                </div>

                            </div>

                            <div className='mt-5 font-extralight text-[11px]'>
                                <p className="overflow-hidden line-clamp-1">
                                    {descricao}
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <img src={star} onClick={(alteraEstrela)} alt="ícone de estrela" className="w-7 h-7 mt-4 fill-zinc-300 bg-current-white" />
                            </div>
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
                </div>

            </Link>
        </div>
    );
}

export default CardTarefas;