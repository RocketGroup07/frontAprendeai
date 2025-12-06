import React, { useState } from 'react'
import Input from './Input'
import ReactGrid from './ReactGrid'
import FormButton from './FormButton'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { api } from '../lib/axios';

function ChamadaForm({ turmaId, turmaNome, dataTurma }) {

    const [dataHoraTurma, setDataHoraTurma] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        const horasTotais = data.horasTotais;

        try {
            const response = await api.post("/api/dia-aula", {
                turmaId: turmaId,
                dataAula: data.dataAula,
                horasMaximas: data.horasMaximas,
                conteudo: data.conteudo,
                horasTotais: horasTotais
            });

            const initializer = await api.post("/api/chamada/inicializar", {
                turmaId: turmaId,
                dataAula: data.dataAula,
                horasMaximas: horasTotais,
                conteudo: data.conteudo,
            });

            const normalized = (initializer.data || []).map(item => ({
                id: item.id ?? item.alunoId ?? item.presencaId ?? null,
                alunoId: item.alunoId ?? item.id ?? item.presencaId ?? null,
                nome: item.nome ?? item.nomeAluno ?? item.alunoNome ?? '',
                login: item.login ?? item.email ?? '',
                horasPresentes: Number(item.horasPresentes ?? item.horasPresente ?? item.horas ?? 0)
            }));

            console.log("initializer.data normalizado:", normalized);
            setDataHoraTurma(normalized);

            reset()
        } catch (error) {
            toast.error(
                error.response?.data?.mensagem || "Há algo de errado com o código!"
            );
            console.log("erro na api:", error)
        }
    };

    console.log("dataHoraTurma:", dataHoraTurma);

    const atualizarHorasAluno = (alunoId, novasHoras) => {
        setDataHoraTurma(prev => 
            prev.map(aluno => 
                aluno.alunoId === alunoId 
                    ? { ...aluno, horasPresentes: Number(novasHoras) }
                    : aluno
            )
        );
    };

    const marcarPresencas = async () => {
        try {
            if (!dataHoraTurma || dataHoraTurma.length === 0) {
                toast.warn("Nenhuma chamada inicializada!");
                return;
            }

            console.log("Enviando presenças:", dataHoraTurma);

            for (let i = 0; i < dataHoraTurma.length; i++) {
                const aluno = dataHoraTurma[i];
                const id = aluno.alunoId;
                const horasPresentes = Number(aluno.horasPresentes || 0);

                console.log(`PATCH ID: ${id}, Horas: ${horasPresentes}`);

                await api.patch(`/api/chamada/presenca/${id}`, {
                    horasPresentes: horasPresentes
                });
            }
            
            toast.success("Presenças marcadas!");
            console.log("Presenças enviadas com sucesso!");

            setDataHoraTurma([]);
            
        } catch (error) {
            toast.error(error.response?.data?.mensagem || "Erro ao marcar presenças!");
            console.error("Erro completo:", error);
            console.error("Resposta do servidor:", error.response?.data);
        }
    };

    return (
        <div className="flex flex-col w-[100%] items-center mt-20">
            <div className="flex flex-col w-[89%] gap-4">
                <div className="flex justify-between w-[100%] mb-6">
                    <h1 className='text-5xl text-[var(--text)]'>{turmaNome}</h1>
                    {dataHoraTurma && dataHoraTurma.length > 0 && (
                        <div className="w-[15%]">
                            <FormButton onClick={marcarPresencas}>Marcar Presenças</FormButton>
                        </div>
                    )}
                </div>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-14">
                        <div className="flex flex-col gap-6 ">
                            <div>
                                <Input
                                    type="date"
                                    name="dataAula"
                                    id="dataAula"
                                    register={register}
                                    error={!!errors.dataAula}
                                />
                                {errors.dataAula && (
                                    <span className="text-red-500 text-sm mt-1 block">
                                        {errors.dataAula.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Input
                                    placeholder="Digite a quantidade máxima de horas"
                                    type="number"
                                    name="horasMaximas"
                                    id="horasMaximas"
                                    min={0}
                                    max={8}
                                    register={register}
                                    error={!!errors.horasMaximas}
                                />
                                {errors.horasMaximas && (
                                    <span className="text-red-500 text-sm mt-1 block">
                                        {errors.horasMaximas.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Input
                                    placeholder="Digite o conteúdo da aula"
                                    type="text"
                                    name="conteudo"
                                    id="conteudo"
                                    register={register}
                                    error={!!errors.conteudo}
                                />
                                {errors.conteudo && (
                                    <span className="text-red-500 text-sm mt-1 block">
                                        {errors.conteudo.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Input
                                    placeholder="Digite a quantidade de horas dadas"
                                    type="number"
                                    name="horasTotais"
                                    id="horasTotais"
                                    min={0}
                                    max={8}
                                    register={register}
                                    error={!!errors.horasTotais}
                                />
                                {errors.horasTotais && (
                                    <span className="text-red-500 text-sm mt-1 block">
                                        {errors.horasTotais.message}
                                    </span>
                                )}
                            </div>

                            <div className="w-[100%] ">
                                <FormButton type="submit">Inicializar chamada</FormButton>
                            </div>
                        </div>
                        
                        <ReactGrid 
                            dataTurma={dataTurma} 
                            dataHoraTurma={dataHoraTurma}
                            onUpdateHoras={atualizarHorasAluno}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChamadaForm