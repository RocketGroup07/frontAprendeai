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
        formState: { errors: errors }
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

            toast.success("Turma adicionada com sucesso!");
            console.log("resposta da api initializer:", initializer.data);
            console.log("resposta da api response:", response.data);

            setDataHoraTurma(initializer.data);

            reset()
        } catch (error) {
            toast.error(
                error.response?.data?.mensagem || "Há algo de errado com o código!"
            );
            console.log("erro na api:", error)
        }
    };

    console.log("dataHoraTurma:", dataHoraTurma);

    // Função para atualizar horas de um aluno no estado
    const atualizarHorasAluno = (alunoId, novasHoras) => {
        setDataHoraTurma(prev => 
            prev.map(aluno => 
                aluno.alunoId === alunoId 
                    ? { ...aluno, horasPresente: Number(novasHoras) }
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

            // Itera sobre dataHoraTurma (que tem tanto ID quanto horas)
            for (let i = 0; i < dataHoraTurma.length; i++) {
                const aluno = dataHoraTurma[i];
                const id = aluno.alunoId;
                const horasPresente = Number(aluno.horasPresente || 0);

                console.log(`PATCH ID: ${id}, Horas: ${horasPresente}`);

                // ENVIA O BODY COM horasPresente
                await api.patch(`/api/chamada/presenca/${id}`, {
                    horasPresentes: horasPresente
                });
            }
            
            toast.success("Presenças marcadas!");
            console.log("Presenças enviadas com sucesso!");
            
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
                    <h1 className='text-5xl text-white'>{turmaNome}</h1>
                    <div className="w-[15%] mb-6">
                        <FormButton onClick={marcarPresencas}>Marcar Presenças</FormButton>
                    </div>
                </div>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-14">
                        <div className="flex flex-col gap-6 ">
                            <Input
                                type="date"
                                name="dataAula"
                                id="dataAula"
                                register={register}
                            />
                            <Input
                                placeholder="8h nesse dia"
                                type="number"
                                name="horasMaximas"
                                id="horasMaximas"
                                register={register}
                            />
                            <Input
                                placeholder="Digite o conteúdo da aula"
                                type="text"
                                name="conteudo"
                                id="conteudo"
                                register={register}
                            />
                            <Input
                                placeholder="Digite a quantidade máxima de horas"
                                type="number"
                                name="horasTotais"
                                id="horasTotais"
                                register={register}
                            />

                            <div className="w-[100%] mb-6">
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