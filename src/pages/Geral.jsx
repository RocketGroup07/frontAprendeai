import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from '../components/Header';
import CardPosts from '../components/CardPosts';
import LinkRedirecionavel from '../components/LinkRedirecionavel';
import TextType from '../components/TextType.jsx';
import { useAuth } from '../components/UserAuth.jsx';
import { api } from "../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import StaggeredMenu from "../components/StaggeredMenu.jsx";

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/geral' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

function Geral() {
  const { turmaId } = useParams();
  const [posts, setPosts] = useState([]);
  const [turmaNome, setTurmaNome] = useState("");
  const auth = useAuth();
  const usuario = auth?.usuario;
  const userName = usuario?.nome || "Usuário";
  const { state } = useLocation();

  useEffect(() => {
    async function fetchTurma() {
      try {
        const response = await api.get(`posts/turma/${turmaId}`);
        console.log("Posts recebidos:", response.data);
        setPosts(response.data || []);
        // setTurmaNome(response.data.turma.nome || "");
      } catch (error) {
        console.error("Erro ao buscar turma:", error);
      }
    }
    fetchTurma();
  }, [turmaId]);

  // Remover duplicados por id
  const uniquePosts = Array.from(new Map(posts.map(post => [post.id, post])).values());

  // Agrupar por data (ano)
  const postsPorData = uniquePosts.reduce((acc, post) => {
    const data = post.dataAgendada;
    if (!acc[data]) acc[data] = [];
    acc[data].push(post);
    return acc;
  }, {});



  // Ordenar datas do mais recente para o mais antigo
  const grupos = Object.entries(postsPorData).sort((a, b) => {
    const [diaA, mesA, anoA] = a[0].split('/').map(Number);
    const [diaB, mesB, anoB] = b[0].split('/').map(Number);
    const dateA = new Date(anoA, mesA - 1, diaA);
    const dateB = new Date(anoB, mesB - 1, diaB);
    return dateB - dateA;
  });

  console.log(grupos)

  return (
    <div className='min-h-screen font-neuli'>
      <div style={{ height: "10vh" }}>
        <StaggeredMenu />
      </div>

      <div className='flex flex-col items-center justify-center gap-10 pt-10'>
        <div className='w-[90%] h-[137px] p-7 bg-[#2A2A2A] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]'>
          <TextType
            text={[`Olá ${userName}!`, `Turma: ${turmaNome}`, 'Abaixo estão as atividades', 'Bons estudos!']}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>
      </div>

      <div className='w-[90%] mr-auto ml-auto mt-4 flex flex-row gap-[48px] p-1 text-white'>
        <LinkRedirecionavel nome={"Geral"} link={"/turmas/" + turmaId} className="bg-[#D00909] text-white p-2 rounded cursor-pointer" />
        <LinkRedirecionavel nome={"Atividades"} link={"/Atividades/" + turmaId} className="p-2 cursor-pointer" />
        <LinkRedirecionavel nome={"Favoritos"} link={"/Favoritos/" + turmaId} className="p-2 cursor-pointer" />
      </div>

      <div className='w-[90%] m-auto mt-5 text-white'>
        {grupos.length === 0 ? (
          <div className="text-center text-lg mt-10">Nenhum post encontrado para esta turma.</div>
        ) : (
          grupos.map(([data, listaPosts]) => (
            <div key={data} className="mb-8">
              <h2 className="text-xl font-medium mb-4">{format(data, "dd 'de' MMMM", { locale: ptBR })}</h2>
              <div className="flex flex-row flex-wrap gap-4">
                {listaPosts.map((post) => (
                  <CardPosts
                    key={post.id}
                    id={post.id}
                    turmaId={turmaId}
                    titulo={post.titulo}
                    descricao={post.conteudo}
                    autor={post.autor}
                    ano={post.dataPostagem}
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
