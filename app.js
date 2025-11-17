// ============================
// APROVAÇÃO SEM LIMITES - GESTOR DE ESTUDOS
// Versão Final (V9.5 - Correção Anki Completa)
// Arquitetura: Gestor de Estudo Reverso com Plano Automático
// ============================

// ============================
// CONFIGURAÇÃO DE SEGURANÇA
// ============================
// Sistema de convite mais seguro - hash gerado externamente
const MASTER_INVITE_HASH = '4c3a9c0ed83518edbd2515048e3df48ddeadfc47f3d681ae8121605250a98820';
const DEFAULT_HOURS_PER_TOPIC = 1.5;
const BLOCK_DURATION_MINUTES = 60;
const ANKI_BLOCK_DURATION_MINUTES = 30;

// ============================
// BANCO DE DADOS DE CONCURSOS (V7 - Baseado no Edital PDF)
// ============================
const examDatabase = {
    'CGM_AM_TI': {
        name: 'CGM Manaus - Auditor TI (Edital 2025)',
        subjects: {
            'BAS_PORT': { name: 'Língua Portuguesa', weight: 5, topics: { 'INTERPRET': { name: 'Interpretação, Compreensão e Funções da Linguagem' }, 'MORFO': { name: 'Morfologia (Classes Gramaticais)' }, 'SINTAXE': { name: 'Sintaxe (Concordância, Regência, Crase)' }, 'PONTUACAO': { name: 'Pontuação, Ortografia e Fonemas' } } },
            'BAS_AUD': { name: 'Auditoria Governamental e Controles', weight: 5, topics: { 'SCI': { name: 'Controle Interno (Conceitos, Três Linhas IIA)' }, 'CGM_MANAUS': { name: 'Estrutura e Decretos CGM Manaus' }, 'TCE': { name: 'Tomada de Contas Especial (TCE)' }, 'CONT_EXT': { name: 'Controle Externo (Constituição/TCU)' }, 'AUD_TIPOS': { name: 'Tipos de Auditoria (Regularidade, Operacional)' }, 'AUD_FASES': { name: 'Fases da Auditoria (Normas, Relatórios)' }, 'LAI': { name: 'Transparência (LAI e Portais)' } } },
            'BAS_DIR': { name: 'Direito (Admin. e Constitucional)', weight: 5, topics: { 'DIR_CONST': { name: 'Direito Constitucional (Princípios, Direitos, Organização)' }, 'DIR_ADM_ORG': { name: 'Direito Admin. (Princípios, Organização, Poderes)' }, 'DIR_ADM_ATOS': { name: 'Direito Admin. (Atos Administrativos)' }, 'LICIT': { name: 'Licitações e Contratos (Lei 14.133/2021)' }, 'LGPD_BAS': { name: 'LGPD (Tópicos do Direito)' } } },
            'BAS_AFO': { name: 'Administração Financeira e Orçamentária', weight: 4, topics: { 'ORC_CONC': { name: 'Orçamento (Conceitos, PPA, LDO, LOA)' }, 'REC_DESP': { name: 'Receita e Despesa (Classificação, Estágios)' }, 'LRF': { name: 'Lei de Responsabilidade Fiscal (LCP 101/2000)' }, 'CICLO': { name: 'Ciclo Orçamentário e Créditos Adicionais' } } },
            'BAS_RLM': { name: 'Raciocínio Lógico', weight: 3, topics: { 'LOG_PROP': { name: 'Lógica Proposicional (Proposições, Negação)' }, 'LOG_PROB': { name: 'Problemas de Raciocínio e Diagramas' }, 'ALGEBRA': { name: 'Álgebra (Equações, Porcentagem, Juros)' }, 'SEQ_GEO': { name: 'Sequências (PA/PG), Geometria e Probabilidade' } } },
            'BAS_LEG': { name: 'Legislação Municipal', weight: 3, topics: { 'LEI_ORG': { name: 'Lei Orgânica de Manaus' }, 'ESTATUTO': { name: 'Estatuto dos Servidores (Lei 1.118/71)' }, 'REG_CGM': { name: 'Estrutura e Regimento CGM (Lei 3.546/25)' }, 'COD_ETICA': { name: 'Código de Conduta Ética (Decreto 6.153/25)' } } },
            'TI_GOV': { name: 'TI - Governança de TI', weight: 4, topics: { 'COBIT': { name: 'COBIT (Conceitos, Estrutura, Objetivos)' }, 'ITIL': { name: 'ITIL (Ger. de Serviços)' } } },
            'TI_PROJ': { name: 'TI - Gestão de Projetos', weight: 4, topics: { 'PMO': { name: 'PMO, Portfólio, Viabilidade' }, 'PMBOK': { name: 'PMBOK 7ª Edição (Princípios, Domínios)' }, 'AGIL': { name: 'Metodologias Ágeis (SCRUM, KANBAN)' }, 'CICLO_PROJ': { name: 'Ciclo de Vida do Projeto (EAP, Cronograma)' } } },
            'TI_SEC': { name: 'TI - Segurança da Informação', weight: 4, topics: { 'ISO_27002': { name: 'Norma ISO/IEC 27002' }, 'POLITICAS': { name: 'Políticas de Segurança, Autenticação' }, 'CRIPT': { name: 'Criptografia e PKI' }, 'REDES_SEC': { name: 'Segurança de Redes (Firewall, DMZ, NIDS)' }, 'BACKUP': { name: 'Backup e Malwares' } } },
            'TI_INFRA': { name: 'TI - Infraestrutura', weight: 4, topics: { 'REDES_PROT': { name: 'Redes, Voz/Imagem e Protocolos (TCP/IP)' }, 'DIR_SERV': { name: 'Serviços de Diretório (AD, Azure, LDAP)' }, 'CLOUD': { name: 'Cloud Computing (IaaS, PaaS, SaaS)' } } },
            'TI_SYS': { name: 'TI - Sistemas Operacionais', weight: 4, topics: { 'MS_WIN': { name: 'Microsoft Windows (Admin, Logs, SYSPREP)' }, 'MS_OFFICE': { name: 'MS Office / M365 e Políticas' }, 'SCRIPTS': { name: 'PowerShell e Scripts' }, 'HARDWARE': { name: 'Hardware e Periféricos' } } },
            'TI_CONTRAT': { name: 'TI - Contratação', weight: 4, topics: { 'PROJ_BASICO': { name: 'Contratação de TI e Projetos Básicos' }, 'GEST_CONTR': { name: 'Gestão e Fiscalização de Contratos' }, 'LEI_14133': { name: 'Lei 14.133/21 (Aplicada a TI)' } } },
            'TI_ESPECIAIS': { name: 'TI - Tópicos Especiais', weight: 4, topics: { 'LAI_LGPD': { name: 'LAI e LGPD (Tópicos de TI)' }, 'EMERG': { name: 'Tecnologias Emergentes (IA, Big Data)' }, 'BI': { name: 'Business Intelligence (BI) e Painéis' }, 'INGLES': { name: 'Inglês Técnico' } } }
        }
    },
    'Outros': {
        name: 'Outros (Personalizado)',
        subjects: {
            'GERAL': { name: 'Geral', weight: 1, topics: { 'TOPICO_1': { name: 'Tópico 1' } } }
        }
    }
};

// ============================
// ESTADO DA APLICAÇÃO (Memória)
// ============================
const memoryDB = { users: {}, currentUserId: null };
let timerInterval = null;
let timerRunning = false;
let focusTimerInterval = null;
let currentAnkiSession = [];
let currentAnkiIndex = 0;

// ============================
// FUNÇÕES DE PERSISTÊNCIA (localStorage)
// ============================
function saveStateToLocalStorage() {
    try {
        localStorage.setItem('aprovaDB', JSON.stringify(memoryDB.users));
        localStorage.setItem('aprovaLastUser', memoryDB.currentUserId);
    } catch (e) {
        console.error('Falha ao salvar estado:', e);
        showToast('Erro: Não foi possível salvar seus dados.');
    }
}

function loadStateFromLocalStorage() {
    try {
        const storedUsers = localStorage.getItem('aprovaDB');
        const lastUser = localStorage.getItem('aprovaLastUser');
        if (storedUsers) memoryDB.users = JSON.parse(storedUsers);
        else memoryDB.users = {};
        if (lastUser && memoryDB.users[lastUser]) memoryDB.currentUserId = lastUser;
        else memoryDB.currentUserId = null;
        return true;
    } catch (e) {
        console.error('Falha ao carregar estado:', e);
        showToast('Erro ao carregar dados salvos. A app pode resetar.');
        memoryDB.users = {}; memoryDB.currentUserId = null;
        return false;
    }
}

// ============================
// FUNÇÕES DE UTILITÁRIOS (Spinner, Toast)
// ============================
function showLoading() { document.getElementById('loadingSpinner').classList.remove('hidden'); }
function hideLoading() { document.getElementById('loadingSpinner').classList.add('hidden'); }

function showToast(message, duration = 3000) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = 'toast'; 
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, duration);
}

// ============================
// FUNÇÕES DE SEGURANÇA (Hashing)
// ============================
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================
// FUNÇÕES DE UTILIZADOR (User Management)
// ============================
async function createUser(name, email, password) {
    const userId = 'user_' + Date.now();
    const passHash = await hashPassword(password);
    const user = {
        id: userId, name: name, email: email, passHash: passHash,
        created: new Date().toISOString(), lastLogin: new Date().toISOString(),
        examId: null,
        dailyHours: { seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, sab: 0, dom: 0 },
        performance: {},
        ankiCards: [],
        errorNotebook: [],
        studyPlan: {},
        timer: { accumulated: 0 },
        session: { currentPage: 'dashboard', lastTimerStartTime: null }
    };
    memoryDB.users[userId] = user;
    return userId;
}

async function loginUser(email, password) {
    const passHashAttempt = await hashPassword(password);
    for (let userId in memoryDB.users) {
        const user = memoryDB.users[userId];
        if (user.email === email && user.passHash === passHashAttempt) {
            memoryDB.currentUserId = userId;
            user.lastLogin = new Date().toISOString();
            saveStateToLocalStorage();
            return userId;
        }
    }
    return null;
}

function getCurrentUser() {
    return memoryDB.currentUserId ? memoryDB.users[memoryDB.currentUserId] : null;
}

function logoutUser() {
    const user = getCurrentUser();
    if (user) {
        pauseTimer();
        if (focusTimerInterval) clearInterval(focusTimerInterval);
        saveStateToLocalStorage();
    }
    memoryDB.currentUserId = null;
    saveStateToLocalStorage();
}

function initializeUserProperties(user) {
    if (!user.performance) user.performance = {};
    if (!user.ankiCards) user.ankiCards = [];
    if (!user.studyPlan) user.studyPlan = {};
    if (!user.dailyHours) user.dailyHours = { seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, sab: 0, dom: 0 };
    if (!user.timer) user.timer = { accumulated: 0 };
    if (!user.session) user.session = { currentPage: 'dashboard', lastTimerStartTime: null };
    if (!user.errorNotebook) user.errorNotebook = [];
}

// ============================
// CRONÓMETRO GLOBAL (Acumulador)
// ============================
function updateTimerDisplay() {
    const user = getCurrentUser();
    if (!user) return;
    let totalMs = user.timer.accumulated || 0;
    if (timerRunning && user.session.lastTimerStartTime) {
        totalMs += (Date.now() - user.session.lastTimerStartTime);
    }
    const totalSeconds = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    document.getElementById('timerDisplay').textContent = `⏱️ ${hours}h ${minutes}m`;
}

function startTimer() {
    const user = getCurrentUser();
    if (timerRunning || !user) return;
    timerRunning = true;
    user.session.lastTimerStartTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 1000);
    showToast('Cronómetro geral iniciado!');
}

function pauseTimer() {
    const user = getCurrentUser();
    if (!timerRunning || !user) return;
    timerRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    const elapsed = Date.now() - (user.session.lastTimerStartTime || Date.now());
    if (elapsed > 0) user.timer.accumulated += elapsed;
    user.session.lastTimerStartTime = null;
    saveStateToLocalStorage();
    updateTimerDisplay();
    showToast('Cronómetro geral pausado.');
}

function resetTimer() {
    const user = getCurrentUser();
    if (!user) return;
    if (confirm('Tem certeza que deseja ZERAR seu tempo total de estudo?')) {
        pauseTimer();
        user.timer.accumulated = 0;
        updateTimerDisplay();
        saveStateToLocalStorage();
        showToast('Tempo total de estudo zerado! ↻');
    }
}

// ============================
// CRONÓMETRO DE FOCO (Regressivo)
// ============================
function startFocusSession(durationInMinutes, title, topicName) {
    const modal = document.getElementById('focusModal');
    const timerDisplay = document.getElementById('focusTimerDisplay');
    const titleDisplay = document.getElementById('focusModalTitle');
    const topicDisplay = document.getElementById('focusModalTopic');
    const pauseBtn = document.getElementById('focusPauseBtn');
    
    titleDisplay.textContent = title;
    topicDisplay.textContent = topicName || "Concentre-se na sua tarefa.";
    
    let totalSeconds = durationInMinutes * 60;
    let isPaused = false;

    if (focusTimerInterval) clearInterval(focusTimerInterval);

    const updateFocusTimer = () => {
        if (isPaused) return;
        
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (totalSeconds <= 0) {
            clearInterval(focusTimerInterval);
            focusTimerInterval = null;
            showToast("Bloco de foco concluído! 🎉");
            modal.classList.add('hidden');
            
            // Adicionar tempo ao cronómetro global
            const user = getCurrentUser();
            if (user) {
                user.timer.accumulated += durationInMinutes * 60 * 1000;
                saveStateToLocalStorage();
                updateTimerDisplay();
            }
        } else {
            totalSeconds--;
        }
    };

    pauseBtn.textContent = "Pausar";
    pauseBtn.onclick = () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? "Retomar" : "Pausar";
    };

    document.getElementById('focusStopBtn').onclick = () => {
        if (confirm("Deseja concluir este bloco de foco?")) {
            clearInterval(focusTimerInterval);
            focusTimerInterval = null;
            modal.classList.add('hidden');
        }
    };

    updateFocusTimer();
    focusTimerInterval = setInterval(updateFocusTimer, 1000);
    modal.classList.remove('hidden');
}

// ============================
// LÓGICA DO ANKI (SM-2 Simplificado)
// ============================
function calculateAnkiReview(card, quality) {
    const now = new Date();
    if (!card) card = initializeAnkiCard();
    if (!card.easeFactor) Object.assign(card, initializeAnkiCard());
    
    if (quality >= 3) {
        if (card.repetitions === 0) card.interval = 1;
        else if (card.repetitions === 1) card.interval = 6;
        else card.interval = Math.round(card.interval * card.easeFactor);
        card.repetitions++; 
        card.correctCount++;
    } else {
        card.repetitions = 0; 
        card.interval = 0; 
        card.incorrectCount++;
    }
    
    card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    
    if (quality === 1) card.interval = 0;
    else if (quality === 2) card.interval = Math.round(card.interval * 1.2);
    else if (quality === 4) card.interval = Math.round(card.interval * 1.3);
    
    card.lastReviewDate = now.toISOString();
    const nextDate = new Date(now);
    
    if (card.interval === 0) nextDate.setMinutes(nextDate.getMinutes() + 10);
    else nextDate.setDate(nextDate.getDate() + card.interval);
    
    card.nextReviewDate = nextDate.toISOString();
    
    if (card.interval === 0) card.cardState = 'learning';
    else if (card.interval < 21) card.cardState = 'review';
    else card.cardState = 'mature';
    
    return card;
}

function initializeAnkiCard() {
    return {
        cardState: 'new', 
        easeFactor: 2.5, 
        interval: 0, 
        repetitions: 0,
        lastReviewDate: null, 
        nextReviewDate: new Date().toISOString(),
        correctCount: 0, 
        incorrectCount: 0
    };
}

// ============================
// LÓGICA DO CICLO INTELIGENTE (V9)
// ============================
function generateMasterStudyCycle() {
    const user = getCurrentUser();
    if (!user || !user.examId) {
        showToast("Selecione um concurso primeiro.");
        return;
    }
    
    // 1. Salva as horas diárias
    const dayKeys = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
    let totalWeeklyHours = 0;
    dayKeys.forEach(day => {
        const hours = parseFloat(document.getElementById(`hours_${day}`).value) || 0;
        user.dailyHours[day] = hours;
        totalWeeklyHours += hours;
    });
    
    if (totalWeeklyHours === 0) {
        showToast("Defina suas horas de estudo diárias para gerar um ciclo.");
        return;
    }

    const exam = examDatabase[user.examId];
    const performance = user.performance || {};
    
    // 2. Calcula a prioridade de cada tópico
    let totalPriorityScore = 0;
    const priorityList = [];
    
    for (const subjectId in exam.subjects) {
        const subject = exam.subjects[subjectId];
        for (const topicId in subject.topics) {
            const topicPerf = performance[subjectId]?.[topicId];
            const rate = topicPerf ? (topicPerf.correct / topicPerf.total) * 100 : 0;
            const priorityScore = (100 - rate) * subject.weight;
            
            if (priorityScore > 0) {
                priorityList.push({
                    subjectId, topicId, score: priorityScore,
                    name: subject.name, topicName: subject.topics[topicId].name,
                });
            }
            totalPriorityScore += Math.max(priorityScore, 1);
        }
    }
    
    if (priorityList.length === 0) {
        showToast("Parabéns! Você registou 100% em todos os tópicos!");
        user.studyPlan = {};
        saveStateToLocalStorage();
        calculateConclusionDate(totalWeeklyHours);
        renderStudyPlan();
        renderDailyFocusDashboard();
        return;
    }

    // 3. Distribui o tempo total em blocos
    const totalWeeklyMinutes = totalWeeklyHours * 60;
    
    // 4. Cria a "fila de estudo" priorizada
    let studyQueue = [];
    for (const item of priorityList) {
        const proportion = item.score / totalPriorityScore;
        const timeAllocatedInMinutes = Math.round(proportion * totalWeeklyMinutes);
        let blocks = Math.max(1, Math.round(timeAllocatedInMinutes / BLOCK_DURATION_MINUTES));
        
        for (let i = 0; i < blocks; i++) {
            studyQueue.push({
                type: 'practice',
                subjectId: item.subjectId,
                topicId: item.topicId,
                name: item.name,
                topicName: item.topicName,
                duration: BLOCK_DURATION_MINUTES,
                score: item.score
            });
        }
    }
    
    studyQueue.sort((a, b) => b.score - a.score);

    // 5. Preenche o calendário (user.studyPlan)
    const weekKey = getWeekKey(0);
    const newStudyPlan = {};
    newStudyPlan[weekKey] = {};
    const times = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    const days = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
    
    let queueIndex = 0;
    
    days.forEach(day => {
        let minutesForDay = (user.dailyHours[day] || 0) * 60;
        if (minutesForDay > 0) {
            
            // Bloco Anki (se houver tempo)
            if (minutesForDay >= ANKI_BLOCK_DURATION_MINUTES) {
                const ankiBlock = { 
                    type: 'anki', 
                    name: 'Revisão Anki', 
                    duration: ANKI_BLOCK_DURATION_MINUTES 
                };
                
                for (const time of times) {
                    const cellKey = `${day.toUpperCase()}_${time}`;
                    if (!newStudyPlan[weekKey][cellKey]) {
                        newStudyPlan[weekKey][cellKey] = ankiBlock;
                        break;
                    }
                }
                minutesForDay -= ANKI_BLOCK_DURATION_MINUTES;
            }

            // Blocos de prática
            let blocksForDay = Math.floor(minutesForDay / BLOCK_DURATION_MINUTES);
            for (const time of times) {
                if (blocksForDay <= 0) break;
                
                const cellKey = `${day.toUpperCase()}_${time}`;
                if (!newStudyPlan[weekKey][cellKey]) {
                    if (queueIndex >= studyQueue.length) queueIndex = 0;
                    
                    if(studyQueue.length > 0) {
                        const topicBlock = studyQueue[queueIndex];
                        newStudyPlan[weekKey][cellKey] = {
                            type: 'practice',
                            name: topicBlock.name,
                            topicName: topicBlock.topicName,
                            duration: BLOCK_DURATION_MINUTES
                        };
                        queueIndex++;
                        blocksForDay--;
                    }
                }
            }
        }
    });

    user.studyPlan = newStudyPlan;
    saveStateToLocalStorage();
    calculateConclusionDate(totalWeeklyHours);
    renderStudyPlan();
    renderDailyFocusDashboard();
    showToast("Ciclo de Estudos Automático gerado com sucesso!");
}

function calculateConclusionDate(totalWeeklyHours) {
    const user = getCurrentUser();
    const predictionEl = document.getElementById('cyclePrediction');
    if (!user || !user.examId) {
        if (predictionEl) predictionEl.textContent = ""; 
        return;
    }
    
    const exam = examDatabase[user.examId];
    let totalTopics = 0;
    for (const subjectId in exam.subjects) {
        totalTopics += Object.keys(exam.subjects[subjectId].topics).length;
    }
    
    if (!totalWeeklyHours || totalWeeklyHours === 0) {
        if (predictionEl) predictionEl.textContent = "Defina suas horas de estudo para ver a previsão.";
        return;
    }
    
    const totalHoursNeeded = totalTopics * DEFAULT_HOURS_PER_TOPIC;
    const weeksNeeded = Math.ceil(totalHoursNeeded / totalWeeklyHours);
    
    if (predictionEl) {
        predictionEl.textContent = `Previsão de Conclusão (1ª passagem): ${weeksNeeded} semanas.`;
    }
}

function renderDailyFocusDashboard() {
    const user = getCurrentUser();
    const container = document.getElementById('dailyFocusContainer');
    if (!user || !user.examId || !user.studyPlan) {
        container.innerHTML = `<div class="card"><p style="color: var(--text-gray);">Gere seu ciclo na aba "Meu Concurso" para ver seu plano de hoje.</p></div>`;
        return;
    }
    
    const today = new Date();
    const dayKeys = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const todayKey = dayKeys[today.getDay()].toUpperCase();
    const weekKey = getWeekKey(0);
    const todayPlan = user.studyPlan[weekKey] || {};

    let html = '';
    let blocksFound = 0;
    
    const times = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    times.forEach(time => {
        const cellKey = `${todayKey}_${time}`;
        const block = todayPlan[cellKey];
        
        if (block) {
            blocksFound++;
            if (block.type === 'anki') {
                const dueAnkiCards = getDueAnkiCards();
                html += `
                    <div class="focus-block anki">
                        <div class="focus-block-header">Bloco de ${time} (${block.duration} min) - REVISÃO ANKI</div>
                        <div class="focus-block-title">Memorização Ativa</div>
                        <div class="focus-block-action"><i>Ação: Revise os cartões de erro/teoria que você criou.</i></div>
                        ${dueAnkiCards.length > 0
                            ? `<button class="btn btn-primary" onclick="startAnkiSession()">⚡ Iniciar Revisão (${dueAnkiCards.length} cartões)</button>`
                            : `<p style="color: var(--text-gray);">✅ Nenhuma revisão Anki pendente!</p>`
                        }
                    </div>
                `;
            } else if (block.type === 'practice') {
                html += `
                    <div class="focus-block">
                        <div class="focus-block-header">Bloco de ${time} (${block.duration} min) - PRÁTICA EXTERNA</div>
                        <div class="focus-block-title">${block.name}</div>
                        <div class="focus-block-topic">${block.topicName}</div>
                        <div class="focus-block-action"><i>Ação: Vá ao seu site de questões e resolva questões deste tópico. Depois, lance seu desempenho.</i></div>
                        <div style="display: flex; gap: 12px;">
                            <button class="btn btn-primary" style="flex: 1;" onclick="startFocusSession(${block.duration}, 'Prática Externa', '${block.name} - ${block.topicName}')">🚀 Iniciar Foco (${block.duration}:00)</button>
                            <button class="btn btn-success" style="flex: 1;" onclick="showPage('desempenho')">📊 Lançar Desempenho</button>
                        </div>
                    </div>
                `;
            }
        }
    });

    if (blocksFound === 0) {
        html = `<div class="card"><p style="color: var(--text-gray);">🎉 Você não tem blocos de estudo agendados para hoje! Ajuste suas horas na aba "Meu Concurso" ou aproveite o dia de folga.</p></div>`;
    }
    container.innerHTML = html;
}

// ============================
// LÓGICA DE REGISTO (V9)
// ============================
function savePerformanceLog() {
    const user = getCurrentUser();
    const subjectId = document.getElementById('logSubject').value;
    const topicId = document.getElementById('logTopic').value;
    const total = parseInt(document.getElementById('logTotal').value);
    const correct = parseInt(document.getElementById('logCorrect').value);

    if (!subjectId || !topicId || isNaN(total) || isNaN(correct)) {
        showToast("Preencha todos os campos corretamente."); 
        return;
    }
    if (correct > total) {
        showToast("Acertos não podem ser maiores que o total."); 
        return;
    }

    if (!user.performance[subjectId]) user.performance[subjectId] = {};
    if (!user.performance[subjectId][topicId]) {
        user.performance[subjectId][topicId] = { total: 0, correct: 0 };
    }

    user.performance[subjectId][topicId].total += total;
    user.performance[subjectId][topicId].correct += correct;
    
    saveStateToLocalStorage();
    showToast("Desempenho salvo! Regenere seu ciclo para atualizar as prioridades.");
    
    document.getElementById('logPerformanceForm').reset();
    populateLogSubjects();
}

function saveAnkiCard() {
    const user = getCurrentUser();
    const subjectId = document.getElementById('addAnkiSubject').value;
    const topicId = document.getElementById('addAnkiTopic').value;
    const front = document.getElementById('cardFront').value.trim();
    const back = document.getElementById('cardBack').value.trim();

    if (!subjectId || !topicId || !front || !back) {
        showToast("Preencha todos os campos."); 
        return;
    }

    const newCard = {
        id: 'card_' + Date.now(),
        subjectId: subjectId,
        topicId: topicId,
        subjectName: examDatabase[user.examId].subjects[subjectId].name,
        topicName: examDatabase[user.examId].subjects[subjectId].topics[topicId].name,
        front: front,
        back: back,
        anki: initializeAnkiCard()
    };

    user.ankiCards.push(newCard);
    saveStateToLocalStorage();
    showToast("Cartão Anki salvo!");
    document.getElementById('addCardForm').reset();
    populateAddCardSubjects();
}

function saveErrorEntry() {
    const user = getCurrentUser();
    const subjectId = document.getElementById('addErrorSubject').value;
    const topicId = document.getElementById('addErrorTopic').value;
    const question = document.getElementById('errorQuestion').value.trim();
    const comment = document.getElementById('errorComment').value.trim();

    if (!subjectId || !topicId || !question || !comment) {
        showToast("Preencha todos os campos."); 
        return;
    }

    const newError = {
        id: 'error_' + Date.now(),
        subjectId: subjectId,
        topicId: topicId,
        subjectName: examDatabase[user.examId].subjects[subjectId].name,
        topicName: examDatabase[user.examId].subjects[subjectId].topics[topicId].name,
        question: question,
        comment: comment,
        dateAdded: new Date().toISOString()
    };

    user.errorNotebook.push(newError);
    saveStateToLocalStorage();
    showToast("Erro salvo no Caderno!");
    document.getElementById('addErrorForm').reset();
    populateAddErrorSubjects();
}

// ============================
// LÓGICA DE REVISÃO ANKI (Corrigida - Sem recursão)
// ============================
function getDueAnkiCards() {
    const user = getCurrentUser();
    if (!user || !user.ankiCards) return [];
    const now = new Date();
    return user.ankiCards.filter(card => {
        if (!card.anki || !card.anki.nextReviewDate) return true;
        return new Date(card.anki.nextReviewDate) <= now;
    });
}

function startAnkiSession() {
    currentAnkiSession = getDueAnkiCards();
    if (currentAnkiSession.length === 0) {
        showToast("Você não tem cartões Anki para revisar hoje! 🎉");
        showPage('dashboard');
        return;
    }
    
    // Embaralhar cartões
    currentAnkiSession.sort(() => Math.random() - 0.5);
    currentAnkiIndex = 0;
    
    // Navegar para a página Anki SEM chamar showPage recursivamente
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById('ankiSessionPage').classList.remove('hidden');
    
    // Atualizar menu ativo
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector('[data-page="anki"]');
    if (activeBtn) activeBtn.classList.add('active');
    
    // Salvar página atual
    const user = getCurrentUser();
    if (user) user.session.currentPage = 'anki';
    
    renderAnkiCard(currentAnkiIndex);
}

function renderAnkiCard(index) {
    if (index >= currentAnkiSession.length) {
        showToast("Sessão Anki concluída! 🎉");
        showPage('dashboard');
        return;
    }
    
    const card = currentAnkiSession[index];
    document.getElementById('ankiCurrent').textContent = index + 1;
    document.getElementById('ankiTotal').textContent = currentAnkiSession.length;
    document.getElementById('ankiTopicName').textContent = `${card.subjectName} > ${card.topicName}`;
    document.getElementById('ankiCardFront').textContent = card.front;
    document.getElementById('ankiCardFront_Back').textContent = card.front;
    document.getElementById('ankiCardBack').textContent = card.back;
    
    document.getElementById('ankiFrontView').classList.remove('hidden');
    document.getElementById('ankiBackView').classList.add('hidden');
}

function handleAnkiCardResponse(quality) {
    const card = currentAnkiSession[currentAnkiIndex];
    card.anki = calculateAnkiReview(card.anki, quality);
    saveStateToLocalStorage();
    
    currentAnkiIndex++;
    if (currentAnkiIndex >= currentAnkiSession.length) {
        showToast("Sessão Anki concluída! 🎉");
        showPage('dashboard');
    } else {
        renderAnkiCard(currentAnkiIndex);
    }
}

// ============================
// PLANO DE ESTUDOS (V8 - Automático)
// ============================
let currentWeekOffset = 0;

function getWeekKey(weekOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + (weekOffset * 7));
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    return `${year}-W${week}`;
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function renderStudyPlan() {
    const user = getCurrentUser();
    if (!user) return;
    
    const weekKey = getWeekKey(currentWeekOffset);
    if (!user.studyPlan) user.studyPlan = {};
    const weekPlanData = user.studyPlan[weekKey] || {};
    
    const tbody = document.getElementById('planTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const times = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    
    times.forEach(time => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.className = 'plan-cell-time';
        timeCell.textContent = time;
        row.appendChild(timeCell);
        
        days.forEach(day => {
            const cell = document.createElement('td');
            const cellKey = `${day}_${time}`;
            const block = weekPlanData[cellKey];
            
            if (block) {
                const blockDiv = document.createElement('div');
                blockDiv.className = 'plan-cell-block';
                if (block.type === 'anki') {
                    blockDiv.classList.add('anki');
                    blockDiv.innerHTML = `<strong>${block.name}</strong> (${block.duration}m)`;
                    blockDiv.onclick = () => startAnkiSession();
                } else {
                    blockDiv.innerHTML = `<strong>${block.name}</strong><br><small>${block.topicName}</small>`;
                    blockDiv.onclick = () => startFocusSession(block.duration, block.name, block.topicName);
                }
                cell.appendChild(blockDiv);
            }
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
}

// ============================
// NAVEGAÇÃO E RENDERIZAÇÃO DE PÁGINAS (Corrigida)
// ============================
function showPage(pageName) {
    // Esconder todas as páginas
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    
    let pageId = pageName + 'Page';
    
    // Correção especial para página Anki - NÃO chamar startAnkiSession aqui
    if (pageName === 'anki') {
        pageId = 'ankiSessionPage';
        // Iniciar sessão apenas se não houver sessão ativa
        if (currentAnkiSession.length === 0 || currentAnkiIndex >= currentAnkiSession.length) {
            startAnkiSession();
            return; // Importante: sair da função aqui
        } else {
            // Se já tem sessão ativa, apenas mostrar a página
            const page = document.getElementById(pageId);
            if (page) page.classList.remove('hidden');
        }
    } else {
        // Para outras páginas, comportamento normal
        const page = document.getElementById(pageId);
        if (page) page.classList.remove('hidden');
    }
    
    // Atualizar menu ativo
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Salvar página atual
    const user = getCurrentUser();
    if (user) user.session.currentPage = pageName;
    
    // Renderizações específicas de página (exceto Anki)
    if (pageName === 'plano') renderStudyPlan();
    else if (pageName === 'perfil') renderProfileDisplay();
    else if (pageName === 'concurso') renderConcursoPage();
    else if (pageName === 'dashboard') renderDailyFocusDashboard();
    else if (pageName === 'desempenho') populateLogSubjects();
    else if (pageName === 'adicionar') populateAddCardSubjects();
    else if (pageName === 'adicionarErro') populateAddErrorSubjects();
    else if (pageName === 'erros') renderErrorNotebookPage();
}

function renderConcursoPage() {
    const user = getCurrentUser();
    if (!user) return;
    
    populateExamSelect();
    
    // Carregar horas diárias
    const dayKeys = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
    dayKeys.forEach(day => {
        const input = document.getElementById(`hours_${day}`);
        if(input) input.value = user.dailyHours[day] || 0;
    });

    const select = document.getElementById('examSelect');
    const info = document.getElementById('currentExamInfo');
    const structureContainer = document.getElementById('examStructureContainer');
    const predictionEl = document.getElementById('cyclePrediction');
    
    if (user.examId) {
        select.value = user.examId;
        const exam = examDatabase[user.examId];
        const cardCount = (user.ankiCards || []).length;
        const errorCount = (user.errorNotebook || []).length;
        if(info) {
            info.textContent = `Concurso: ${exam.name} | Cartões Anki: ${cardCount} | Erros: ${errorCount}`;
        }
        
        let html = '';
        for (const subjectId in exam.subjects) {
            const subject = exam.subjects[subjectId];
            html += `<details style="margin-bottom: 8px;">
                        <summary style="font-weight: 600; cursor: pointer;">${subject.name} (Peso ${subject.weight})</summary>
                        <ul style="margin-left: 20px; margin-top: 8px; font-size: 14px;">`;
            for (const topicId in subject.topics) {
                html += `<li>${subject.topics[topicId].name}</li>`;
            }
            html += `</ul></details>`;
        }
        if(structureContainer) structureContainer.innerHTML = html;
        let totalHours = Object.values(user.dailyHours).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
        calculateConclusionDate(totalHours);
    } else {
        select.value = '';
        if(info) info.textContent = 'Nenhum concurso selecionado';
        if(structureContainer) structureContainer.innerHTML = '<p style="color: var(--text-gray);">Selecione um concurso para ver a estrutura.</p>';
        if(predictionEl) predictionEl.textContent = "";
    }
}

function renderProfileDisplay() {
    const user = getCurrentUser();
    if (!user) return;
    
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileCreated').textContent = new Date(user.created).toLocaleDateString('pt-BR');
}

function populateAllSubjectDropdowns() {
    const user = getCurrentUser();
    if (!user || !user.examId) return;
    
    const exam = examDatabase[user.examId];
    const selects = [
        { id: 'logSubject', default: '<option value="">Selecione a matéria...</option>', useId: true },
        { id: 'addAnkiSubject', default: '<option value="">Selecione a matéria...</option>', useId: true },
        { id: 'addErrorSubject', default: '<option value="">Selecione a matéria...</option>', useId: true }
    ];
    
    selects.forEach(s => {
        const select = document.getElementById(s.id);
        if (select) {
            select.innerHTML = s.default;
            for (const subjectId in exam.subjects) {
                const subject = exam.subjects[subjectId];
                const option = document.createElement('option');
                option.value = s.useId ? subjectId : subject.name;
                option.textContent = subject.name;
                select.appendChild(option);
            }
        }
    });
    
    populateTopics('addAnkiTopic', null);
    populateTopics('logTopic', null);
    populateTopics('addErrorTopic', null);
}

function populateTopics(selectId, subjectId) {
    const user = getCurrentUser();
    const topicSelect = document.getElementById(selectId);
    if (!topicSelect) return;
    
    if (!user || !user.examId || !subjectId || !examDatabase[user.examId].subjects[subjectId]) {
        topicSelect.innerHTML = '<option value="">Selecione a matéria primeiro...</option>';
        topicSelect.disabled = true; 
        return;
    }
    
    const topics = examDatabase[user.examId].subjects[subjectId].topics;
    topicSelect.innerHTML = '<option value="">Selecione o tópico...</option>';
    topicSelect.disabled = false;
    
    for (const topicId in topics) {
        const option = document.createElement('option');
        option.value = topicId;
        option.textContent = topics[topicId].name;
        topicSelect.appendChild(option);
    }
}

function populateLogSubjects() { populateAllSubjectDropdowns(); }
function populateAddCardSubjects() { populateAllSubjectDropdowns(); }
function populateAddErrorSubjects() { populateAllSubjectDropdowns(); }

function populateExamSelect() {
    const select = document.getElementById('examSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione...</option>';
    for (const examId in examDatabase) {
        const option = document.createElement('option');
        option.value = examId;
        option.textContent = examDatabase[examId].name;
        select.appendChild(option);
    }
}

function loadExamSubjectsToUser(examId) {
    const user = getCurrentUser();
    if (!user || !examDatabase[examId]) return;
    
    if (user.examId && user.examId !== examId) {
        if (!confirm('Trocar de concurso? Seu progresso e ciclo de estudos serão focados no novo concurso.')) {
            renderConcursoPage(); 
            return;
        }
    }
    
    user.examId = examId;
    user.studyPlan = {};
    user.performance = {};
    populateAllSubjectDropdowns();
    showToast(`Concurso "${examDatabase[examId].name}" selecionado!`);
    renderConcursoPage();
    renderDailyFocusDashboard();
    saveStateToLocalStorage();
}

// ============================
// NOVAS FUNÇÕES (V9 - Caderno de Erros)
// ============================
function renderErrorNotebookPage() {
    const user = getCurrentUser();
    const container = document.getElementById('notebookContainer');
    if (!container) return;
    
    if (!user || !user.errorNotebook || user.errorNotebook.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray);">Seu caderno de erros está vazio. Adicione erros na aba "➕ Adicionar Erro".</p>';
        return;
    }
    
    const errorsBySubject = {};
    user.errorNotebook.forEach(error => {
        if (!errorsBySubject[error.subjectName]) {
            errorsBySubject[error.subjectName] = [];
        }
        errorsBySubject[error.subjectName].push(error);
    });

    let html = '';
    for (const subjectName in errorsBySubject) {
        html += `<h3 style="margin-top: 16px; margin-bottom: 12px; border-bottom: 2px solid var(--border-gray); padding-bottom: 4px;">${subjectName}</h3>`;
        
        errorsBySubject[subjectName].forEach(error => {
            const date = new Date(error.dateAdded).toLocaleDateString('pt-BR');
            html += `
                <div style="background: var(--bg-light); padding: 12px; border-radius: 6px; margin-bottom: 12px; white-space: pre-wrap;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <p style="font-size: 13px; color: var(--text-gray); font-weight: 500;">${error.topicName}</p>
                        <p style="font-size: 12px; color: var(--text-gray);">${date}</p>
                    </div>
                    <p style="font-weight: 600; margin-bottom: 8px;"><strong>Pergunta:</strong> ${error.question}</p>
                    <p style="font-size: 14px; background: white; padding: 8px; border-radius: 4px; border-left: 3px solid var(--error-red);"><strong>Comentário:</strong> ${error.comment}</p>
                    <button class="btn btn-danger" style="margin-top: 8px; font-size: 12px;" onclick="deleteErrorEntry('${error.id}')">🗑️ Excluir</button>
                </div>
            `;
        });
    }
    container.innerHTML = html;
}

function deleteErrorEntry(errorId) {
    const user = getCurrentUser();
    if (!user || !user.errorNotebook) return;
    
    if (confirm('Tem certeza que deseja excluir este erro?')) {
        user.errorNotebook = user.errorNotebook.filter(error => error.id !== errorId);
        saveStateToLocalStorage();
        renderErrorNotebookPage();
        showToast('Erro excluído do caderno!');
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;
    
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmNewPassword').value;

    if (newPass !== confirmPass) {
        showToast("A nova senha e a confirmação não coincidem."); 
        return;
    }
    if (newPass.length < 4) {
        showToast("A nova senha deve ter pelo menos 4 caracteres."); 
        return;
    }

    showLoading();
    const currentPassHash = await hashPassword(currentPass);
    
    if (currentPassHash !== user.passHash) {
        showToast("A senha atual está incorreta.");
        hideLoading(); 
        return;
    }
    
    user.passHash = await hashPassword(newPass);
    saveStateToLocalStorage();
    hideLoading();
    showToast("Senha alterada com sucesso!");
    document.getElementById('changePasswordForm').reset();
}

function inviteFriends() {
    const message = `Olá! Estou a usar o Aprovação Sem Limites para gerir meus estudos. Peça-me o código de convite para se registar!`;
    navigator.clipboard.writeText(message).then(() => {
        showToast("Mensagem de convite copiada! Lembre-se de enviar o código.");
    }).catch(() => {
        showToast("Erro ao copiar a mensagem.");
    });
}

// ============================
// BACKUP & RESTORE
// ============================
function exportUserData() {
    const user = getCurrentUser();
    if (!user) { 
        showToast('Nenhum usuário logado!'); 
        return; 
    }
    
    const backup = { 
        version: '9.5', 
        exportDate: new Date().toISOString(), 
        userData: user 
    };
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_aprovacao_${user.email}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup do utilizador exportado! 📥');
}

function importUserData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const backup = JSON.parse(e.target.result);
            if (!backup.userData || !backup.version) {
                throw new Error('Arquivo de backup inválido');
            }
            
            if (confirm('Isso vai sobrescrever seus dados para este utilizador. Continuar?')) {
                const userData = backup.userData;
                memoryDB.users[userData.id] = userData;
                memoryDB.currentUserId = userData.id;
                saveStateToLocalStorage();
                initializeApp();
                showToast('Backup restaurado com sucesso! 📤');
            }
        } catch (error) {
            showToast('Erro ao carregar arquivo: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// ============================
// INICIALIZAÇÃO E EVENT LISTENERS
// ============================
document.addEventListener('DOMContentLoaded', () => {
    
    initializeApp();
    
    // ----- Login / Registo -----
    document.querySelectorAll('.login-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            document.getElementById('loginForm').classList.toggle('hidden', tabName !== 'login');
            document.getElementById('registerForm').classList.toggle('hidden', tabName !== 'register');
        });
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault(); 
        showLoading();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const userId = await loginUser(email, password);
        if (userId) { 
            initializeApp(); 
            showToast('Login realizado com sucesso! 🎉'); 
        } else { 
            showToast('Email ou senha incorretos!'); 
        }
        hideLoading();
    });

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        const inviteCode = document.getElementById('registerInviteCode').value;
        
        if (password !== passwordConfirm) { 
            showToast('As senhas não coincidem!'); 
            return; 
        }
        
        // Verificar se email já existe
        for (let uid in memoryDB.users) {
            if (memoryDB.users[uid].email === email) {
                showToast('Email já registrado!'); 
                return;
            }
        }
        
        showLoading();
        const inviteCodeHash = await hashPassword(inviteCode);
        if (inviteCodeHash !== MASTER_INVITE_HASH) {
            showToast('Código de Convite inválido!');
            hideLoading(); 
            return;
        }
        
        const userId = await createUser(name, email, password);
        memoryDB.currentUserId = userId;
        saveStateToLocalStorage();
        initializeApp();
        showToast('Conta criada com sucesso! 🎉');
        hideLoading();
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Deseja sair?')) { 
            logoutUser(); 
            window.location.reload(); 
        }
    });
    
    // ----- Navegação Principal -----
    document.querySelectorAll('.menu-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => showPage(btn.dataset.page));
    });
    
    // ----- Cronómetro Global -----
    document.getElementById('playBtn').addEventListener('click', startTimer);
    document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
    
    // ----- Página "Meu Concurso" -----
    populateExamSelect();
    document.getElementById('examSelect').addEventListener('change', (e) => {
        if (e.target.value) loadExamSubjectsToUser(e.target.value);
    });
    document.getElementById('generateCycleBtn').addEventListener('click', generateMasterStudyCycle);

    // ----- Página "Lançar Desempenho" -----
    document.getElementById('logSubject').addEventListener('change', (e) => {
        populateTopics('logTopic', e.target.value);
    });
    document.getElementById('logPerformanceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        savePerformanceLog();
    });

    // ----- Página "Adicionar Cartão Anki" -----
    document.getElementById('addAnkiSubject').addEventListener('change', (e) => {
        populateTopics('addAnkiTopic', e.target.value);
    });
    document.getElementById('addCardForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveAnkiCard();
    });
    
    // ----- Página "Adicionar Erro" -----
    document.getElementById('addErrorSubject').addEventListener('change', (e) => {
        populateTopics('addErrorTopic', e.target.value);
    });
    document.getElementById('addErrorForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveErrorEntry();
    });

    // ----- Página "Revisão Anki" -----
    document.getElementById('showAnkiBackBtn').addEventListener('click', () => {
        document.getElementById('ankiFrontView').classList.add('hidden');
        document.getElementById('ankiBackView').classList.remove('hidden');
    });
    
    document.getElementById('ankiRatingButtons').addEventListener('click', (e) => {
        const btn = e.target.closest('.anki-btn');
        if (btn) handleAnkiCardResponse(parseInt(btn.dataset.quality));
    });
    
    // ----- Página "Perfil" -----
    document.getElementById('exportDataBtn').addEventListener('click', exportUserData);
    document.getElementById('importDataBtn').addEventListener('click', () => {
        document.getElementById('importFileInput').click();
    });
    document.getElementById('importFileInput').addEventListener('change', (e) => {
        if (e.target.files[0]) importUserData(e.target.files[0]);
    });
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    document.getElementById('inviteBtn').addEventListener('click', inviteFriends);

});

/**
 * Função de inicialização principal
 */
function initializeApp() {
    showLoading();
    const success = loadStateFromLocalStorage();
    const lastUser = memoryDB.currentUserId;
    
    if (success && lastUser && memoryDB.users[lastUser]) {
        // Restaurar sessão
        const user = getCurrentUser();
        initializeUserProperties(user);
        
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        
        document.getElementById('userName').textContent = user.name;
        
        if (user.examId) {
            populateAllSubjectDropdowns();
        }

        const lastPage = user.session.currentPage || 'dashboard';
        showPage(lastPage);
        updateTimerDisplay();
        
        // Iniciar timer se estava rodando
        if (user.session.lastTimerStartTime) {
            startTimer();
        }
    } else {
        // Ecrã de login
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
    }
    hideLoading();
}

// Salva o estado antes de fechar o separador
window.addEventListener('beforeunload', () => {
    const user = getCurrentUser();
    if (user) {
        pauseTimer();
        user.session.lastAction = new Date().toISOString();
        saveStateToLocalStorage();
    }
});
