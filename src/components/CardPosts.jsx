import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IoMdShareAlt } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { api } from "../lib/axios";
import { toast } from "react-toastify";
import { useAuth } from "./UserAuth";
import star from '../assets/images/star.svg';
import starFill from '../assets/images/star-fill.svg';
import { useEffect, useState } from "react";

function CardPosts({id, turmaId, titulo, descricao, autor, ano, onDelete }) {
    const [favoritado, setFavoritado] = useState(false);
    // Mantemos favoritoId, mas ele não será usado na requisição DELETE
    const [favoritoId, setFavoritoId] = useState(null);

    // Função que será chamada ao clicar na estrela para favoritar/desfavoritar
    async function handleFavoritar(e) {
        e.stopPropagation(); // Impede que o clique na estrela propague para o Link

        if (favoritado) {
            try {
                const response = await api.delete(`/favoritos/remover/posts/${id}`);
                if (response.status === 200 || response.status === 204 ) {
                    setFavoritado(false); // Desmarcar como favoritado
                    setFavoritoId(null);  // Limpar o id do favorito
                    toast.success("Post removido dos favoritos!");
                }
            } catch (error) {
                console.error("Erro ao remover favorito:", error);
                // Opcional: Adicionar um toast de erro mais específico
                toast.error("Erro ao remover o post dos favoritos.");
            }
        } else {
            // Caso contrário, favoritar o post
            try {
                const response = await api.post(`/favoritos/adicionar/post/${id}`);
                if (response.status === 200) {
                    setFavoritado(true); // Marcar como favoritado
                    // O backend pode ter retornado o id do novo favorito
                    setFavoritoId(response.data.favoritoId);
                    toast.success("Post adicionado aos favoritos!");
                }
            } catch (error) {
                console.error("Erro ao favoritar o post:", error);
                toast.error("Erro ao adicionar o post aos favoritos.");
            }
        }
    }

    useEffect(() => {
        async function checkFavorito() {
            try {
                // Verifica a lista de favoritos
                const response = await api.get(`/favoritos/listar/`);
                // Encontra se o post atual está na lista pelo postId (que é o 'id' do componente)
                const postFavoritado = response.data.posts.find(post => post.postId === id);
                if (postFavoritado) {
                    setFavoritado(true); // Se o post já estiver favoritado
                    // Armazena o id do favorito para o futuro, se necessário
                    setFavoritoId(postFavoritado.favoritoId);
                } else {
                    // Garante que o estado está limpo se não for encontrado
                    setFavoritado(false);
                    setFavoritoId(null);
                }
            } catch (error) {
                console.error("Erro ao verificar status de favorito:", error);
            }
        }
        checkFavorito();
    }, [id]);

    const { isProfessor } = useAuth();

    async function handleDelete(e) {
        e.preventDefault();
        e.stopPropagation();

        const ConfirmDelete = () => (
            <div className="flex gap-2">
                <button
                    onClick={async () => {
                        toast.dismiss(); // Fecha o toast antes de iniciar a deleção
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
        <div className="relative w-80 cursor-pointer hover:scale-103 transition-transform font-neuli group">
            {isProfessor && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Deletar post"
                >
                    <MdClose size={20} />
                </button>
            )}

            {/* O Link cobre todo o card, mas sem afetar a estrela */}
            <Link to={`/post/${turmaId}/${id}`} className="block">
                <div className="h-80 bg-[var(--main)] text-white rounded-t-lg p-10 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl line-clamp-1">{titulo}</h2>
                        <div className="mt-5 font-extralight text-[16px]">
                            <p className="overflow-hidden line-clamp-2">{descricao}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <div className="flex items-center gap-2">
                            <p className="font-normal text-sm">Autor:</p>
                            <p className="font-light text-sm">{autor}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-normal text-sm">Data:</p>
                            <p className="font-light text-sm">{format(ano, "dd 'de' MMM yy", { locale: ptBR })}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--primary)] w-full text-white rounded-b-lg p-1 flex items-center justify-end">
                    <div className="flex flex-row text-[12px] items-center gap-2 pr-2">
                        <div>
                            <h6>Clique aqui para saber mais</h6>
                        </div>
                        <div>
                            <IoMdShareAlt />
                        </div>
                    </div>
                </div>
            </Link>

            {/* Estrela para favoritar/desfavoritar */}
            <div
                className="absolute bottom-16 right-4 cursor-pointer"
                onClick={handleFavoritar} // Chama a função ao clicar, mas não redireciona
            >
                <img
                    src={favoritado ? starFill : star}
                    alt="Ícone de estrela"
                    className="w-7 h-7 mt-4 fill-zinc-300 bg-current-white"
                />
            </div>
        </div>
    );
}

export default CardPosts;