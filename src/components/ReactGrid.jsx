import React, { useEffect, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { api } from '../lib/axios';
import { useParams } from 'react-router';
import { useAuth } from './UserAuth';
import { themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

function ReactGrid({ dataTurma, dataHoraTurma }) {
  const [rowData, setRowData] = useState([]);


  const { turmaId: turmaIdParam } = useParams();
  const { turmaId: turmaIdContext } = useAuth();
  const turmaId = turmaIdParam || turmaIdContext;

  const myTheme = themeQuartz
    .withParams({
      accentColor: "#D00909",
      backgroundColor: "#212121",
      browserColorScheme: "dark",
      chromeBackgroundColor: {
        ref: "foregroundColor",
        mix: 0.07,
        onto: "backgroundColor"
      },
      foregroundColor: "#FFF",
      headerBackgroundColor: "#D00909",
      headerFontSize: 14,
      headerTextColor: "#F1F1F1"
    });

  useEffect(() => {
    if (Array.isArray(dataTurma)) {
      setRowData(dataTurma);
    } else if (dataTurma && dataTurma.length) {
      setRowData(dataTurma);
    } else {
      setRowData([]);
    }
  }, [dataTurma]);

  // 🔹 Botão de salvar por linha
  const saveButtonRenderer = (params) => {
    return (
      <button
        onClick={() => handleSave(params.dataTurma)}
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
    { field: "nome", headerName: "Nome do Aluno", sortable: true, filter: true },
    { field: "login", headerName: "Email", editable: true },
    { field: "horasMaximas", headerName: "Horas", editable: true }
  ];

  useEffect(() => {
    if (dataTurma && dataTurma.length > 0) {
      setRowData(dataTurma);
    }
  }, [dataTurma]);

  // 🔵 PATCH ao clicar no botão
  const handleSave = async (row) => {
    try {
      await api.patch(`api/chamada/presenca/${row.id}`, {
        horasPresentes: Number(row.horasPresente),
      });
      await chamada();

      alert("Horas atualizadas!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar. Tente novamente.");
    }
  };

  return (
    <div style={{ height: 500, width: '82%' }}>
      <AgGridReact theme={myTheme} rowData={rowData} columnDefs={colDefs} />
    </div>
  );
}

export default ReactGrid;