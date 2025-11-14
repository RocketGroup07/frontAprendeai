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

function Geral() {
  const { turmaId } = useParams();
  const { turmaNome, selecionarTurma } = useAuth();
  const [posts, setPosts] = useState([]);
  const auth = useAuth();
  const usuario = auth?.usuario;
  const userName = usuario?.nome || "Usuário";
  const { state } = useLocation();

  useEffect(() => {
    async function fetchTurmaPosts() {
      try {
        const response = await api.get(`posts/turma/${turmaId}`);
        setPosts(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar turma:", error);
      }
    }
    fetchTurmaPosts();
  }, [turmaId]);

  useEffect(() => {
    async function ensureTurmaNome() {
      if (!turmaNome && turmaId) {
        try {
          const resp = await api.get('alunos/minhas-turmas');
          const turmaAtual = (resp.data || []).find(t => String(t.id) === String(turmaId));
          if (turmaAtual) selecionarTurma(turmaAtual.id, turmaAtual.nome);
        } catch (err) {
          console.error('Erro ao buscar nome da turma:', err);
        }
      }
    }
    ensureTurmaNome();
  }, [turmaId, turmaNome, selecionarTurma]);

  console.log(turmaId)

  // Remover duplicados por id
  const uniquePosts = Array.from(new Map(posts.map(post => [post.postId, post])).values());
  console.log("Posts únicos:", uniquePosts);
  // Agrupar por data (ano)
  const postsPorData = uniquePosts.reduce((acc, post) => {
    const data = format(post.data, "dd 'de' MMMM", { locale: ptBR })
    console.log("Data do post:", data);
    if (!acc[data]) acc[data] = [];
    acc[data].push(post);
    return acc;
  }, {});

  console.log("Recebido 2" + postsPorData);

  // Ordenar datas do mais recente para o mais antigo
  const grupos = Object.entries(postsPorData).sort((a, b) => {
    const [diaA, mesA, anoA] = a[0].split('/').map(Number);
    const [diaB, mesB, anoB] = b[0].split('/').map(Number);
    const dateA = new Date(anoA, mesA - 1, diaA);
    const dateB = new Date(anoB, mesB - 1, diaB);
    return dateB - dateA;
  });

  console.log("Recebido" + grupos);

  return (
    <div className='min-h-screen font-neuli'>
      <div style={{ height: "10vh" }}>
        <StaggeredMenu />
      </div>
      <div className='flex flex-col items-center justify-center gap-10 pt-10'>
        <div className='w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]'>
          <TextType
            text={[`Olá ${userName}!`, `Turma: ${turmaNome || '...'}`, 'Abaixo estão as atividades', 'Bons estudos!']}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>
      </div>

      <LinksContainer turmaId={turmaId}/>

      <div className='w-[90%] m-auto mt-5 text-[var(--text)]'>
        {grupos.length === 0 ? (
          <div className="text-center flex flex-col-reverse items-center text-lg mt-10">Nenhum post encontrado para esta turma.
            <img
              src={semTarefas}
              alt="Nenhuma tarefa encontrada"
              className="w-64 h-64 mt-4" // Adicione classes para controlar o tamanho
            />
          </div>
        ) : (
          grupos.map(([data, listaPosts]) => (
            <div key={data} className="mb-8">
              <h2 className="text-xl font-medium mb-4">{data}</h2>
              <div className="flex flex-row flex-wrap gap-8">
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