<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <i class='bx bxs-graduation'></i>
        <span>StudIA</span>
      </div>
    </div>

    <ul class="nav-links">
      <li>
        <router-link to="/dashboard" active-class="active">
          <i class='bx bx-grid-alt'></i>
          <span class="link-name">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/materias" active-class="active">
          <i class='bx bx-book-bookmark'></i>
          <span class="link-name">Materias</span>
        </router-link>
      </li>
      <li>
        <router-link to="/flashcards" active-class="active">
          <i class='bx bx-cloud-upload'></i>
          <span class="link-name">Crear Flashcards</span>
        </router-link>
      </li>
      <li>
        <router-link to="/examen" active-class="active">
          <i class='bx bx-brain'></i>
          <span class="link-name">Usar Flashcards</span>
        </router-link>
      </li>
      <li>
        <router-link to="/crear-examen" active-class="active">
          <i class='bx bx-edit-alt'></i>
          <span class="link-name">Crear Examen</span>
        </router-link>
      </li>
      <li>
        <router-link to="/pomodoro" active-class="active">
          <i class='bx bx-timer'></i>
          <span class="link-name">Pomodoro</span>
        </router-link>
      </li>
    </ul>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="avatar">
          <i class='bx bx-user'></i>
        </div>
        <div class="details">
          <span class="name">{{ usuario?.nombre || 'Usuario' }}</span>
          <span class="role">Estudiante</span>
        </div>
      </div>
      <button class="logout-btn" @click="cerrarSesion" title="Cerrar sesión">
        <i class='bx bx-log-out'></i>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AppSidebar',
  data() {
    return {
      usuario: null
    }
  },
  mounted() {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
    }
  },
  methods: {
    cerrarSesion() {
      localStorage.removeItem('usuario');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 260px;
  background: var(--surface-color);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-right: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: all 0.3s ease;
}

.sidebar-header {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.logo i {
  color: var(--primary-color);
  font-size: 32px;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}

.nav-links {
  margin-top: 20px;
  list-style: none;
  flex: 1;
  padding: 0 12px;
}

.nav-links li {
  margin-bottom: 8px;
}

.nav-links a {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 15px;
  font-weight: 500;
  padding: 14px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.nav-links a i {
  font-size: 22px;
  transition: all 0.3s ease;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
  transform: translateX(4px);
}

.nav-links a.active {
  background: linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.1) 100%);
  color: var(--primary-color);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.nav-links a.active i {
  filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.4));
}

.sidebar-footer {
  padding: 20px 16px;
  border-top: 1px solid var(--surface-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.details {
  display: flex;
  flex-direction: column;
}

.name {
  color: var(--text-main);
  font-size: 14px;
  font-weight: 600;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role {
  color: var(--text-muted);
  font-size: 12px;
}

.logout-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 22px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
</style>
