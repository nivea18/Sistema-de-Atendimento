import React, { useState } from 'react';


export const TelaGuiche = ({ guiches, chamarProximaSenha, expedienteAberto }) => {
    // Estado local para qual guichê o atendente está logado 
    const [guicheSelecionadoId, setGuicheSelecionadoId] = useState(guiches[0] ? guiches[0].id : null);
    
    // Calcula o guichê 
    const guicheAtivo = guiches.find(g => g.id === guicheSelecionadoId) || null;

    if (!guicheAtivo) return <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>Nenhum Guichê Encontrado.</div>;

    // chama a próxima senha 
    const handleChamarProxima = (tipo) => {
        chamarProximaSenha(guicheAtivo.id, tipo);
    };
    
    // finalizar o atendimento 
    const handleFinalizar = () => {
        // null sinaliza para o hook que é apenas para finalizar o atendimento atual
        chamarProximaSenha(guicheAtivo.id, null); 
    };


    const isBusy = guicheAtivo.status === 'EM ATENDIMENTO';
    const canCall = expedienteAberto && !isBusy;

    const buttonStyles = (backgroundColor) => ({
        padding: '10px 15px',
        margin: '5px',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        cursor: (canCall || isBusy) ? 'pointer' : 'not-allowed',
        backgroundColor: (canCall || isBusy) ? backgroundColor : '#1c829cff',
        transition: 'background-color 0.3s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    });

    return (
        <div style={{ padding: '20px', backgroundColor: '#ace7edff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Guichê de Atendimento</h2>
            
           
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <label htmlFor="guiche-select" style={{ marginRight: '10px' }}>Atendente no Guichê:</label>
                <select 
                    id="guiche-select"
                    value={guicheSelecionadoId}
                    onChange={(e) => setGuicheSelecionadoId(parseInt(e.target.value))}
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    {guiches.map(g => (
                        <option key={g.id} value={g.id}>Guichê {g.id}</option>
                    ))}
                </select>
            </div>

            <div style={{ padding: '15px', backgroundColor: guicheAtivo.status === 'LIVRE' ? '#d4edda' : '#ffeeba', borderRadius: '8px', marginBottom: '20px', borderLeft: `5px solid ${guicheAtivo.status === 'LIVRE' ? 'green' : 'orange'}` }}>
                <h4 style={{ margin: '0 0 5px 0' }}>Guichê {guicheAtivo.id}</h4>
                <p style={{ margin: 0 }}>Status: <strong>{guicheAtivo.status}</strong></p>
                {isBusy && guicheAtivo.senhaAtual && (
                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#c3a500' }}>Atendendo: {guicheAtivo.senhaAtual.id}</p>
                )}
                {!expedienteAberto && <p style={{ color: 'red', margin: 0 }}>Expediente Fechado!</p>}
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Botões de Chamada */}
                <p style={{ fontWeight: 'bold', margin: '0' }}>Chamar Próxima Senha:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <button 
                        onClick={() => handleChamarProxima('SP')} 
                        disabled={!canCall}
                        style={buttonStyles('#007bff')}
                    >
                        Chamar Próximo (SP)
                    </button>
                    <button 
                        onClick={() => handleChamarProxima('SG')} 
                        disabled={!canCall}
                        style={buttonStyles('#28a745')}
                    >
                        Chamar Próximo (SG)
                    </button>
                    <button 
                        onClick={() => handleChamarProxima('SE')} 
                        disabled={!canCall}
                        style={buttonStyles('#ffc107')}
                    >
                        Chamar Próximo (SE)
                    </button>
                </div>
                
                {/* Botão de Finalizar */}
                {isBusy && (
                    <button 
                        onClick={handleFinalizar} 
                        style={{ ...buttonStyles('#dc3545'), marginTop: '10px' }}
                    >
                        Finalizar Atendimento ({guicheAtivo.senhaAtual.id})
                    </button>
                )}
            </div>

        </div>
    );
};