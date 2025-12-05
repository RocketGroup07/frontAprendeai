import { useEffect, useState } from "react";
import { api } from "../lib/axios";

function Comentarios({ postId, turmaId }) {
    const [novoComentario, setNovoComentario] = useState("");
    const [comentarios, setComentarios] = useState([]);

    // Buscar comentários
   const buscarComentarios = async () => {
    try {
        const response = await api.get(`/comentarios/post/${postId}`);

        // Ordenar por data (do mais recente para o mais antigo)
        const comentariosOrdenados = response.data.sort(
            (a, b) => new Date(b.dataComentario) - new Date(a.dataComentario)
        );

        setComentarios(comentariosOrdenados);
    } catch (error) {
        console.error("Erro ao buscar comentários:", error);
    }
};
    // Enviar comentário
    const enviarComentario = async () => {
    if (!postId || !turmaId) {
        console.error("ERRO: postId ou turmaId estão undefined!");
        return;
    }

    if (!novoComentario.trim()) return;

    try {
        const formData = new FormData();
        formData.append("conteudo", novoComentario);

        await api.post(`/comentarios/criar/${turmaId}/post/${postId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        setNovoComentario("");
        buscarComentarios();
    } catch (error) {
        console.error("Erro ao enviar comentário:", error);
    }
};

    useEffect(() => {
        if (postId) buscarComentarios();
    }, [postId]);

    return (
        <div className="mt-6">
            <h1 className="text-2xl font-bold mb-4">Comentários:</h1>

            <div className="bg-[var(--main)] p-4 rounded-lg flex flex-col gap-3 text-white">
                <textarea
                    className="w-full p-3 rounded bg-gray-700 outline-none h-30"
                    placeholder="Escreva seu comentário..."
                    value={novoComentario}
                    maxLength={400}
                    onChange={(e) => setNovoComentario(e.target.value)}
                ></textarea>

                <button
                    className="bg-red-600 cursor-pointer hover:bg-red-700 transition text-white px-4 py-2 rounded-md self-end"
                    onClick={enviarComentario}
                >
                    Enviar
                </button>
            </div>

            <div className="mt-6 mb-10 bg-[var(--main)] p-5 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-white">Todos os comentários</h2>

                <div className="flex flex-col gap-4">
                    {comentarios.length === 0 && (
                        <p className="text-white">Nenhum comentário ainda.</p>
                    )}

                    {comentarios.map((comentario) => (
                        <div key={comentario.id} className="bg-gray-700 p-4 rounded-lg m-2">
                            <div className="flex justify-between mb-1">
                                <strong>{comentario.usuario}</strong>
                                <span className="text-sm text-white">
                                    {new Date(comentario.dataComentario).toLocaleDateString("pt-BR")}
                                </span>
                            </div>
                            <p>{comentario.conteudo}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Comentarios;
