import React, { useEffect, useState } from 'react';
import StaggeredMenu from '../components/StaggeredMenu';
import ReactGrid from '../components/ReactGrid';
import { useAuth } from '../components/UserAuth';
import { useParams } from 'react-router';
import { api } from '../lib/axios';
import FormButton from '../components/FormButton';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import { useForm } from 'react-hook-form';

function DashProf() {
    const [codigoTurma, setCodigoTurma] = useState('');
    const [data, setData] = useState('');
    const [turmaNome, setTurmaNome] = useState("");
    // Estado para armazenar o código da turma

    const turmaId = useParams().turmaId;

    useEffect(() => {
        async function fetchTurma() {
            try {
                const response = await api.get(`/turmas/${turmaId}`);
                setTurmaNome(response.data.nome);
            } catch (err) {
                toast.error("Erro ao carregar a turma");
            }
        }

        if (turmaId) fetchTurma();
    }, [turmaId]);

    const {
        register,
        handleSubmit,
        formState: { errors: errors }
    } = useForm();



    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`; // Retorna no formato dd/mm/aaaa
    };



    const onSubmit = async (data) => {


        try {
            const response = await api.post("/api/chamada/inicializar", {
                turmaId: turmaId,
                dataAula: data.dataAula,
                conteudo: data.conteudo,
                horasMaximas: data.horasMaximas
            });

            toast.success("Turma adicionada com sucesso!");
            setData(response.data);
            console.log("resposta da api:", response.data);

        } catch (error) {
            toast.error(
                error.response?.data?.mensagem || "Há algo de errado com o código!"
            );
            console.log("erro na api:", error)
        }
    };

    return (
        <div className='w-[100%] flex flex-col'>
            <div style={{ height: "10vh" }}>
                <StaggeredMenu />
            </div>

            {/* Container principal */}
            <div className="flex flex-col w-[100%] items-center mt-20">
                {/* Container menor */}
                <div className="flex flex-col w-[89%] gap-4">
                    <div className="flex justify-between w-[100%] mb-6">
                        <h1 className='text-5xl text-white'>{turmaNome}</h1>
                        <button className='bg-[var(--primary)] text-white cursor-pointer w-[14%] rounded-[4px] h-8'>Voltar Para a Home</button>
                    </div>
                    <form action="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-[15%] mb-6">
                            <FormButton>Gerar Relatório</FormButton>
                        </div>
                        <div className="flex g-4 gap-6">
                            <Input
                                type="text" // Alterado para texto
                                name="dataAula"
                                id="dataAula"
                                register={register}
                                defaultValue={getTodayDate()} // Define o valor inicial como dd/mm/aaaa
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
                        </div>
                    </form>

                    {/*  Lógica de aparecer a tabela quando gerar o relatorio */}
                    <ReactGrid data={data} />
                    {/* {data && data.length > 0 && (
                        
                    )} */}
                </div>
            </div>
        </div>
    );
}

export default DashProf;