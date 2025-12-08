import { useState, useRef, useEffect } from "react";

export default function QuadroEntrega({ entregas, alunosTurma }) {

    // Converter formato vindo da API para o usado no componente
    const alunos = alunosTurma.map((aluno) => {
        const entrega = entregas.find((e) => e.alunoId === aluno.id);

        return {
            nome: aluno.nome,
            id: aluno.id,
            entregue: !!entrega,
            resposta: entrega?.respostaTexto || "",
            anexos: entrega?.nomesArquivoEntrega || []
        };
    });

    const [aberto, setAberto] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(alunos[0] || null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (alunos.length > 0) {
            setAlunoSelecionado(alunos[0]);
        }
    }, [entregas]);

    function selecionarAluno(a) {
        setAlunoSelecionado(a);
        setAberto(false);
    }

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!alunoSelecionado) {
        return (
            <div className="text-white mt-4 p-4 bg-gray-800 rounded">
                Nenhuma entrega encontrada.
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-800 p-4 rounded-sm mt-6 text-white">

            <h2 className="text-lg font-bold pb-2">
                Atividades Entregues
            </h2>

            {/* Dropdown */}
            <div className="mt-4 relative" ref={dropdownRef}>
                <h4 className="mb-1">Selecione o Aluno:</h4>

                <button
                    onClick={() => setAberto(!aberto)}
                    className="w-full bg-gray-700 p-2 rounded-sm text-left"
                >
                    {alunoSelecionado.nome}
                </button>

                {aberto && (
                    <div
                        className="
                            absolute mt-1 w-full bg-gray-700 rounded-sm shadow-md z-10
                            max-h-46 overflow-y-scroll
                            scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-800
                        "
                    >
                        {alunos.map((aluno) => (
                            <div
                                key={aluno.id}
                                className="p-2 cursor-pointer hover:bg-red-700 transition-colors duration-150"
                                onClick={() => selecionarAluno(aluno)}
                            >
                                {aluno.nome}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Conteúdo */}
            <div className="mt-6 p-4 rounded-sm">

                <div className="mb-4">
                    <p className="text-sm">Aluno:</p>
                    <div className="bg-gray-600 p-2 rounded-sm mt-1">
                        {alunoSelecionado.nome}
                    </div>
                </div>

                <div
                    className={`p-2 rounded-sm mt-4 mb-10 w-28 text-center text-white font-semibold ${alunoSelecionado.entregue ? "bg-green-600" : "bg-red-600"
                        }`}
                >
                    {alunoSelecionado.entregue ? "Entregue" : "Pendente"}
                </div>

                {alunoSelecionado.resposta && (
                    <div className="mb-4">
                        <p className="text-sm">Resposta do aluno:</p>
                        <div className="bg-gray-600 p-3 rounded-sm mt-1 text-sm whitespace-pre-line">
                            {alunoSelecionado.resposta}
                        </div>
                    </div>
                )}

                {alunoSelecionado.anexos.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm">Anexos:</p>
                        {alunoSelecionado.anexos.map((arq, i) => (
                            <div key={i} className="bg-gray-600 p-2 rounded-sm mt-1 text-sm">
                                {arq}
                            </div>
                        ))}
                    </div>
                )}

                {!alunoSelecionado.entregue && (
                    <p className="mt-2 text-sm italic text-gray-200">
                        (Nenhum conteúdo enviado pelo aluno)
                    </p>
                )}
            </div>
        </div>
    );
}
