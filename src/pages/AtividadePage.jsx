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

// ***** FUNÇÃO DE FORMATAÇÃO CORRIGIDA PARA ORDENAÇÃO *****
function formatarAtividadeParaComponente(post) {

  // 🚨 CORREÇÃO AQUI: Usando 'dataAtividade' (data de criação) ao invés de 'dataEntrega'.
  const dataDeReferencia = post.dataAtividade || post.dataEntrega;

  // Data para Exibição (Ex: "27 de Outubro")
  const dataParaExibicao = format(new Date(dataDeReferencia), "dd 'de 'MMMM yyyy", { locale: ptBR });

  // Data para Agrupamento/Ordenação (Ex: "27 de Outubro 2025")
  // Alterei o formato para 'dd MMMM yyyy' para garantir que agrupe por dia e ano corretamente.
  const dataParaOrdenacao = format(new Date(dataDeReferencia), 'dd MMMM yyyy', { locale: ptBR });

  // Fix: Trunca o 'conteudo'
  const descricaoResumida = post.conteudo
    ? post.conteudo.substring(0, 100) + "..."
    : "";

  // Fix: Cria um objeto NOVO e usa '?' para evitar crash
  return {
    id: post.id,
    titulo: post.titulo,

    // Dados "traduzidos" para o front-end:
    ano: dataParaExibicao,         // Usado no CardTarefas (Ex: "27 de Outubro 2025")
    dataDeAgrupamento: dataParaOrdenacao, // Usado para agrupar (Ex: "27 Outubro 2025")
    descricao: descricaoResumida,

    // Usa optional chaining '?' para evitar o crash
    autor: post.professor?.nome || "Professor"
  };
}

function AtividadePage() {
  const { turmaId: turmaIdParam } = useParams();
  const { turmaId: turmaIdContext } = useAuth();
  const turmaId = turmaIdParam || turmaIdContext;

  const { isProfessor } = useAuth();

  const [atividades, setAtividades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  // Adição do estado para o arquivo anexado
  const [novoArquivo, setNovoArquivo] = useState(null);

  useEffect(() => {
    async function fetchAtividades() {
      try {
        const response = await api.get(`/atividades/turma/${turmaId}`);
        // console.log("Resposta da API de atividades:", response.data); // Linha removida
        if (response.data && Array.isArray(response.data)) {

          const atividadesFormatadas = response.data.map(formatarAtividadeParaComponente);
          setAtividades(atividadesFormatadas);

        }
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    }
    if (turmaId) {
      fetchAtividades();
    }
  }, [turmaId]);

  // Agrupamento usando o campo corrigido 'dataDeAgrupamento'
  const postsPorData = atividades.reduce((acc, post) => {
    const data = post.dataDeAgrupamento;
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(post);
    return acc;
  }, {});

  // Ordenação que AGORA FUNCIONA
  const grupos = Object.entries(postsPorData).sort((a, b) => {
    // a[0] e b[0] são agora 'dd MMMM yyyy'
    // Para ordenar datas em formato de texto, é melhor convertê-las para objeto Date
    const parseDate = (dateString) => {
      // Cria uma data no formato yyyy-MM-dd para ser reconhecida corretamente
      const parts = dateString.split(' ');
      const dia = parts[0].padStart(2, '0');
      const mes = parts[1]; // Mês em extenso
      const ano = parts[2];

      // Mapeamento simples do mês em português (ajuste caso os meses estejam capitalizados ou em outro formato)
      const mesesMap = {
        'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5,
        'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
      };

      const mesIndex = mesesMap[mes.toLowerCase()];

      if (mesIndex === undefined) return new Date(0); // Data inválida em caso de erro

      return new Date(ano, mesIndex, dia);
    };

    const dateA = parseDate(a[0]);
    const dateB = parseDate(b[0]);

    return dateB.getTime() - dateA.getTime(); // Ordena do mais novo para o mais antigo
  });

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

  // ***** handleSubmit CORRIGIDO: Remoção do Content-Type manual para FormData *****
  async function handleSubmit(e) {
    e.preventDefault();
    if (!novoTitulo || !novaData || !novaDescricao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const [ano, mes, dia] = novaData.split('-').map(Number);
    const dataFormatadaISO = new Date(ano, mes - 1, dia).toISOString();

    // Payload em FormData (formato string/multipart)
    const formData = new FormData();

    const post = {
      titulo: novoTitulo,
      conteudo: novaDescricao,
      dataEntrega: dataFormatadaISO,
      // Se o back-end está esperando a data de criação no payload, adicione-a aqui.
      // Assumindo que a data de criação é AGORA
      /*  dataAtividade: new Date().toISOString(),  */
    };

    formData.append('atividade', JSON.stringify(post));

    if (novoArquivo) {
      formData.append('arquivo', novoArquivo);
    }

    try {
      // **Ajuste Crítico:** Removido o objeto 'headers' para que o Axios/Browser
      // configure automaticamente o 'Content-Type: multipart/form-data' corretamente.
      api.options.headers = {};
      const response = await api.post(`/atividades/criar/${turmaId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      const atividadeCriada = response.data;
      const atividadeFormatada = formatarAtividadeParaComponente(atividadeCriada);

      setAtividades([atividadeFormatada, ...atividades]);

      setShowModal(false);
      setNovoTitulo("");
      setNovaData("");
      setNovaDescricao("");
      setNovoArquivo(null);

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
              handleSubmit={handleSubmit}
              novoTitulo={novoTitulo}
              setNovoTitulo={setNovoTitulo}
              novaData={novaData}
              setNovaData={setNovaData}
              novaDescricao={novaDescricao}
              setNovaDescricao={setNovaDescricao}
              novoArquivo={novoArquivo}
              setNovoArquivo={setNovoArquivo}
              isAtividade={true}
              nomeModal={"Nova Atividade"}
            />

       
        <div className='w-[90%] m-auto mt-5 text-white'>
          {grupos.length === 0 ? (
            <div className="text-center flex flex-col-reverse items-center text-lg mt-10 text-[var(--text)]">Nenhuma atividade encontrada para esta turma.
              <img
                src={semTarefas}
                alt="Nenhuma tarefa encontrada"
                className="w-64 h-64 mt-4"
              />
            </div>
          ) : (
            grupos.map(([data, listaPosts]) => (
              <div key={data} className="mb-8">
                {/* O 'data' aqui é o nome do grupo (dataDeAgrupamento) */}
                <h2 className="text-xl font-medium mb-4 text-[var(--text)]">{data}</h2>
                <div className="flex flex-row flex-wrap gap-4">

                  {listaPosts.map((atividade) => (
                    <CardTarefas
                      key={atividade.id}
                      id={atividade.id}
                      turmaId={turmaId}
                      titulo={atividade.titulo}
                      descricao={atividade.descricao}
                      autor={atividade.autor}
                      ano={atividade.ano} // 'ano' é a data formatada em Português
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