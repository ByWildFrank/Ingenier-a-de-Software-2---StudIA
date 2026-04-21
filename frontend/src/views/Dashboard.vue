<template>
  <div class="dashboard-page">
    <header class="top-header">
      <div class="welcome-text">
        <h1>Bienvenido de vuelta, <span>{{ nombreCorto }}</span> 🚀</h1>
        <p>Aquí tienes un resumen de tu actividad en StudIA.</p>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="loading-center">
      <div class="loader"></div>
      <p class="mt-2">Cargando estadísticas...</p>
    </div>

    <div v-else class="dashboard-grid">
      <!-- Widget 1: Progreso General -->
      <div class="widget card-glass">
        <div class="widget-header">
          <div class="icon-box bg-blue"><i class='bx bx-line-chart'></i></div>
          <h3>Progreso General</h3>
        </div>
        <div class="widget-body">
          <div class="progress-circle" :style="circleGradient">
            <div class="inner-value">{{ stats.progresoPromedio }}%</div>
          </div>
          <p class="widget-desc">Promedio de aciertos en tus sesiones de estudio.</p>
        </div>
      </div>

      <!-- Widget 2: Materias -->
      <div class="widget card-glass">
        <div class="widget-header">
          <div class="icon-box bg-purple"><i class='bx bx-book-open'></i></div>
          <h3>Materias Activas</h3>
        </div>
        <div class="widget-body counters">
          <div class="big-number">{{ stats.totalMaterias }}</div>
          <p class="widget-desc">Materias en curso actualmente.</p>
          <button class="action-btn" @click="$router.push('/materias')">Ver mis materias</button>
        </div>
      </div>

      <!-- Widget 3: Apuntes -->
      <div class="widget card-glass">
        <div class="widget-header">
          <div class="icon-box bg-orange"><i class='bx bx-file'></i></div>
          <h3>Apuntes Subidos</h3>
        </div>
        <div class="widget-body counters">
          <div class="big-number">{{ stats.totalApuntes }}</div>
          <p class="widget-desc">Documentos procesados por la IA.</p>
          <button class="action-btn btn-secondary" @click="$router.push('/flashcards')">Subir nuevo</button>
        </div>
      </div>

      <!-- Widget 4: Flashcards -->
      <div class="widget card-glass widget-wide">
        <div class="widget-header">
          <div class="icon-box bg-green"><i class='bx bx-brain'></i></div>
          <h3>Flashcards</h3>
        </div>
        <div class="widget-body row-layout">
          <div class="stats-col">
            <span class="stat-label">Total generadas</span>
            <span class="stat-val highlight-blue">{{ stats.totalFlashcards }}</span>
          </div>
          <div class="stats-col">
            <span class="stat-label">Precisión</span>
            <span class="stat-val" :class="stats.precision >= 70 ? 'highlight-green' : 'highlight-red'">
              {{ stats.precision }}%
            </span>
          </div>
          <div class="stats-col">
            <span class="stat-label">Materias</span>
            <span class="stat-val">{{ stats.totalMaterias }}</span>
          </div>
          <button class="action-btn" @click="$router.push('/flashcards')">Estudiar ahora</button>
        </div>
      </div>

      <!-- Widget 5: Progreso por Materia -->
      <div class="widget card-glass widget-wide" v-if="stats.materias && stats.materias.length">
        <div class="widget-header">
          <div class="icon-box bg-purple"><i class='bx bx-bar-chart-alt-2'></i></div>
          <h3>Rendimiento por Materia</h3>
        </div>
        <div class="widget-body">
          <div class="materia-bars">
            <div class="materia-bar-row" v-for="m in stats.materias" :key="m.id_materia">
              <div class="bar-label">
                <span class="bar-name">{{ m.nombre_materia }}</span>
                <span class="bar-info">{{ m.sesiones }} sesiones · {{ m.mejor_puntaje || 0 }}%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: (m.mejor_puntaje || 0) + '%' }" :class="barColor(m.mejor_puntaje)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Widget 6: Historial reciente -->
      <div class="widget card-glass widget-wide" v-if="stats.historial && stats.historial.length">
        <div class="widget-header">
          <div class="icon-box bg-blue"><i class='bx bx-history'></i></div>
          <h3>Actividad Reciente</h3>
        </div>
        <div class="widget-body">
          <div class="history-list">
            <div class="history-item" v-for="h in stats.historial" :key="h.id_progreso">
              <div class="h-icon" :class="h.avance_porcentual >= 70 ? 'h-icon-ok' : 'h-icon-warn'">
                <i class='bx' :class="h.avance_porcentual >= 70 ? 'bxs-check-circle' : 'bxs-error-circle'"></i>
              </div>
              <div class="h-info">
                <span class="h-materia">{{ h.nombre_materia }}</span>
                <span class="h-detail">{{ h.comentarios }}</span>
              </div>
              <div class="h-score" :class="h.avance_porcentual >= 70 ? 'highlight-green' : 'highlight-red'">
                {{ h.avance_porcentual }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DashboardView',
  data() {
    return {
      usuario: null,
      loading: true,
      stats: {
        totalMaterias: 0,
        totalFlashcards: 0,
        totalApuntes: 0,
        progresoPromedio: 0,
        precision: 0,
        historial: [],
        materias: []
      }
    };
  },
  computed: {
    nombreCorto() {
      if (!this.usuario || !this.usuario.nombre) return 'Estudiante';
      return this.usuario.nombre.split(' ')[0];
    },
    circleGradient() {
      const pct = this.stats.progresoPromedio;
      return {
        background: `conic-gradient(var(--primary-color) ${pct}%, rgba(255,255,255,0.1) 0)`
      };
    }
  },
  async mounted() {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
    } else {
      this.$router.push('/login');
      return;
    }
    await this.loadStats();
  },
  methods: {
    async loadStats() {
      this.loading = true;
      try {
        const id = this.usuario?.id_usuario || 1;
        const res = await axios.get(`http://localhost:3000/api/dashboard/stats?id_usuario=${id}`);
        this.stats = res.data;
      } catch (e) {
        console.error("Error cargando stats:", e);
      } finally {
        this.loading = false;
      }
    },
    barColor(pct) {
      if (pct >= 70) return 'bar-green';
      if (pct >= 40) return 'bar-yellow';
      return 'bar-red';
    }
  }
};
</script>

<style scoped>
.dashboard-page { padding: 40px; animation: fadeIn 0.5s ease; }
.top-header { margin-bottom: 40px; }
.welcome-text h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
.welcome-text h1 span {
  color: var(--primary-color);
  background: -webkit-linear-gradient(45deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.welcome-text p { color: var(--text-muted); font-size: 16px; }
.mt-2 { margin-top: 8px; }

.loading-center { display: flex; flex-direction: column; align-items: center; padding: 60px 0; }
.loader {
  border: 4px solid var(--surface-border); border-top: 4px solid var(--primary-color);
  border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite;
}

/* Grid */
.dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

.card-glass {
  background: var(--surface-color); backdrop-filter: blur(12px);
  border: 1px solid var(--surface-border); border-radius: 20px;
  padding: 24px; transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
.card-glass:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.2); }
.widget-wide { grid-column: span 3; }

.widget-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.icon-box {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; font-size: 24px; color: white;
}
.bg-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.bg-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.bg-orange { background: linear-gradient(135deg, #f97316, #ea580c); }
.bg-green { background: linear-gradient(135deg, #10b981, #059669); }
.widget-header h3 { font-size: 18px; font-weight: 600; color: var(--text-main); }

.widget-body { display: flex; flex-direction: column; align-items: center; }
.counters .big-number { font-size: 48px; font-weight: 800; color: var(--text-main); line-height: 1; margin-bottom: 8px; }
.widget-desc { color: var(--text-muted); font-size: 14px; text-align: center; margin-bottom: 20px; }

.row-layout { flex-direction: row; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 16px; }
.stats-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.stat-label { color: var(--text-muted); font-size: 14px; }
.stat-val { font-size: 32px; font-weight: 700; }
.highlight-red { color: #f43f5e; } .highlight-green { color: #10b981; } .highlight-blue { color: #3b82f6; }

/* Progress Circle */
.progress-circle {
  width: 120px; height: 120px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px; position: relative;
}
.progress-circle::before { content: ""; position: absolute; inset: 10px; border-radius: 50%; background: var(--surface-color); }
.inner-value { position: relative; font-size: 28px; font-weight: 700; color: var(--text-main); }

/* Materia Bars */
.materia-bars { width: 100%; display: flex; flex-direction: column; gap: 16px; }
.materia-bar-row { width: 100%; }
.bar-label { display: flex; justify-content: space-between; margin-bottom: 6px; }
.bar-name { font-size: 14px; font-weight: 600; color: var(--text-main); }
.bar-info { font-size: 12px; color: var(--text-muted); }
.bar-track { width: 100%; height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s ease; }
.bar-green { background: linear-gradient(90deg, #10b981, #059669); }
.bar-yellow { background: linear-gradient(90deg, #f59e0b, #d97706); }
.bar-red { background: linear-gradient(90deg, #ef4444, #dc2626); }

/* History */
.history-list { width: 100%; display: flex; flex-direction: column; gap: 12px; }
.history-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; background: rgba(255,255,255,0.03);
  border-radius: 12px; border: 1px solid var(--surface-border);
}
.h-icon { font-size: 24px; }
.h-icon-ok { color: #10b981; } .h-icon-warn { color: #f59e0b; }
.h-info { flex: 1; display: flex; flex-direction: column; }
.h-materia { font-size: 14px; font-weight: 600; color: var(--text-main); }
.h-detail { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.h-score { font-size: 20px; font-weight: 700; }

/* Buttons */
.action-btn {
  background: var(--primary-color); color: white; border: none; padding: 12px 24px;
  border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; width: 100%;
}
.action-btn:hover { background: var(--primary-hover); transform: scale(1.02); }
.btn-secondary { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); }
.btn-secondary:hover { background: rgba(255,255,255,0.15); }

@media (max-width: 1024px) { .dashboard-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .widget-wide { grid-column: span 1; }
  .row-layout { flex-direction: column; gap: 24px; }
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
