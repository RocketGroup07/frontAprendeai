import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CardPosts from '../components/CardPosts';
import TextType from '../components/TextType.jsx';
import { useAuth } from '../components/UserAuth.jsx';
import { api } from "../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import semTarefas from '../assets/images/semTarefas.svg';
import StaggeredMenu from "../components/StaggeredMenu.jsx";
import LinksContainer from "../components/LinksContainer.jsx";
import { toast } from "react-toastify";

function Geral() {
  const { turmaId } = useParams();
  const { turmaNome, selecionarTurma, isProfessor, isAluno, usuario } = useAuth();
  const [posts, setPosts] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const { state } = useLocation();

  const userName = usuario?.nome || "Usuário";

  // 🔒 Adiciona o token no header das requisições
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  async function fetchTurmas() {
    try {
      let endpoint = "";

      if (isProfessor) {
        endpoint = "turmas/"; // endpoint do professor
      } else if (isAluno) {
        endpoint = "alunos/minhas-turmas"; // endpoint do aluno
      }

      if (!endpoint) return;

      const response = await api.get(endpoint);
      setTurmas(response.data || []);

      // se já houver turma selecionada, não sobrescreve
      if (!turmaNome && response.data?.length > 0) {
        selecionarTurma(response.data[0].id, response.data[0].nome);
      }

    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar turmas");
    }
  }

  useEffect(() => {
    fetchTurmas();
  }, [isProfessor, isAluno]);

  // remover duplicados
  const uniquePosts = Array.from(new Map(posts.map(post => [post.postId, post])).values());

  // agrupar por data
  const postsPorData = uniquePosts.reduce((acc, post) => {
    const data = format(post.data, "dd 'de' MMMM", { locale: ptBR });
    if (!acc[data]) acc[data] = [];
    acc[data].push(post);
    return acc;
  }, {});

  const grupos = Object.entries(postsPorData);

  return (
    <div className='min-h-screen font-neuli'>
      <div style={{ height: "10vh" }}>
        <StaggeredMenu />
      </div>

      <div className='flex flex-col items-center justify-center gap-10 pt-10'>
        <div className='w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]'>
          <TextType
            text={[
              `Olá ${userName}!`,
              `Turma: ${turmaNome || '...'}`,
              'Abaixo estão as atividades',
              'Bons estudos!'
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>
      </div>

      <LinksContainer turmaId={turmaId} />

      <div className='w-[90%] m-auto mt-5 text-[var(--text)]'>
        {grupos.length === 0 ? (
          <div className="text-center flex flex-col-reverse items-center text-lg mt-10">
            Nenhum post encontrado para esta turma.
            <img
              src={semTarefas}
              alt="Nenhuma tarefa encontrada"
              className="w-64 h-64 mt-4"
            />
          </div>
        ) : (
          grupos.map(([data, listaPosts]) => (
            <div key={data} className="mb-8">
              <h2 className="text-xl font-medium mb-4">{data}</h2>
              <div className="flex flex-row flex-wrap gap-4">
                {listaPosts.map((post) => (
                  <CardPosts
                    key={post.postId}
                    id={post.postId}
                    turmaId={turmaId}
                    titulo={post.titulo}
                    descricao={post.conteudo}
                    autor={post.autor}
                    ano={post.data}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Geral;
