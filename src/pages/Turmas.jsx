import React, { useState } from "react";
import Header from "../components/Header";
import CardTurmas from "../components/CardTurmas";
import { FaPlus } from "react-icons/fa";
import Input from "../components/Input";
import { Form, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "../lib/axios";
import { useNavigate } from "react-router-dom";

function Turmas() {
  const [showInputCard, setShowInputCard] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors: errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("alunos/entrar-turma", {
        codigoTurma: data.codigoTurma,
      });
      toast.success('Turma adicionada com sucesso!');
      setShowInputCard(false);

      const turmaId = response.data.id || data.codigoTurma;
      setTimeout(() => {
        navigate(`/turmas`, { state: { turmaId: turmaId } });
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.mensagem || 'Há algo de errado com o código!');
    }
  };

  const onError = (errors) => {
    Object.values(errors).forEach((err) => {
      alert(err.message);
    });
  };

  return (
    <div className="bg-[#212121] h-[100vh]">
      <Header />
      <div className="flex mt-6 radius-1 rounded-[2vh] justify-center text-white bg-[#2A2A2A] h-34 w-[90%] text-center items-center ml-19">
        <h1 className="text-[28px] font-bold">Suas Turmas</h1>
      </div>
      <div className="flex bg-[#D00909] rounded-[4px] ml-19 mt-9 text-white w-21 justify-center">
        <h2 className="text-[22px] font-[500]">Geral</h2>
      </div>
      <div className="flex ml-18 mt-5">
        <CardTurmas />
        <div
          className="w-80 h-46 ml-4 bg-[#2A2A2A] text-white rounded-lg p-10 flex flex-col justify-between items-center text-center border-dotted border-gray-500 border-2 cursor-pointer"
          onClick={() => setShowInputCard(true)}
        >
          <FaPlus size={42} className="text-gray-500 mt-5" />
          <p className="text-gray-500 text-[18px]">Entre em uma nova turma</p>
        </div>
        {showInputCard && (
          <div className="absolute top-1/2 left-1/2 transform shadow-[0_22px_70px_4px_rgba(0, 0, 0, 0.56)] -translate-x-1/2 -translate-y-1/2 w-120 h-90 bg-zinc-900 rounded-3xl items-center text-center">

            <div className="w-40 h-40 flex justify-center items-center m-auto">
              <div className="w-20 h-20 bg-black rounded-full flex justify-center items-center">
                <img className="w-10 h-10 z-10" src="../images/Group.svg" alt="logo" />
              </div>
            </div>

            <h3 className="text-white text-[1.5rem] font-semibold mb-4">Insira o código da turma:</h3>

            <form
              title={"codigoTurma"}
              onSubmit={handleSubmit(onSubmit, onError)}
              className="w-full flex flex-col items-center"
            >
              <Input
                placeholder="Digite o código da turma"
                className="p-2 rounded border bg-neutral-950 mb-4  text-white text-[0.7rem]"
                type=""
                name="codigoTurma"
                id="codigoTurma"
                register={register}
                rules={{
                }}
                error={!!errors.senha}
              />
              <div className="flex gap-4">
                <button
                  className="bg-[#D00909] text-white px-4 py-2 rounded cursor-pointer"
                  onClick={() => setShowInputCard(false)}
                >
                  Fechar
                </button>

                <button
                  className="bg-[#278d27] text-white px-4 py-2 rounded cursor-pointer">
                  Entrar
                </button>
              </div>



            </form>          </div>)}
      </div>
    </div>
  );
}

export default Turmas;