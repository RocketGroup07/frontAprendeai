import { IoMdShareAlt } from "react-icons/io";
import beca from '../assets/images/school-svgrepo.svg';
import star from '../assets/images/star.svg';
import starFill from '../assets/images/star-fill.svg';
import { Link } from "react-router-dom";
import { useAuth } from "./UserAuth";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { api } from "../lib/axios";
import { useState, useEffect } from "react";

function CardTarefas({ id, titulo, descricao, ano, favoritado: initialFavoritado, turmaId, small, onDelete }) {
    const [favoritado, setFavoritado] = useState(initialFavoritado || false);
    const { isProfessor } = useAuth();
    const [favoritoId, setFavoritoId] = useState(null);

    async function handleFavoritar(e) {
        e.stopPropagation();
        e.preventDefault();

        if (favoritado) {
            try {
                const response = await api.delete(`/favoritos/remover/atividades/${id}`);
                if (response.status === 200 || response.status === 204) {
                    setFavoritado(false);
                    setFavoritoId(null);
                    toast.success("Tarefa removida dos favoritos!");
                }
            } catch (error) {
                console.error("Erro ao remover favorito:", error);
                toast.error("Erro ao remover a tarefa dos favoritos.");
            }
        } else {
            try {
                const response = await api.post(`/favoritos/adicionar/atividade/${id}`);
                if (response.status === 200) {
                    setFavoritado(true);
                    setFavoritoId(response.data.favoritoId);
                    toast.success("Tarefa adicionada aos favoritos!");
                }
            } catch (error) {
                console.error("Erro ao favoritar a tarefa:", error);
                toast.error("Erro ao adicionar a tarefa aos favoritos.");
            }
        }
    }

    useEffect(() => {
        async function checkFavorito() {
            try {
                const response = await api.get(`/favoritos/listar/`);
                const listaAtividadesFavoritas = response.data.atividades || [];
                const tarefaFavoritada = listaAtividadesFavoritas.find(t => t.id === id);

                if (tarefaFavoritada) {
                    setFavoritado(true);
                    setFavoritoId(tarefaFavoritada.favoritoId);
                } else {
                    setFavoritado(false);
                    setFavoritoId(null);
                }
            } catch (error) {
                console.error("Erro ao verificar status de favorito:", error);
            }
        }

        checkFavorito();
    }, [id]);

    async function handleDelete(e) {
        e.preventDefault();
        e.stopPropagation();

        const ConfirmDelete = () => (
            <div className="flex gap-2">
                <button
                    onClick={async () => {
                        toast.dismiss();
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
        <div className={`
            relative cursor-pointer mb-6 hover:scale-103 transition-transform font-neuli 
            ${small ? "w-80 h-50" : "w-80 h-50"} group
        `}>
            {isProfessor && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                    title="Deletar tarefa"
                >
                    <MdClose size={20} />
                </button>
            )}

            <Link to={`/atividades/${turmaId}/${id}`} className="block">
                <div className="w-full">
                    <div className="h-44 bg-[var(--main)] text-white rounded-t-lg p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <img src={beca} alt="ícone de formatura" className="w-10 h-10 mb-2" />
                                <h2 className="text-[2rem] line-clamp-1 font-medium">{titulo}</h2>
                            </div>
                            <div className="mt-5 font-extralight text-[11px]">
                                <p className="overflow-hidden line-clamp-1">{descricao}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[var(--primary)] w-full text-white rounded-b-lg p-1 flex items-center justify-end">
                        <div className="flex flex-row text-[12px] items-center gap-2 pr-2">
                            <h6>Clique aqui para saber mais</h6>
                            <IoMdShareAlt />
                        </div>
                    </div>
                </div>
            </Link>

            <div
                className="absolute bottom-10 right-4 cursor-pointer z-10"
                onClick={handleFavoritar}
            >
                <img
                    src={favoritado ? starFill : star}
                    alt="Ícone de estrela"
                    className="w-7 h-7 mt-4"
                />
            </div>
        </div>
    );
}

export default CardTarefas;
