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

  console.log("dataHoraTurma em ReactGrid:", dataHoraTurma);
  const idsAlunos = dataHoraTurma.map(aluno => aluno.alunoId);
  console.log(idsAlunos);
  

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
            ...aluno, // Mantém todos os dados originais de dataTurma
            horasPresente: horasData ? horasData.horasPresente : 0 // Adiciona horasPresente
          };
        });
        setRowData(mergedData);
      } else {
        // Se não tem dataHoraTurma, usa apenas dataTurma
        setRowData(dataTurma);
      }
    } else {
      setRowData([]);
    }
  }, [dataTurma, dataHoraTurma]);

  const colDefs = [
    { field: "nome", headerName: "Nome do Aluno", sortable: true, filter: false },
    { field: "login", headerName: "Email", editable: false },
    { field: "horasPresente", headerName: "Horas Presente", editable: true }
  ];
  
  
  for (let i = 0; i < idsAlunos.length; i++) {
    
    api.patch(`/api/chamada/presenca/${idsAlunos[i]}`)
  }  

  return (
    <div style={{ height: 500, width: '82%' }}>
      <AgGridReact theme={myTheme} rowData={rowData} columnDefs={colDefs} />
    </div>
  );
}

export default ReactGrid;