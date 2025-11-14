import React, { useEffect, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { api } from '../lib/axios';
import { useParams } from 'react-router';
import { useAuth } from './UserAuth';

ModuleRegistry.registerModules([AllCommunityModule]);

function ReactGrid({ data }) {
  const [rowData, setRowData] = useState([]); // Dados das linhas
  const [loading, setLoading] = useState(false); // Estado de carregamento


  const { turmaId: turmaIdParam } = useParams();
  const { turmaId: turmaIdContext } = useAuth();
  const turmaId = turmaIdParam || turmaIdContext;

  // Definições das colunas
  const colDefs = [
    { field: "nomeAluno", headerName: "Nome do Aluno", sortable: true, filter: true },
    { field: "horasPresente", headerName: "Email", sortable: true, filter: true, editable: true },
    { field: "papel", headerName: "Papel", sortable: true, filter: true },
  ];

  useEffect(() => {
    if (data && data.length > 0) {
      setRowData(data); // Atualiza os dados da tabela com horasPresente
    }
  }, [data]);

  // Busca os alunos da turma

  return (
    <div style={{ height: 500 }}>
      {loading ? (
        <p>Carregando alunos...</p>
      ) : (
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      )}
    </div>
  );
}

export default ReactGrid;