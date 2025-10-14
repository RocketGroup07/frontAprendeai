import Header from "../components/Header";
import LinkRedirecionavel from "../components/LinkRedirecionavel";
// import posts from '../ativ.json'; // MODIFICAÇÃO 1: Não precisamos mais do JSON local
import CardTarefas from "../components/CardTarefas";
import React, { useState, useRef, useEffect } from "react";
import '../index.css';
// import { format } from "date-fns"; // MODIFICAÇÃO 2: Não é mais necessário formatar a data aqui
import { useParams } from "react-router";
import semTarefas from '../assets/images/semTarefas.svg';
import StaggeredMenu from "../components/StaggeredMenu";
import { api } from "../lib/axios";

function AtividadePage() {
  const { turmaId } = useParams();

  // MODIFICAÇÃO 3: Inicializa o estado de atividades como um array vazio
  const [atividades, setAtividades] = useState([]);

  // MODIFICAÇÃO 4: useEffect para buscar as atividades da API ao carregar a página
  useEffect(() => {
    async function fetchAtividades() {
      try {

        const response = await api.get(`/atividades/turma/${turmaId}`);
        if (response.data && Array.isArray(response.data)) {
          setAtividades(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
        // Opcional: mostrar uma mensagem de erro para o usuário
      }
    }
    fetchAtividades();
  }, [turmaId]); // O useEffect será executado sempre que o turmaId mudar

  // O restante da lógica de agrupamento e ordenação continua igual
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

  // MODIFICAÇÃO 5: Função handleSubmit atualizada para enviar dados à API
  async function handleSubmit(e) {
    e.preventDefault();
    if (!novoTitulo || !novaData || !novaDescricao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novaAtividadePayload = {
      titulo: novoTitulo,
      descricao: novaDescricao,
      // O input type="date" já fornece a data no formato 'YYYY-MM-DD', ideal para APIs
      data_entrega: novaData,
      turma_id: turmaId // Inclui o ID da turma na requisição
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
      {/* O resto do seu JSX permanece o mesmo */}
      <div style={{ height: "10vh" }}>
        <StaggeredMenu />
      </div>

      <div className='min-h-screen font-neuli'>
        <div className='flex flex-col items-center justify-center gap-10 pt-10'>
          <div className='w-[90%] h-[137px] p-7 bg-[#2A2A2A] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]'>
            <h2>Atividades</h2>
          </div>
        </div>

        <div className='w-[90%] mr-auto ml-auto mt-4 flex flex-row gap-[48px] p-1 text-white'>
          <LinkRedirecionavel nome={"Geral"} link={"/geral/" + turmaId} className="p-2  cursor-pointer" />
          <LinkRedirecionavel nome={"Atividades"} link={"/atividades/" + turmaId} className="p-2 cursor-pointer bg-[#D00909] text-white rounded " />
          <LinkRedirecionavel nome={"Favoritos"} link={"/favoritos/" + turmaId} className="p-2 cursor-pointer  " />

          <div className='flex items-center ml-auto'>
            <button
              className='flex items-center gap-2 p-2 cursor-pointer bg-[#D00909] text-white rounded hover:bg-[#b30404] transition-colors'
              onClick={() => setShowModal(true)}
            >
              <span>+</span>
              Nova atividade
            </button>
          </div>
        </div>

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
                <h2 className="text-2xl font-bold mb-4 text-white">Nova Atividade</h2>

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
                      className="px-4 py-2 cursor-pointer bg-[#D00909] text-white rounded hover:bg-[#b30404] transition-colors"
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
          {grupos.length === 0 ? (
            <div className="text-center flex flex-col items-center text-lg mt-10">Nenhuma atividade encontrado para esta turma.
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
            ))

          )}

        </div>
      </div>
    </div>
  )
}

export default AtividadePage;