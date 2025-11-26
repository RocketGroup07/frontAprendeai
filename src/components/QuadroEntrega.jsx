import React, { useState } from "react";

export default function QuadroEntrega() {
    
    const alunos = [
        { nome: "João Silva", entregue: true, resposta: "Minha resposta da atividade...", anexo: "resposta_joao.pdf" },
        { nome: "Maria Souza", entregue: false, resposta: "", anexo: "" },
        { nome: "Pedro Henrique", entregue: true, resposta: "Segue minha atividade completa.", anexo: "" },
    ];

    const [aberto, setAberto] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(alunos[0]);

    function selecionarAluno(a) {
        setAlunoSelecionado(a);
        setAberto(false);
    }

    return (
        <div className="w-full bg-gray-800 p-4 rounded-sm mt-6 text-white">

            {/* Título */}
            <h2 className="text-lg font-bold pb-2">
                Atividades Entregues
            </h2>

            {/* Dropdown customizado */}
            <div className="mt-4 relative">
                <h4 className="mb-1">Selecione o Aluno:</h4>
                
                <button
                    onClick={() => setAberto(!aberto)}
                    className="w-full bg-gray-700 p-2 rounded-sm text-left"
                >
                    {alunoSelecionado.nome}
                </button>

                {aberto && (
                    <div className="absolute mt-1 w-full bg-gray-700 rounded-sm shadow-md z-10">
                        {alunos.map((aluno) => (
                            <div
                                key={aluno.nome}
                                className="
                                    p-2 cursor-pointer 
                                    hover:bg-red-700 
                                    transition-colors duration-150
                                "
                                onClick={() => selecionarAluno(aluno)}
                            >
                                {aluno.nome}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Conteúdo */}
            <div className="mt-6  p-4 rounded-sm">

                {/* Campo: Aluno */}
                <div className="mb-4">
                    <p className="text-sm text-white">Aluno:</p>
                    <div className="bg-gray-600 p-2 rounded-sm mt-1">
                        {alunoSelecionado.nome}
                    </div>
                </div>

                {/* Campo: Status */}
                <div className="mb-4">
                    <p className="text-sm text-white">Status:</p>
                    <div className="bg-gray-600 p-2 rounded-sm mt-1">
                        {alunoSelecionado.entregue ? "Entregue" : "Não entregue"}
                    </div>
                </div>

                {/* Campo: Resposta */}
                {alunoSelecionado.resposta && (
                    <div className="mb-4">
                        <p className="text-sm text-white">Resposta do aluno:</p>
                        <div className="bg-gray-600 p-3 rounded-sm mt-1 text-sm whitespace-pre-line">
                            {alunoSelecionado.resposta}
                        </div>
                    </div>
                )}

                {/* Campo: Anexo */}
                {alunoSelecionado.anexo && (
                    <div className="mb-4">
                        <p className="text-sm text-white">Anexo:</p>
                        <div className="bg-gray-600 p-2 rounded-sm mt-1 text-sm">
                            {alunoSelecionado.anexo}
                        </div>
                    </div>
                )}

                {/* Sem conteúdo */}
                {!alunoSelecionado.resposta &&
                !alunoSelecionado.anexo &&
                alunoSelecionado.entregue && (
                    <p className="mt-2 text-sm italic text-gray-300">
                        (Atividade entregue, mas sem resposta escrita ou anexo)
                    </p>
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
