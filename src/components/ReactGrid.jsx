import React, { useEffect, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

function ReactGrid({ dataTurma, dataHoraTurma, onUpdateHoras }) {
  const [rowData, setRowData] = useState([]);
  
  console.log("dataHoraTurma em ReactGrid:", dataHoraTurma);
  
  const myTheme = themeQuartz.withParams({
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

  // Mescla os dados de dataTurma com dataHoraTurma
  useEffect(() => {
    if (dataTurma && Array.isArray(dataTurma) && dataTurma.length > 0) {
      // Se temos dataHoraTurma, mescla com dataTurma
      if (dataHoraTurma && Array.isArray(dataHoraTurma) && dataHoraTurma.length > 0) {
        const mergedData = dataTurma.map(aluno => {
          // Procura o aluno correspondente em dataHoraTurma
          const horasData = dataHoraTurma.find(
            item => item.alunoId === aluno.id || item.nomeAluno === aluno.nome
          );
          
          return {
            ...aluno,
            horasPresentes: horasData ? Number(horasData.horasPresentes) : 0
          };
        });
        setRowData(mergedData);
      } else {
        // Se não tem dataHoraTurma, usa apenas dataTurma
        setRowData(dataTurma.map(aluno => ({ ...aluno, horasPresentes: 0 })));
      }
    } else if (dataHoraTurma && Array.isArray(dataHoraTurma) && dataHoraTurma.length > 0) {
      // Se só tem dataHoraTurma
      setRowData(dataHoraTurma);
    } else {
      setRowData([]);
    }
  }, [dataTurma, dataHoraTurma]);

  const colDefs = [
    { field: "nome", headerName: "Nome do Aluno", sortable: true, filter: false },
    { field: "login", headerName: "Email", editable: false },
    { 
      field: "horasPresentes", 
      headerName: "Horas Presente", 
      editable: true,
      valueParser: params => Number(params.newValue) || 0
    }
  ];

  // Quando uma célula é editada no AG Grid
  const onCellValueChanged = (event) => {
    if (event.colDef.field === 'horasPresentes' && onUpdateHoras) {
      const alunoId = event.data.id; // ID do aluno
      const novasHoras = Number(event.newValue);
      
      console.log(`Célula editada - Aluno ID: ${alunoId}, Novas horas: ${novasHoras}`);
      
      // Atualiza o estado no componente pai
      onUpdateHoras(alunoId, novasHoras);
    }
  };

  return (
    <div style={{ height: 500, width: '82%' }}>
      <AgGridReact 
        theme={myTheme} 
        rowData={rowData} 
        columnDefs={colDefs}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
}

export default ReactGrid;