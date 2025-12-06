import React, { useEffect, useState } from 'react';
import StaggeredMenu from '../components/StaggeredMenu';
import { useParams } from 'react-router';
import { api } from '../lib/axios';
import { toast } from 'react-toastify';
import ChamadaForm from '../components/ChamadaForm';

function DashProf() {
  const [dataTurma, setData] = useState([]);
  const [turmaNome, setTurmaNome] = useState("");

  const turmaId = useParams().turmaId;

  useEffect(() => {
    async function fetchTurma() {
      try {
        const response = await api.get(`/turmas/${turmaId}`);
        setTurmaNome(response.data.nome);

        // normaliza a resposta para um array de linhas (ajuste chaves conforme seu backend)
        let rows = [];
        if (Array.isArray(response.data)) {
          rows = response.data;
        } else {
          rows =
            response.data.alunos ||
            response.data.presencas ||
            response.data.students ||
            response.data.rows ||
            response.data.lista ||
            []; // fallback vazio
        }
        setData(rows);
        console.log("rows para grid:", rows);
      } catch (err) {
        toast.error("Erro ao carregar a turma");
      }
    }

    if (turmaId) fetchTurma();
  }, [turmaId]);

  return (
    <div className='w-[100%] flex flex-col h-[100vh]'>

      <div style={{ height: "10vh" }}>
        <StaggeredMenu />
      </div>

      <ChamadaForm turmaId={turmaId} turmaNome={turmaNome} dataTurma={dataTurma} />

    </div>
  );
}

export default DashProf;