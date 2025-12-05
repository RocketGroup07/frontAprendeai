import React, { useEffect, useState } from 'react';
import StaggeredMenu from "../components/StaggeredMenu.jsx";
import CardHistorico from '../components/CardHistorico.jsx';
import { api } from '../lib/axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/UserAuth';

function HistoricoChamada() {
  const [historicos, setHistoricos] = useState([]);
  const [horasTotais, setHorasTotais] = useState(0);
  const [somaHoras, setSomaHoras] = useState(0);
  const { turmaId: turmaIdParam } = useParams();
  const { turmaId: turmaIdContext } = useAuth(); // Adicionado useAuth para pegar turmaId do contexto

 
  
  const turmaId = turmaIdParam || turmaIdContext || null;
  

  const fetchHistorico = async () => {
    try {
      // Corrigido: adicionado parênteses e aspas corretas
      const response = await api.get(`/api/dia-aula/turma/${turmaId}`);
      const res = response;
      const dados = Array.isArray(res.data) ? res.data : (res.data?.items || []);
      setHistoricos(dados);
      
      // Calcular soma total das horas em uma variável separada
      const total = dados.reduce((acc, item) => {
        const horas = item.horasTotais ?? item.horasMaximas ?? item.horasPresentes ?? 0;
        return acc + Number(horas);
      }, 0);
      setSomaHoras(total);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      toast.error('Erro ao carregar histórico de chamadas');
    }
  };


console.log("SomasHoras", somaHoras);


  useEffect(() => {
    if (turmaId) {
      fetchHistorico();
    }
  }, [turmaId]); // Adicionado turmaId como dependência

  const handleDelete = async (id) => {
    try {
      // Corrigido: adicionado parênteses e aspas corretas
      await api.delete(`/api/chamada/historico/${id}`);
      setHistoricos(prev => {
        const novosHistoricos = prev.filter(h => (h.id || h._id) !== id);
        
        // Recalcular soma de horas após deletar
        const total = novosHistoricos.reduce((acc, item) => {
          const horas = item.horasTotais ?? item.horasMaximas ?? item.horasPresentes ?? 0;
          return acc + Number(horas);
        }, 0);
        setSomaHoras(total);
        
        return novosHistoricos;
      });
      toast.success('Histórico removido');
    } catch (error) {
      console.error('Erro ao deletar histórico:', error);
      toast.error('Falha ao deletar histórico');
    }
  };

  return (
    <div className="">
      <div style={{ height: "10vh" }}>
        <StaggeredMenu />
      </div>
      
      <div className="w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold m-auto mt-10">
        <h1 className="text-[28px] font-bold">O progresso do curso está em x%</h1>
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
              onDelete={handleDelete} 
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