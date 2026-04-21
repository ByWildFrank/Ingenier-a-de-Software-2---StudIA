<template>
  <div class="materias-page">
    <header class="top-header">
      <div class="header-row">
        <div>
          <h1>Mis Materias 📚</h1>
          <p>Gestiona tus materias y visualiza tu progreso de estudio.</p>
        </div>
        <button class="action-btn add-btn" @click="mostrarFormulario = true" v-if="!mostrarFormulario">
          <i class='bx bx-plus'></i> Nueva Materia
        </button>
      </div>
    </header>

    <!-- Formulario nueva materia -->
    <div v-if="mostrarFormulario" class="new-materia-card card-glass mb-4">
      <h3><i class='bx bx-book-add'></i> Crear nueva materia</h3>
      <div class="form-row mt-3">
        <input 
          class="modern-input" 
          v-model="nuevaMateria.nombre" 
          placeholder="Nombre de la materia"
          @keyup.enter="crearMateria"
        />
        <input 
          class="modern-input" 
          v-model="nuevaMateria.descripcion" 
          placeholder="Descripción (opcional)"
          @keyup.enter="crearMateria"
        />
      </div>
      <div class="form-actions mt-3">
        <button class="action-btn" @click="crearMateria" :disabled="!nuevaMateria.nombre.trim()">
          <i class='bx bx-check'></i> Guardar
        </button>
        <button class="action-btn outline-btn" @click="cancelarFormulario">
          Cancelar
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-center">
      <div class="loader"></div>
      <p class="mt-2">Cargando materias...</p>
    </div>

    <!-- Sin materias -->
    <div v-if="!loading && materias.length === 0" class="empty-state card-glass text-center">
      <div class="empty-icon">📖</div>
      <h2>No tenés materias todavía</h2>
      <p class="text-muted mt-2">Creá tu primera materia para comenzar a subir apuntes y generar flashcards.</p>
      <button class="action-btn mt-4" @click="mostrarFormulario = true">
        <i class='bx bx-plus'></i> Crear primera materia
      </button>
    </div>

    <!-- Lista de materias -->
    <div v-if="!loading && materias.length > 0" class="materias-grid">
      <div 
        class="materia-card card-glass" 
        v-for="m in materias" 
        :key="m.id_materia"
        :class="{ 'materia-expanded': materiaExpandidaId === m.id_materia }"
      >
        
        <!-- Header de la materia -->
        <div class="materia-header" @click="toggleMateria(m.id_materia)">
          <div class="materia-icon" :style="{ background: getGradient(m.id_materia) }">
            <i class='bx bx-book-bookmark'></i>
          </div>
          <div class="materia-info">
            <h3>{{ m.nombre_materia }}</h3>
            <p v-if="m.descripcion" class="materia-desc">{{ m.descripcion }}</p>
          </div>
          <div class="materia-chevron">
            <i class='bx' :class="materiaExpandidaId === m.id_materia ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
          </div>
          <button class="delete-btn" @click.stop="eliminarMateria(m.id_materia)" title="Eliminar materia">
            <i class='bx bx-trash'></i>
          </button>
        </div>

        <!-- Estadísticas (siempre visibles) -->
        <div class="materia-stats mt-3" @click="toggleMateria(m.id_materia)">
          <div class="stat-item">
            <i class='bx bx-file'></i>
            <span class="stat-val">{{ m.totalApuntes || 0 }}</span>
            <span class="stat-label">Apuntes</span>
          </div>
          <div class="stat-item">
            <i class='bx bx-cards'></i>
            <span class="stat-val">{{ m.totalFlashcards || 0 }}</span>
            <span class="stat-label">Flashcards</span>
          </div>
          <div class="stat-item">
            <i class='bx bx-bar-chart-alt-2'></i>
            <span class="stat-val">{{ m.sesiones || 0 }}</span>
            <span class="stat-label">Sesiones</span>
          </div>
        </div>

        <!-- Contenido Expandido: Apuntes -->
        <div v-if="materiaExpandidaId === m.id_materia" class="materia-details mt-4">
          <div class="details-section">
            <h4><i class='bx bx-list-ul'></i> Apuntes de esta materia</h4>
            
            <div v-if="loadingApuntes" class="loader-sm mt-3"></div>
            
            <div v-else-if="!apuntesPorMateria[m.id_materia] || apuntesPorMateria[m.id_materia].length === 0" class="empty-notes mt-3">
              <p>No hay apuntes subidos aún.</p>
            </div>

            <ul v-else class="notes-list mt-3">
              <li v-for="apunte in apuntesPorMateria[m.id_materia]" :key="apunte.id_apunte" class="note-item">
                <div class="note-info">
                  <i class='bx bxs-file-pdf note-icon' :class="fileIcon(apunte.tipo_archivo)"></i>
                  <span class="note-title">{{ apunte.titulo }}</span>
                </div>
                <div class="note-actions">
                  <!-- Botón Estudiar (si ya tiene tarjetas) -->
                  <button 
                    v-if="apunte.cantFlashcards > 0" 
                    class="btn-study-mini" 
                    @click="estudiarApunte(apunte.id_apunte)" 
                    title="Estudiar este apunte"
                  >
                    <i class='bx bx-play'></i> Estudiar
                  </button>

                  <!-- Botón Generar (si NO tiene tarjetas) -->
                  <button 
                    v-else 
                    class="btn-generate-mini" 
                    @click="generarParaApunte(apunte)" 
                    :disabled="generandoApunteId === apunte.id_apunte"
                  >
                    <template v-if="generandoApunteId === apunte.id_apunte">
                      <div class="loader-xs mr-2"></div> Generando...
                    </template>
                    <template v-else>
                      <i class='bx bx-wand'></i> Generar Flashcards
                    </template>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Barra de Progreso (siempre visible) -->
        <div class="progreso-section mt-3">
          <div class="progreso-header">
            <span class="progreso-label">Mejor puntaje</span>
            <span class="progreso-valor" :class="progresoClass(m.mejor_puntaje)">
              {{ m.mejor_puntaje || 0 }}%
            </span>
          </div>
          <div class="progreso-track">
            <div 
              class="progreso-fill" 
              :class="progresoBarClass(m.mejor_puntaje)" 
              :style="{ width: (m.mejor_puntaje || 0) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Acciones principales -->
        <div class="materia-actions mt-3">
          <router-link :to="'/flashcards'" class="action-btn small-btn">
            <i class='bx bx-plus-circle'></i> Nuevo apunte
          </router-link>
          <router-link :to="'/examen'" class="action-btn small-btn outline-btn">
            <i class='bx bx-brain'></i> Repasar todo
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MateriasView',
  data() {
    return {
      usuario: null,
      materias: [],
      loading: true,
      mostrarFormulario: false,
      materiaExpandidaId: null,
      loadingApuntes: false,
      apuntesPorMateria: {},
      nuevaMateria: {
        nombre: '',
        descripcion: ''
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
      this.loading = true;
      try {
        const id = this.usuario?.id_usuario;
        if (!id) return;
        // Obtener materias con estadísticas
        const res = await axios.get(`http://localhost:3000/api/materias/stats?id_usuario=${id}`);
        this.materias = res.data;
      } catch (e) {
        console.error("Error cargando materias con stats:", e);
      } finally {
        this.loading = false;
      }
    },
    async toggleMateria(id) {
      if (this.materiaExpandidaId === id) {
        this.materiaExpandidaId = null;
      } else {
        this.materiaExpandidaId = id;
        if (!this.apuntesPorMateria[id]) {
          await this.cargarApuntes(id);
        }
      }
    },
    async cargarApuntes(id_materia) {
      this.loadingApuntes = true;
      try {
        const res = await axios.get(`http://localhost:3000/api/apuntes/materia/${id_materia}`);
        this.apuntesPorMateria[id_materia] = res.data;
      } catch (e) {
        console.error("Error cargando apuntes:", e);
      } finally {
        this.loadingApuntes = false;
      }
    },
    async generarParaApunte(apunte) {
      if (this.generandoApunteId) return;
      this.generandoApunteId = apunte.id_apunte;
      try {
        await axios.post('http://localhost:3000/api/flashcards/generate', {
          id_apunte: apunte.id_apunte
        });
        // Refrescar apuntes de esta materia para actualizar el conteo
        await this.cargarApuntes(apunte.id_materia);
        // También refrescar materias para actualizar el conteo total de flashcards
        await this.cargarMaterias();
      } catch (e) {
        console.error("Error al generar para apunte:", e);
        alert("Hubo un error al generar las flashcards. Por favor, intenta de nuevo.");
      } finally {
        this.generandoApunteId = null;
      }
    },
    estudiarApunte(id_apunte) {
      this.$router.push(`/examen?id_apunte=${id_apunte}`);
    },
    fileIcon(tipo) {
      if (tipo?.includes('pdf')) return 'bxs-file-pdf';
      if (tipo?.includes('word')) return 'bxs-file-doc';
      if (tipo?.includes('image')) return 'bxs-file-image';
      return 'bxs-file';
    },
    async crearMateria() {
      if (!this.nuevaMateria.nombre.trim()) return;
      try {
        const id = this.usuario?.id_usuario || 1;
        await axios.post('http://localhost:3000/api/materias', {
          id_usuario: id,
          nombre_materia: this.nuevaMateria.nombre,
          descripcion: this.nuevaMateria.descripcion || ''
        });
        this.cancelarFormulario();
        await this.cargarMaterias();
      } catch (e) {
        alert("Error creando materia.");
        console.error(e);
      }
    },
    async eliminarMateria(id) {
      if (!confirm('¿Estás seguro de eliminar esta materia?')) return;
      try {
        await axios.delete(`http://localhost:3000/api/materias/${id}`);
        await this.cargarMaterias();
      } catch (e) {
        alert("Error eliminando materia.");
        console.error(e);
      }
    },
    cancelarFormulario() {
      this.mostrarFormulario = false;
      this.nuevaMateria = { nombre: '', descripcion: '' };
    },
    getGradient(id) {
      const gradients = [
        'linear-gradient(135deg, #3b82f6, #2563eb)',
        'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        'linear-gradient(135deg, #f97316, #ea580c)',
        'linear-gradient(135deg, #10b981, #059669)',
        'linear-gradient(135deg, #ec4899, #db2777)',
        'linear-gradient(135deg, #06b6d4, #0891b2)',
        'linear-gradient(135deg, #f59e0b, #d97706)'
      ];
      return gradients[id % gradients.length];
    },
    progresoClass(pct) {
      if (!pct) return 'val-zero';
      if (pct >= 70) return 'val-green';
      if (pct >= 40) return 'val-yellow';
      return 'val-red';
    },
    progresoBarClass(pct) {
      if (!pct) return '';
      if (pct >= 70) return 'fill-green';
      if (pct >= 40) return 'fill-yellow';
      return 'fill-red';
    }
  }
}
</script>

<style scoped>
.materias-page { padding: 40px; animation: fadeIn 0.5s ease; }

.top-header { margin-bottom: 32px; }
.header-row { display: flex; justify-content: space-between; align-items: flex-start; }
.top-header h1 { font-size: 30px; font-weight: 700; color: var(--text-main); }
.top-header p { color: var(--text-muted); font-size: 15px; margin-top: 6px; }

.mt-2 { margin-top: 8px; } .mt-3 { margin-top: 16px; } .mt-4 { margin-top: 24px; }
.mb-4 { margin-bottom: 24px; }
.text-center { text-align: center; }
.text-muted { color: var(--text-muted); }

.card-glass {
  background: var(--surface-color); backdrop-filter: blur(12px);
  border: 1px solid var(--surface-border); border-radius: 20px;
  padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* New materia form */
.new-materia-card h3 {
  font-size: 18px; font-weight: 600; color: var(--text-main);
  display: flex; align-items: center; gap: 8px;
}
.new-materia-card h3 i { font-size: 22px; color: var(--primary-color); }
.form-row { display: flex; gap: 12px; }
.modern-input {
  flex: 1; padding: 14px 16px; background: rgba(0,0,0,0.2);
  border: 1px solid var(--surface-border); border-radius: 10px;
  color: var(--text-main); font-size: 15px; outline: none;
}
.modern-input:focus { border-color: var(--primary-color); }
.form-actions { display: flex; gap: 10px; }

/* Empty state */
.empty-state { padding: 60px 40px; }
.empty-icon { font-size: 64px; margin-bottom: 16px; }
.empty-state h2 { font-size: 24px; font-weight: 700; color: var(--text-main); }

/* Loading */
.loading-center { display: flex; flex-direction: column; align-items: center; padding: 60px 0; }
.loader {
  border: 4px solid var(--surface-border); border-top: 4px solid var(--primary-color);
  border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite;
}

/* Grid */
.materias-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }

.materia-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }

/* Expanded state */
.materia-card.materia-expanded {
  grid-row: span 2;
  border-color: var(--primary-color);
  background: rgba(25, 29, 46, 0.95);
}

.materia-header { display: flex; align-items: center; gap: 16px; cursor: pointer; }
.materia-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: white; flex-shrink: 0;
}
.materia-info { flex: 1; min-width: 0; }
.materia-info h3 {
  font-size: 18px; font-weight: 700; color: var(--text-main);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.materia-desc { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.materia-chevron { font-size: 24px; color: var(--text-muted); transition: transform 0.3s; }
.delete-btn {
  background: none; border: none; color: var(--text-muted); font-size: 18px;
  cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.2s;
}
.delete-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }

/* Details Section */
.materia-details {
  border-top: 1px solid var(--surface-border);
  padding-top: 20px;
  animation: slideDown 0.3s ease-out;
}
.materia-details h4 {
  font-size: 14px; color: var(--text-main); font-weight: 600;
  display: flex; align-items: center; gap: 8px;
}
.materia-details h4 i { color: var(--primary-color); }

.notes-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.note-item {
  background: rgba(255,255,255,0.03);
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.note-item:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(59, 130, 246, 0.3);
}
.note-info { display: flex; align-items: center; gap: 12px; }
.note-icon { font-size: 20px; }
.bxs-file-pdf { color: #ef4444; }
.bxs-file-doc { color: #3b82f6; }
.note-title { font-size: 14px; color: var(--text-main); }

.btn-study-mini {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}
.btn-study-mini:hover {
  background: #10b981;
  color: white;
}

.btn-generate-mini {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}
.btn-generate-mini:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
  transform: scale(1.05);
}
.btn-generate-mini:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loader-sm {
  width: 24px; height: 24px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader-xs {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.mr-2 { margin-right: 8px; }

/* Stats */
.materia-stats {
  display: flex; gap: 8px;
  padding: 14px 0; border-top: 1px solid var(--surface-border);
  border-bottom: 1px solid var(--surface-border);
  cursor: pointer;
}
.stat-item {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.stat-item i { font-size: 18px; color: var(--primary-color); margin-bottom: 2px; }
.stat-val { font-size: 20px; font-weight: 700; color: var(--text-main); }
.stat-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

/* Progreso */
.progreso-section { }
.progreso-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.progreso-label { font-size: 13px; color: var(--text-muted); }
.progreso-valor { font-size: 16px; font-weight: 700; }
.val-zero { color: var(--text-muted); }
.val-green { color: #10b981; }
.val-yellow { color: #f59e0b; }
.val-red { color: #ef4444; }

.progreso-track {
  width: 100%; height: 8px; background: rgba(255,255,255,0.06);
  border-radius: 4px; overflow: hidden;
}
.progreso-fill {
  height: 100%; border-radius: 4px; transition: width 0.8s ease;
}
.fill-green { background: linear-gradient(90deg, #10b981, #059669); }
.fill-yellow { background: linear-gradient(90deg, #f59e0b, #d97706); }
.fill-red { background: linear-gradient(90deg, #ef4444, #dc2626); }

/* Actions */
.materia-actions { display: flex; gap: 8px; }

/* Buttons */
.action-btn {
  background: var(--primary-color); color: white; border: none; padding: 12px 24px;
  border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-size: 14px;
}
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn:hover:not(:disabled) { background: var(--primary-hover); transform: scale(1.02); }

.add-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  padding: 12px 20px; font-size: 14px;
}

.small-btn { padding: 10px 16px; font-size: 13px; flex: 1; justify-content: center; }
.outline-btn { background: transparent; border: 1px solid var(--surface-border); color: var(--text-main); }
.outline-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); }

@media (max-width: 768px) {
  .materias-grid { grid-template-columns: 1fr; }
  .form-row { flex-direction: column; }
  .header-row { flex-direction: column; gap: 16px; }
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
