<template>
  <div id="app-container" :class="{ 'has-sidebar': showSidebar }">
    <Sidebar v-if="showSidebar" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Sidebar
  },
  computed: {
    showSidebar() {
      // No mostrar sidebar en login ni register
      return this.$route.path !== '/login' && this.$route.path !== '/register';
    }
  }
}
</script>

<style>
/* Global Styling for Premium Dark Theme */
:root {
  --bg-color: #0f172a; /* Slate 900 */
  --surface-color: rgba(30, 41, 59, 0.7); /* Slate 800 with opacity for glass */
  --surface-border: rgba(255, 255, 255, 0.1);
  --primary-color: #3b82f6; /* Blue 500 */
  --primary-hover: #2563eb; /* Blue 600 */
  --text-main: #f8fafc; /* Slate 50 */
  --text-muted: #94a3b8; /* Slate 400 */
  --accent-color: #8b5cf6; /* Violet 500 */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
  background-attachment: fixed;
  min-height: 100vh;
}

#app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.has-sidebar .main-content {
  padding-left: 260px; /* Ancho del sidebar */
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-color);
}
::-webkit-scrollbar-thumb {
  background: var(--surface-border);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
</style>
