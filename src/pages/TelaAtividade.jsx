import { Link, useParams } from "react-router";
import StaggeredMenu from "../components/StaggeredMenu";
import TextType from "../components/TextType";
import { FaCircle, FaLongArrowAltLeft } from "react-icons/fa";
import { MdOutlineAddTask } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { api, baseURL } from "../lib/axios";
import { format } from "date-fns";
import { ca, ptBR } from "date-fns/locale";
import IAMessages from "../components/IAMessages";
import { FaRobot } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";



function TelaAtividade() {
    const { turmaId, atividadeId } = useParams();
    const [atividade, setAtividade] = useState(null);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        async function fetchAtividade() {
            try {
                const response = await api.get(`/atividades/${atividadeId}`);
                setAtividade(response.data);
                
               
                console.log("Atividade carregada:", response.data);
            } catch (error) {
                console.error("Erro ao buscar a atividade:", error);
                setAtividade(null); // Garante que não haverá dados antigos em caso de erro
            }
        }
        fetchAtividade();
    }, [atividadeId, turmaId]);


    // async function baixarArquivo() {
    //     try{
    //         const response = await api.get(`atividades/${postId}/download/anexo`)
    //         console.log("Está vindo");
    //     }catch(error){
    //         console.error("Erro ao buscar a atividade:", error);
    //     }
    // }


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
                            </div>
                            <hr className="border-t border-gray-600 my-4" />
                            
                                {atividade.nomesArquivosAnexo > "0" &&(
                            <div>
                                <div>
                                    <p className="font-bold" >Arquivo:</p>
                                </div>
                                <a href={`${baseURL}atividades/${atividade.id}/download/anexo`} target="_blank" download>
                                <div className="mt-4  bg-[var(--primary)] font-bold p-4 rounded w-90 flex justify-between items-center cursor-pointer hover:bg-red-800 transition-all ">
                                    <div>{atividade.nomesArquivosAnexo}</div>
                                    <div><AiOutlineDownload /></div>
                                </div> </a> <hr className="border-t border-gray-600 my-4" />  
                            </div>
                                )}
                                  
                           
                            
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