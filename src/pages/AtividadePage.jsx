import LinkRedirecionavel from "../components/LinkRedirecionavel";
import CardTarefas from "../components/CardTarefas";
import React, { useState, useRef, useEffect } from "react";
import '../index.css';
import { useParams } from "react-router";
import semTarefas from '../assets/images/semTarefas.svg';
import StaggeredMenu from "../components/StaggeredMenu";
import LinksContainer from "../components/LinksContainer";
import { useAuth } from "../components/UserAuth";
import { api } from "../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Modal from "../components/Modal";

function formatarAtividadeParaComponente(post) {

  const dataDeReferencia = post.dataAtividade || post.dataEntrega;

  const dataParaExibicao = format(new Date(dataDeReferencia), "dd 'de 'MMMM yyyy", { locale: ptBR });

  const dataParaOrdenacao = format(new Date(dataDeReferencia), 'dd MMMM yyyy', { locale: ptBR });

  const descricaoResumida = post.conteudo
    ? post.conteudo.substring(0, 100) + "..."
    : "";

  return {
    id: post.id,
    titulo: post.titulo,
    ano: dataParaExibicao,
    dataDeAgrupamento: dataParaOrdenacao,
    descricao: descricaoResumida,
    autor: post.professor?.nome || "Professor"
  };
}

function AtividadePage() {
  const { turmaId: turmaIdParam } = useParams();
  const { turmaId: turmaIdContext, isProfessor } = useAuth();

  const turmaId = turmaIdParam || turmaIdContext;

  const [atividades, setAtividades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    async function fetchAtividades() {
      try {
        const response = await api.get(`/atividades/turma/${turmaId}`);
        if (response.data && Array.isArray(response.data)) {
          const atividadesFormatadas = response.data.map(formatarAtividadeParaComponente);
          setAtividades(atividadesFormatadas);
        } else {
          setAtividades([]);
        }
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    }

    if (turmaId) fetchAtividades();
  }, [turmaId]);

  const postsPorData = atividades.reduce((acc, post) => {
    const data = post.dataDeAgrupamento;
    if (!acc[data]) acc[data] = [];
    acc[data].push(post);
    return acc;
  }, {});

  const grupos = Object.entries(postsPorData).sort((a, b) => {

    const parseDate = (dateString) => {

      const parts = dateString.split(' ');
      const dia = parts[0].padStart(2, '0');
      const mes = parts[1];
      const ano = parts[2];

      const mesesMap = {
        janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
        julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
      };

      const mesIndex = mesesMap[mes.toLowerCase()];

      if (mesIndex === undefined) return new Date(0);

      return new Date(ano, mesIndex, dia);
    };

    const dateA = parseDate(a[0]);
    const dateB = parseDate(b[0]);

    return dateB.getTime() - dateA.getTime();
  });

  // Fecha modal ao clicar fora
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

  // 🌟 NOVO handleSubmit — usando dados do react-hook-form
  async function handleSubmit(data) {
    try {
      const { titulo, dataEntrega, descricao, arquivo } = data;

      const [ano, mes, dia] = dataEntrega.split('-').map(Number);
      const dataFormatadaISO = new Date(ano, mes - 1, dia).toISOString();

      const formData = new FormData();

      const atividadeObj = {
        titulo,
        conteudo: descricao,
        dataEntrega: dataFormatadaISO
      };

      formData.append("atividade", JSON.stringify(atividadeObj));

      if (arquivo) {
        formData.append("arquivo", arquivo);
      }

      const response = await api.post(`/atividades/criar/${turmaId}`, formData);

      const atividadeCriada = response.data;
      const atividadeFormatada = formatarAtividadeParaComponente(atividadeCriada);

      setAtividades(prev => [atividadeFormatada, ...prev]);

      setShowModal(false);

    } catch (error) {
      console.error("Erro na criação da atividade:", error);
      alert("Erro ao criar atividade.");
    }
  }


  function removerAtividade(id) {
  setAtividades(prev => prev.filter(a => a.id !== id));
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
          <div className='flex items-center ml-auto'>
            {isProfessor && (
              <button
                className='flex items-center gap-2 p-2 cursor-pointer bg-[var(--primary)] text-white rounded hover:bg-[#b30404] transition-colors'
                onClick={() => setShowModal(true)}
              >
                <span>+</span>
                Nova atividade
              </button>
            )}
          </div>
        </LinksContainer>

        {/* MODAL */}
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          modalRef={modalRef}
          nomeModal="Nova Atividade"
          onSubmit={handleSubmit}
          fields={[
            { name: "titulo", label: "Título", type: "text", required: true, maxLength: { value: 100, message: "Máximo de 50 caracteres" } },
            { name: "dataEntrega", label: "Data de Entrega", type: "date", required: true, },
            { name: "descricao", label: "Descrição", type: "textarea", required: true, maxLength: { value: 300, message: "Máximo de 50 caracteres" } },
            { name: "arquivo", label: "Anexo", type: "file" }
          ]}
        />

        <div className='w-[90%] m-auto mt-5 text-white'>
          {grupos.length === 0 ? (
            <div className="text-center flex flex-col-reverse items-center text-lg mt-10 text-[var(--text)]">
              Nenhuma atividade encontrada para esta turma.
              <img src={semTarefas} alt="Nenhuma tarefa encontrada" className="w-64 h-64 mt-4" />
            </div>
          ) : (
            grupos.map(([data, lista]) => (
              <div key={data} className="mb-8">
                <h2 className="text-xl font-medium mb-4 text-[var(--text)]">{data}</h2>
                <div className="flex flex-row flex-wrap gap-4">
                  {lista.map((atividade) => (
                    <CardTarefas
                      key={atividade.id}
                      id={atividade.id}
                      turmaId={turmaId}
                      titulo={atividade.titulo}
                      descricao={atividade.descricao}
                      autor={atividade.autor}
                      ano={atividade.ano}
                      onDelete={() => removerAtividade(atividade.id)}
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
