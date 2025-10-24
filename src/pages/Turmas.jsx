import React, { useState } from "react";
import CardTurmas from "../components/CardTurmas";
import { FaPlus } from "react-icons/fa";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "../lib/axios";
import StaggeredMenu from "../components/StaggeredMenu";

function Turmas() {
  const [showInputCard, setShowInputCard] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("alunos/entrar-turma", {
        codigoTurma: data.codigoTurma,
      });

      toast.success("Turma adicionada com sucesso!");
      setShowInputCard(false);

      
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.mensagem || "Há algo de errado com o código!"
      );
    }
  };

  const onError = (errors) => {
    Object.values(errors).forEach((err) => {
      alert(err.message);
    });
  };

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
        <div className='flex items-center ml-auto'>
            <button
              className='flex items-center gap-2 p-2 cursor-pointer bg-[var(--primary)] rounded hover:bg-[#b30404] transition-colors'
              onClick={() => setShowModal(true)}
            >
              <span>+</span>
              Nova atividade
            </button>
          </div>
      </div>

      <div className="flex m-auto mt-5 w-[90%]">
        <CardTurmas />

        <div
          className="w-80 h-46 ml-4 bg-[var(--main)] text-white rounded-lg p-10 flex flex-col justify-between items-center text-center border-dotted border-gray-500 border-2 cursor-pointer"
          onClick={() => setShowInputCard(true)}
        >
          <FaPlus size={42} className="text-gray-500 mt-5" />
          <p className="text-gray-500 text-[18px]">Entre em uma nova turma</p>
        </div>

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
