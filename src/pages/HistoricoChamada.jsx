import { useEffect, useMemo, useState } from 'react';
import StaggeredMenu from "../components/StaggeredMenu.jsx";
import CardHistorico from '../components/CardHistorico.jsx';
import { api } from '../lib/axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/UserAuth.jsx';

function HistoricoChamada() {
  const [historicos, setHistoricos] = useState([]);
  const [horasTotais, setHorasTotais] = useState(0); // carga horária total da turma
  const [somaHoras, setSomaHoras] = useState(0); // soma das horas das chamadas
  const { turmaId: turmaIdParam } = useParams();
  const { turmaId: turmaIdContext } = useAuth();
  const turmaId = turmaIdParam || turmaIdContext || null;

  // busca tanto o histórico quanto as informações da turma em uma única função
  const fetchDados = async () => {
    if (!turmaId) return;

    try {
      // paraleliza as requisições
      const [histResp, turmaResp] = await Promise.allSettled([
        api.get(`/api/dia-aula/turma/${turmaId}`),
        api.get(`/turmas/${turmaId}`)
      ]);

      // histórico
      let dadosHistorico = [];
      if (histResp.status === 'fulfilled') {
        const raw = histResp.value.data;
        dadosHistorico = Array.isArray(raw) ? raw : (raw?.items || []);
        setHistoricos(dadosHistorico);
      } else {
        console.error('Erro ao buscar histórico:', histResp.reason);
        toast.error('Erro ao carregar histórico de chamadas');
      }

      // soma das horas (garante number)
      const totalHoras = dadosHistorico.reduce((acc, item) => {
        const horas = Number(item.horasTotais ?? item.horasMaximas ?? item.horasPresentes ?? 0);
        return acc + (Number.isFinite(horas) ? horas : 0);
      }, 0);
      setSomaHoras(totalHoras);

      // turma / carga horária total
      if (turmaResp.status === 'fulfilled') {
        const turmaData = turmaResp.value.data;
        // tenta vários nomes que a API possa usar
        const carga =
          Number(turmaData.cargaHorariaTotal ?? turmaData.cargaHoraria ?? turmaData.horasTotais ?? turmaData.horas ?? 0);
        setHorasTotais(Number.isFinite(carga) ? carga : 0);
      } else {
        console.error('Erro ao buscar turma:', turmaResp.reason);
        toast.error('Erro ao carregar informações da turma');
      }
    } catch (err) {
      console.error('Erro inesperado ao buscar dados:', err);
      toast.error('Erro ao carregar dados');
    }
  };

  useEffect(() => {
    fetchDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaId]);

  // progresso calculado a partir de somaHoras e horasTotais
  const progressoPercentual = useMemo(() => {
    if (!horasTotais || horasTotais === 0) return '0.0';
    const pct = (somaHoras / horasTotais) * 100;
    const clamped = Math.max(0, Math.min(pct, 100));
    return clamped.toFixed(1);
  }, [somaHoras, horasTotais]);

  return (
    <div className="">
      <div style={{ height: "10vh" }}>
        <StaggeredMenu turmaId={turmaId} />
      </div>

      <div className="w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex flex-col justify-center items-center font-bold m-auto mt-10">
        <h1 className="text-[28px] font-bold">
          O progresso do curso está em {progressoPercentual}%
        </h1>
        <p className="text-[16px] mt-2 opacity-90">
          {somaHoras}h de {horasTotais}h concluídas
        </p>
        <div className="w-full bg-white/20 rounded-full h-2 mt-3">
          <div
            className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressoPercentual}%` }}
          />
        </div>
      </div>

      <div className="w-[90%] mt-20 font-bold text-[24px] text-[var(--text)] m-auto items-center p-2 rounded">
        <h2>Chamadas Anteriores:</h2>
        <p className="text-[18px] mt-2">Total de horas: {somaHoras}h</p>
      </div>

      <div className="flex flex-wrap m-auto mt-5 w-[90%] gap-4">
        {historicos.length > 0 ? (
          historicos.map(item => (
            <CardHistorico
              key={item.id || item._id}
              item={item}
            />
          ))
        ) : (
          <p className="text-[var(--text)] m-auto">Nenhum histórico encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default HistoricoChamada;