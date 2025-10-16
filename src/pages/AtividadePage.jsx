import LinkRedirecionavel from "../components/LinkRedirecionavel"
import posts from '../ativ.json';
import CardTarefas from "../components/CardTarefas";
import React, { useState, useRef, useEffect } from "react";
import '../index.css';
// import { format } from "date-fns"; // MODIFICAÇÃO 2: Não é mais necessário formatar a data aqui
import { useParams } from "react-router";
import semTarefas from '../assets/images/semTarefas.svg';
import StaggeredMenu from "../components/StaggeredMenu";
import LinksContainer from "../components/LinksContainer"; // Adicione este import
import { log } from "three/tsl";
import { useAuth } from "../components/UserAuth";

function AtividadePage() {
  const { turmaId: turmaIdParam } = useParams();
  const { turmaId: turmaIdContext } = useAuth();
  const turmaId = turmaIdParam || turmaIdContext;

  const uniquePosts = Array.from(new Map(posts.map(post => [post.id, post])).values());
  const [atividades, setAtividades] = useState(uniquePosts);

  const postsPorData = atividades.reduce((acc, post) => {
    const data = post.ano;
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(post);
    return acc;
  }, {});

  const grupos = Object.entries(postsPorData).sort((a, b) => {
    const [diaA, mesA, anoA] = a[0].split('/').map(Number);
    const [diaB, mesB, anoB] = b[0].split('/').map(Number);
    const dateA = new Date(anoA, mesA - 1, diaA);
    const dateB = new Date(anoB, mesB - 1, diaB);
    return dateB - dateA;
  });

  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");

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

  function handleSubmit(e) {
    e.preventDefault();
    if (!novoTitulo || !novaData || !novaDescricao) return;
    const dataFormatada = format(novaData, "dd/MM/yyyy");
    const novoId = atividades.length > 0 ? Math.max(...atividades.map(a => a.id)) + 1 : 1;
    const novaAtividade = {
      id: novoId,
      titulo: novoTitulo,
      descricao: novaDescricao,
      ano: dataFormatada,
      autor: "Você"
    };

    try {
      // Faz a requisição POST para o endpoint da sua API
      // Certifique-se de que o endpoint '/atividades' está correto
      const response = await api.post(`/atividades/criar/${turmaId}`, novaAtividadePayload);

      // Adiciona a nova atividade (retornada pela API) ao estado local
      // A resposta da API (response.data) deve conter a atividade recém-criada
      setAtividades([response.data, ...atividades]);

      // Limpa o formulário e fecha o modal
      setShowModal(false);
      setNovoTitulo("");
      setNovaData("");
      setNovaDescricao("");

    } catch (error) {
      console.error("Erro ao postar atividade:", error);
      alert("Falha ao criar a atividade. Tente novamente.");
    }
  }

  return (
    <div>
      <div style={{ height: "10vh" }}>
        <StaggeredMenu />
      </div>

      <div className='min-h-screen font-neuli'>
        <div className='flex flex-col items-center justify-center gap-10 pt-10'>
          <div className='w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]'>
            <h2>Atividades</h2>
          </div>
        </div>

        <LinksContainer turmaId={turmaId}>
          {/* Botão para criar atividade */}
          <div className='flex items-center ml-auto'>
            <button
              className='flex items-center gap-2 p-2 cursor-pointer bg-[var(--primary)] text-white rounded hover:bg-[#b30404] transition-colors'
              onClick={() => setShowModal(true)}
            >
              <span>+</span>
              Nova atividade
            </button>
          </div>
        </LinksContainer>

        {showModal && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black opacity-80" onClick={() => setShowModal(false)}></div>
            <div className="flex items-center justify-center min-h-screen">
              <div ref={modalRef} className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 w-150 h-140 flex flex-col items-center relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-white font-light text-5xl p-2 cursor-pointer"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Nova Atividade</h2>
                <form className="flex flex-col gap-4 mt-4 w-full items-start" onSubmit={handleSubmit}>
                  <label className="text-left text-white">Nome da Atividade</label>
                  <input type="text" value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} className="w-full bg-[#4a4a4a] p-3 text-white rounded-md  font-neuli outline-0" />
                  <label className="text-left text-white">Data de Entrega</label>
                  <input type="date" value={novaData} onChange={e => setNovaData(e.target.value)} className="w-full bg-[#4a4a4a] p-3 text-white rounded-md  outline-0" />
                  <label className="text-left text-white">Descrição</label>
                  <textarea value={novaDescricao} onChange={e => setNovaDescricao(e.target.value)} className="w-full bg-[#4a4a4a] p-3 text-white rounded-md  font-neuli outline-0 resize-none" />
                  <div className="flex gap-2 w-full justify-end  mt-8">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 cursor-pointer text-white border border-gray-300 rounded hover:bg-white hover:text-black transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 cursor-pointer bg-[var(--primary)] text-white rounded hover:bg-[#b30404] transition-colors"
                    >
                      Postar Atividade
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className='w-[90%] m-auto mt-5 text-white'>
          {grupos.map(([data, listaPosts]) => (
            <div key={data} className="mb-8">
              <h2 className="text-xl font-medium mb-4 text-[var(--text)]">{data}</h2>
              <div className="flex flex-row flex-wrap gap-4">
                {listaPosts.map((post) => (
                  <CardTarefas
                    key={post.id}
                    titulo={post.titulo}
                    descricao={post.descricao}
                    autor={post.autor}
                    ano={post.ano}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AtividadePage;