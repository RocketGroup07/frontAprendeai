import { Link, useParams } from "react-router";
import StaggeredMenu from "../components/StaggeredMenu";
import TextType from "../components/TextType";
import { FaCircle, FaLongArrowAltLeft } from "react-icons/fa";
import { MdOutlineAddTask } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { api } from "../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import IAMessages from "../components/IAMessages";
import { FaRobot } from "react-icons/fa";



function TelaAtividade() {
    const { turmaId, atividadeId } = useParams();
    const [atividade, setAtividade] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [arquivo, setArquivo] = useState(null);
    const fileInputRef = React.useRef();

    useEffect(() => {
        async function fetchAtividade() {
            try {
                const response = await api.get(`/atividades/${atividadeId}`);
                setAtividade(response.data);
                console.log("Atividade carregada:", response.data);
            } catch (error) {
                console.error("Erro ao buscar a atividade:", error);
                setAtividade(null);
            }
        }
        fetchAtividade();
    }, [atividadeId, turmaId]);


    return (
        <div>

            <div style={{ height: "10vh" }}>
                <StaggeredMenu />
            </div>

            <div className='w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px] m-auto mt-10 '>
                <TextType
                    text={["Atividades"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                />
            </div>

            <div className="w-[90%] m-auto mt-3" >
                <div>
                    <Link to={"/atividades/" + turmaId} >

                        <button className="flex bg-red-600 center p-2 text-white rounded-sm items-center gap-3 cursor-pointer hover:bg-red-700 "><FaLongArrowAltLeft />Voltar</button>
                    </Link>
                </div>
                {atividade ? (
                    <div className="flex text-white gap-6 m-auto mt-5 ">
                        <div className="text-6xl" ><MdOutlineAddTask /></div>
                        <div className="w-full">
                            <div className="text-3xl font-bold">
                                <h1>{atividade.titulo}</h1>
                            </div>
                            <div className="flex gap-4 items-center text-[0.7rem] font-light " >
                                <div>
                                    <h6>{atividade.nome}</h6>
                                </div>
                                <div>
                                    <FaCircle />
                                </div>
                                <div>
                                    <h6>{format(new Date(atividade.dataAtividade), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</h6>
                                </div>

                            </div>
                            <hr className="border-t border-gray-600 my-4" />
                            <div>
                                <div>
                                    <p className="text-justify whitespace-pre-wrap">{atividade.conteudo}</p>
                                </div>
                                <div className="mt-4 font-extralight">
                                    <p>atividade</p> {/* MEXER AQUI */}
                                </div>


                            </div>
                            <hr className="border-t border-gray-600 my-4" />

                            <div className="flex gap-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setArquivo(e.target.files[0]);
                                        }
                                    }}
                                />
                                <button
                                    className="flex bg-gray-600 center p-2 text-white rounded-sm items-center gap-3 cursor-pointer hover:bg-gray-700 "
                                    onClick={e => {
                                        e.preventDefault();
                                        fileInputRef.current.click();
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 flex-shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3 3 0 014.24 4.24L9.9 17.01a1 1 0 01-1.41-1.41L17.25 7.24" />
                                    </svg>
                                    {arquivo ? arquivo.name : "Anexar"}
                                </button>
                                <button className="flex bg-red-600 center p-2 text-white rounded-sm items-center gap-3 cursor-pointer hover:bg-red-700 ">Entregar Atividade</button>
                            </div>

                            <div>
                                {/* Botão flutuante para abrir o chat IA */}
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
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 32,
                                        cursor: "pointer",
                                        transition: "transform 0.2s",
                                        transform: showChat ? "scale(1.1) rotate(15deg)" : "scale(1)"
                                    }}
                                    title={showChat ? "Fechar chat IA" : "Abrir chat IA"}
                                >
                                    <FaRobot />
                                </button>
                                {/* Chat IA com animação de fade/slide */}
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
                                    {showChat && (
                                        <IAMessages contexto={atividade.conteudo} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-white text-center mt-10">Carregando atividade...</div>
                )}

            </div>


        </div>
    )
}

export default TelaAtividade;