import { useState, useEffect, useRef } from "react";
import CardTurmas from "../components/CardTurmas";
import { FaPlus } from "react-icons/fa";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "../lib/axios";
import StaggeredMenu from "../components/StaggeredMenu";
import { useAuth } from "../components/UserAuth";

function Turmas() {
  const [showInputCard, setShowInputCard] = useState(false);
  const [turmas, setTurmas] = useState([]);
  const { isProfessor, isAluno } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const [novoNome, setnovoNome] = useState("");
  const [novoLimite, setnovoLimite] = useState("");
  const [novaCargaHoraria, setnovaCargaHoraria] = useState("");

  async function fetchTurmas() {
    try {
      let endpoint = "";

      if (isProfessor) {
        endpoint = "turmas/";
      } else if (isAluno) {
        endpoint = "alunos/minhas-turmas";
      }

      if (!endpoint) return;

      const response = await api.get(endpoint);
      setTurmas(response.data || []);
    } catch (error) {
      toast.error("Erro ao carregar turmas");
    }
  }

  useEffect(() => {
    fetchTurmas();
  }, [isProfessor, isAluno]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("alunos/entrar-turma", {
        codigoTurma: data.codigoTurma,
      });

      toast.success("Turma adicionada com sucesso!");
      setShowInputCard(false);

      // Atualiza lista sem recarregar a página
      fetchTurmas();
    } catch (error) {
      toast.error(
        error.response?.data?.mensagem || "Há algo de errado com o código!"
      );
    }
  };

  const onError = (errors) => {
    Object.values(errors).forEach((err) => alert(err.message));
  };

  async function handleCreateTurma(e) {
    e.preventDefault();
    if (!novoNome || !novoLimite || !novaCargaHoraria) return;

    const novaTurma = {
      nome: novoNome,
      cargaHorariaTotal: novaCargaHoraria,
      limiteAlunos: novoLimite,
    };

    try {
      // POST para criar uma nova turma (ajuste o endpoint se necessário)
      const response = await api.post("/turmas/", novaTurma);

      // Atualiza lista local de turmas com a turma retornada pela API
      setTurmas([response.data, ...turmas]);

      // Limpa o formulário e fecha o modal
      setShowModal(false);
      setnovoNome("");
      setnovoLimite("");
      setnovaCargaHoraria("");

      toast.success("Turma criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar turma:", error);
      toast.error("Falha ao criar a turma. Tente novamente.");
    }
  }

  return (
    <div className="bg-[var(--bg)] h-[100vh]">
      <div style={{ height: "10vh" }}>
        <StaggeredMenu />
      </div>

      <div className="w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px] m-auto mt-10">
        <h1 className="text-[28px] font-bold">Suas Turmas</h1>
      </div>

      <div className="w-[90%] mr-auto ml-auto mt-4 flex flex-row gap-[48px] p-1 text-[var(--text)] ">
        <div className="bg-[var(--primary)] items-center p-2 rounded">
          <h2>Geral</h2>
        </div>

        {isProfessor && (
          <div className="flex items-center ml-auto">
            <button
              className="flex items-center gap-2 p-2 cursor-pointer bg-[var(--primary)] rounded hover:bg-[#b30404] transition-colors"
              onClick={() => setShowModal(true)}
            >
              <span>+</span>
              Nova Turma
            </button>
          </div>)}

        {showModal && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black opacity-80" onClick={() => setShowModal(false)}></div>
            <div className="flex items-center justify-center min-h-screen">
              <div ref={modalRef} className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 w-150 h-125 flex flex-col items-center relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-white font-light text-5xl p-2 cursor-pointer"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Nova Turma</h2>
                <form className="flex flex-col gap-4 mt-4 w-full items-start" onSubmit={handleCreateTurma}>
                  <label className="text-left text-white">Nome da Turma</label>
                  <input type="text" value={novoNome} onChange={e => setnovoNome(e.target.value)} className="w-full bg-[#4a4a4a] p-3 text-white rounded-md  font-neuli outline-0" />
                  <label className="text-left text-white">Limite de Alunos</label>
                  <input type="text" value={novoLimite} onChange={e => setnovoLimite(e.target.value)} className="w-full bg-[#4a4a4a] p-3 text-white rounded-md  outline-0" />
                  <label className="text-left text-white">Carga Horaria Total</label>
                  <input value={novaCargaHoraria} onChange={e => setnovaCargaHoraria(e.target.value)} className="w-full bg-[#4a4a4a] p-3 text-white rounded-md  font-neuli outline-0 resize-none" />
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
                      Criar Turma
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="flex m-auto mt-5 w-[90%]">
        <CardTurmas turmas={turmas} />

        {isAluno && (
          <div
            className="w-80 h-46 ml-4 bg-[var(--main)] text-white rounded-lg p-10 flex flex-col justify-between items-center text-center border-dotted border-gray-500 border-2 cursor-pointer"
            onClick={() => setShowInputCard(true)}
          >
            <FaPlus size={42} className="text-gray-500 mt-5" />
            <p className="text-gray-500 text-[18px]">
              Entre em uma nova turma
            </p>
          </div>
        )}

        {showInputCard && (
          <div className="absolute top-1/2 left-1/2 transform shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] -translate-x-1/2 -translate-y-1/2 w-120 h-90 bg-zinc-900 rounded-3xl items-center text-center">
            <div className="w-40 h-40 flex justify-center items-center m-auto">
              <div className="w-20 h-20 bg-black rounded-full flex justify-center items-center">
                <img
                  className="w-10 h-10 z-10"
                  src="../images/Group.svg"
                  alt="logo"
                />
              </div>
            </div>

            <h3 className="text-white text-[1.5rem] font-semibold mb-4">
              Insira o código da turma:
            </h3>

            <form
              title="codigoTurma"
              onSubmit={handleSubmit(onSubmit, onError)}
              className="w-full flex flex-col items-center"
            >
              <Input
                placeholder="Digite o código da turma"
                className="p-2 rounded border bg-neutral-950 mb-4 text-white text-[0.7rem]"
                name="codigoTurma"
                id="codigoTurma"
                register={register}
                rules={{ required: "O código da turma é obrigatório" }}
                error={!!errors.codigoTurma}
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  className="bg-[var(--primary)] text-white px-4 py-2 rounded cursor-pointer"
                  onClick={() => setShowInputCard(false)}
                >
                  Fechar
                </button>

                <button
                  type="submit"
                  className="bg-[#278d27] text-white px-4 py-2 rounded cursor-pointer"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Turmas;
