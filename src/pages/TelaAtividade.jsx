import { Link, useParams } from "react-router";
import StaggeredMenu from "../components/StaggeredMenu";
import TextType from "../components/TextType";
import { FaCircle, FaLongArrowAltLeft } from "react-icons/fa";
import { MdOutlineAddTask } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { api, baseURL } from "../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import IAMessages from "../components/IAMessages";
import { FaRobot } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import EntregaAtividade from "../components/EntregaAtividade";
import QuadroEntrega from "../components/QuadroEntrega";
import { useAuth } from "../components/UserAuth";
import { toast } from "react-toastify";

function TelaAtividade() {
    const { turmaId, atividadeId } = useParams();
    const [atividade, setAtividade] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [entregue, setEntregue] = useState(false);
    const [alunosTurma, setAlunosTurma] = useState([]);

    const { isProfessor } = useAuth();
    const [entregasGerais, setEntregasGerais] = useState([]);

    async function fetchAlunosTurma() {
        try {
            const response = await api.get(`/turmas/${turmaId}`);
            setAlunosTurma(response.data.alunos || []);
        } catch (error) {
            console.error("Erro ao buscar alunos da turma:", error);
        }
    }

    async function fetchAtividade() {
        try {
            const response = await api.get(`/atividades/${atividadeId}`);
            setAtividade(response.data);
        } catch (error) {
            console.error("Erro ao buscar a atividade:", error);
        }
    }

    async function checkEntrega() {
        try {
            const response = await api.get(`/entregas/${atividadeId}`);
            setEntregue(response.data.entregue || false);
        } catch (error) {
            console.error("Erro ao verificar entrega:", error);
        }
    }

    async function fetchEntregasGerais() {
        try {
            const response = await api.get(`/entregas/${atividadeId}/geral`);
            setEntregasGerais(response.data);
        } catch (error) {
            console.error("Erro ao buscar entregas gerais:", error);
        }
    }

    useEffect(() => {
        fetchAtividade();
        checkEntrega();
        fetchEntregasGerais();
        fetchAlunosTurma();
    }, [atividadeId]);

    // ----------------------------
    // ENVIO DA ENTREGA (AJUSTADO)
    // ----------------------------
    async function enviarEntrega({ texto, arquivo }) {
        if (!texto && !arquivo) {
            toast.error("Você precisa enviar um texto, um arquivo ou ambos.", {
                toastId: "erroEnvioVazio"
            });
            return;
        }

        try {
            const formData = new FormData();
            if (texto) formData.append("resposta", texto);
            if (arquivo) formData.append("arquivo", arquivo);

            const response = await api.post(
                `/entregas/${atividadeId}/entregar/`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            toast.success("Entrega enviada com sucesso!", {
                toastId: "sucessoEntrega"
            });

            setEntregue(true);
            fetchAtividade();
            fetchEntregasGerais();

            console.log("Resposta da API:", response.data);

        } catch (error) {
            console.error("Erro ao enviar entrega:", error);

            toast.error("Erro ao enviar entrega!", {
                toastId: "erroAoEnviarEntrega"
            });
        }
    }

    return (
        <div>
            <div style={{ height: "10vh" }}>
                <StaggeredMenu turmaId={turmaId} />
            </div>

            <div className="w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px] m-auto mt-10">
                <TextType
                    text={["Atividades"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                />
            </div>

            <div className="w-[90%] m-auto mt-3">
                <div className="w-[5%]">
                    <Link to={"/atividades/" + turmaId}>
                        <button className="flex bg-[var(--primary)] center p-2 text-[#f1f1f1] rounded-sm items-center gap-3 cursor-pointer hover:bg-red-700">
                            <FaLongArrowAltLeft />
                            Voltar
                        </button>
                    </Link>
                </div>

                {atividade ? (
                    <div className="flex text-[var(--text)] gap-6 m-auto mt-5">
                        <div className="text-6xl">
                            <MdOutlineAddTask />
                        </div>

                        <div className="w-full">
                            <div className="text-3xl font-bold">
                                <h1>{atividade.titulo}</h1>
                            </div>

                            <div className="flex gap-4 items-center text-[0.7rem] font-light">
                                <div>
                                    <h6>{atividade.nome}</h6>
                                </div>
                                <div>
                                    <FaCircle />
                                </div>
                                <div>
                                    <h6>
                                        {format(new Date(atividade.dataAtividade), "dd 'de' MMMM 'de' yyyy", {
                                            locale: ptBR,
                                        })}
                                    </h6>
                                </div>
                            </div>

                            <hr className="border-t border-gray-600 my-4" />

                            <div>
                                <p className="text-justify whitespace-pre-wrap">
                                    {atividade.conteudo}
                                </p>

                                {atividade.nomesArquivosAnexo > "0" && (
                                    <div>
                                        <p className="font-bold mt-4">Material Extra:</p>

                                        <a
                                            href={`${baseURL}atividades/${atividade.id}/download/anexo`}
                                            target="_blank"
                                            download
                                        >
                                            <div className="mt-4 bg-[var(--primary)] font-bold p-4 rounded w-90 flex justify-between items-center cursor-pointer hover:bg-red-800 transition-all">
                                                <div>{atividade.nomesArquivosAnexo}</div>
                                                <div>
                                                    <AiOutlineDownload />
                                                </div>
                                            </div>
                                        </a>

                                        <hr className="border-t border-gray-600 my-4" />
                                    </div>
                                )}

                                <div className="w-full mt-4">

                                    {isProfessor && (
                                        <QuadroEntrega
                                            entregas={entregasGerais}
                                            alunosTurma={alunosTurma}
                                        />
                                    )}

                                    {!isProfessor && (
                                        <>
                                            {entregue ? (
                                                <div className="bg-gray-700 text-white font-bold p-3 rounded text-left">
                                                    <div>ATIVIDADE ENTREGUE</div>

                                                    {atividade?.entrega?.[0]?.respostaTexto && (
                                                        <div
                                                            className="mt-2 font-normal text-white/90 text-left"
                                                            style={{ whiteSpace: "pre-wrap" }}
                                                        >
                                                            {atividade.entrega[0].respostaTexto}
                                                        </div>
                                                    )}

                                                    {atividade?.entrega?.[0]?.nomesArquivoEntrega?.length > 0 && (
                                                        <div className="mt-2 font-normal text-white/90 text-left">
                                                            {atividade.entrega[0].nomesArquivoEntrega.map((nome, index) => (
                                                                <div key={index}>{nome}</div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <EntregaAtividade onEntregar={enviarEntrega} />
                                            )}
                                        </>
                                    )}

                                </div>
                            </div>

                            <hr className="border-t border-gray-600 my-4" />

                            {/* BOTÃO IA */}
                            <button
                                onClick={() => setShowChat((v) => !v)}
                                style={{
                                    position: "fixed",
                                    bottom: 40,
                                    right: 40,
                                    zIndex: 1000,
                                    background: "#b30404",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: 60,
                                    height: 60,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 32,
                                    cursor: "pointer",
                                    transition: "transform 0.2s",
                                    transform: showChat ? "scale(1.1) rotate(15deg)" : "scale(1)",
                                }}
                                title={showChat ? "Fechar chat IA" : "Abrir chat IA"}
                            >
                                <FaRobot />
                            </button>

                            <div
                                style={{
                                    position: "fixed",
                                    bottom: showChat ? 120 : 60,
                                    right: 40,
                                    zIndex: 1001,
                                    opacity: showChat ? 1 : 0,
                                    pointerEvents: showChat ? "auto" : "none",
                                    transform: showChat ? "translateY(0)" : "translateY(40px)",
                                    transition: "all 0.4s cubic-bezier(.4,2,.6,1)",
                                }}
                            >
                                {showChat && <IAMessages contexto={atividade.conteudo} />}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-white text-center mt-10">Carregando atividade...</div>
                )}
            </div>
        </div>
    );
}

export default TelaAtividade;