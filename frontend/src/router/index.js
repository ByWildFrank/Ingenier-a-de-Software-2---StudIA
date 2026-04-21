import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { requiresGuest: true } },
  { path: '/register', component: () => import('../views/Register.vue'), meta: { requiresGuest: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/materias', component: () => import('../views/Materias.vue'), meta: { requiresAuth: true } },
  { path: '/flashcards', component: () => import('../views/FlashcardsIA.vue'), meta: { requiresAuth: true } },
  { path: '/examen', component: () => import('../views/ExamenFlashcards.vue'), meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const usuarioItem = localStorage.getItem('usuario');
  let usuarioValido = false;
  
  if (usuarioItem) {
    try {
      const parsed = JSON.parse(usuarioItem);
      if (parsed && parsed.id_usuario) {
        usuarioValido = true;
      }
    } catch(e) {
      usuarioValido = false;
    }
  }

  // Si requiere autenticación y no hay usuario VÁLIDO (con id_usuario estructurado), al login
  if (to.meta.requiresAuth && !usuarioValido) {
    localStorage.removeItem('usuario'); // Limpiar cachés corruptos viejos
    next('/login');
  } 
  // Si está en el login/register y YA está autenticado, llevarlo al dashboard
  else if (to.meta.requiresGuest && usuarioValido) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
