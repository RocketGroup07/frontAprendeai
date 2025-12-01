import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IoMdShareAlt } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { api } from "../lib/axios";
import { toast } from "react-toastify";
import { useAuth } from "./UserAuth";

function CardPosts({ id, turmaId, titulo, descricao, autor, ano, onDelete }) {

    const { isProfessor } = useAuth();

    async function handleDelete(e) {
        e.preventDefault();
        e.stopPropagation();

        const ConfirmDelete = () => (
            <div className="flex gap-2">
                <button
                    onClick={async () => {
                        try {
                            await api.delete(`/posts/${turmaId}/${id}`);
                            toast.success("Post deletado com sucesso!");
                            if (onDelete) onDelete();
                        } catch (error) {
                            const errorMessage = error.response?.data?.message || "Falha ao deletar o post. Tente novamente.";
                            toast.error(errorMessage);
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


            <Link to={`/post/${turmaId}/${id}`} className=''>
                <div
                    className="h-80 bg-[var(--main)] text-white rounded-t-lg p-10 flex flex-col justify-between"
                >
                    <div>
                        <h2 className='text-3xl line-clamp-1'>{titulo}</h2>
                        <div className='mt-5 font-extralight text-[16px]'>
                            <p className="overflow-hidden line-clamp-2">
                                {descricao}
                            </p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 pt-4'>
                        <div className='flex items-center gap-2'>
                            <p className='font-normal text-sm'>Autor:</p>
                            <p className='font-light text-sm'>{autor}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p className='font-normal text-sm'>Data:</p>
                            <p className='font-light text-sm'>{format(ano, "dd 'de' MMM yy", { locale: ptBR })}</p>
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
            </Link>
        </div>
    );
}

export default CardPosts;