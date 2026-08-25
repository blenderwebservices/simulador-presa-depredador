import { presets } from './presets.js';

// Application State
const state = {
    model: 'linear', // 'linear' or 'lotka-volterra'
    params: {
        // Linear Model
        a11: 0.5,
        a12: 0.1,
        a21: 0.1,
        a22: 0.15,
        initX1: 1.0,
        initX2: 1.0,
        
        // Lotka-Volterra
        initP: 100,
        initD: 10,
        r1: 0.005,
        a1: 0.0001,
        a2: 0.0001,
        r2: 0.015,
        
        // General
        time: 100
    },
    importedData: null
};

const wizardState = {
    currentStep: 1,
    maxStepReached: 1
};

const stepInfo = {
    1: {
        title: "Selección de Modelo",
        desc: "Elige el tipo de modelo matemático en el cual basar la simulación."
    },
    2: {
        title: "Escenarios Preestablecidos",
        desc: "Selecciona una plantilla de escenario configurada para ver dinámicas específicas."
    },
    3: {
        title: "Ajuste de Parámetros",
        desc: "Configura detalladamente los coeficientes, poblaciones iniciales y horizontes temporales."
    },
    4: {
        title: "Simulación y Resultados",
        desc: "Visualiza los gráficos temporales, retratos de fase, estabilidad y análisis conceptual."
    },
    5: {
        title: "Resumen Final",
        desc: "Revisa la conclusión final del sistema y decide los siguientes pasos."
    }
};

// Chart instances
let timeChart = null;
let phaseChart = null;

// DOM Elements
const elements = {
    // Model Selection Cards
    tabLinear: document.getElementById('btn-select-linear'),
    tabLv: document.getElementById('btn-select-lv'),
    
    // Parameter sections
    linearParams: document.getElementById('linear-params'),
    lvParams: document.getElementById('lv-params'),
    
    // Inputs: Linear
    matrixA11: document.getElementById('matrix-a11'),
    matrixA12: document.getElementById('matrix-a12'),
    matrixA21: document.getElementById('matrix-a21'),
    matrixA22: document.getElementById('matrix-a22'),
    initX1: document.getElementById('init-x1'),
    initX2: document.getElementById('init-x2'),
    
    // Inputs: Lotka-Volterra
    lvInitP: document.getElementById('lv-init-p'),
    lvInitD: document.getElementById('lv-init-d'),
    lvR1: document.getElementById('lv-r1'),
    lvA1: document.getElementById('lv-a1'),
    lvA2: document.getElementById('lv-a2'),
    lvR2: document.getElementById('lv-r2'),
    
    // Inputs: General
    simTime: document.getElementById('sim-time'),
    
    // Labels for value display
    valInitX1: document.getElementById('val-init-x1'),
    valInitX2: document.getElementById('val-init-x2'),
    valLvInitP: document.getElementById('val-lv-init-p'),
    valLvInitD: document.getElementById('val-lv-init-d'),
    valLvR1: document.getElementById('val-lv-r1'),
    valLvA1: document.getElementById('val-lv-a1'),
    valLvA2: document.getElementById('val-lv-a2'),
    valLvR2: document.getElementById('val-lv-r2'),
    valSimTime: document.getElementById('val-sim-time'),
    
    // Presets
    presetsContainer: document.getElementById('presets-container'),
    
    // Metrics
    lblPrey: document.getElementById('lbl-prey'),
    lblPredator: document.getElementById('lbl-predator'),
    valMetricPrey: document.getElementById('val-metric-prey'),
    valMetricPredator: document.getElementById('val-metric-predator'),
    valMetricStability: document.getElementById('val-metric-stability'),
    
    // Math & Details
    mathEquations: document.getElementById('math-equations'),
    stabilityBadge: document.getElementById('stability-badge'),
    eig1: document.getElementById('eig-1'),
    eig2: document.getElementById('eig-2'),
    
    // File actions
    fileImport: document.getElementById('file-import'),
    btnExport: document.getElementById('btn-export'),
    btnRecalculate: document.getElementById('btn-recalculate'),
    
    // Philosophy Elements
    philosophyPlasticity: document.getElementById('philosophy-plasticity'),
    philosophyIdeology: document.getElementById('philosophy-ideology'),
    philosophyParasitoidism: document.getElementById('philosophy-parasitoidism'),

    // Wizard Navigation Elements
    prevStepBtn: document.getElementById('prev-step-btn'),
    nextStepBtn: document.getElementById('next-step-btn'),
    stepTitleText: document.getElementById('step-title-text'),
    stepDescText: document.getElementById('step-desc-text'),
    skipPresetsBtn: document.getElementById('skip-presets-btn'),
    btnExportPdf: document.getElementById('btn-export-pdf'),
    btnGotoSummary: document.getElementById('btn-goto-summary'),
    simulationLoadingScreen: document.getElementById('simulation-loading-screen'),
    simulationResultsContainer: document.getElementById('simulation-results-container'),
    loadingMsg: document.getElementById('loading-msg'),
    
    // Summary Step
    finalSummaryModel: document.getElementById('final-summary-model'),
    finalSummaryStability: document.getElementById('final-summary-stability'),
    finalSummaryPreyLbl: document.getElementById('final-summary-prey-lbl'),
    finalSummaryPreyVal: document.getElementById('final-summary-prey-val'),
    finalSummaryPredLbl: document.getElementById('final-summary-pred-lbl'),
    finalSummaryPredVal: document.getElementById('final-summary-pred-val'),
    finalSummaryParams: document.getElementById('final-summary-params'),
    btnRepeatSim: document.getElementById('btn-repeat-sim'),
    btnRestartSim: document.getElementById('btn-restart-sim'),
    
    // Sidebar Summary
    sideModelName: document.getElementById('side-model-name'),
    sideSimulationState: document.getElementById('side-simulation-state'),
    sideParamsList: document.getElementById('side-params-list'),
    sideResultsList: document.getElementById('side-results-list'),
    
    // Landing Page Elements
    landingPage: document.getElementById('landing-page'),
    simulationApp: document.getElementById('simulation-app'),
    btnBackToLanding: document.getElementById('btn-back-to-landing')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    initPresets();
    setupEventListeners();
    setupWizardListeners();
    initLandingListeners();
    initHeroCanvas();
    goToStep(1);
});

// Setup Presets in UI (filtered by model)
function initPresets() {
    elements.presetsContainer.innerHTML = '';
    const filteredPresets = presets.filter(preset => preset.model === state.model);
    filteredPresets.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'preset-card';
        btn.id = preset.id;
        btn.innerHTML = `<span style="font-weight:600; font-size:0.95rem; display:block; margin-bottom:0.25rem;">${preset.name}</span>`;
        btn.title = preset.description;
        btn.addEventListener('click', () => loadPreset(preset));
        elements.presetsContainer.appendChild(btn);
    });
}

// Load Preset Data
function loadPreset(preset) {
    document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
    const pCard = document.getElementById(preset.id);
    if (pCard) pCard.classList.add('active');

    state.model = preset.model;
    
    // Load model-specific params
    if (preset.model === 'linear') {
        state.params.a11 = preset.params.a11;
        state.params.a12 = preset.params.a12;
        state.params.a21 = preset.params.a21;
        state.params.a22 = preset.params.a22;
        state.params.initX1 = preset.params.initX1;
        state.params.initX2 = preset.params.initX2;
    } else {
        state.params.initP = preset.params.initP;
        state.params.initD = preset.params.initD;
        state.params.r1 = preset.params.r1;
        state.params.a1 = preset.params.a1;
        state.params.a2 = preset.params.a2;
        state.params.r2 = preset.params.r2;
    }
    state.params.time = preset.params.time;
    
    // Update inputs and tabs UI
    updateUIFromState();
    goToStep(3); // Advance to parameters
}

// Bind event listeners to DOM controls
function setupEventListeners() {
    // Input changes: Linear
    const linearInputs = [elements.matrixA11, elements.matrixA12, elements.matrixA21, elements.matrixA22];
    linearInputs.forEach(input => {
        input.addEventListener('input', () => {
            state.params.a11 = parseFloat(elements.matrixA11.value) || 0;
            state.params.a12 = parseFloat(elements.matrixA12.value) || 0;
            state.params.a21 = parseFloat(elements.matrixA21.value) || 0;
            state.params.a22 = parseFloat(elements.matrixA22.value) || 0;
            updateMathCard();
        });
    });

    elements.initX1.addEventListener('input', (e) => {
        state.params.initX1 = parseFloat(e.target.value);
        elements.valInitX1.textContent = state.params.initX1 % 1 === 0 ? state.params.initX1.toLocaleString() : state.params.initX1.toFixed(1);
        updateMathCard();
    });
    elements.initX2.addEventListener('input', (e) => {
        state.params.initX2 = parseFloat(e.target.value);
        elements.valInitX2.textContent = state.params.initX2 % 1 === 0 ? state.params.initX2.toLocaleString() : state.params.initX2.toFixed(1);
        updateMathCard();
    });

    // Input changes: Lotka-Volterra
    elements.lvInitP.addEventListener('input', (e) => {
        state.params.initP = parseFloat(e.target.value);
        elements.valLvInitP.textContent = state.params.initP;
        updateMathCard();
    });
    elements.lvInitD.addEventListener('input', (e) => {
        state.params.initD = parseFloat(e.target.value);
        elements.valLvInitD.textContent = state.params.initD;
        updateMathCard();
    });
    elements.lvR1.addEventListener('input', (e) => {
        state.params.r1 = parseFloat(e.target.value);
        elements.valLvR1.textContent = state.params.r1.toFixed(4);
        updateMathCard();
    });
    elements.lvA1.addEventListener('input', (e) => {
        state.params.a1 = parseFloat(e.target.value);
        elements.valLvA1.textContent = state.params.a1.toFixed(5);
        updateMathCard();
    });
    elements.lvA2.addEventListener('input', (e) => {
        state.params.a2 = parseFloat(e.target.value);
        elements.valLvA2.textContent = state.params.a2.toFixed(5);
        updateMathCard();
    });
    elements.lvR2.addEventListener('input', (e) => {
        state.params.r2 = parseFloat(e.target.value);
        elements.valLvR2.textContent = state.params.r2.toFixed(4);
        updateMathCard();
    });

    // Time Input
    elements.simTime.addEventListener('input', (e) => {
        state.params.time = parseInt(e.target.value);
        elements.valSimTime.textContent = state.params.time;
        updateMathCard();
    });

    // Recalculate and trigger loading animation
    elements.btnRecalculate.addEventListener('click', () => {
        goToStep(4);
        elements.simulationLoadingScreen.style.display = 'flex';
        elements.simulationResultsContainer.style.display = 'none';
        
        const messages = [
            "Aplicando Runge-Kutta de 4.º Orden...",
            "Calculando matriz de coeficientes...",
            "Analizando autovalores del Jacobiano...",
            "Evaluando estabilidad del punto fijo...",
            "Generando órbitas en espacio fase..."
        ];
        let msgIndex = 0;
        elements.loadingMsg.textContent = messages[0];
        
        const intervalId = setInterval(() => {
            msgIndex = (msgIndex + 1) % messages.length;
            elements.loadingMsg.textContent = messages[msgIndex];
        }, 350);
        
        setTimeout(() => {
            clearInterval(intervalId);
            runSimulation();
            elements.simulationLoadingScreen.style.display = 'none';
            elements.simulationResultsContainer.style.display = 'block';
            
            wizardState.maxStepReached = 5;
            elements.nextStepBtn.disabled = false;
            updateSidebarSummary();
        }, 1800);
    });

    // CSV Import / Export
    elements.fileImport.addEventListener('change', handleFileImport);
    elements.btnExport.addEventListener('click', handleExport);
}

// Wizard controller and navigation
function setupWizardListeners() {
    // Model Selection Buttons
    document.getElementById('btn-select-linear').addEventListener('click', () => {
        switchModel('linear');
        goToStep(2);
    });
    document.getElementById('btn-select-lv').addEventListener('click', () => {
        switchModel('lotka-volterra');
        goToStep(2);
    });

    // Skip presets card
    elements.skipPresetsBtn.addEventListener('click', () => {
        goToStep(3);
    });

    // Timeline step clicking (can jump to unlocked steps)
    document.querySelectorAll('.timeline-step').forEach(stepNode => {
        stepNode.addEventListener('click', () => {
            const stepNum = parseInt(stepNode.getAttribute('data-step'));
            if (stepNum <= wizardState.maxStepReached) {
                goToStep(stepNum);
            }
        });
    });

    // Navigation arrows
    elements.prevStepBtn.addEventListener('click', () => {
        if (wizardState.currentStep > 1) {
            goToStep(wizardState.currentStep - 1);
        }
    });
    elements.nextStepBtn.addEventListener('click', () => {
        if (wizardState.currentStep < wizardState.maxStepReached) {
            goToStep(wizardState.currentStep + 1);
        }
    });

    // Results panel CTA to Summary
    elements.btnGotoSummary.addEventListener('click', () => {
        goToStep(5);
    });

    // Restart and repeat simulation buttons in Summary
    elements.btnRepeatSim.addEventListener('click', () => {
        goToStep(3);
    });
    elements.btnRestartSim.addEventListener('click', () => {
        wizardState.maxStepReached = 1;
        state.results = null;
        goToStep(1);
    });

    // PDF Report Generator button
    elements.btnExportPdf.addEventListener('click', () => {
        exportToPDF();
    });
}

function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > 5) return;
    
    // Toggle wizard steps views
    for (let i = 1; i <= 5; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        if (stepEl) {
            if (i === stepNum) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        }
    }
    
    // Update timeline nodes
    document.querySelectorAll('.timeline-step').forEach(stepNode => {
        const s = parseInt(stepNode.getAttribute('data-step'));
        if (s === stepNum) {
            stepNode.classList.add('active');
            stepNode.classList.remove('completed');
        } else if (s < stepNum) {
            stepNode.classList.add('completed');
            stepNode.classList.remove('active');
        } else {
            stepNode.classList.remove('active', 'completed');
        }
    });
    
    wizardState.currentStep = stepNum;
    if (stepNum > wizardState.maxStepReached) {
        wizardState.maxStepReached = stepNum;
    }
    
    // Set headers
    elements.stepTitleText.textContent = stepInfo[stepNum].title;
    elements.stepDescText.textContent = stepInfo[stepNum].desc;
    
    // Manage nav arrow buttons
    elements.prevStepBtn.disabled = (stepNum === 1);
    elements.nextStepBtn.disabled = (stepNum >= wizardState.maxStepReached || stepNum === 4 || stepNum === 5);
    
    // Sync sidebar summary UI
    updateSidebarSummary();
    
    // Step specific loads
    if (stepNum === 2) {
        initPresets();
    } else if (stepNum === 4) {
        if (state.results) {
            elements.simulationLoadingScreen.style.display = 'none';
            elements.simulationResultsContainer.style.display = 'block';
        }
    } else if (stepNum === 5) {
        renderFinalSummary();
    }
}

function updateSidebarSummary() {
    if (!elements.sideModelName) return; // safety
    
    // 1. Model Name Badge
    if (state.model === 'linear') {
        elements.sideModelName.textContent = "Sistema Lineal (Social)";
        elements.sideModelName.style.background = "rgba(6, 182, 212, 0.1)";
        elements.sideModelName.style.borderColor = "rgba(6, 182, 212, 0.25)";
        elements.sideModelName.style.color = "var(--color-prey)";
    } else {
        elements.sideModelName.textContent = "Lotka-Volterra (Biológico)";
        elements.sideModelName.style.background = "rgba(244, 63, 94, 0.1)";
        elements.sideModelName.style.borderColor = "rgba(244, 63, 94, 0.25)";
        elements.sideModelName.style.color = "var(--color-predator)";
    }
    
    // 2. Simulator State Text
    if (wizardState.currentStep === 1) {
        elements.sideSimulationState.textContent = "Seleccionando modelo...";
    } else if (wizardState.currentStep === 2) {
        elements.sideSimulationState.textContent = "Seleccionando escenario...";
    } else if (wizardState.currentStep === 3) {
        elements.sideSimulationState.textContent = "Configurando variables...";
    } else if (wizardState.currentStep === 4) {
        if (elements.simulationLoadingScreen.style.display === 'flex') {
            elements.sideSimulationState.textContent = "Resolviendo ecuaciones...";
        } else {
            elements.sideSimulationState.textContent = "Simulación completada.";
        }
    } else if (wizardState.currentStep === 5) {
        elements.sideSimulationState.textContent = "Resultados analizados.";
    }
    
    // 3. Current parameters key-value list
    elements.sideParamsList.innerHTML = '';
    if (state.model === 'linear') {
        elements.sideParamsList.appendChild(createSidebarItem("a11 (Presa)", state.params.a11.toFixed(3)));
        elements.sideParamsList.appendChild(createSidebarItem("a12 (Impacto)", state.params.a12.toFixed(3)));
        elements.sideParamsList.appendChild(createSidebarItem("a21 (Impacto)", state.params.a21.toFixed(3)));
        elements.sideParamsList.appendChild(createSidebarItem("a22 (Radical)", state.params.a22.toFixed(3)));
        elements.sideParamsList.appendChild(createSidebarItem("x1(0)", state.params.initX1.toLocaleString()));
        elements.sideParamsList.appendChild(createSidebarItem("x2(0)", state.params.initX2.toLocaleString()));
    } else {
        elements.sideParamsList.appendChild(createSidebarItem("P0 (Presas)", state.params.initP));
        elements.sideParamsList.appendChild(createSidebarItem("D0 (Depred.)", state.params.initD));
        elements.sideParamsList.appendChild(createSidebarItem("r1 (Crec.)", state.params.r1.toFixed(4)));
        elements.sideParamsList.appendChild(createSidebarItem("a1 (Caza)", state.params.a1.toFixed(5)));
        elements.sideParamsList.appendChild(createSidebarItem("a2 (Reprod.)", state.params.a2.toFixed(5)));
        elements.sideParamsList.appendChild(createSidebarItem("r2 (Mortal.)", state.params.r2.toFixed(4)));
    }
    elements.sideParamsList.appendChild(createSidebarItem("Tiempo", `${state.params.time} años`));
    
    // 4. Live Results / Stability
    elements.sideResultsList.innerHTML = '';
    if (state.results && state.results.prey && state.results.prey.length > 0) {
        const finalPrey = state.results.prey[state.results.prey.length - 1];
        const finalPred = state.results.predator[state.results.predator.length - 1];
        
        elements.sideResultsList.appendChild(createSidebarItem("Estabilidad", elements.valMetricStability.textContent));
        elements.sideResultsList.appendChild(createSidebarItem("Final Presa", formatValue(finalPrey)));
        elements.sideResultsList.appendChild(createSidebarItem("Final Pred.", formatValue(finalPred)));
    } else {
        elements.sideResultsList.innerHTML = `<span class="text-muted font-sm">Pendiente de simular</span>`;
    }
}

function createSidebarItem(label, val) {
    const div = document.createElement('div');
    div.className = 'sidebar-item';
    div.innerHTML = `<span class="lbl">${label}:</span> <span class="val">${val}</span>`;
    return div;
}

function renderFinalSummary() {
    elements.finalSummaryModel.textContent = state.model === 'linear' ? "Sistema Lineal (Social)" : "Lotka-Volterra (Biológico)";
    elements.finalSummaryStability.textContent = elements.stabilityBadge.textContent;
    
    if (state.model === 'linear') {
        elements.finalSummaryPreyLbl.textContent = "Población Pasiva Final (x1):";
        elements.finalSummaryPredLbl.textContent = "Población Radical Final (x2):";
    } else {
        elements.finalSummaryPreyLbl.textContent = "Población Presas Final (P):";
        elements.finalSummaryPredLbl.textContent = "Población Depredadores Final (D):";
    }
    
    if (state.results && state.results.prey) {
        const finalPrey = state.results.prey[state.results.prey.length - 1];
        const finalPred = state.results.predator[state.results.predator.length - 1];
        elements.finalSummaryPreyVal.textContent = formatValue(finalPrey);
        elements.finalSummaryPredVal.textContent = formatValue(finalPred);
    }
    
    const paramsDiv = elements.finalSummaryParams;
    paramsDiv.innerHTML = '';
    const addParamSummary = (name, val) => {
        const d = document.createElement('div');
        d.innerHTML = `<span style="color: var(--color-text-secondary); margin-right: 0.5rem;">${name}:</span><strong>${val}</strong>`;
        paramsDiv.appendChild(d);
    };
    
    if (state.model === 'linear') {
        addParamSummary("a11", state.params.a11.toFixed(3));
        addParamSummary("a12", state.params.a12.toFixed(3));
        addParamSummary("a21", state.params.a21.toFixed(3));
        addParamSummary("a22", state.params.a22.toFixed(3));
        addParamSummary("x1(0)", state.params.initX1);
        addParamSummary("x2(0)", state.params.initX2);
    } else {
        addParamSummary("P0", state.params.initP);
        addParamSummary("D0", state.params.initD);
        addParamSummary("r1", state.params.r1.toFixed(4));
        addParamSummary("a1", state.params.a1.toFixed(5));
        addParamSummary("a2", state.params.a2.toFixed(5));
        addParamSummary("r2", state.params.r2.toFixed(4));
    }
    addParamSummary("Tiempo", `${state.params.time} años`);
}

// Generate premium report in PDF using jsPDF
function exportToPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Brand Identity colors
        const primaryColor = [139, 92, 246]; // Purple
        const secondaryColor = [6, 182, 212]; // Cyan
        const darkColor = [8, 9, 13]; // Near black
        const textMuted = [100, 116, 139]; // Muted grey
        
        // Header Banner
        doc.setFillColor(...darkColor);
        doc.rect(0, 0, 210, 35, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("Simulación Depredador-Presa", 15, 18);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Reporte Científico & Biofilosófico", 15, 25);
        doc.text(new Date().toLocaleString(), 145, 25);
        
        // Line break
        let posY = 45;
        
        // Section: Configuración
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text("1. Configuración del Modelo", 15, posY);
        posY += 8;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const modelName = state.model === 'linear' ? "Sistema Lineal (Social)" : "Lotka-Volterra (Biológico)";
        doc.text(`Modelo seleccionado: ${modelName}`, 15, posY);
        posY += 8;
        
        // Parameters Table
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...textMuted);
        doc.text("Parámetro", 15, posY);
        doc.text("Valor", 85, posY);
        doc.text("Parámetro", 115, posY);
        doc.text("Valor", 185, posY);
        posY += 4;
        
        doc.setDrawColor(220, 220, 220);
        doc.line(15, posY, 195, posY);
        posY += 6;
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        
        const paramsList = [];
        if (state.model === 'linear') {
            paramsList.push(["a11 (Auto-crec. Presa)", state.params.a11]);
            paramsList.push(["a12 (Impacto Pred. en Presa)", state.params.a12]);
            paramsList.push(["a21 (Impacto Presa en Pred.)", state.params.a21]);
            paramsList.push(["a22 (Auto-crec. Pred.)", state.params.a22]);
            paramsList.push(["x1(0) (Pasiva Inicial)", state.params.initX1]);
            paramsList.push(["x2(0) (Radical Inicial)", state.params.initX2]);
        } else {
            paramsList.push(["P0 (Presas Iniciales)", state.params.initP]);
            paramsList.push(["D0 (Depredadores Iniciales)", state.params.initD]);
            paramsList.push(["r1 (Crecimiento Presas)", state.params.r1]);
            paramsList.push(["a1 (Éxito Caza Pred.)", state.params.a1]);
            paramsList.push(["a2 (Eficiencia Reprod.)", state.params.a2]);
            paramsList.push(["r2 (Mortalidad Pred.)", state.params.r2]);
        }
        paramsList.push(["Horizonte Tiempo", `${state.params.time} años`]);
        
        for (let i = 0; i < paramsList.length; i += 2) {
            const p1 = paramsList[i];
            const p2 = paramsList[i + 1] || ["", ""];
            doc.text(`${p1[0]}:`, 15, posY);
            doc.text(String(p1[1]), 85, posY);
            if (p2[0]) {
                doc.text(`${p2[0]}:`, 115, posY);
                doc.text(String(p2[1]), 185, posY);
            }
            posY += 6;
        }
        
        posY += 6;
        
        // Section: Análisis y Estabilidad
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text("2. Análisis de Estabilidad y Autovalores", 15, posY);
        posY += 8;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const stabilityStr = elements.stabilityBadge.textContent;
        const finalPreyStr = elements.valMetricPrey.textContent;
        const finalPredStr = elements.valMetricPredator.textContent;
        
        doc.text(`Clasificación del punto fijo: ${stabilityStr}`, 15, posY);
        posY += 6;
        doc.text(`Autovalor lambda_1: ${elements.eig1.textContent}`, 15, posY);
        doc.text(`Autovalor lambda_2: ${elements.eig2.textContent}`, 115, posY);
        posY += 6;
        doc.text(`Población Pasiva/Presa Final: ${finalPreyStr}`, 15, posY);
        doc.text(`Población Radical/Depredador Final: ${finalPredStr}`, 115, posY);
        posY += 10;
        
        // Section: Gráficos
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text("3. Gráficas de Simulación", 15, posY);
        posY += 6;
        
        // Add charts side by side
        if (timeChart && phaseChart) {
            const timeChartImg = timeChart.toBase64Image();
            const phaseChartImg = phaseChart.toBase64Image();
            
            doc.addImage(timeChartImg, 'PNG', 15, posY, 85, 55);
            doc.addImage(phaseChartImg, 'PNG', 110, posY, 85, 55);
            posY += 65;
        }
        
        // Check overflow for page 2
        if (posY > 210) {
            doc.addPage();
            posY = 20;
        }
        
        // Section: Contexto Biofilosófico
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text("4. Análisis Biofilosófico", 15, posY);
        posY += 8;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("Plasticidad Neuronal (Mahner & Bunge)", 15, posY);
        posY += 5;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const plasticText = elements.philosophyPlasticity.innerText || elements.philosophyPlasticity.textContent;
        const splitPlastic = doc.splitTextToSize(plasticText, 180);
        doc.text(splitPlastic, 15, posY);
        posY += (splitPlastic.length * 4) + 6;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Ideología Radical y Coerción Territorial", 15, posY);
        posY += 5;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const ideoText = elements.philosophyIdeology.innerText || elements.philosophyIdeology.textContent;
        const splitIdeo = doc.splitTextToSize(ideoText, 180);
        doc.text(splitIdeo, 15, posY);
        posY += (splitIdeo.length * 4) + 6;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Parasitoidismo Social", 15, posY);
        posY += 5;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const parasText = elements.philosophyParasitoidism.innerText || elements.philosophyParasitoidism.textContent;
        const splitParas = doc.splitTextToSize(parasText, 180);
        doc.text(splitParas, 15, posY);
        posY += (splitParas.length * 4) + 6;
        
        // Footer (Page numbers)
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(...textMuted);
            doc.text(`Página ${i} de ${totalPages}`, 95, 287);
        }
        
        doc.save(`reporte_simulacion_${state.model}_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
        alert("Error al generar PDF: " + err.message);
        console.error(err);
    }
}

// Switch model types
function switchModel(modelName) {
    state.model = modelName;
    updateUIFromState();
    initPresets();
}

// Update variables and sidebar in real-time
function updateMathCard() {
    updateSidebarSummary();
}

// Sync UI inputs with the current state object
function updateUIFromState() {
    if (state.model === 'linear') {
        elements.tabLinear.classList.add('active');
        elements.tabLv.classList.remove('active');
        elements.linearParams.classList.add('active');
        elements.lvParams.classList.remove('active');
        
        // Metrics Label
        elements.lblPrey.textContent = "Población Pasiva Final (x1)";
        elements.lblPredator.textContent = "Población Radical Final (x2)";
        
        // Inputs
        elements.matrixA11.value = state.params.a11;
        elements.matrixA12.value = state.params.a12;
        elements.matrixA21.value = state.params.a21;
        elements.matrixA22.value = state.params.a22;
        elements.initX1.value = state.params.initX1;
        elements.valInitX1.textContent = state.params.initX1 % 1 === 0 ? state.params.initX1.toLocaleString() : state.params.initX1.toFixed(1);
        elements.initX2.value = state.params.initX2;
        elements.valInitX2.textContent = state.params.initX2 % 1 === 0 ? state.params.initX2.toLocaleString() : state.params.initX2.toFixed(1);

    } else {
        elements.tabLinear.classList.remove('active');
        elements.tabLv.classList.add('active');
        elements.linearParams.classList.remove('active');
        elements.lvParams.classList.add('active');
        
        // Metrics Label
        elements.lblPrey.textContent = "Población de Presas Final (P)";
        elements.lblPredator.textContent = "Población de Depredadores Final (D)";
        
        // Inputs
        elements.lvInitP.value = state.params.initP;
        elements.valLvInitP.textContent = state.params.initP;
        elements.lvInitD.value = state.params.initD;
        elements.valLvInitD.textContent = state.params.initD;
        elements.lvR1.value = state.params.r1;
        elements.valLvR1.textContent = state.params.r1.toFixed(4);
        elements.lvA1.value = state.params.a1;
        elements.valLvA1.textContent = state.params.a1.toFixed(5);
        elements.lvA2.value = state.params.a2;
        elements.valLvA2.textContent = state.params.a2.toFixed(5);
        elements.lvR2.value = state.params.r2;
        elements.valLvR2.textContent = state.params.r2.toFixed(4);
    }
    
    elements.simTime.value = state.params.time;
    elements.valSimTime.textContent = state.params.time;
}

// Init Chart.js Graphs
function initCharts() {
    const ctxTime = document.getElementById('timeChart').getContext('2d');
    timeChart = new Chart(ctxTime, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Población Pasiva / Presa',
                    data: [],
                    borderColor: '#0891b2',
                    backgroundColor: 'rgba(8, 145, 178, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    label: 'Población Radical / Depredador',
                    data: [],
                    borderColor: '#e11d48',
                    backgroundColor: 'rgba(225, 29, 72, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    label: 'Estadísticas Importadas (Presa/Pasiva)',
                    data: [],
                    borderColor: 'rgba(8, 145, 178, 0.4)',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 1,
                    hidden: true
                },
                {
                    label: 'Estadísticas Importadas (Dep/Radical)',
                    data: [],
                    borderColor: 'rgba(225, 29, 72, 0.4)',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 1,
                    hidden: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#334155', font: { family: 'Inter', size: 11 } }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(15, 23, 42, 0.05)' },
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    title: { display: true, text: 'Tiempo (Años)', color: '#64748b' }
                },
                y: {
                    grid: { color: 'rgba(15, 23, 42, 0.05)' },
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    title: { display: true, text: 'Población', color: '#64748b' }
                }
            }
        }
    });

    const ctxPhase = document.getElementById('phaseChart').getContext('2d');
    phaseChart = new Chart(ctxPhase, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Órbita en Espacio Fase',
                data: [],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.3)',
                borderWidth: 2,
                showLine: true,
                tension: 0.1,
                pointRadius: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(15, 23, 42, 0.05)' },
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    title: { display: true, text: 'Población Pasiva / Presas', color: '#64748b' }
                },
                y: {
                    grid: { color: 'rgba(15, 23, 42, 0.05)' },
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    title: { display: true, text: 'Población Radical / Depredadores', color: '#64748b' }
                }
            }
        }
    });
}

// Numerical Integration RK4
function runSimulation() {
    // Explicitly sync all parameters from the DOM elements
    if (state.model === 'linear') {
        state.params.a11 = parseFloat(elements.matrixA11.value) || 0;
        state.params.a12 = parseFloat(elements.matrixA12.value) || 0;
        state.params.a21 = parseFloat(elements.matrixA21.value) || 0;
        state.params.a22 = parseFloat(elements.matrixA22.value) || 0;
        state.params.initX1 = parseFloat(elements.initX1.value) || 0;
        state.params.initX2 = parseFloat(elements.initX2.value) || 0;
    } else {
        state.params.initP = parseFloat(elements.lvInitP.value) || 0;
        state.params.initD = parseFloat(elements.lvInitD.value) || 0;
        state.params.r1 = parseFloat(elements.lvR1.value) || 0;
        state.params.a1 = parseFloat(elements.lvA1.value) || 0;
        state.params.a2 = parseFloat(elements.lvA2.value) || 0;
        state.params.r2 = parseFloat(elements.lvR2.value) || 0;
    }
    state.params.time = parseInt(elements.simTime.value) || 100;

    const tMax = state.params.time;
    const timeArr = [];
    const preyArr = [];
    const predatorArr = [];
    const phasePoints = [];
    
    if (state.model === 'linear') {
        const a11 = state.params.a11;
        const a12 = state.params.a12;
        const a21 = state.params.a21;
        const a22 = state.params.a22;
        const initX1 = state.params.initX1;
        const initX2 = state.params.initX2;
        
        // Analytical solver for calculations display
        calculateLinearStability(a11, a12, a21, a22, initX1, initX2);

        // Simulation by RK4 for linear equations:
        // dx1/dt = a11*x1 + a12*x2
        // dx2/dt = a21*x1 + a22*x2
        const f1 = (x1, x2) => a11 * x1 + a12 * x2;
        const f2 = (x1, x2) => a21 * x1 + a22 * x2;
        
        // Standard numerical RK4 integration
        let x1 = initX1;
        let x2 = initX2;
        const dt = 0.05;
        const stepsPerYear = 1 / dt;
        
        timeArr.push(0);
        preyArr.push(x1);
        predatorArr.push(x2);
        phasePoints.push({ x: x1, y: x2 });
        
        for (let year = 1; year <= tMax; year++) {
            for (let k = 0; k < stepsPerYear; k++) {
                // RK4 steps
                const k1_1 = f1(x1, x2);
                const k1_2 = f2(x1, x2);
                
                const k2_1 = f1(x1 + 0.5 * dt * k1_1, x2 + 0.5 * dt * k1_2);
                const k2_2 = f2(x1 + 0.5 * dt * k1_1, x2 + 0.5 * dt * k1_2);
                
                const k3_1 = f1(x1 + 0.5 * dt * k2_1, x2 + 0.5 * dt * k2_2);
                const k3_2 = f2(x1 + 0.5 * dt * k2_1, x2 + 0.5 * dt * k2_2);
                
                const k4_1 = f1(x1 + dt * k3_1, x2 + dt * k3_2);
                const k4_2 = f2(x1 + dt * k3_1, x2 + dt * k3_2);
                
                x1 += (dt / 6) * (k1_1 + 2 * k2_1 + 2 * k3_1 + k4_1);
                x2 += (dt / 6) * (k1_2 + 2 * k2_2 + 2 * k3_2 + k4_2);
            }
            
            // Limit extreme values to avoid Chart.js crashes
            if (Math.abs(x1) > 1e100 || Math.abs(x2) > 1e100) {
                timeArr.push(year);
                preyArr.push(Infinity);
                predatorArr.push(Infinity);
                break;
            }
            
            timeArr.push(year);
            preyArr.push(x1);
            predatorArr.push(x2);
            phasePoints.push({ x: x1, y: x2 });
        }
    } else {
        // Lotka-Volterra Model (Non-linear)
        // dP/dt = r1*P - a1*P*D
        // dD/dt = a2*P*D - r2*D
        const r1 = state.params.r1;
        const a1 = state.params.a1;
        const a2 = state.params.a2;
        const r2 = state.params.r2;
        
        let P = state.params.initP;
        let D = state.params.initD;
        
        const f1 = (pVal, dVal) => r1 * pVal - a1 * pVal * dVal;
        const f2 = (pVal, dVal) => a2 * pVal * dVal - r2 * dVal;
        
        const dt = 0.1;
        const stepsPerYear = 1 / dt;
        
        timeArr.push(0);
        preyArr.push(P);
        predatorArr.push(D);
        phasePoints.push({ x: P, y: D });
        
        for (let year = 1; year <= tMax; year++) {
            for (let k = 0; k < stepsPerYear; k++) {
                // RK4 steps
                const k1_1 = f1(P, D);
                const k1_2 = f2(P, D);
                
                const k2_1 = f1(P + 0.5 * dt * k1_1, D + 0.5 * dt * k1_2);
                const k2_2 = f2(P + 0.5 * dt * k1_1, D + 0.5 * dt * k1_2);
                
                const k3_1 = f1(P + 0.5 * dt * k2_1, D + 0.5 * dt * k2_2);
                const k3_2 = f2(P + 0.5 * dt * k2_1, D + 0.5 * dt * k2_2);
                
                const k4_1 = f1(P + dt * k3_1, D + dt * k3_2);
                const k4_2 = f2(P + dt * k3_1, D + dt * k3_2);
                
                P += (dt / 6) * (k1_1 + 2 * k2_1 + 2 * k3_1 + k4_1);
                D += (dt / 6) * (k1_2 + 2 * k2_2 + 2 * k3_2 + k4_2);
            }
            
            // Check for extinction
            if (P < 1e-3) P = 0;
            if (D < 1e-3) D = 0;
            
            timeArr.push(year);
            preyArr.push(P);
            predatorArr.push(D);
            phasePoints.push({ x: P, y: D });
        }
        
        calculateLVStability(r1, a1, a2, r2);
    }
    
    // Save results in state for export
    state.results = { time: timeArr, prey: preyArr, predator: predatorArr };
    
    // Update metric cards
    const finalPrey = preyArr[preyArr.length - 1];
    const finalPred = predatorArr[predatorArr.length - 1];
    
    elements.valMetricPrey.textContent = formatValue(finalPrey);
    elements.valMetricPredator.textContent = formatValue(finalPred);
    
    // Redraw charts
    updateCharts(timeArr, preyArr, predatorArr, phasePoints);

    // Update dynamic bio-philosophical analysis
    updateBioPhilosophy();
}

// Format values nicely for dashboard indicators
function formatValue(val) {
    if (val === null || val === undefined) return "N/A";
    if (isNaN(val)) return "N/A";
    if (!isFinite(val)) return "∞ (Crítico)";
    if (val === 0) return "0 (Extinto)";
    if (Math.abs(val) >= 1e6) {
        return val.toExponential(4);
    }
    return val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}

// Update charts with simulated data
function updateCharts(timeArr, preyArr, predatorArr, phasePoints) {
    // Time Chart updates
    timeChart.data.labels = timeArr;
    timeChart.data.datasets[0].data = preyArr;
    timeChart.data.datasets[1].data = predatorArr;
    
    // If external data is loaded, display it
    if (state.importedData && state.importedData.time) {
        timeChart.data.datasets[2].data = state.importedData.prey;
        timeChart.data.datasets[2].hidden = false;
        timeChart.data.datasets[3].data = state.importedData.predator;
        timeChart.data.datasets[3].hidden = false;
    } else {
        timeChart.data.datasets[2].hidden = true;
        timeChart.data.datasets[3].hidden = true;
    }
    
    timeChart.update();
    
    // Phase Chart updates
    phaseChart.data.datasets[0].data = phasePoints;
    phaseChart.update();
}

// Calculate stability parameters for the linear system A
function calculateLinearStability(a11, a12, a21, a22, initX1, initX2) {
    const trace = a11 + a22;
    const det = a11 * a22 - a12 * a21;
    const disc = trace * trace - 4 * det;
    
    let classification = "";
    let badgeClass = "badge";
    let lambda1Text = "";
    let lambda2Text = "";
    
    let l1_real, l1_imag = 0, l2_real, l2_imag = 0;
    
    // Correct calculations
    if (disc >= 0) {
        l1_real = (trace + Math.sqrt(disc)) / 2;
        l2_real = (trace - Math.sqrt(disc)) / 2;
        elements.eig1.textContent = l1_real.toFixed(5);
        elements.eig2.textContent = l2_real.toFixed(5);
    } else {
        l1_real = trace / 2;
        l1_imag = Math.sqrt(-disc) / 2;
        l2_real = trace / 2;
        l2_imag = -Math.sqrt(-disc) / 2;
        elements.eig1.textContent = `${l1_real.toFixed(3)} + ${l1_imag.toFixed(3)}i`;
        elements.eig2.textContent = `${l2_real.toFixed(3)} - ${l1_imag.toFixed(3)}i`;
    }

    // Stability rules
    if (det < 0) {
        classification = "Punto de Silla (Saddle Point)";
        badgeClass += " saddle";
        elements.valMetricStability.textContent = "Silla Inestable";
        elements.valMetricStability.className = "metric-value text-saddle";
    } else if (det > 0) {
        if (disc >= 0) {
            if (trace < 0) {
                classification = "Nodo Estable";
                badgeClass += " stable";
                elements.valMetricStability.textContent = "Asintóticamente Estable";
                elements.valMetricStability.className = "metric-value text-stable";
            } else if (trace > 0) {
                classification = "Nodo Inestable";
                badgeClass += " unstable";
                elements.valMetricStability.textContent = "Asintóticamente Inestable";
                elements.valMetricStability.className = "metric-value text-unstable";
            } else {
                classification = "Centro Neutro";
                elements.valMetricStability.textContent = "Estabilidad Marginal";
            }
        } else {
            if (trace < 0) {
                classification = "Foco Espiral Estable";
                badgeClass += " stable";
                elements.valMetricStability.textContent = "Espiral Estable";
                elements.valMetricStability.className = "metric-value text-stable";
            } else if (trace > 0) {
                classification = "Foco Espiral Inestable";
                badgeClass += " unstable";
                elements.valMetricStability.textContent = "Espiral Inestable";
                elements.valMetricStability.className = "metric-value text-unstable";
            } else {
                classification = "Centro Neutro (Oscilación)";
                elements.valMetricStability.textContent = "Estable (Centro)";
                elements.valMetricStability.className = "metric-value text-stable";
            }
        }
    } else {
        classification = "Línea de Equilibrios";
        elements.valMetricStability.textContent = "Degenerado";
        elements.valMetricStability.className = "metric-value text-muted";
    }

    // Display math rendering
    const matrixLatex = `A = \\begin{pmatrix} ${a11.toFixed(3)} & ${a12.toFixed(3)} \\\\ ${a21.toFixed(3)} & ${a22.toFixed(3)} \\end{pmatrix}`;
    const charEqLatex = `\\lambda^2 - ${trace.toFixed(3)}\\lambda + ${det.toFixed(4)} = 0`;
    const eigenvaluesLatex = disc >= 0 
        ? `\\lambda_{1,2} = ${l1_real.toFixed(4)}, \\ \\ ${l2_real.toFixed(4)}`
        : `\\lambda_{1,2} = ${l1_real.toFixed(4)} \\pm ${l1_imag.toFixed(4)}i`;
    
    let lyapunovLatex = "";
    if (det > 0 && trace < 0) {
        lyapunovLatex = `<div class="lyapunov-badge success">Teorema de Lyapunov: El origen es Asintóticamente Estable (AE) ya que \\(Tr(A) < 0\\) y \\(Det(A) > 0\\).</div>`;
    } else if (det < 0) {
        lyapunovLatex = `<div class="lyapunov-badge danger">Teorema de Chetaev: El origen es Inestable. Existe una dirección de escape (Punto de Silla).</div>`;
    } else {
        lyapunovLatex = `<div class="lyapunov-badge warning">Teorema de Lyapunov: Inestable o Inconcluso.</div>`;
    }

    elements.mathEquations.innerHTML = `
        <p><strong>Ecuación de Estado Matricial:</strong></p>
        <div>$$\\dot{X} = AX, \\quad ${matrixLatex}$$</div>
        <p><strong>Ecuación Característica:</strong></p>
        <div>$$Det(A - \\lambda I) = ${charEqLatex}$$</div>
        <p><strong>Autovalores Calculados:</strong></p>
        <div>$$${eigenvaluesLatex}$$</div>
        <p><strong>Clasificación del Atractor:</strong></p>
        <div>Trace \\(p = ${trace.toFixed(3)}\\), Det \\(q = ${det.toFixed(4)}\\), Disc \\(\\Delta = ${disc.toFixed(4)}\\)</div>
        ${lyapunovLatex}
    `;

    elements.stabilityBadge.textContent = classification;
    elements.stabilityBadge.className = badgeClass;
    
    // Rerender MathJax/KaTeX math
    if (window.renderMathInElement) {
        window.renderMathInElement(elements.mathEquations);
    }
}

// Calculate stability parameters for Lotka-Volterra
function calculateLVStability(r1, a1, a2, r2) {
    // Non-trivial fixed point is at (P*, D*) = (r2/a2, r1/a1)
    const pStar = r2 / a2;
    const dStar = r1 / a1;
    
    elements.eig1.textContent = "Neutro (Complejo)";
    elements.eig2.textContent = "\\(\\pm i \\sqrt{r_1 r_2}\\)";
    
    elements.valMetricStability.textContent = "Estable (Órbita Cerrada)";
    elements.valMetricStability.className = "metric-value text-stable";
    
    elements.stabilityBadge.textContent = "Centro Neutro (Ciclo Límite)";
    elements.stabilityBadge.className = "badge stable";
    
    const pStarText = pStar.toFixed(1);
    const dStarText = dStar.toFixed(1);
    
    elements.mathEquations.innerHTML = `
        <p><strong>Ecuaciones Diferenciales (LV):</strong></p>
        <div>$$\\frac{dP}{dt} = ${r1.toFixed(3)}P - ${a1.toFixed(5)}PD$$</div>
        <div>$$\\frac{dD}{dt} = ${a2.toFixed(5)}PD - ${r2.toFixed(3)}D$$</div>
        <p><strong>Punto de Equilibrio No Trivial:</strong></p>
        <div>$$P^* = \\frac{r_2}{a_2} = ${pStarText}, \\quad D^* = \\frac{r_1}{a_1} = ${dStarText}$$</div>
        <p><strong>Jacobiana en el Equilibrio:</strong></p>
        <div>$$J^* = \\begin{pmatrix} 0 & -a_1 P^* \\\\ a_2 D^* & 0 \\end{pmatrix}$$</div>
        <p><strong>Autovalores de la Jacobiana:</strong></p>
        <div>$$\\lambda_{1,2} = \\pm i \\sqrt{r_1 r_2} = \\pm ${Math.sqrt(r1 * r2).toFixed(5)}i$$</div>
        <div class="lyapunov-badge success">Órbita Periódica Cerrada: El origen es un Centro. No hay decaimiento de energía.</div>
    `;
    
    // Rerender MathJax/KaTeX math
    if (window.renderMathInElement) {
        window.renderMathInElement(elements.mathEquations);
    }
}

// Handle File upload containing empirical populations statistics
function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
        const text = evt.target.result;
        try {
            if (file.name.endsWith('.json')) {
                const data = JSON.parse(text);
                if (data.time && data.prey && data.predator) {
                    state.importedData = data;
                } else {
                    throw new Error("El archivo JSON debe tener arreglos 'time', 'prey' y 'predator'.");
                }
            } else if (file.name.endsWith('.csv')) {
                // Parse CSV
                const lines = text.split('\n');
                const time = [];
                const prey = [];
                const predator = [];
                
                // Expect header: time,prey,predator OR tiempo,pasivo,radical
                let startIdx = 1;
                for (let i = startIdx; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    const cols = line.split(',');
                    if (cols.length >= 3) {
                        time.push(parseFloat(cols[0]));
                        prey.push(parseFloat(cols[1]));
                        predator.push(parseFloat(cols[2]));
                    }
                }
                
                state.importedData = { time, prey, predator };
            }
            
            alert("Estadísticas cargadas con éxito y superpuestas en el gráfico.");
            runSimulation();
        } catch (err) {
            alert("Error al parsear el archivo: " + err.message);
        }
    };
    reader.readAsText(file);
}

// Export Simulated Data to CSV
function handleExport() {
    if (!state.results || !state.results.time) {
        alert("No hay simulación activa para exportar.");
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    const header = state.model === 'linear' ? "Año,Poblacion_Pasiva,Poblacion_Radical\n" : "Año,Poblacion_Presas,Poblacion_Depredadores\n";
    csvContent += header;
    
    const results = state.results;
    for (let i = 0; i < results.time.length; i++) {
        const pVal = isFinite(results.prey[i]) ? results.prey[i] : "";
        const dVal = isFinite(results.predator[i]) ? results.predator[i] : "";
        csvContent += `${results.time[i]},${pVal},${dVal}\n`;
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `simulacion_${state.model}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link); // Required for FF
    
    link.click();
    document.body.removeChild(link);
}

// Dynamically update biophilosophical context based on parameters and simulation results
function updateBioPhilosophy() {
    if (!state.results || !state.results.time) return;

    const results = state.results;
    const finalPrey = results.prey[results.prey.length - 1];
    const finalPredator = results.predator[results.predator.length - 1];

    let plasticityHtml = "";
    let ideologyHtml = "";
    let parasitoidismHtml = "";

    if (state.model === 'linear') {
        const a11 = state.params.a11;
        const a12 = state.params.a12;
        const a21 = state.params.a21;
        const a22 = state.params.a22;

        // 1. Plasticity Card
        plasticityHtml = `Según Mahner y Bunge, los humanos poseemos un sistema nervioso con alta plasticidad neuronal, lo que nos permite aprender del error. En el modelo lineal actual:
        <ul style="margin-top: 0.5rem; padding-left: 1.2rem;">
            <li style="margin-bottom: 0.4rem;"><strong>Población Pasiva (a₁₁ = ${a11.toFixed(3)}):</strong> ${a11 < 0 
                ? `Muestra capacidad de aprendizaje y auto-regulación (plasticidad conductual). Al tener un coeficiente negativo, el grupo pasivo aprende de sus excesos y tiende a auto-limitarse para no colapsar el sistema.` 
                : `Carece de auto-regulación intrínseca (sistema rígido o sin retroalimentación). Crece sin límites propios, haciéndose vulnerable a perturbaciones y coerción externa.`}
            </li>
            <li style="margin-bottom: 0.4rem;"><strong>Población Radical (a₂₂ = ${a22.toFixed(3)}):</strong> ${a22 < 0 
                ? `Muestra auto-limitación o moderación conductual. Ajusta su tasa de crecimiento interno para evitar saturar el espacio social.` 
                : `Exhibe un sistema comprometido y rígido (fanatismo). El dogmatismo ideológico les impide aprender del error y buscan expandirse indefinidamente sin importar la viabilidad del entorno.`}
            </li>
        </ul>`;

        // 2. Ideology Card
        ideologyHtml = `El modelo describe el conflicto de coerción territorial y social entre dos grupos ideológicos. Evaluando las interacciones cruzadas de la matriz:
        <ul style="margin-top: 0.5rem; padding-left: 1.2rem;">`;
        
        if (a12 < 0 && a21 > 0) {
            ideologyHtml += `<li style="margin-bottom: 0.4rem;"><strong>Depredación Ideológica Coercitiva (a₁₂ < 0, a₂₁ > 0):</strong> El grupo radical agresivo devora y coacciona al sector pasivo. Los radicales se expanden asimilando o destruyendo a la base social de la población pasiva, la cual decrece a causa de este acoso.</li>`;
        } else if (a12 < 0 && a21 < 0) {
            ideologyHtml += `<li style="margin-bottom: 0.4rem;"><strong>Conflicto y Competencia Excluyente (a₁₂ < 0, a₂₁ < 0):</strong> Ambas corrientes ideológicas son hostiles entre sí. Se destruyen o marginan recíprocamente, provocando una constante fricción y guerra de desgaste por el control social.</li>`;
        } else if (a12 > 0 && a21 > 0) {
            ideologyHtml += `<li style="margin-bottom: 0.4rem;"><strong>Sinergia y Cooperación Ideológica (a₁₂ > 0, a₂₁ > 0):</strong> Sorprendentemente, ambos grupos se retroalimentan de forma positiva. Representa un pluralismo abierto donde la existencia y debate entre ambos fomenta el crecimiento mutuo de la sociedad.</li>`;
        } else if (a12 > 0 && a21 < 0) {
            ideologyHtml += `<li style="margin-bottom: 0.4rem;"><strong>Asimilación Inversa / Pacificación (a₁₂ > 0, a₂₁ < 0):</strong> La interacción con la población pasiva debilita al grupo radical pero robustece al pasivo, representando un proceso de desradicalización por influencia de la mayoría moderada.</li>`;
        } else {
            ideologyHtml += `<li style="margin-bottom: 0.4rem;"><strong>Aislamiento o Interacción Neutra:</strong> No existe una transferencia o coerción directa significativa entre ambos grupos ideológicos; se desarrollan en esferas sociales desconectadas.</li>`;
        }
        
        ideologyHtml += `</ul>`;

        // 3. Parasitoidism Card
        const isPreyExtinct = !isFinite(finalPrey) || finalPrey < 0.05;
        const isPredExtinct = !isFinite(finalPredator) || finalPredator < 0.05;
        const isPreyExploding = isFinite(finalPrey) && Math.abs(finalPrey) > 1000;
        const isPredExploding = isFinite(finalPredator) && Math.abs(finalPredator) > 1000;

        if (isPreyExtinct && isPredExtinct) {
            parasitoidismHtml = `<strong>¡Colapso por Parasitoidismo Total!</strong> La ideología radical coaccionó de manera tan extrema a la base pasiva que la extinguió por completo. Al desaparecer el "huésped" que alimentaba y sostenía al sistema, el grupo radical también colapsó y se extinguió. Esto demuestra la inviabilidad a largo plazo de los regímenes totalitarios destructivos.`;
        } else if (isPreyExtinct && !isPredExtinct) {
            parasitoidismHtml = `<strong>Parasitoidismo Consumado (Extinción del Huésped):</strong> La población pasiva ha sido totalmente asimilada o erradicada. La ideología radical posee ahora el monopolio total de un sistema vacío, pero su viabilidad futura es nula al carecer de un sector productivo o base social activa.`;
        } else if (!isPreyExtinct && isPredExtinct) {
            parasitoidismHtml = `<strong>Pacificación y Extinción Radical:</strong> La ideología violenta y radical no logró asimilar suficientes adeptos o sufrió de alta mortalidad, extinguiéndose por completo. La población pasiva sobrevive y recupera el control territorial, logrando una estabilidad pacífica libre de coerción.`;
        } else if (isPreyExploding || isPredExploding) {
            parasitoidismHtml = `<strong>Desborde Ideológico y Crisis del Sistema:</strong> Las poblaciones crecen exponencialmente de manera descontrolada hacia el infinito. En la realidad social, esta inestabilidad desborda las instituciones y la capacidad de carga del territorio, culminando invariablemente en una revolución, colapso estatal o guerra civil destructiva.`;
        } else {
            parasitoidismHtml = `<strong>Equilibrio y Coexistencia Regulada:</strong> Ambas poblaciones sobreviven en equilibrio o dirección controlada (pasiva = ${formatValue(finalPrey)}, radical = ${formatValue(finalPredator)}). La coerción radical y la resiliencia o resistencia social de la población pasiva se equilibran mutuamente, impidiendo que el parasitoidismo ideológico destruya la base social y garantizando la supervivencia del sistema bajo una tensión constante.`;
        }

    } else {
        // Lotka-Volterra Model
        const r1 = state.params.r1;
        const a1 = state.params.a1;
        const a2 = state.params.a2;
        const r2 = state.params.r2;

        // 1. Plasticity Card
        plasticityHtml = `En el modelo Lotka-Volterra no lineal, las poblaciones carecen de auto-limitación interna (diagonal matricial cero):
        <ul style="margin-top: 0.5rem; padding-left: 1.2rem;">
            <li style="margin-bottom: 0.4rem;"><strong>Presas / Pasivos (r₁ = ${r1.toFixed(4)}):</strong> Crecen de manera exponencial en ausencia de depredadores. Bunge asocia esto a un comportamiento impulsivo sin aprendizaje o conciencia de límites ecológicos/sociales.</li>
            <li style="margin-bottom: 0.4rem;"><strong>Depredadores / Radicales (r₂ = ${r2.toFixed(4)}):</strong> Tienen una tasa de mortalidad intrínseca constante, lo que representa que si no logran cazar y coaccionar a los pasivos, su ideología colapsa rápidamente debido al dogmatismo rígido y a la falta de autosustento.</li>
        </ul>`;

        // 2. Ideology Card
        ideologyHtml = `Relación clásica de depredación biológica aplicada a la sociedad:
        <ul style="margin-top: 0.5rem; padding-left: 1.2rem;">
            <li style="margin-bottom: 0.4rem;"><strong>Tasa de Éxito de Caza (a₁ = ${a1.toFixed(5)}):</strong> Mide la efectividad con la que la ideología radical ejerce coerción, intimida o asimila de forma destructiva a la población pasiva para su propio beneficio.</li>
            <li style="margin-bottom: 0.4rem;"><strong>Tasa de Reproducción/Conversión (a₂ = ${a2.toFixed(5)}):</strong> Representa el éxito del grupo radical para reclutar nuevos militantes comprometidos a partir de sus interacciones coercitivas con el sector pasivo.</li>
        </ul>`;

        // 3. Parasitoidism Card
        const isPreyExtinct = finalPrey < 0.1;
        const isPredExtinct = finalPredator < 0.1;

        if (isPreyExtinct && isPredExtinct) {
            parasitoidismHtml = `<strong>Colapso por Depredación Extrema (Parasitoidismo):</strong> La tasa de caza fue demasiado alta, extinguiendo a las presas (pasivos). Como consecuencia inmediata, la población depredadora (radicales) se quedó sin sustento alimentario y se extinguió, ilustrando el colapso ecológico y social total del parasitoidismo.`;
        } else if (isPreyExtinct && !isPredExtinct) {
            parasitoidismHtml = `<strong>Monopolio Radical Inviable:</strong> Las presas se han extinguido. Aunque quedan algunos depredadores en este instante, su extinción total por hambruna social es inminente.`;
        } else if (!isPreyExtinct && isPredExtinct) {
            parasitoidismHtml = `<strong>Extinción Radical y Paz Social:</strong> Los depredadores se extinguieron por completo debido a baja eficiencia o alta mortalidad. Las presas pasivas ahora se multiplican libremente, libres de amenaza coercitiva.`;
        } else {
            parasitoidismHtml = `<strong>Órbita Periódica (Centro Neutro):</strong> Las poblaciones coexisten en un ciclo oscilatorio cerrado y permanente (pasiva = ${formatValue(finalPrey)}, radical = ${formatValue(finalPredator)}). Hay fases de alta tensión ideológica (crecimiento radical), seguidas por una caída demográfica pasiva, que luego reduce el sustento de los radicales provocando su declive, lo que a su vez permite que los pasivos se recuperen. Es un ciclo constante de conflicto y tregua.`;
        }
    }

    elements.philosophyPlasticity.innerHTML = plasticityHtml;
    elements.philosophyIdeology.innerHTML = ideologyHtml;
    elements.philosophyParasitoidism.innerHTML = parasitoidismHtml;
}

// ==========================================
// LANDING PAGE LOGIC & CANVAS ANIMATION
// ==========================================

function initLandingListeners() {
    const startBtns = [
        document.getElementById('cta-start-nav'),
        document.getElementById('cta-start-hero'),
        document.getElementById('cta-start-footer')
    ];
    
    startBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                // Fade out landing page
                elements.landingPage.classList.add('fade-out');
                setTimeout(() => {
                    elements.landingPage.style.display = 'none';
                    elements.landingPage.classList.remove('fade-out');
                    
                    // Fade in simulation app
                    elements.simulationApp.style.display = 'flex';
                    elements.simulationApp.classList.add('fade-in');
                    setTimeout(() => {
                        elements.simulationApp.classList.remove('fade-in');
                    }, 400);
                }, 400);
            });
        }
    });
    
    if (elements.btnBackToLanding) {
        elements.btnBackToLanding.addEventListener('click', () => {
            // Fade out simulation app
            elements.simulationApp.classList.add('fade-out');
            setTimeout(() => {
                elements.simulationApp.style.display = 'none';
                elements.simulationApp.classList.remove('fade-out');
                
                // Fade in landing page
                elements.landingPage.style.display = 'block';
                elements.landingPage.classList.add('fade-in');
                setTimeout(() => {
                    elements.landingPage.classList.remove('fade-in');
                    // Force resize trigger for canvas
                    window.dispatchEvent(new Event('resize'));
                }, 400);
            }, 400);
        });
    }
}

function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    function resize() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        width = canvas.width;
        height = canvas.height;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    const particles = [];
    const maxParticles = 60;
    
    let mouse = { x: null, y: null };
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    for (let i = 0; i < maxParticles; i++) {
        const radius = 30 + Math.random() * 120;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
            r: radius,
            angle: angle,
            speed: 0.01 + Math.random() * 0.015,
            size: 1.5 + Math.random() * 2.5,
            color: Math.random() > 0.5 ? '#06b6d4' : '#ec4899',
            trail: []
        });
    }
    
    function draw() {
        if (elements.landingPage.style.display === 'none') {
            // Pause animation when landing is not visible to save CPU resources
            requestAnimationFrame(draw);
            return;
        }
        
        ctx.clearRect(0, 0, width, height);
        
        const drawWidth = width / window.devicePixelRatio;
        const drawHeight = height / window.devicePixelRatio;
        
        // Draw Grid
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.04)';
        ctx.lineWidth = 1;
        const gridStep = 40;
        for (let x = 0; x < drawWidth; x += gridStep) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, drawHeight);
            ctx.stroke();
        }
        for (let y = 0; y < drawHeight; y += gridStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(drawWidth, y);
            ctx.stroke();
        }
        
        // Draw Axes
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(35, drawHeight - 35);
        ctx.lineTo(drawWidth - 20, drawHeight - 35);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(35, 20);
        ctx.lineTo(35, drawHeight - 35);
        ctx.stroke();
        
        // Axis labels
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.font = '500 10px var(--font-body)';
        ctx.fillText('Población Presa (P)', drawWidth - 115, drawHeight - 18);
        
        ctx.save();
        ctx.translate(18, 120);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Población Depredador (D)', 0, 0);
        ctx.restore();
        
        // Fixed Point center
        const cx = drawWidth / 2 + 10;
        const cy = drawHeight / 2 - 10;
        
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();
        
        particles.forEach(p => {
            p.angle += p.speed;
            
            const rx = p.r;
            const ry = p.r * 0.75;
            
            let targetX = cx + rx * Math.cos(p.angle);
            let targetY = cy + ry * Math.sin(p.angle);
            
            // Leaning effect to look like Volterra orbits
            const dx = (targetX - cx) / cx;
            targetY += dx * 25;
            
            if (mouse.x !== null && mouse.y !== null) {
                const dist = Math.hypot(targetX - mouse.x, targetY - mouse.y);
                if (dist < 100) {
                    const force = (100 - dist) / 100 * 12;
                    const angleToMouse = Math.atan2(mouse.y - targetY, mouse.x - targetX);
                    targetX += Math.cos(angleToMouse) * force;
                    targetY += Math.sin(angleToMouse) * force;
                }
            }
            
            p.trail.push({ x: targetX, y: targetY });
            if (p.trail.length > 12) {
                p.trail.shift();
            }
            
            if (p.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(p.trail[0].x, p.trail[0].y);
                for (let k = 1; k < p.trail.length; k++) {
                    ctx.lineTo(p.trail[k].x, p.trail[k].y);
                }
                ctx.strokeStyle = p.color + '15';
                ctx.lineWidth = p.size;
                ctx.stroke();
            }
            
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(targetX, targetY, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(draw);
    }
    
    requestAnimationFrame(draw);
}
