import { useEffect, useState } from 'react'
import StaggeredMenu from '../components/StaggeredMenu'
import { Link, useParams } from 'react-router';
import GridHistorico from '../components/GridHistorico';
import { toast } from 'react-toastify';
import { api } from '../lib/axios';
import { useAuth } from '../components/UserAuth';
import EstatisticasPainel from '../components/EstatisticasPainel';
import { FaLongArrowAltLeft } from 'react-icons/fa';

function DiaHistorico() {
    const { diaAulaId } = useParams();
    const { usuario } = useAuth();
    const userName = usuario?.nome || "Usuário";
    const [diaHistorico, setDiaHistorico] = useState([]);
    const [alunoNomes, setAlunoNomes] = useState([]);
    const [alunoHistoricos, setAlunoHistoricos] = useState([]);
    const [turmaId, setTurmaId] = useState(null);

    // 1) Buscar lista de alunos do dia
    const fetchDiaHistorico = async () => {
        try {
            const response = await api.get(`/api/chamada/listar/${diaAulaId}`);
            const dados = Array.isArray(response.data) ? response.data : [];
            console.log(dados)
            setDiaHistorico(dados);

            const nomes = dados
                .map(item => item.nomeAluno)
                .filter(Boolean);

            setAlunoNomes(nomes);

        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            toast.error('Erro ao carregar histórico de chamadas');
        }
    };


    // 2) Buscar frequencia de cada aluno
    const fetchAlunoHistorico = async (nomes) => {
        try {
            const requests = nomes.map(nome =>
                api.get('/api/chamada/frequencia/aluno', {
                    params: { nome }
                })
            );

            const responses = await Promise.all(requests);

            // Junta todas as respostas em um array só
            const dados = responses.map(r => r.data).flat();
            console.log("Segundo fetch: ", dados)
            setAlunoHistoricos(dados);

        } catch (error) {
            console.error('Erro ao buscar histórico aluno:', error);
            toast.error('Erro ao carregar frequência dos alunos');
        }
    };

    const fetchDiaAulaInfo = async () => {
        try {
            const response = await api.get(`/api/dia-aula/${diaAulaId}`);
            const info = response.data;

            if (info?.turmaId) {
                setTurmaId(info.turmaId);
            }
        } catch (error) {
            console.error("Erro ao buscar info do dia da aula:", error);
            toast.error("Erro ao carregar informações da aula");
        }
    };


    useEffect(() => {
        if (diaAulaId) {
            fetchDiaHistorico();
            fetchDiaAulaInfo();
        }
    }, [diaAulaId]);


    useEffect(() => {
        if (alunoNomes.length > 0) {
            fetchAlunoHistorico(alunoNomes);
        }
    }, [alunoNomes]);

    console.log(usuario)

    return (
        <div className='w-[100%] flex flex-col h-[100vh]'>

            <div style={{ height: "10vh" }}>
                <StaggeredMenu turmaId={turmaId} />
            </div>

            <div className='w-[90%] m-auto mt-20'>
                <div className="w-[5%]">
                    <Link to={`/historico/${turmaId}`}>
                        <button className="flex bg-red-600 center p-2 text-[#f1f1f1] rounded-sm items-center gap-3 cursor-pointer hover:bg-red-700">
                            <FaLongArrowAltLeft />
                            Voltar
                        </button>
                    </Link>
                </div>
            </div>

            <EstatisticasPainel
                diaHistorico={diaHistorico}
                alunoHistorico={alunoHistoricos}
                userName={userName}
            />

            <GridHistorico diaHistorico={diaHistorico} alunoHistorico={alunoHistoricos} />

        </div>
    )
}

export default DiaHistorico;
