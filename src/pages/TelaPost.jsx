import TextType from "../components/TextType"
import { FaLongArrowAltLeft } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { FaCircle } from "react-icons/fa6";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { api, baseURL } from "../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import StaggeredMenu from "../components/StaggeredMenu";
import { AiOutlineDownload } from "react-icons/ai";
import Comentarios from "../components/Comentarios";


function TelaPost() {
    const { turmaId, postId } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await api.get(`/posts/${postId}/${turmaId}`);
                setPost(response.data);
                console.log("Post carregado:", response.data);
            } catch (error) {
                console.error("Erro ao buscar o post:", error);
                setPost(null); // Garante que não haverá dados antigos em caso de erro
            }
        }
        fetchPost();
    }, [postId]);

    return (
        <div>

            <div style={{ height: "10vh" }}>
                <StaggeredMenu />
            </div>

            <div className='w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px] m-auto mt-10 '>
                <TextType
                    text={["Posts"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                />
            </div>

            <div className="w-[90%] m-auto mt-3" >
                <div>
                    <Link to={"/geral/" + turmaId} >

                        <button className="flex bg-red-600 center p-2 text-white rounded-sm items-center gap-3 cursor-pointer hover:bg-red-700 "><FaLongArrowAltLeft />Voltar</button>
                    </Link>
                </div>
                {post ? (
                    <div className="flex text-white gap-6 m-auto mt-5 ">
                        <div className="text-6xl" ><SiGoogleclassroom /></div>
                        <div className="w-full" >
                            <div className="text-3xl font-bold">
                                <h1>{post.titulo}</h1>
                            </div>
                            <div className="flex gap-4 items-center text-[0.7rem] font-light " >
                                <div>
                                    <h6>{post.autor.nome}</h6>
                                </div>
                                <div>
                                    <FaCircle />
                                </div>
                                <div>
                                    <h6>{format(new Date(post.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</h6>
                                </div>

                            </div>
                            <hr className="border-t border-gray-600 my-4" />
                            <div>
                                <div>
                                    <p className="text-justify whitespace-pre-wrap">{post.conteudo}</p>
                                </div>
                            </div>
                            <hr className="border-t border-gray-600 my-4" />
                            <Comentarios turmaId={turmaId} postId={postId} />
                            {post.nomeArquivo > "0" && (
                                <a
                                    href={`${baseURL}posts/${post.turmaId}/${post.postId}/download/anexo`}
                                    download={post.nomeArquivo}
                                >
                                    <div className="mt-4 bg-[var(--primary)] font-bold p-4 rounded w-90 flex justify-between items-center cursor-pointer hover:bg-red-800 transition-all">
                                        <div>{post.nomeArquivo}</div>
                                        <div><AiOutlineDownload /></div>
                                        <hr className="border-t border-gray-600 my-4" />
                                    </div>
                                </a>
                                
                            )}

                            
                        </div>
                    </div>
                ) : (
                    <div className="text-white text-center mt-10">Carregando post...</div>
                )}

            </div>

        </div>
    )
}

export default TelaPost