<template>
  <div class="flashcards-page">
    <header class="top-header">
      <h1>Crear Flashcards 🧠</h1>
      <p>Selecciona tu materia, sube un apunte y genera tarjetas inteligentes con IA.</p>
    </header>

    <!-- Fase 1: Materia y Apunte -->
    <div class="upload-section card-glass" v-if="!apunteSubido && !generando && !generacionCompleta">
      
      <!-- Selección de Materia -->
      <div class="materia-selector mb-4">
        <h3>1. ¿A qué materia pertenece este apunte?</h3>
        
        <div v-if="!creandoMateria">
          <select class="modern-select" v-model="idMateriaSeleccionada">
            <option disabled value="">-- Elige una materia --</option>
            <option v-for="m in materias" :key="m.id_materia" :value="m.id_materia">
              {{ m.nombre_materia }}
            </option>
            <option value="NEW">+ Añadir nueva materia...</option>
          </select>
        </div>

        <div v-else class="new-materia-form mt-2">
          <input 
            type="text" 
            class="modern-input" 
            v-model="nuevaMateriaNombre" 
            placeholder="Nombre de la nueva materia"
            @keyup.enter="guardarNuevaMateria"
          />
          <button class="action-btn small-btn ml-2" @click="guardarNuevaMateria">Guardar</button>
          <button class="action-btn outline-btn small-btn ml-2" @click="cancelarNuevaMateria">Cancelar</button>
        </div>
      </div>

      <!-- Subir archivo -->
      <div v-if="idMateriaSeleccionada && idMateriaSeleccionada !== 'NEW'">
        
        <!-- Info de flashcards existentes -->
        <div v-if="flashcardsExistentes > 0" class="existing-cards-banner mb-4">
          <div class="banner-content">
            <i class='bx bx-info-circle'></i>
            <div>
              Ya hay <strong>{{ flashcardsExistentes }} flashcards</strong> en esta materia. 
              Podés <router-link to="/examen" class="link-estudiar">estudiarlas aquí</router-link>.
            </div>
          </div>
        </div>

        <h3>2. Selecciona tu archivo</h3>
        <div class="upload-box" @click="$refs.fileInput.click()">
          <i class='bx bx-cloud-upload upload-icon'></i>
          <p class="mt-2">Haz clic para seleccionar tu Apunte</p>
          <span class="file-types">Soporta: .pdf, .docx, .ppt, imágenes, .txt</span>
          <input 
            type="file" 
            ref="fileInput" 
            hidden 
            @change="manejarArchivo" 
          />
        </div>

        <div v-if="archivoSeleccionado" class="selected-file mt-4">
          <i class='bx bx-file'></i> {{ archivoSeleccionado.name }}
          <button class="action-btn w-full mt-3" @click="subirApunte" :disabled="subiendo">
            {{ subiendo ? 'Subiendo al servidor...' : '3. Subir Archivo' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Fase 2: Apunte listo para IA -->
    <div class="ai-section card-glass text-center" v-if="apunteSubido && !generando && !generacionCompleta">
      <div class="success-icon mb-3"><i class='bx bxs-check-circle'></i></div>
      <h3>¡Apunte Registrado!</h3>
      <p>Archivo: <strong>{{ apunteSubido.titulo || archivoSeleccionado?.name }}</strong></p>
      <p class="text-muted mt-2">Materia: {{ materiaNombre }}</p>
      <button class="action-btn gemini-btn mt-4" @click="generarConIA">
        <i class='bx bxs-magic-wand'></i> Generar Flashcards con IA
      </button>
    </div>

    <!-- Fase 3: Estado de Carga -->
    <div class="loading-state card-glass" v-if="generando">
      <div class="loader"></div>
      <h3 class="mt-4">Google Gemini está procesando...</h3>
      <p>Extrayendo contenido y generando tarjetas de estudio.</p>
    </div>

    <!-- Fase 4: Generación completada -->
    <div v-if="generacionCompleta" class="result-section">
      <div class="result-card card-glass text-center">
        <div class="result-emoji">🎉</div>
        <h2>¡Flashcards Generadas!</h2>
        <p class="text-muted mt-2">Se crearon <strong>{{ cantidadGeneradas }}</strong> tarjetas para <strong>{{ materiaNombre }}</strong></p>

        <div class="result-stats mt-4">
          <div class="r-stat">
            <i class='bx bx-cards'></i>
            <span>{{ cantidadGeneradas }}</span>
            <small>Tarjetas</small>
          </div>
          <div class="r-stat">
            <i class='bx bx-book-open'></i>
            <span>{{ materiaNombre }}</span>
            <small>Materia</small>
          </div>
        </div>

        <div class="result-actions mt-4">
          <router-link to="/examen" class="action-btn study-btn">
            <i class='bx bx-play'></i> Estudiar ahora
          </router-link>
          <button class="action-btn outline-btn" @click="reiniciarProceso">
            <i class='bx bx-plus'></i> Crear más flashcards
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FlashcardsIA',
  data() {
    return {
      usuario: null,
      materias: [],
      idMateriaSeleccionada: '',
      creandoMateria: false,
      nuevaMateriaNombre: '',
      archivoSeleccionado: null,
      subiendo: false,
      apunteSubido: null,
      generando: false,
      flashcardsExistentes: 0,
      generacionCompleta: false,
      cantidadGeneradas: 0
    }
  },
  computed: {
    materiaNombre() {
      const m = this.materias.find(m => m.id_materia === this.idMateriaSeleccionada);
      return m ? m.nombre_materia : '';
    }
  },
  watch: {
    idMateriaSeleccionada(val) {
      if (val === 'NEW') {
        this.creandoMateria = true;
      } else if (val) {
        this.contarFlashcards(val);
      }
    }
  },
  async mounted() {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
    }
    await this.cargarMaterias();
  },
  methods: {
    async cargarMaterias() {
      try {
        const id = this.usuario?.id_usuario;
        if (!id) return;
        const res = await axios.get(`http://localhost:3000/api/materias?id_usuario=${id}`);
        this.materias = res.data;
        if (this.materias.length === 0) this.idMateriaSeleccionada = 'NEW';
      } catch (e) { console.error(e); }
    },
    async contarFlashcards(id) {
      try {
        const res = await axios.get(`http://localhost:3000/api/flashcards/materia/${id}`);
        this.flashcardsExistentes = res.data.length;
      } catch (e) { this.flashcardsExistentes = 0; }
    },
    cancelarNuevaMateria() {
      this.creandoMateria = false;
      this.nuevaMateriaNombre = '';
      this.idMateriaSeleccionada = '';
    },
    async guardarNuevaMateria() {
      if (!this.nuevaMateriaNombre.trim()) return;
      try {
        const id = this.usuario?.id_usuario;
        if (!id) return;
        const res = await axios.post('http://localhost:3000/api/materias', {
          id_usuario: id,
          nombre_materia: this.nuevaMateriaNombre,
          descripcion: 'Automática desde apuntes'
        });
        await this.cargarMaterias();
        this.idMateriaSeleccionada = res.data.id_materia;
        this.creandoMateria = false;
        this.nuevaMateriaNombre = '';
      } catch (e) { alert("Error creando materia."); }
    },
    manejarArchivo(event) {
      if (event.target.files.length > 0) this.archivoSeleccionado = event.target.files[0];
    },
    async subirApunte() {
      if (!this.archivoSeleccionado || !this.idMateriaSeleccionada) return;
      this.subiendo = true;
      const formData = new FormData();
      formData.append('archivo', this.archivoSeleccionado);
      formData.append('id_materia', this.idMateriaSeleccionada);
      try {
        const res = await axios.post('http://localhost:3000/api/apuntes', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.apunteSubido = res.data;
      } catch (e) {
        console.error(e);
        alert("Error subiendo el archivo.");
      } finally { this.subiendo = false; }
    },
    async generarConIA() {
      this.generando = true;
      try {
        const res = await axios.post('http://localhost:3000/api/flashcards/generate', {
          id_apunte: this.apunteSubido.id_apunte
        });
        this.cantidadGeneradas = res.data.length;
        this.generacionCompleta = true;
      } catch (e) {
        console.error(e);
        alert("Error generando flashcards.");
      } finally { this.generando = false; }
    },
    reiniciarProceso() {
      this.archivoSeleccionado = null;
      this.apunteSubido = null;
      this.generacionCompleta = false;
      this.cantidadGeneradas = 0;
      this.idMateriaSeleccionada = '';
      this.flashcardsExistentes = 0;
    }
  }
}
</script>

<style scoped>
.flashcards-page { padding: 40px; animation: fadeIn 0.5s ease; }
.top-header { margin-bottom: 32px; }
.top-header h1 { font-size: 30px; font-weight: 700; color: var(--text-main); }
.top-header p { color: var(--text-muted); font-size: 15px; margin-top: 6px; }

h3 { color: var(--text-main); margin-bottom: 12px; font-weight: 600; }
.mt-2 { margin-top: 8px; } .mt-3 { margin-top: 16px; } .mt-4 { margin-top: 24px; }
.mb-4 { margin-bottom: 24px; } .ml-2 { margin-left: 8px; }
.w-full { width: 100%; } .text-center { text-align: center; }
.text-muted { color: var(--text-muted); }

.card-glass {
  background: var(--surface-color); backdrop-filter: blur(12px);
  border: 1px solid var(--surface-border); border-radius: 20px;
  padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
.modern-select, .modern-input {
  width: 100%; padding: 14px 16px; background: rgba(0,0,0,0.2);
  border: 1px solid var(--surface-border); border-radius: 10px;
  color: var(--text-main); font-size: 15px; outline: none;
}
.modern-select option { background: #1a1e2f; color: #fff; }
.new-materia-form { display: flex; align-items: center; }

/* Existing cards banner */
.existing-cards-banner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-radius: 14px;
  background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2);
}
.banner-content { display: flex; align-items: center; gap: 12px; color: var(--text-main); font-size: 15px; }
.banner-content i { font-size: 24px; color: #3b82f6; }
.link-estudiar { color: #10b981; font-weight: 600; text-decoration: underline; }

/* Upload */
.upload-box {
  border: 2px dashed var(--surface-border); border-radius: 14px;
  padding: 40px 20px; text-align: center; cursor: pointer;
  background: rgba(0,0,0,0.1); transition: all 0.3s ease;
}
.upload-box:hover { border-color: var(--primary-color); background: rgba(59,130,246,0.05); }
.upload-icon { font-size: 54px; color: var(--primary-color); }
.file-types { display: block; font-size: 13px; color: var(--text-muted); margin-top: 6px; }
.selected-file {
  background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;
  display: flex; flex-direction: column; align-items: center; font-weight: 600;
}
.success-icon i { font-size: 80px; color: #10b981; }
.gemini-btn {
  background: linear-gradient(135deg, #10b981, #3b82f6); font-size: 18px;
  display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px;
}
.loading-state { display: flex; flex-direction: column; align-items: center; }
.loader {
  border: 4px solid var(--surface-border); border-top: 4px solid var(--accent-color);
  border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite;
}

/* Result Section */
.result-section { max-width: 560px; margin: 0 auto; }
.result-emoji { font-size: 64px; margin-bottom: 8px; }
.result-card h2 { font-size: 28px; font-weight: 700; color: var(--text-main); }

.result-stats { display: flex; justify-content: center; gap: 32px; }
.r-stat {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 20px 28px; border-radius: 14px;
  background: rgba(255,255,255,0.03); border: 1px solid var(--surface-border);
}
.r-stat i { font-size: 28px; color: var(--primary-color); }
.r-stat span { font-size: 20px; font-weight: 700; color: var(--text-main); }
.r-stat small { font-size: 12px; color: var(--text-muted); }

.result-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

.study-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  text-decoration: none;
}

/* Buttons */
.action-btn {
  background: var(--primary-color); color: white; border: none; padding: 12px 24px;
  border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  display: inline-flex; align-items: center; gap: 8px;
}
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn:hover:not(:disabled) { background: var(--primary-hover); transform: scale(1.02); }
.small-btn { padding: 12px 16px; font-size: 13px; }
.outline-btn { background: transparent; border: 1px solid var(--surface-border); color: var(--text-main); }
.outline-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
