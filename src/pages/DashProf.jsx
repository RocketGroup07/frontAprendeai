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
import ChamadaForm from '../components/ChamadaForm';

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
                console.log(response.data);
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
            const response = await api.post("/api/dia-aula", {
                turmaId: turmaId,
                dataAula: data.dataAula,
                conteudo: data.conteudo,
                horasMaximas: data.horasMaximas,
                horasTotais: data.horasTotais
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
        <div className='w-[100%] flex flex-col h-[100vh]'>
            <div style={{ height: "10vh" }}>
                <StaggeredMenu/>
            </div>

                

        <ChamadaForm turmaId = {turmaId} turmaNome = {turmaNome}/>
                  
        </div>
    );
}

export default DashProf;