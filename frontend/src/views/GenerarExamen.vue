<template>
  <div class="generar-examen-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Generar Examen con IA 🧠</h1>
        <p>Transforma tus apuntes en un examen personalizado en segundos.</p>
      </div>
      <div class="header-badge">
        <i class='bx bxs-zap'></i>
        <span>Prototipo Visual</span>
      </div>
    </header>

    <div class="main-grid">
      <!-- Configuración del Examen -->
      <section class="config-section card-glass">
        <div class="section-title">
          <i class='bx bx-cog'></i>
          <h2>Configuración</h2>
        </div>

        <div class="form-group">
          <label>Materia</label>
          <select class="modern-select">
            <option>Ingeniería de Software II</option>
            <option>Base de Datos I</option>
            <option>Sistemas Operativos</option>
          </select>
        </div>

        <div class="form-group">
          <label>Documento de Origen (PDF, Word, PPT)</label>
          <div class="drop-zone" :class="{ 'dragging': isDragging }" 
               @dragover.prevent="isDragging = true" 
               @dragleave="isDragging = false"
               @drop.prevent="handleDrop">
            <i class='bx bx-cloud-upload'></i>
            <p v-if="!fileName">Arrastra aquí tu examen o haz clic para subir</p>
            <p v-else class="file-uploaded text-gradient">{{ fileName }}</p>
            <input type="file" ref="fileInput" hidden @change="handleFileChange">
            <button class="small-btn" @click="$refs.fileInput.click()">Explorar Archivos</button>
          </div>
        </div>

        <div class="form-group">
          <div class="split-labels">
            <label>Cantidad de Preguntas</label>
            <span class="value-display">{{ cantPreguntas }}</span>
          </div>
          <input type="range" v-model="cantPreguntas" min="5" max="30" step="5" class="modern-range">
        </div>

        <div class="form-group">
          <label>Nivel de Dificultad</label>
          <div class="difficulty-options">
            <button v-for="d in 3" :key="d" 
                    :class="['diff-btn', { active: dificultad === d }]"
                    @click="dificultad = d">
              {{ ['Fácil', 'Intermedio', 'Avanzado'][d-1] }}
            </button>
          </div>
        </div>

        <button class="generate-btn" @click="generarExamen" :disabled="generando">
          <span v-if="!generando">
            <i class='bx bxs-magic-wand'></i> Generar Examen
          </span>
          <span v-else class="loader-container">
            <div class="loader-dots"><span></span><span></span><span></span></div>
            Procesando con IA...
          </span>
        </button>
      </section>

      <!-- Previsualización -->
      <section class="preview-section" v-if="examenGenerado">
        <div class="card-glass preview-card animate-slide-up">
          <div class="preview-header">
            <div class="status-indicator">
              <span class="dot"></span>
              Modelo Generado
            </div>
            <button class="icon-btn" @click="examenGenerado = null"><i class='bx bx-x'></i></button>
          </div>

          <div class="exam-header-mock">
            <h3>Examen Final: Ingeniería de Software II</h3>
            <div class="exam-meta">
              <span><i class='bx bx-calendar'></i> 21 Abr 2026</span>
              <span><i class='bx bx-list-ul'></i> {{ cantPreguntas }} Preguntas</span>
              <span><i class='bx bx-award'></i> Puntaje: 100</span>
            </div>
          </div>

          <div class="questions-list">
            <div v-for="i in 3" :key="i" class="question-item">
              <p class="question-text">
                <span class="q-num">0{{ i }}.</span> 
                {{ mockQuestions[i-1].pregunta }}
              </p>
              <div class="options-grid-mock">
                <div v-for="(opt, idx) in mockQuestions[i-1].opciones" :key="idx" class="option-mock">
                  <span class="opt-letter">{{ ['A','B','C','D'][idx] }}</span>
                  <span class="opt-text">{{ opt }}</span>
                </div>
              </div>
            </div>
            <div class="more-indicator">... y {{ cantPreguntas - 3 }} preguntas más</div>
          </div>

          <div class="preview-actions">
            <button class="action-btn outline"><i class='bx bx-download'></i> Descargar PDF</button>
            <button class="action-btn primary"><i class='bx bx-play'></i> Comenzar Examen</button>
          </div>
        </div>
      </section>

      <!-- Estado Inicial / Empty -->
      <section class="empty-preview" v-else>
        <div class="empty-content card-glass">
          <div class="ai-orb"></div>
          <h3>Listo para la Magia</h3>
          <p>Configura los parámetros y pulsa generar para ver la previsualización del examen modelo.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GenerarExamen',
  data() {
    return {
      isDragging: false,
      fileName: '',
      cantPreguntas: 10,
      dificultad: 2,
      generando: false,
      examenGenerado: false,
      mockQuestions: [
        {
          pregunta: "¿Cuál de los siguientes es un pilar fundamental del Manifiesto Ágil?",
          opciones: ["Individuos e interacciones sobre procesos y herramientas", "Seguir un plan rígido sobre el cambio", "Documentación exhaustiva sobre software funcionando", "Negociación de contratos sobre colaboración"]
        },
        {
          pregunta: "En Scrum, ¿quién es el responsable de priorizar el Product Backlog?",
          opciones: ["Scrum Master", "Product Owner", "Development Team", "Stakeholders"]
        },
        {
          pregunta: "¿Qué técnica se utiliza para estimar el esfuerzo en historias de usuario?",
          opciones: ["Planning Poker", "Gantt Chart", "Critical Path Method", "Monte Carlo Simulation"]
        }
      ]
    }
  },
  methods: {
    handleDrop(e) {
      this.isDragging = false;
      const file = e.dataTransfer.files[0];
      if (file) {
        if (this.validarArchivo(file)) {
          this.fileName = file.name;
        }
      }
    },
    handleFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        if (this.validarArchivo(file)) {
          this.fileName = file.name;
        } else {
          e.target.value = ''; // Limpiar el input si falla
        }
      }
    },
    validarArchivo(file) {
      const MAX_SIZE = 15 * 1024 * 1024; // 15MB
      const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx'];
      const extension = file.name.split('.').pop().toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        alert("Formato no permitido. Solo se aceptan PDF, Word (doc, docx) o PowerPoint (ppt, pptx).");
        return false;
      }

      if (file.size > MAX_SIZE) {
        alert("El archivo es demasiado grande. El máximo permitido es 15MB.");
        return false;
      }

      return true;
    },
    generarExamen() {
      if (!this.fileName) {
        alert("Por favor, selecciona un documento PDF primero.");
        return;
      }
      this.generando = true;
      // Simulación de carga IA
      setTimeout(() => {
        this.generando = false;
        this.examenGenerado = true;
      }, 2500);
    }
  }
}
</script>

<style scoped>
.generar-examen-page {
  padding: 40px;
  max-width: 1300px;
  margin: 0 auto;
  animation: fadeIn 0.8s ease;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.page-header p {
  color: var(--text-muted);
  font-size: 16px;
}

.header-badge {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.header-badge i { font-size: 18px; }

.main-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 30px;
  align-items: flex-start;
}

.card-glass {
  background: var(--surface-color);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--surface-border);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: var(--primary-color);
}

.section-title h2 { font-size: 18px; font-weight: 700; color: #fff; }

.form-group { margin-bottom: 24px; }

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.modern-select {
  width: 100%;
  padding: 14px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  color: #fff;
  font-family: inherit;
  outline: none;
  cursor: pointer;
}

.drop-zone {
  border: 2px dashed var(--surface-border);
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.02);
}

.drop-zone.dragging {
  border-color: var(--primary-color);
  background: rgba(59, 130, 246, 0.05);
  transform: scale(1.02);
}

.drop-zone i {
  font-size: 40px;
  color: var(--primary-color);
  margin-bottom: 12px;
}

.drop-zone p {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.small-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid var(--surface-border);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.small-btn:hover { background: rgba(255,255,255,0.2); }

.split-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-display {
  background: var(--primary-color);
  color: #fff;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}

.modern-range {
  width: 100%;
  margin-top: 10px;
  accent-color: var(--primary-color);
}

.difficulty-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.diff-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--surface-border);
  color: var(--text-muted);
  padding: 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.diff-btn.active {
  background: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.generate-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4);
}

.generate-btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* Loader */
.loader-container { display: flex; align-items: center; gap: 12px; }
.loader-dots { display: flex; gap: 4px; }
.loader-dots span {
  width: 6px; height: 6px; background: #fff; border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}
.loader-dots span:nth-child(2) { animation-delay: 0.2s; }
.loader-dots span:nth-child(3) { animation-delay: 0.4s; }

/* Preview Section */
.preview-card {
  max-width: 800px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.status-indicator {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator .dot {
  width: 8px; height: 8px; background: #10b981; border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

.icon-btn {
  background: rgba(255,255,255,0.05);
  border: none; color: var(--text-muted);
  width: 32px; height: 32px; border-radius: 50%;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
}

.exam-header-mock h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}

.exam-meta {
  display: flex;
  gap: 20px;
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 30px;
}

.exam-meta span { display: flex; align-items: center; gap: 6px; }

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}

.question-item {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--surface-border);
  padding: 20px;
  border-radius: 16px;
}

.question-text {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.5;
}

.q-num { color: var(--primary-color); margin-right: 8px; }

.options-grid-mock {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.option-mock {
  background: rgba(255,255,255,0.03);
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
}

.opt-letter {
  background: rgba(255,255,255,0.08);
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 4px; font-weight: 700; font-size: 11px;
}

.more-indicator {
  text-align: center;
  color: var(--primary-color);
  font-size: 14px;
  font-style: italic;
}

.preview-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
}

.action-btn.outline {
  background: transparent;
  border: 1px solid var(--surface-border);
  color: #fff;
}

.action-btn.primary {
  background: var(--primary-color);
  border: none;
  color: #fff;
}

.action-btn:hover { transform: scale(1.05); }

/* Empty state */
.empty-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.ai-orb {
  width: 120px; height: 120px;
  background: radial-gradient(circle, var(--primary-color) 0%, var(--accent-color) 100%);
  border-radius: 50%;
  margin: 0 auto 30px;
  filter: blur(40px);
  animation: pulse 4s infinite;
}

.empty-content h3 { font-size: 24px; margin-bottom: 12px; }
.empty-content p { color: var(--text-muted); line-height: 1.6; }

.text-gradient {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

/* Animations */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
</style>
