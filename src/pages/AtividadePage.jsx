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

// ***** FORMATAÇÃO *****
function formatarAtividadeParaComponente(post) {
  const dataDeReferencia = post.dataAtividade || post.dataEntrega;

  const dataParaExibicao = format(new Date(dataDeReferencia), "dd 'de' MMMM yyyy", { locale: ptBR });
  const dataParaAgrupamento = format(new Date(dataDeReferencia), "dd MMMM yyyy", { locale: ptBR });

  const descricaoResumida = post.conteudo
    ? post.conteudo.substring(0, 100) + "..."
    : "";

  return {
    id: post.id,
    titulo: post.titulo,
    ano: dataParaExibicao,
    dataDeAgrupamento: dataParaAgrupamento,
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

  // 🔥 Agora fetchAtividades está fora e pode ser chamado no handleSubmit
  async function fetchAtividades() {
    try {
      const response = await api.get(`/atividades/turma/${turmaId}`);

      if (response.data && Array.isArray(response.data)) {
        const atividadesFormatadas = response.data.map(formatarAtividadeParaComponente);
        setAtividades(atividadesFormatadas);
      }
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    }
  }

  // Carrega ao entrar na página
  useEffect(() => {
    if (turmaId) fetchAtividades();
  }, [turmaId]);

  // Agrupar atividades por data
  const postsPorData = atividades.reduce((acc, post) => {
    const data = post.dataDeAgrupamento;
    if (!acc[data]) acc[data] = [];
    acc[data].push(post);
    return acc;
  }, {});

  // Ordenar (mais nova → mais antiga)
  const grupos = Object.entries(postsPorData).sort((a, b) => {
    const parseDate = (dateString) => {
      const [dia, mesNome, ano] = dateString.split(" ");
      const mesesMap = {
        janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
        julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
      };
      return new Date(Number(ano), mesesMap[mesNome.toLowerCase()], Number(dia));
    };

    return parseDate(b[0]).getTime() - parseDate(a[0]).getTime();
  });

  // Fecha modal quando clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ***** handleSubmit CORRIGIDO *****
  async function handleSubmit(data) {
  try {
    // validação rápida no frontend (mostra problema imediatamente)
    if (!data.titulo || !data.descricao || !data.dataEntrega) {
      alert("Por favor, preencha título, descrição e data de entrega.");
      return;
    }

    // montar FormData
    const formData = new FormData();

    // garantir que o backend receba a data no formato esperado (ISO)
    const isoDataEntrega = new Date(data.dataEntrega).toISOString();

    const atividade = {
      titulo: data.titulo,
      conteudo: data.descricao,
      dataEntrega: isoDataEntrega
    };

    formData.append("atividade", JSON.stringify(atividade));

    // se houver arquivo
    if (data.arquivo) {
      formData.append("arquivo", data.arquivo);
    }

    // debug: listar keys do FormData (ajuda a confirmar o que será enviado)
    for (const pair of formData.entries()) {
      console.log("FormData entry:", pair[0], pair[1]);
    }

    // NÃO definir Content-Type manualmente — o browser define o multipart boundary.
    const response = await api.post(`/atividades/criar/${turmaId}`, formData);

    console.log("Atividade criada (API):", response.data);

    // atualizar lista após criação
    await fetchAtividades();

    setShowModal(false);

  } catch (error) {
    // log completo para debugging
    console.error("Erro na criação da atividade:", error);

    // Axios error com resposta do servidor
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Resposta do servidor:", error.response.data);
      alert(`Falha ao criar a atividade: ${error.response.data?.message || JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // requisição feita mas sem resposta (CORS / servidor off)
      console.error("No response (request):", error.request);
      alert("Falha de rede: sem resposta do servidor. Verifique o console / network.");
    } else {
      // outro erro
      alert("Erro inesperado: " + error.message);
    }
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

        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          modalRef={modalRef}
          nomeModal="Nova Atividade"
          onSubmit={handleSubmit}
          fields={[
            { name: "titulo", label: "Título", type: "text", required: true },
            { name: "dataEntrega", label: "Data de Entrega", type: "date", required: true },
            { name: "descricao", label: "Descrição", type: "textarea", required: true },
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
                      onDelete={() => {
                        // Remove a atividade do estado
                        setAtividades((prev) => prev.filter((a) => a.id !== atividade.id));
                      }}
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
