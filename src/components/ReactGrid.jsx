import React, { useEffect, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { api } from '../lib/axios';
import { useParams } from 'react-router';
import { useAuth } from './UserAuth';

ModuleRegistry.registerModules([AllCommunityModule]);

function ReactGrid({ data, turmaSelecionada }) {
  const [rowData, setRowData] = useState([]);
  

  const { turmaId: turmaIdParam } = useParams();
  const { turmaId: turmaIdContext } = useAuth();
  const turmaId = turmaIdParam || turmaIdContext;

  // 🔹 Botão de salvar por linha
  const saveButtonRenderer = (params) => {
    return (
      <button
        onClick={() => handleSave(params.data)}
        style={{
          padding: "5px 10px",
          cursor: "pointer",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Salvar
      </button>
    );
  };

  const colDefs = [
    { field: "nomeAluno", headerName: "Nome do Aluno", sortable: true, filter: true },
    { field: "horasPresente", headerName: "Horas", editable: true },
    { field: "percentualPresenca", headerName: "Percentual de Presença" },
    {
      headerName: "Ações",
      cellRenderer: saveButtonRenderer, // 🔹 botão
      width: 120
    }
  ];

  useEffect(() => {
    if (data && data.length > 0) {
      setRowData(data);
    }
  }, [data]);
  useEffect(() => {
    if (turmaSelecionada && turmaSelecionada.length > 0) {
      setRowData(turmaSelecionada);
    }
  }, [turmaSelecionada]);

  

  /* useEffect(() => {
    if (percentualPresenca && percentualPresenca.length > 0) {
      setRowData(percentualPresenca);
    }
  }, [percentualPresenca]); */

  // 🔵 PATCH ao clicar no botão
  const handleSave = async (row) => {
    try {
      await api.patch(`api/chamada/presenca/${row.id}`, {
        horasPresentes: Number(row.horasPresente),
      });

      alert("Horas atualizadas!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar. Tente novamente.");
    }
  };

  return (
    <div style={{ height: 500 }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
}

export default ReactGrid;