import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";

import LinkRedirecionavel from "../components/LinkRedirecionavel";
import CardTarefas from "../components/CardTarefas";
import StaggeredMenu from "../components/StaggeredMenu";
import LinksContainer from "../components/LinksContainer";
import { api } from "../lib/axios";


import { useAuth } from "../components/UserAuth";
import { log } from "three/tsl";

import "../index.css";

// -------------------------------------------------------------

function AtividadePage() {
  const auth = useAuth();
  // ---------------------- Contexto / Params ----------------------
  const { turmaId: turmaIdParam } = useParams();
  const { turmaId: turmaIdContext } = useAuth();
  const turmaId = turmaIdParam || turmaIdContext;

  // ---------------------- Estado inicial -------------------------
  const [atividades, setAtividades] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoArquivo, setNovoArquivo] = useState(null);

  // ---------------------- Buscar atividades da API ----------------
  useEffect(() => {
    async function fetchAtividades() {
      try {
        const token = localStorage.getItem('token');
        console.log('turmaId:', turmaId);
        console.log('token:', token);
        const response = await api.get(`atividades/turma/${turmaId}`);
        console.log('Atividades recebidas da API:', response.data);
        setAtividades(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setAtividades([]);
        console.error(error);
      }
    }
    if (turmaId) fetchAtividades();
  }, [turmaId]);

  // ---------------------- Agrupar por data ------------------------
  // Garante que cada atividade tenha o campo 'ano' no formato dd/MM/yyyy
  const atividadesComAno = atividades.map((post) => {
    let ano = post.ano;
    if (!ano && post.dataEntrega) {
      const data = new Date(post.dataEntrega);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const anoNum = data.getFullYear();
      ano = `${dia}/${mes}/${anoNum}`;
    }
    return { ...post, ano };
  });

  const postsPorData = atividadesComAno.reduce((acc, post) => {
    const data = post.ano;
    if (!acc[data]) acc[data] = [];
    acc[data].push(post);
    return acc;
  }, {});

  const grupos = Object.entries(postsPorData).sort((a, b) => {
    const [diaA, mesA, anoA] = a[0].split("/").map(Number);
    const [diaB, mesB, anoB] = b[0].split("/").map(Number);

    const dateA = new Date(anoA, mesA - 1, diaA);
    const dateB = new Date(anoB, mesB - 1, diaB);

    return dateB - dateA;
  });

  // ---------------------- Fechar modal ao clicar fora ------------
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalRef]);

  // ---------------------- Submissão de nova atividade ------------
  async function handleSubmit(e) {
    e.preventDefault();
    if (!novoTitulo || !novaData || !novaDescricao) return;

    // Monta o objeto de atividade conforme esperado pela API
    const atividadePayload = {
      titulo: novoTitulo,
      conteudo: novaDescricao,
      dataEntrega: new Date(novaData).toISOString(),
      professorNome: auth.usuario?.nome || "Professor", // pega o nome do usuário logado
      turmaNome: auth.turmaId?.toString() || "Turma",   // pega o id da turma
      // outros campos se necessário
    };

    // Cria o FormData para envio multipart
    const formData = new FormData();
    formData.append("titulo", novoTitulo);
    formData.append("conteudo", novaDescricao);
    formData.append("dataEntrega", new Date(novaData).toISOString());
    formData.append("professorNome", auth.usuario?.nome || "Professor");
    if (novoArquivo) {
      formData.append("arquivo", novoArquivo);
    }

    try {
      // Envia o POST para a API Java usando axios
      const response = await api.post(`atividades/criar/${turmaId}`, formData);
      const data = response.data;
      setAtividades([data, ...atividades]);
      setShowModal(false);
      setNovoTitulo("");
      setNovaData("");
      setNovaDescricao("");
      setNovoArquivo(null);
    } catch (error) {
      alert("Erro ao criar atividade!");
      console.error(error);
    }
  }

  // ---------------------- Renderização ----------------------------
  return (
    <div>
      {/* Menu */}
      <div style={{ height: "10vh" }}>
        <StaggeredMenu />
      </div>

      <div className="min-h-screen font-neuli">
        {/* Título principal */}
        <div className="flex flex-col items-center justify-center gap-10 pt-10">
          <div className="w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]">
            <h2>Atividades</h2>
          </div>
        </div>

        {/* Container de links e botão nova atividade */}
        <LinksContainer turmaId={turmaId}>
          <div className="flex items-center ml-auto">
            <button
              className="flex items-center gap-2 p-2 cursor-pointer bg-[var(--primary)] text-white rounded hover:bg-[#b30404] transition-colors"
              onClick={() => setShowModal(true)}
            >
              <span>+</span>
              Nova atividade
            </button>
          </div>
        </LinksContainer>

        {/* Modal de nova atividade */}
        {showModal && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black opacity-80"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="flex items-center justify-center min-h-screen">
              <div
                ref={modalRef}
                className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 w-150 h-158 flex flex-col items-center relative"
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-white font-light text-5xl p-2 cursor-pointer"
                >
                  &times;
                </button>

                <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">
                  Nova Atividade
                </h2>

                <form
                  className="flex flex-col gap-4 mt-4 w-full items-start"
                  onSubmit={handleSubmit}
                >
                  {/* Nome */}
                  <label className="text-left text-white">Nome da Atividade</label>
                  <input
                    type="text"
                    value={novoTitulo}
                    onChange={(e) => setNovoTitulo(e.target.value)}
                    className="w-full bg-[#4a4a4a] p-3 text-white rounded-md font-neuli outline-0"
                  />

                  {/* Data */}
                  <label className="text-left text-white">Data de Entrega</label>
                  <input
                    type="date"
                    value={novaData}
                    onChange={(e) => setNovaData(e.target.value)}
                    className="w-full bg-[#4a4a4a] p-3 text-white rounded-md outline-0"
                  />

                  {/* Descrição */}
                  <label className="text-left text-white">Descrição</label>
                  <textarea
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                    className="w-full bg-[#4a4a4a] p-3 text-white rounded-md font-neuli outline-0 resize-none"
                  />

                  {/* Arquivo */}
                  <label className="text-left text-white">Anexos</label>
                  <div className="w-full">
                    <label className="flex items-center justify-between gap-3 w-full bg-[#4a4a4a] p-3 text-white rounded-md font-neuli cursor-pointer overflow-hidden">
                      <div className="flex items-center gap-3 truncate">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-5 h-5 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3 3 0 014.24 4.24L9.9 17.01a1 1 0 01-1.41-1.41L17.25 7.24"
                          />
                        </svg>
                        <span className="truncate">
                          {novoArquivo
                            ? novoArquivo.name || novoArquivo
                            : "Clique para adicionar arquivo"}
                        </span>
                      </div>
                      <input
                        type="file"
                        onChange={(e) =>
                          setNovoArquivo(e.target.files?.[0] || null)
                        }
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Botões 🧀🧀🧀🧀🧀 */}
                  <div className="flex gap-2 w-full justify-end mt-8">
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

        {/* Lista de atividades agrupadas */}
        <div className="w-[90%] m-auto mt-5 text-white">
          {grupos.length === 0 ? (
            <div className="text-center text-lg text-gray-400 mt-10">
              Nenhuma atividade encontrada.
            </div>
          ) : (
            grupos.map(([data, listaPosts]) => (
              <div key={data} className="mb-8">
                <h2 className="text-xl font-medium mb-4 text-[var(--text)]">{data}</h2>
                <div className="flex flex-row flex-wrap gap-4">
                  {listaPosts.map((post) => (
                    <CardTarefas
                      key={post.id}
                      titulo={post.titulo}
                      descricao={post.conteudo}
                      autor={post.professorNome}
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
  );
}

export default AtividadePage;
