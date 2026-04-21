<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Crear Cuenta</h2>

      <form @submit.prevent="register">
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="nombre" type="text" required />
        </div>

        <div class="form-group">
          <label>Correo</label>
          <input v-model="correo" type="email" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="contraseña" type="password" required />
        </div>

        <div class="form-group">
          <label>Nivel Educativo</label>
          <input v-model="nivel_educativo" type="text" placeholder="Ej. Universidad, Secundaria" />
        </div>

        <button type="submit" class="btn-register">Registrarse</button>

        <p class="login-link">
          ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link>
        </p>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';

export default {
  name: 'RegisterView',
  data() {
    return {
      nombre: '',
      correo: '',
      contraseña: '',
      nivel_educativo: '',
      error: null
    };
  },
  methods: {
    async register() {
      this.error = null;

      try {
        const usuario = await authService.register(
          this.nombre, 
          this.correo, 
          this.contraseña, 
          this.nivel_educativo
        );

        // Opcional: auto-login
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.$router.push('/dashboard');

      } catch (err) {
        this.error = err.message || 'No se pudo crear la cuenta';
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #4a6cf7, #6a8dff);
}

.register-card {
  background: white;
  padding: 35px;
  width: 380px;
  border-radius: 14px;
  box-shadow: 0 6px 25px rgba(0,0,0,0.15);
  animation: fadeIn 0.4s ease;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.form-group {
  margin-bottom: 18px;
}

label {
  font-weight: 600;
  color: #444;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 5px;
  transition: 0.2s;
}

input:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 4px rgba(74,108,247,0.4);
}

.btn-register {
  width: 100%;
  padding: 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
  transition: 0.2s;
}

.btn-register:hover {
  background: #218838;
}

.login-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9em;
  color: #555;
}

.login-link a {
  color: #4a6cf7;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}

.error {
  margin-top: 12px;
  color: #d9534f;
  text-align: center;
  font-weight: 600;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
