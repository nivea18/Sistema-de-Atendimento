import { useState, useEffect, useMemo, useCallback } from 'react';

const NUM_GUICHES = 5;
const EXPEDIENTE_INICIO = 7 * 60; // 7:00 em minutos
const EXPEDIENTE_FIM = 17 * 60;   // 17:00 em minutos

const gerarID = (tipo, sequencial) => {
    const d = new Date();
    const YY = String(d.getFullYear()).slice(2);
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const DD = String(d.getDate()).padStart(2, '0');
    const SQ = String(sequencial).padStart(4, '0');
    return `${YY}${MM}${DD}-${tipo}${SQ}`;
};

const calcularTM = (tipo) => {
    let base, variacao;

    switch (tipo) {
        case 'SP': // 15 min +/- 5 min
            base = 15;
            variacao = Math.floor(Math.random() * 11) - 5; // -5 a +5
            return Math.max(1, base + variacao); // Min 1
        case 'SG': // 5 min +/- 3 min
            base = 5;
            variacao = Math.floor(Math.random() * 7) - 3; // -3 a +3
            return Math.max(1, base + variacao);
        case 'SE': // 95% < 1 min, 5% = 5 min
            if (Math.random() < 0.05) { // 5% chance
                return 5;
            }
            return 1; // 95% chance de 1 min
        default:
            return 5;
    }
};

//Hook Principal 

export const useSistemaAtendimento = () => {
    const [filas, setFilas] = useState({ SP: [], SG: [], SE: [] });
    const [guiches, setGuiches] = useState(Array(NUM_GUICHES).fill(null).map((_, i) => ({
        id: i + 1,
        status: 'Livre',
        senhaAtual: null,
        tempoRestante: 0,
    })));
    const [historicoChamadas, setHistoricoChamadas] = useState([]);
    const [sequenciais, setSequenciais] = useState({ SP: 0, SG: 0, SE: 0 });
    const [cicloPrioridade, setCicloPrioridade] = useState('SP'); // SP -> SE|SG
    const [todasAsSenhas, setTodasAsSenhas] = useState([]);
    const [expedienteAberto, setExpedienteAberto] = useState(false);
    const [horaAtualMinutos, setHoraAtualMinutos] = useState(EXPEDIENTE_INICIO);

    // Efeito para simular o tempo (1s real = 1min simulado)
    useEffect(() => {
        if (!expedienteAberto) return;

        const timer = setInterval(() => {
            setHoraAtualMinutos(prevMin => {
                if (prevMin >= EXPEDIENTE_FIM) {
                    setExpedienteAberto(false);
                    return EXPEDIENTE_FIM;
                }
                return prevMin + 1;
            });

            // Diminui o tempo restante de atendimento nos guichês
            setGuiches(prevGuiches => prevGuiches.map(g => {
                if (g.status === 'Em Atendimento' && g.tempoRestante > 0) {
                    const novoTempo = g.tempoRestante - 1;
                    if (novoTempo <= 0) {
                        // Atendimento finalizado
                        finalizarAtendimento(g.id, g.senhaAtual.id);
                        return { ...g, status: 'Livre', senhaAtual: null, tempoRestante: 0 };
                    }
                    return { ...g, tempoRestante: novoTempo };
                }
                return g;
            }));

        }, 100); //100ms real = 1min simulado)

        return () => clearInterval(timer);
    }, [expedienteAberto]);


    // AS - Agente Sistema: Emite a senha e a adiciona à fila.

    const emitirSenha = useCallback((tipo) => {
        if (!expedienteAberto) {
            alert("O expediente não está aberto!");
            return null;
        }

        setSequenciais(prevSeq => ({
            ...prevSeq,
            [tipo]: prevSeq[tipo] + 1
        }));

        const sequencial = sequenciais[tipo] + 1;
        const id = gerarID(tipo, sequencial);
        const horaEmissao = new Date();
        const descartada = Math.random() < 0.05;

        const novaSenha = {
            id,
            tipo,
            horaEmissao: horaEmissao.toISOString(),
            horaAtendimento: null,
            guiche: null,
            status: descartada ? 'Descartada' : 'Aguardando',
            TM: calcularTM(tipo),
        };

        setTodasAsSenhas(prev => [...prev, novaSenha]);

        if (!descartada) {
            setFilas(prevFilas => ({
                ...prevFilas,
                [tipo]: [...prevFilas[tipo], novaSenha]
            }));
        }

        return id;
    }, [sequenciais, expedienteAberto,setTodasAsSenhas]);


    //AA - Agente Atendente: Chama o próximo na fila.

    const chamarProximaSenha = useCallback((guicheId) => {
        const guicheIndex = guicheId - 1;
        const guiche = guiches[guicheIndex];

        if (guiche.status === 'Em Atendimento' || !expedienteAberto) {
            return;
        }

        let proximaSenha = null;
        let tipoChamado = null;

        //Tenta atender a Prioritária (SP)
        if (cicloPrioridade === 'SP' && filas.SP.length > 0) {
            proximaSenha = filas.SP[0];
            tipoChamado = 'SP';
        } 
        
        //Tenta atender Exames (SE) ou Geral (SG)
        else if (cicloPrioridade !== 'SP') {
            if (filas.SE.length > 0) {
                // SE não tem prioridade mas é rápida, chamada antes de SG
                proximaSenha = filas.SE[0];
                tipoChamado = 'SE';
            } else if (filas.SG.length > 0) {
                proximaSenha = filas.SG[0];
                tipoChamado = 'SG';
            }
        }
        
       
        if (!proximaSenha) {
          
             if (cicloPrioridade === 'SP') {
                if (filas.SE.length > 0) {
                    proximaSenha = filas.SE[0];
                    tipoChamado = 'SE';
                } else if (filas.SG.length > 0) {
                    proximaSenha = filas.SG[0];
                    tipoChamado = 'SG';
                }
             }
        }
        
        // Se ainda não achou, reverte ao ciclo SP para tentar novamente na próxima chamada se houver
        if (!proximaSenha) {
            if (filas.SP.length > 0) {
                proximaSenha = filas.SP[0];
                tipoChamado = 'SP';
            }
        }


        if (proximaSenha) {
            // Remove da fila
            setFilas(prevFilas => ({
                ...prevFilas,
                [tipoChamado]: prevFilas[tipoChamado].slice(1)
            }));

            // Atualiza o guichê e o histórico
            setGuiches(prevGuiches => prevGuiches.map((g, i) => {
                if (i === guicheIndex) {
                    return {
                        ...g,
                        status: 'Em Atendimento',
                        senhaAtual: proximaSenha,
                        tempoRestante: proximaSenha.TM,
                    };
                }
                return g;
            }));

            // Atualiza o histórico para o painel
            setHistoricoChamadas(prevHist => [
                { ...proximaSenha, guiche: guicheId },
                ...prevHist.slice(0, 4) //  apenas os 5 últimos
            ]);

            setTodasAsSenhas(prev => prev.map(s => 
                s.id === proximaSenha.id ? { 
                    ...s, 
                    status: 'Em Atendimento', 
                    guiche: guicheId,
                } : s
            ));

            // Atualiza as prioridades
            if (tipoChamado === 'SP') {
                setCicloPrioridade('SE|SG');
            } else {
                setCicloPrioridade('SP');
            }

            return proximaSenha;
        }
        
        // Se não tiver senhas em nenhuma fila.
        return null; 
    }, [guiches, filas, cicloPrioridade, expedienteAberto]);


 //Finaliza o atendimento no guichê

const finalizarAtendimento = useCallback((guicheId, senhaId) => {
    
    
    const horaAtendimento = new Date().toISOString(); 
    
    // Muda o status da senha para Atendida
    setTodasAsSenhas(prev => prev.map(s => 
        s.id === senhaId ? { 
            ...s, 
            status: 'Atendida', 
            horaAtendimento: horaAtendimento,
        } : s
    ));
}, [setTodasAsSenhas]); 

    //Funções de Expediente
    
    const iniciarExpediente = () => {
        const agora = new Date();
        const horaInicio = (agora.getHours() * 60) + agora.getMinutes();
        
        // Reinicia 
        setFilas({ SP: [], SG: [], SE: [] });
        setHistoricoChamadas([]);
        setHoraAtualMinutos(EXPEDIENTE_INICIO); // 7hrs para a simulação começar
        setExpedienteAberto(true);
        console.log("Expediente iniciado. Simulação rodando.");
    };

    const encerrarExpediente = () => {
        setExpedienteAberto(false);
        // Senhas nas filas são automaticamente descartadas
        console.log("Expediente encerrado. Senhas restantes descartadas.");
    };


    const horaFormatada = useMemo(() => {
        const h = Math.floor(horaAtualMinutos / 60);
        const m = horaAtualMinutos % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }, [horaAtualMinutos]);


    return {
        filas,
        guiches,
        historicoChamadas,
        cicloPrioridade,
        expedienteAberto,
        horaFormatada,
        iniciarExpediente,
        encerrarExpediente,
        emitirSenha,
        chamarProximaSenha,
        sequenciais,
        todasAsSenhas,
        
    };
};