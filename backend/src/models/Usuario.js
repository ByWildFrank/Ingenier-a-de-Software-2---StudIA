class Usuario {
  constructor({ id_usuario, nombre, correo, contraseña, nivel_educativo, id_tipo_usuario, activo }) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.correo = correo;
    this.contraseña = contraseña;
    this.nivel_educativo = nivel_educativo;
    this.id_tipo_usuario = id_tipo_usuario;
    this.activo = activo;
  }

  // --- Getters ---

  getNombre() {
    return this.nombre;
  }

  getCorreo() {
    return this.correo;
  }

  getContrasena() {
    return this.contraseña;
  }

  getNivelEducativo() {
    return this.nivel_educativo;
  }

  getTipoUsuario() {
    return this.id_tipo_usuario;
  }

  getActivo() {
    return this.activo;
  }

  // --- Setters ---

  setNombre(nombre) {
    this.nombre = nombre;
  }

  setCorreo(correo) {
    this.correo = correo;
  }

  setContrasena(contrasena) {
    this.contraseña = contrasena;
  }

  setNivelEducativo(nivelEducativo) {
    this.nivel_educativo = nivelEducativo;
  }

  setTipoUsuario(tipoUsuario) {
    this.id_tipo_usuario = tipoUsuario;
  }

  setActivo(activo) {
    this.activo = activo;
  }

  // --- Métodos de Negocio ---

  /**
   * Registra al usuario en el sistema delegando al servicio de autenticación.
   * @returns {Promise<Usuario>} El usuario registrado.
   */
  async registrar() {
    const authService = require('../services/auth.service');
    return await authService.registrar(
      this.nombre,
      this.correo,
      this.contraseña,
      this.nivel_educativo
    );
  }

  /**
   * Inicia sesión validando credenciales contra la base de datos.
   * @param {string} correo - Correo electrónico.
   * @param {string} contrasena - Contraseña del usuario.
   * @returns {Promise<Boolean>} true si las credenciales son válidas.
   */
  static async iniciarSesion(correo, contrasena) {
    const authService = require('../services/auth.service');
    const usuario = await authService.iniciarSesion(correo, contrasena);
    return usuario !== null;
  }

  /**
   * Recupera la contraseña del usuario (placeholder para futura implementación).
   */
  async recuperarContrasena() {
    // Funcionalidad pendiente de implementación
    throw new Error('Funcionalidad de recuperación de contraseña aún no implementada.');
  }

  // --- Métodos de Infraestructura ---

  static desdeDB(row) {
    return new Usuario(row);
  }

  toJSON() {
    return {
      id_usuario: this.id_usuario,
      nombre: this.nombre,
      correo: this.correo,
      nivel_educativo: this.nivel_educativo,
      id_tipo_usuario: this.id_tipo_usuario,
      activo: this.activo
    };
  }
}

module.exports = Usuario;
