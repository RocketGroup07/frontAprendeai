import React, { useEffect, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { api } from '../lib/axios';

ModuleRegistry.registerModules([AllCommunityModule]);

function ReactGrid({ codigoTurma }) {
  const [rowData, setRowData] = useState([]); // Dados das linhas
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // Definições das colunas
  const colDefs = [
    { field: "nome", headerName: "Nome do Aluno", sortable: true, filter: true },
    { field: "login", headerName: "Email", sortable: true, filter: true },
    { field: "papel", headerName: "Papel", sortable: true, filter: true },
  ];

  // Busca os alunos da turma
  useEffect(() => {
    async function fetchAlunos() {
      if (!codigoTurma) return; // Não faz a requisição se o código da turma não estiver definido
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Obtém o token do localStorage
        if (!token) {
          console.error('Token de autenticação ausente.');
          return;
        }

        console.log(`Enviando requisição para /turmas/${codigoTurma} com o código:`, { codigo: codigoTurma });

        // Força o envio do corpo com GET
        const response = await api.get(`turmas/${codigoTurma}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
            'Content-Type': 'application/json', // Define o tipo de conteúdo
          },
          data: { codigo: codigoTurma }, // Corpo da requisição
          transformRequest: [(data) => JSON.stringify(data)], // Serializa o corpo
        });

        console.log('Resposta da API:', response.data);
        setRowData(Array.isArray(response.data) ? response.data : []); // Garante que rowData seja um array
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        setRowData([]); // Limpa os dados em caso de erro
      } finally {
        setLoading(false);
      }
    }
    fetchAlunos();
  }, [codigoTurma]); // Refaz a requisição sempre que o código da turma mudar

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