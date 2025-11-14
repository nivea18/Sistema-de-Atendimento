import React from 'react';

// O componente recebe as props do App.jsx
export const TelaRelatorios = ({ todasAsSenhas, horaFormatada }) => {

    // Funções para calcular os totais
    const calcularTotalTipo = (tipo) => 
        todasAsSenhas.filter(s => s.tipo === tipo).length;

    const totalSP = calcularTotalTipo('SP');
    const totalSG = calcularTotalTipo('SG');
    const totalSE = calcularTotalTipo('SE');
    const totalGeral = todasAsSenhas.length;

    return (
        <div style={{ padding: '20px', backgroundColor: '#9dd4f5ff', borderRadius: '8px', border: '1px solid #ccc' }}>
            
            <h2>Relatórios de Atendimento</h2>
            <p>Hora de Geração: {horaFormatada}</p>
            
            <h3>1. Quantitativo Geral</h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e0e0e0' }}>
                        <th style={tableHeaderStyle}>Tipo</th>
                        <th style={tableHeaderStyle}>Total Emitidas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={tableRowStyle}>
                        <td style={tableCellStyle}>SP (Prioritário)</td>
                        <td style={tableCellStyle}>{totalSP}</td>
                    </tr>
                    <tr style={tableRowStyle}>
                        <td style={tableCellStyle}>SG (Geral)</td>
                        <td style={tableCellStyle}>{totalSG}</td>
                    </tr>
                    <tr style={tableRowStyle}>
                        <td style={tableCellStyle}>SE (Especial)</td>
                        <td style={tableCellStyle}>{totalSE}</td>
                    </tr>
                    <tr style={{ ...tableRowStyle, fontWeight: 'bold', backgroundColor: '#1c7daaff' }}>
                        <td style={tableCellStyle}>TOTAL GERAL</td>
                        <td style={tableCellStyle}>{totalGeral}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
};

// Estilos auxiliares
const tableHeaderStyle = { padding: '10px', border: '1px solid #000000ff', textAlign: 'left', backgroundColor: '#d0d0d0' };
const tableCellStyle = { padding: '8px', border: '1px solid #000000ff', textAlign: 'left' };
const tableRowStyle = { transition: 'background-color 0.3s' };