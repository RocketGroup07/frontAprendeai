import { useRef, useState } from "react";
import { FaPaperclip } from "react-icons/fa";

export default function EntregaAtividade({ onEntregar }) {
    const fileInputRef = useRef(null);
    const [arquivo, setArquivo] = useState(null);
    const [texto, setTexto] = useState("");

    const handleSubmit = () => {
        // monta o "pacote" de entrega
        const entrega = {
            texto,
            arquivo,
        };

        // caso o pai queira receber
        if (onEntregar) onEntregar(entrega);

        console.log("Entrega enviada:", entrega);
    };

    return (
        <div className="flex flex-col gap-4 mt-6">

            {/* ÁREA DE TEXTO */}
            <textarea
                className="w-full p-3 rounded-sm bg-gray-700 focus:outline-none"
                rows={4}
                maxLength={500}
                placeholder="Escreva sua resposta aqui..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
            />

            {/* BOTÕES */}
            <div className="flex gap-4">

                {/* INPUT DE ARQUIVO INVISÍVEL */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => setArquivo(e.target.files[0])}
                />

                {/* BOTÃO DE ANEXAR */}
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex bg-gray-600 p-2 text-white rounded-sm items-center gap-3 cursor-pointer hover:bg-gray-700"
                >
                    <FaPaperclip />
                    {arquivo ? arquivo.name : "Anexar Arquivo"}
                </button>

                {/* BOTÃO DE ENTREGA */}
                <button
                    onClick={handleSubmit}
                    className="flex bg-red-600 p-2 text-white rounded-sm items-center gap-3 cursor-pointer hover:bg-red-700"
                >
                    Entregar Atividade
                </button>
            </div>
        </div>
    );
}
