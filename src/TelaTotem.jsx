import React, { useState } from 'react';


// O componente agora recebe as props do App.jsx
export const TelaTotem = ({ emitirSenha, expedienteAberto }) => {
   
    
    const [ultimaSenha, setUltimaSenha] = useState(null);

    const handleEmissao = (tipo) => {
        const id = emitirSenha(tipo);
        if (id) {
            setUltimaSenha(id);
        }
    };

    const buttonStyles = (color, enabled) => ({
        padding: '12px 20px',
        margin: '10px',
        fontSize: '1.1em',
        borderRadius: '8px',
        border: 'none',
        color: 'white',
        fontWeight: 'bold',
        cursor: enabled ? 'pointer' : 'not-allowed',
        backgroundColor: enabled ? color : '#ccc',
        transition: 'background-color 0.3s',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    });

    return (
        <div style={{ padding: '20px', backgroundColor: '#e9f7ef', borderRadius: '12px', border: '1px solid #d4edda' }}>
            <h2 style={{ textAlign: 'center', color: '#155724' }}>TOTEM DE SENHAS</h2>
            <p style={{ textAlign: 'center', color: expedienteAberto ? 'green' : 'red' }}>
                {expedienteAberto ? 'Toque para emitir sua senha' : 'Expediente Fechado'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                <button 
                    onClick={() => handleEmissao('SP')} 
                    disabled={!expedienteAberto}
                    style={buttonStyles('#007bff', expedienteAberto)}
                >
                    Senha Prioritária (SP)
                </button>
                <button 
                    onClick={() => handleEmissao('SG')} 
                    disabled={!expedienteAberto}
                    style={buttonStyles('#28a745', expedienteAberto)}
                >
                    Senha Geral (SG)
                </button>
                <button 
                    onClick={() => handleEmissao('SE')} 
                    disabled={!expedienteAberto}
                    style={buttonStyles('#ffc107', expedienteAberto)}
                >
                    Senha Especial (SE)
                </button>
            </div>
            
            {ultimaSenha && (
                <div style={{ marginTop: '25px', padding: '15px', border: '1px solid #28a745', backgroundColor: '#d4edda', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#155724' }}>Sua senha:</p>
                    <h3 style={{ margin: '5px 0 0 0', fontSize: '2em', color: '#155724' }}>{ultimaSenha}</h3>
                    <p style={{ margin: 0, fontSize: '0.8em', color: '#155724' }}>Aguarde sua chamada no painel.</p>
                </div>
            )}

            {!expedienteAberto && (
                <div style={{ marginTop: '25px', padding: '15px', border: '1px solid #dc3545', backgroundColor: '#f8d7da', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#721c24' }}>O sistema está fora do horário de atendimento.</p>
                </div>
            )}
        </div>
    );
};