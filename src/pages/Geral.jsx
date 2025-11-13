import { useLocation, useParams } from "react-router-dom";
import { use, useEffect, useRef, useState } from "react";
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
import Modal from "../components/Modal.jsx";

function Geral() {
  const { turmaId } = useParams();
  const { turmaNome, selecionarTurma, isProfessor, isAluno, usuario, usuarioId } = useAuth();
  const [posts, setPosts] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const { state } = useLocation();
  const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);
  
    const [novoTitulo, setNovoTitulo] = useState("");
    const [novaData, setNovaData] = useState("");
    const [novaDescricao, setNovaDescricao] = useState("");
    // Adição do estado para o arquivo anexado
    const [novoArquivo, setNovoArquivo] = useState(null);

  const userName = usuario?.nome || "Usuário";

  // Adiciona o token no header das requisições
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
async function fetchPosts() {
    try {
      if (!turmaId) return;
      const response = await api.get(`/posts/turma/${turmaId}`);
      console.log("Posts recebidos da API:", response.data);
      
      // Converter string de data para Date
      const data = (response.data || []).map(post => ({
        ...post,
        data: post.data ? new Date(post.data) : new Date()
      }));
      
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (turmaId) {
      fetchPosts();
    }
  }, [turmaId]);

  useEffect(() => {
    fetchTurmas();
  }, [isProfessor, isAluno]);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!novoTitulo || !novaDescricao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    /* const [ano, mes, dia] = novaData.split('-').map(Number);
    const dataFormatadaISO = new Date(ano, mes - 1, dia).toISOString(); */

    // Payload em FormData (formato string/multipart)
    const formData = new FormData();

    const post = {
      titulo: novoTitulo,
      conteudo: novaDescricao,
    };

    formData.append('post', JSON.stringify(post));

    if (novoArquivo) {
      formData.append('arquivo', novoArquivo);
    }

    try {
     
      const response = await api.post(`/posts/criar/${usuarioId}/turma/${turmaId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Resposta da API ao criar post:", response);

      const postCriado = response.data;
     // const postFormatado = formatarPostParaComponente(postCriado);

      //setPosts([postFormatado, ...posts]);

      setShowModal(false);
      setNovoTitulo("");
      setNovaDescricao("");
      setNovoArquivo(null);

    } catch (error) {
      console.error("Erro ao postar post:", error);
      alert("Falha ao criar o post. Tente novamente.");
    }
  }

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
              'Abaixo estão os posts',
              'Bons estudos!'
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>
      </div>

      <LinksContainer turmaId={turmaId}>
        <div className='flex items-center ml-auto'>

          {isProfessor && (
            <button
              className='flex items-center gap-2 p-2 cursor-pointer bg-[var(--primary)] text-white rounded hover:bg-[#b30404] transition-colors'
              onClick={() => setShowModal(true)}
            >
              <span>+</span>
              Novo Post
            </button>
          )}


        </div>
      </LinksContainer>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        modalRef={modalRef}
        handleSubmit={handleSubmit}
        novoTitulo={novoTitulo}
        setNovoTitulo={setNovoTitulo}
        novaData={novaData}
        setNovaData={setNovaData}
        novaDescricao={novaDescricao}
        setNovaDescricao={setNovaDescricao}
        novoArquivo={novoArquivo}
        setNovoArquivo={setNovoArquivo}
        isGeral={true}
        nomeModal={"Novo Post"}
      />

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
              <div className="flex flex-row flex-wrap gap-7">
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
