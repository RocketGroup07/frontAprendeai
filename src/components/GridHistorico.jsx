import { useEffect, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

function GridHistorico({ diaHistorico, alunoHistorico }) {
    const [rowData, setRowData] = useState([]);

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

    useEffect(() => {
        if (diaHistorico && alunoHistorico) {

            const normalized = diaHistorico.map(d => ({
                ...d,
                alunoId: d.alunoId ?? d.id
            }));

            // cria um mapa por alunoId, escolhendo a entrada com maior horasPresenteTotal
            const totalsMap = (alunoHistorico || []).reduce((acc, item) => {
                const id = item.alunoId ?? item.id;
                const key = String(id);
                const existing = acc[key];
                if (!existing || (Number(item.horasPresenteTotal || 0) > Number(existing.horasPresenteTotal || 0))) {
                    acc[key] = item;
                }
                return acc;
            }, {});

            const mergedData = normalized.map(dia => {
                const totalData = totalsMap[String(dia.alunoId)];
                return {
                    ...dia,
                    horasPresente: dia.horasPresente ?? 0,
                    horasPresenteTotal: totalData?.horasPresenteTotal ?? 0,
                    percentualPresenca: totalData?.percentualPresenca ?? 0,
                    percentualFalta: totalData?.percentualFalta ?? 0
                };
            });

            setRowData(mergedData);
        }
    }, [diaHistorico, alunoHistorico]);



    const colDefs = [
        { field: "nomeAluno", headerName: "Nome do Aluno", sortable: true, filter: false, flex: 2 },
        { field: "horasPresente", headerName: "Horas Presente no Dia", editable: false, flex: 2 },
        { field: "horasPresenteTotal", headerName: "Horas Presente Total", editable: false, flex: 2 },
        { field: "percentualPresenca", headerName: "Percentual de Presença", editable: false, flex: 2, valueFormatter: params => Number(params.value).toFixed(2) + '%' },
    ];

    const noRowsTemplate = `<div class="p-3 text-gray-400">Nenhum aluno encontrado</div>`;

    return (
        <div style={{ height: '80%', width: '90%', margin: 'auto' }}>
            <AgGridReact
                theme={myTheme}
                rowData={rowData}
                columnDefs={colDefs}
                overlayNoRowsTemplate={noRowsTemplate}
            />
        </div>
    );
}

export default GridHistorico;