import React, { useState } from 'react'
import Input from './Input'
import ReactGrid from './ReactGrid'
import FormButton from './FormButton'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { api } from '../lib/axios';
import { set } from 'date-fns';

function ChamadaForm({ turmaId, turmaNome, dataTurma }) {

    const onClick = async () => {
        try {
            const response = await api.get(`/api/chamada/relatorio/${turmaId}`, {
                responseType: 'blob'
            });

            // tenta extrair filename do header Content-Disposition
            const disposition = response.headers?.['content-disposition'] || response.headers?.['Content-Disposition'];
            let filename = 'relatorio.pdf';
            if (disposition) {
                const fileNameMatch = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i);
                if (fileNameMatch && fileNameMatch[1]) {
                    filename = decodeURIComponent(fileNameMatch[1].replace(/["']/g, ''));
                }
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Download iniciado");
        } catch (err) {
            console.error("Erro ao gerar relatório:", err);
            toast.error("Erro ao gerar relatório");
        }
    }

    const [dataHoraTurma, setDataHoraTurma] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors: errors }
    } = useForm();

    const handleApplyHoras = (e) => {
        e?.preventDefault();
        const horas = getValues('horasMaximas');
        // envia somente o número/valor para a grid
        setDataHoraTurma(horas ?? 0);
    };

    const onSubmit = async (data) => {

        try {

            const response = await api.post("/api/dia-aula", {
                turmaId: turmaId,
                dataAula: data.dataAula,
                horasMaximas: data.horasMaximas,
                conteudo: data.conteudo,
                horasTotais: data.horasTotais
            });

            const initializer = await api.post("/api/chamada/inicializar", {
                turmaId: turmaId,
                dataAula: data.dataAula,
                horasMaximas: data.horasMaximas,
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

    return (
        <div className="flex flex-col w-[100%] items-center mt-20">
            {/* Container menor */}
            <div className="flex flex-col w-[89%] gap-4">
                <div className="flex justify-between w-[100%] mb-6">
                    <h1 className='text-5xl text-white'>{turmaNome}</h1>
                    <div className="w-[15%] mb-6">
                        <FormButton>Fetch de Tudo</FormButton>
                    </div>
                </div>
                <form action="" onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex gap-14">
                        <div className="flex flex-col gap-6 ">
                            <Input
                                type="date" // Alterado para texto
                                name="dataAula"
                                id="dataAula"
                                register={register}                // Define o valor inicial como dd/mm/aaaa
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
                                <FormButton reset>Inicializar chamada</FormButton>

                            </div>
                        </div>
                        {/*  Lógica de aparecer a tabela quando gerar o relatorio */}
                        <ReactGrid dataTurma={dataTurma} dataHoraTurma={dataHoraTurma} />
                        {/* {data && data.length > 0 && (
                                                        
                                                    )} */}
                    </div>
                </form>


            </div>
        </div>
    )
}

export default ChamadaForm