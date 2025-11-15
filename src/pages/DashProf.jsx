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
    const [data, setdata] = useState('');
    const [percentualPresenca, setpercentualPresenca] = useState("");
    const { turmaNome, selecionarTurma } = useAuth();
    // Estado para armazenar o código da turma
    const [turmaSelecionada, setTurmaSelecionada] = useState(null); // Estado para armazenar a turma selecionada

    const { turmaId: turmaIdParam } = useParams();
    const { turmaId: turmaIdContext } = useAuth();
    const turmaId = turmaIdParam || turmaIdContext;

    const {
        register,
        handleSubmit,
        formState: { errors: errors }
    } = useForm();

    const handleInputChange = (e) => {
        setCodigoTurma(e.target.value); // Atualiza o estado com o valor do input
    };

    useEffect(() => {
        async function chamada() {
          try {
            const response = await api.get(`api/chamada/frequencia/${turmaId}`);
            console.log(response.data);
          } catch (error) {
            console.error("Erro ao buscar turma:", error);
          }
        }
      }, [turmaId]);

    const onSubmit = async (data) => {


        try {
            const response = await api.post("/api/chamada/inicializar", {
                turmaId: turmaId,
                dataAula: data.dataAula,
                conteudo: data.conteudo,
                horasMaximas: data.horasMaximas
            });

            toast.success("Turma adicionada com sucesso!");
            setdata(response.data);
            console.log("resposta da api:", response.data);
            chamada();

        } catch (error) {
            toast.error(
                error.response?.data?.mensagem || "Há algo de errado com o código!"
            );
            console.log("erro na api:", error)
        }
    };



    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // Quando o usuário pressiona Enter, atualiza a turma selecionada
            setTurmaSelecionada(codigoTurma);
            console.log('Código da turma enviado:', codigoTurma);
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
                        <div className="flex g-4 bg-blue-600 gap-6">
                            <Input
                                placeholder="21/08/2025"
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
                        </div>
                    </form>

                    {/*  Lógica de aparecer a tabela quando gerar o relatorio */}
                    <ReactGrid data={data} turmaSelecionada={turmaSelecionada}/>
                    {/* {data && data.length > 0 && (
                        
                    )} */}
                </div>
            </div>
        </div>
    );
}

export default DashProf;