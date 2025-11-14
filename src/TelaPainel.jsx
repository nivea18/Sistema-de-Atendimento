import React from 'react';



export const TelaPainel = ({ historicoChamadas, guiches }) => {
    

    // Encontra a última chamada válida
    const ultimaChamada = historicoChamadas[0] || null;

    const guicheAtual = ultimaChamada ? guiches.find(g => g.id === ultimaChamada.guicheId) : null;

    return (
        <div style={{ padding: '20px', backgroundColor: '#1d1d1d', color: 'white', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
            <h2 style={{ textAlign: 'center', color: '#ffc107', margin: '0 0 15px 0' }}>PAINEL DE ATENDIMENTO</h2>
            
            <div style={{ border: '5px solid #ffc107', padding: '20px', textAlign: 'center', margin: '20px 0', borderRadius: '8px', backgroundColor: '#333' }}>
                <h3 style={{ fontSize: '1.2em', color: 'white', margin: '0 0 10px 0' }}>ÚLTIMA CHAMADA:</h3>
                {ultimaChamada ? (
                    <>
                        <p style={{ margin: 0, fontSize: '4em', fontWeight: '900', color: '#28a745', lineHeight: 1.1 }}>
                            {ultimaChamada.senhaId}
                        </p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '2em', fontWeight: 'bold', color: '#ffc107' }}>
                            Guichê {ultimaChamada.guicheId}
                        </p>
                    </>
                ) : (
                    <p style={{ fontSize: '1.5em', color: '#aaa' }}>Aguardando primeira chamada...</p>
                )}
            </div>

            <h3 style={{ color: '#aaa', marginTop: '30px' }}>Guichês em Atendimento:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {guiches.map(guiche => (
                    <div 
                        key={guiche.id} 
                        style={{
                            padding: '10px 15px',
                            backgroundColor: guiche.status === 'EM ATENDIMENTO' ? '#28a745' : '#6c757d',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '0.9em'
                        }}
                    >
                        G-{guiche.id}: {guiche.status === 'EM ATENDIMENTO' ? guiche.senhaAtual.id : 'LIVRE'}
                    </div>
                ))}
            </div>
        </div>
    );
};