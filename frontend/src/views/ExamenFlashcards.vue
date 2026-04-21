<template>
  <div class="exam-page">

    <!-- Estado: Selección de Materia -->
    <div v-if="!modoEstudio && !resumenFinal" class="selector-section card-glass">
      <header class="top-header">
        <h1>📝 Usar Flashcards</h1>
        <p>Elige una materia y estudia respondiendo las tarjetas una por una.</p>
      </header>

      <select class="modern-select mt-4" v-model="selectedMateriaId">
        <option disabled value="">-- Selecciona la materia --</option>
        <option v-for="m in materias" :key="m.id_materia" :value="m.id_materia">
          {{ m.nombre_materia }}
        </option>
      </select>

      <div v-if="selectedMateriaId && !loading" class="mt-4 text-center">
        <p class="fc-count" v-if="flashcards.length">
          <i class='bx bx-cards fc-icon'></i>
          <strong>{{ flashcards.length }} flashcards</strong> disponibles para esta materia.
        </p>
        <p class="fc-count fc-empty" v-else>
          <i class='bx bx-info-circle'></i>
          No hay flashcards generadas para esta materia. 
          <router-link to="/flashcards" class="link-crear">¡Creá algunas primero!</router-link>
        </p>
        <button 
          class="action-btn start-btn mt-3" 
          @click="iniciarEstudio" 
          :disabled="!flashcards.length"
        >
          <i class='bx bx-play'></i> Comenzar Estudio
        </button>
      </div>

      <div v-if="loading" class="mt-4 text-center">
        <div class="loader-sm"></div>
        <p class="mt-2">Cargando flashcards...</p>
      </div>
    </div>

    <!-- Estado: Estudio en curso (Mostrar Flashcard + Registrar Respuesta) -->
    <div v-if="modoEstudio" class="study-container">
      
      <!-- Barra de Progreso -->
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-info">
        <span>Tarjeta {{ currentIndex + 1 }} de {{ flashcards.length }}</span>
        <span class="score-live">
          <span class="correct-count">✓ {{ aciertos }}</span>
          <span class="wrong-count">✗ {{ errores }}</span>
        </span>
      </div>

      <!-- Card de la Pregunta -->
      <div class="question-card card-glass" :class="{ 'shake': shakeCard }">
        
        <!-- Dificultad -->
        <div class="difficulty-badge">
          <i class='bx bxs-star' v-for="s in currentFlashcard.dificultad" :key="s"></i>
          <i class='bx bx-star' v-for="s in (5 - (currentFlashcard.dificultad || 0))" :key="'e'+s"></i>
        </div>

        <!-- Título de la flashcard -->
        <p class="card-titulo" v-if="currentFlashcard.titulo">{{ currentFlashcard.titulo }}</p>

        <!-- Pregunta -->
        <h2 class="question-text">{{ currentFlashcard.pregunta }}</h2>
        
        <!-- Respuestas -->
        <div class="answers-grid">
          <button 
            v-for="(resp, i) in currentFlashcard.respuestas" 
            :key="i"
            class="answer-btn"
            :class="{
              'answer-correct': answered && resp.es_correcta,
              'answer-wrong': answered && selectedAnswer === i && !resp.es_correcta,
              'answer-disabled': answered && selectedAnswer !== i && !resp.es_correcta
            }"
            :disabled="answered"
            @click="seleccionarRespuesta(i, resp)"
          >
            <span class="answer-letter">{{ ['A','B','C','D'][i] }}</span>
            <span class="answer-text">{{ resp.texto_respuesta }}</span>
            <i v-if="answered && resp.es_correcta" class='bx bxs-check-circle icon-correct'></i>
            <i v-if="answered && selectedAnswer === i && !resp.es_correcta" class='bx bxs-x-circle icon-wrong'></i>
          </button>
        </div>

        <!-- Feedback (Analizar Respuesta) -->
        <div v-if="answered" class="feedback-section mt-4">
          <div v-if="lastCorrect" class="feedback correct-fb">
            <i class='bx bxs-check-circle'></i> ¡Correcto! 🎉
          </div>
          <div v-else class="feedback wrong-fb">
            <i class='bx bxs-x-circle'></i> Incorrecto — La respuesta correcta está marcada en verde.
          </div>
          <button class="action-btn mt-3" @click="siguientePregunta">
            {{ isLastQuestion ? 'Ver Resultados' : 'Siguiente Tarjeta →' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Estado: Resultados Finales -->
    <div v-if="resumenFinal" class="results-container">
      <div class="results-card card-glass text-center">
        <div class="trophy-icon" v-if="scorePercent >= 70">🏆</div>
        <div class="trophy-icon" v-else>📚</div>
        
        <h1>Sesión Completada</h1>
        <p class="materia-name">{{ selectedMateriaName }}</p>

        <div class="score-circle mt-4">
          <svg viewBox="0 0 120 120" class="score-svg">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
            <circle cx="60" cy="60" r="54" fill="none" 
              :stroke="scorePercent >= 70 ? '#10b981' : (scorePercent >= 40 ? '#f59e0b' : '#ef4444')"
              stroke-width="8" stroke-linecap="round"
              :stroke-dasharray="339.292" 
              :stroke-dashoffset="339.292 - (339.292 * animatedScore / 100)"
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="55" text-anchor="middle" fill="white" font-size="28" font-weight="700">{{ animatedScore }}%</text>
            <text x="60" y="75" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="12">Puntaje</text>
          </svg>
        </div>

        <div class="stats-row mt-4">
          <div class="stat-box correct-stat">
            <span class="stat-number">{{ aciertos }}</span>
            <span class="stat-label">Correctas</span>
          </div>
          <div class="stat-box wrong-stat">
            <span class="stat-number">{{ errores }}</span>
            <span class="stat-label">Incorrectas</span>
          </div>
          <div class="stat-box total-stat">
            <span class="stat-number">{{ flashcards.length }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>

        <div class="mt-4" v-if="progressSaved">
          <p class="saved-msg"><i class='bx bxs-check-circle'></i> Progreso guardado en la base de datos.</p>
        </div>

        <div class="actions-row mt-4">
          <button class="action-btn" @click="repetirEstudio">
            <i class='bx bx-revision'></i> Repetir
          </button>
          <button class="action-btn outline-btn" @click="cambiarMateria">
            <i class='bx bx-arrow-back'></i> Cambiar Materia
          </button>
          <router-link to="/flashcards" class="action-btn outline-btn">
            <i class='bx bx-plus'></i> Crear más
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ExamenFlashcards',
  data() {
    return {
      usuario: null,
      materias: [],
      selectedMateriaId: '',
      flashcards: [],
      loading: false,
      
      // Estado de estudio
      modoEstudio: false,
      resumenFinal: false,
      currentIndex: 0,
      selectedAnswer: null,
      answered: false,
      lastCorrect: false,
      shakeCard: false,
      
      // Puntaje
      aciertos: 0,
      errores: 0,
      progressSaved: false,
      animatedScore: 0
    }
  },
  computed: {
    currentFlashcard() {
      return this.flashcards[this.currentIndex] || {};
    },
    isLastQuestion() {
      return this.currentIndex === this.flashcards.length - 1;
    },
    progressPercent() {
      return ((this.currentIndex) / this.flashcards.length) * 100;
    },
    scorePercent() {
      if (!this.flashcards.length) return 0;
      return Math.round((this.aciertos / this.flashcards.length) * 100);
    },
    selectedMateriaName() {
      const m = this.materias.find(m => m.id_materia === this.selectedMateriaId);
      return m ? m.nombre_materia : '';
    }
  },
  watch: {
    async selectedMateriaId(id) {
      if (!id) return;
      await this.loadFlashcards(id);
    }
  },
  async mounted() {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
    }
    await this.loadMaterias();
    
    // Si viene un id_apunte en la URL, cargar ese estudio directamente
    const apunteId = this.$route.query.id_apunte;
    if (apunteId) {
      await this.loadFlashcardsByApunte(apunteId);
    }
  },
  methods: {
    async loadMaterias() {
      try {
        const id = this.usuario?.id_usuario;
        if (!id) return;
        const res = await axios.get(`http://localhost:3000/api/materias?id_usuario=${id}`);
        this.materias = res.data;
      } catch (e) {
        console.error(e);
      }
    },
    async loadFlashcards(id) {
      this.loading = true;
      try {
        const res = await axios.get(`http://localhost:3000/api/flashcards/materia/${id}`);
        this.flashcards = this.shuffleArray(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async loadFlashcardsByApunte(id) {
      this.loading = true;
      try {
        const res = await axios.get(`http://localhost:3000/api/flashcards/apunte/${id}`);
        this.flashcards = this.shuffleArray(res.data);
        if (this.flashcards.length > 0) {
          this.selectedMateriaId = this.flashcards[0].id_materia;
          this.modoEstudio = true; // Iniciar directamente
        } else {
          alert("Este apunte no tiene flashcards generadas aún.");
          this.$router.push('/materias');
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    shuffleArray(array) {
      const a = [...array];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      // Mezclar las respuestas de cada flashcard
      a.forEach(fc => {
        if (fc.respuestas) {
          const r = [...fc.respuestas];
          for (let i = r.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [r[i], r[j]] = [r[j], r[i]];
          }
          fc.respuestas = r;
        }
      });
      return a;
    },

    // Caso de uso: Mostrar Flashcard
    iniciarEstudio() {
      this.currentIndex = 0;
      this.aciertos = 0;
      this.errores = 0;
      this.selectedAnswer = null;
      this.answered = false;
      this.modoEstudio = true;
      this.resumenFinal = false;
      this.progressSaved = false;
      this.animatedScore = 0;
    },

    // Caso de uso: Registrar Respuesta
    seleccionarRespuesta(index, resp) {
      this.selectedAnswer = index;
      this.answered = true;
      if (resp.es_correcta) {
        this.aciertos++;
        this.lastCorrect = true;
      } else {
        this.errores++;
        this.lastCorrect = false;
        this.shakeCard = true;
        setTimeout(() => { this.shakeCard = false; }, 500);
      }
    },

    // Siguiente o Finalizar
    async siguientePregunta() {
      if (this.isLastQuestion) {
        this.modoEstudio = false;
        this.resumenFinal = true;
        await this.guardarProgreso();
        this.animateScore();
        return;
      }
      this.currentIndex++;
      this.selectedAnswer = null;
      this.answered = false;
      this.lastCorrect = false;
    },

    // Analizar Respuesta (extend): Guardar progreso
    async guardarProgreso() {
      try {
        const id = this.usuario?.id_usuario;
        if (!id) return;
        await axios.post('http://localhost:3000/api/flashcards/progress', {
          id_usuario: id,
          id_materia: this.selectedMateriaId,
          aciertos: this.aciertos,
          total: this.flashcards.length,
          porcentaje: this.scorePercent
        });
        this.progressSaved = true;
      } catch (e) {
        console.error("Error guardando progreso:", e);
      }
    },

    // Animación del score
    animateScore() {
      const target = this.scorePercent;
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        this.animatedScore = current;
      }, 15);
    },

    repetirEstudio() {
      this.flashcards = this.shuffleArray(this.flashcards);
      this.resumenFinal = false;
      this.iniciarEstudio();
    },
    cambiarMateria() {
      this.selectedMateriaId = '';
      this.flashcards = [];
      this.modoEstudio = false;
      this.resumenFinal = false;
      this.progressSaved = false;
    }
  }
}
</script>

<style scoped>
.exam-page { padding: 40px; animation: fadeIn 0.5s ease; }
.top-header { margin-bottom: 20px; }
.top-header h1 { font-size: 30px; font-weight: 700; color: var(--text-main); }
.top-header p { color: var(--text-muted); font-size: 15px; margin-top: 8px; }

.mt-2 { margin-top: 8px; } .mt-3 { margin-top: 16px; } .mt-4 { margin-top: 24px; }
.text-center { text-align: center; }

.card-glass {
  background: var(--surface-color);
  backdrop-filter: blur(12px);
  border: 1px solid var(--surface-border);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modern-select {
  width: 100%; padding: 14px 16px;
  background: rgba(0,0,0,0.2); border: 1px solid var(--surface-border);
  border-radius: 10px; color: var(--text-main); font-size: 15px; outline: none;
}
.modern-select option { background: #1a1e2f; color: #fff; }

.fc-count { 
  color: var(--text-muted); font-size: 15px; 
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.fc-icon { font-size: 22px; color: #10b981; }
.fc-empty { color: var(--text-muted); }
.link-crear { color: #3b82f6; font-weight: 600; text-decoration: underline; }

.start-btn {
  background: linear-gradient(135deg, #10b981, #3b82f6);
  display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; font-size: 16px;
}

.loader-sm {
  border: 3px solid var(--surface-border); border-top: 3px solid var(--primary-color);
  border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite;
  margin: 0 auto;
}

/* Progress Bar */
.progress-bar-container {
  width: 100%; height: 6px; background: rgba(255,255,255,0.1);
  border-radius: 3px; margin-bottom: 12px; overflow: hidden;
}
.progress-bar {
  height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981);
  border-radius: 3px; transition: width 0.4s ease;
}
.progress-info {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24px; font-size: 14px; color: var(--text-muted);
}
.score-live { display: flex; gap: 16px; }
.correct-count { color: #10b981; font-weight: 600; }
.wrong-count { color: #ef4444; font-weight: 600; }

/* Question Card */
.question-card { max-width: 700px; margin: 0 auto; }
.question-card.shake { animation: shake 0.4s ease; }
.difficulty-badge { margin-bottom: 12px; font-size: 16px; color: #f59e0b; }
.difficulty-badge .bx-star { opacity: 0.25; }

.card-titulo {
  font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
  color: var(--primary-color); margin-bottom: 8px; opacity: 0.8;
}

.question-text { font-size: 22px; font-weight: 600; color: var(--text-main); line-height: 1.5; margin-bottom: 28px; }

.answers-grid { display: flex; flex-direction: column; gap: 12px; }
.answer-btn {
  display: flex; align-items: center; gap: 14px; padding: 16px 20px;
  background: rgba(255,255,255,0.04); border: 1px solid var(--surface-border);
  border-radius: 12px; cursor: pointer; transition: all 0.2s ease;
  text-align: left; color: var(--text-main); font-size: 15px;
}
.answer-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.1); border-color: #3b82f6; transform: translateX(4px);
}
.answer-letter {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(255,255,255,0.08); font-weight: 700; font-size: 14px;
  flex-shrink: 0;
}
.answer-text { flex: 1; }
.icon-correct { color: #10b981; font-size: 22px; margin-left: auto; }
.icon-wrong { color: #ef4444; font-size: 22px; margin-left: auto; }

.answer-correct {
  background: rgba(16, 185, 129, 0.15) !important;
  border-color: #10b981 !important;
}
.answer-correct .answer-letter { background: #10b981; color: #fff; }
.answer-wrong {
  background: rgba(239, 68, 68, 0.15) !important;
  border-color: #ef4444 !important;
}
.answer-wrong .answer-letter { background: #ef4444; color: #fff; }
.answer-disabled { opacity: 0.4; }

/* Feedback */
.feedback { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 600; }
.correct-fb { color: #10b981; }
.correct-fb i { font-size: 28px; }
.wrong-fb { color: #ef4444; }
.wrong-fb i { font-size: 28px; }
.feedback-section { display: flex; flex-direction: column; align-items: center; }

/* Results */
.results-container { max-width: 550px; margin: 0 auto; }
.trophy-icon { font-size: 64px; margin-bottom: 12px; }
.results-card h1 { font-size: 28px; font-weight: 700; color: var(--text-main); }
.materia-name { color: var(--text-muted); font-size: 16px; margin-top: 4px; }

.score-svg { width: 140px; height: 140px; }

.stats-row { display: flex; justify-content: center; gap: 24px; }
.stat-box {
  text-align: center; padding: 16px 24px; border-radius: 12px;
  background: rgba(255,255,255,0.04); border: 1px solid var(--surface-border);
}
.stat-number { display: block; font-size: 28px; font-weight: 700; }
.stat-label { display: block; font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.correct-stat .stat-number { color: #10b981; }
.wrong-stat .stat-number { color: #ef4444; }
.total-stat .stat-number { color: #3b82f6; }

.saved-msg { color: #10b981; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 6px; }

.actions-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

/* Buttons */
.action-btn {
  background: var(--primary-color); color: white; border: none; padding: 12px 24px;
  border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
}
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn:hover:not(:disabled) { background: var(--primary-hover); transform: scale(1.02); }
.outline-btn { background: transparent; border: 1px solid var(--surface-border); color: var(--text-main); }
.outline-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
</style>
