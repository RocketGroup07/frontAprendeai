import React, { useEffect, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { api } from '../lib/axios';
import { useParams } from 'react-router';
import { useAuth } from './UserAuth';
import { themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

function ReactGrid({ data }) {
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


      /* async function chamada() {
              try {
                const response = await api.get(`api/chamada/frequencia/${turmaId}`);
                console.log(response.data);
            
              } catch (error) {
                console.error("Erro ao buscar turma:", error);
              }
            } */

  useEffect(() => {
    if (data && data.length > 0) {
      setRowData(data);
    }
  }, [data]);




  useEffect(() => {
  if (Array.isArray(data) && data.length > 0) {
    // Extrai apenas os percentuais de presença
    const percentuais = data.map(item => item.percentualPresenca || 0); // Use 0 como valor padrão
    console.log("Percentuais de presença:", percentuais);

    setRowData(data); // Atualiza o grid com os dados completos
  } else {
    console.warn("O array `data` está vazio ou indefinido.");
  }
}, [data]);

async function chamada() {
  try {
    const response = await api.get(`api/chamada/frequencia/${turmaId}`);
    console.log("Dados retornados pela API:", response.data); // Verifique os dados retornados
    setRowData(response.data);
  } catch (error) {
    console.error("Erro ao buscar turma:", error);
  }
}


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
    <div style={{ height: 500 }}>
      <AgGridReact theme={myTheme} rowData={rowData} columnDefs={colDefs} />
    </div>
  );
}

export default ReactGrid;