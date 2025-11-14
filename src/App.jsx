import React from 'react';
import { TelaTotem } from './TelaTotem.jsx';
import { TelaPainel } from './TelaPainel.jsx';
import { TelaGuiche } from './TelaGuiche.jsx';
import { TelaRelatorios } from './TelaRelatorios.jsx';
import { useSistemaAtendimento } from './useSistemaAtendimento';

const App = () => {
    // CHAMA O HOOK APENAS UMA VEZ 
    const sistema = useSistemaAtendimento(); 
    
    // EXTRAI TODOS OS DADOS E FUNÇÕES
    const { 
        expedienteAberto, 
        horaFormatada, 
        iniciarExpediente, 
        encerrarExpediente,
        // Funções
        emitirSenha, 
        chamarProximaSenha,
        // Dados
        filas,
        guiches,
        historicoChamadas,
        sequenciais,
        todasAsSenhas
    } = sistema; 
    
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Sistema de Controle de Atendimento</h1>

            {/* Controle de Expediente */}
            <div style={{ border: '1px solid #000', padding: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    Status do Sistema: <strong> {expedienteAberto ? 'OPERANDO' : 'FECHADO'}</strong>
                    <span style={{ marginLeft: '20px' }}>Hora Simulada: <strong>{horaFormatada}</strong></span>
                </div>
                <div>
                    <button 
                        onClick={iniciarExpediente} 
                        disabled={expedienteAberto}
                        style={{ padding: '10px', background: 'blue', color: 'white', marginRight: '10px', border: 'none', borderRadius: '5px', cursor: expedienteAberto ? 'not-allowed' : 'pointer' }}
                    >
                        Iniciar Expediente (7:00h)
                    </button>
                    <button 
                        onClick={encerrarExpediente} 
                        disabled={!expedienteAberto}
                        style={{ padding: '10px', background: 'gray', color: 'white', border: 'none', borderRadius: '5px', cursor: !expedienteAberto ? 'not-allowed' : 'pointer' }}
                    >
                        Encerrar Expediente (17:00h)
                    </button>
                </div>
            </div>

            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                {/* Totem e Painel */}
                <div style={{ flex: 1, minWidth: '400px' }}>
                    {/* Recebe as funções de emissão */}
                    <TelaTotem 
                        emitirSenha={emitirSenha} 
                        expedienteAberto={expedienteAberto}
                    /> 
                    <hr style={{ margin: '20px 0' }} />
                    {/* Recebe os dados para exibição */}
                    <TelaPainel 
                        historicoChamadas={historicoChamadas} 
                        guiches={guiches} 
                    /> 
                </div>
                
                {/* Guichê do Atendente */}
                <div style={{ flex: 2 }}>
                    {/* Recebe as funções e dados do atendimento */}
                    <TelaGuiche 
                        guiches={guiches}
                        chamarProximaSenha={chamarProximaSenha} 
                        expedienteAberto={expedienteAberto}
                    /> 
                </div>
            </div>

            <hr style={{ margin: '30px 0' }} />

            {/* RELATÓRIOS */}
            
            <TelaRelatorios 
                todasAsSenhas={todasAsSenhas}
                horaFormatada={horaFormatada}
            /> 
            
        </div>
    );
};

export default App;