class Materia {
  constructor({ id_materia, id_usuario, nombre_materia, descripcion, activo }) {
    this.id_materia = id_materia;
    this.id_usuario = id_usuario;
    this.nombre_materia = nombre_materia?.trim();
    this.descripcion = descripcion?.trim();
    this.activo = activo;
  }

  // --- Getters ---

  getNombreMateria() {
    return this.nombre_materia;
  }

  getDescripcion() {
    return this.descripcion;
  }

  getActivo() {
    return this.activo;
  }

  // --- Setters ---

  setNombreMateria(nombreMateria) {
    this.nombre_materia = nombreMateria;
  }

  setDescripcion(descripcion) {
    this.descripcion = descripcion;
  }

  setActivo(activo) {
    this.activo = activo;
  }

  // --- Métodos de Negocio ---

  /**
   * Calcula el avance general de la materia consultando las estadísticas.
   * @returns {Promise<Float>} El porcentaje de avance general.
   */
  async calcularAvanceGeneral() {
    const materiasService = require('../services/materias.service');
    const estadisticas = await materiasService.obtenerConEstadisticas(this.id_usuario);
    const miEstadistica = estadisticas.find(e => e.id_materia === this.id_materia);
    return miEstadistica ? miEstadistica.avance_porcentual || 0 : 0;
  }

  /**
   * Agrega un apunte a esta materia delegando al servicio de apuntes.
   * @param {Object} apunte - Datos del apunte a agregar.
   * @returns {Promise<Object>} El apunte creado.
   */
  async agregarApunte(apunte) {
    const apuntesService = require('../services/apuntes.service');
    return await apuntesService.crear({
      ...apunte,
      id_materia: this.id_materia
    });
  }

  /**
   * Registra un examen para esta materia delegando al servicio de flashcards/progreso.
   * @param {Object} examen - Datos del examen a registrar.
   * @returns {Promise<Object>} El progreso registrado.
   */
  async registrarExamen(examen) {
    const flashcardsService = require('../services/flashcards.service');
    return await flashcardsService.guardarProgreso({
      ...examen,
      id_materia: this.id_materia
    });
  }

  // --- Métodos de Infraestructura ---

  static desdeDB(row) {
    return new Materia(row);
  }

  toJSON() {
    return {
      id_materia: this.id_materia,
      id_usuario: this.id_usuario,
      nombre_materia: this.nombre_materia,
      descripcion: this.descripcion,
      activo: this.activo
    };
  }

  static validar(data) {
    if (!data.id_usuario) throw new Error("La materia debe pertenecer a un usuario");
    if (!data.nombre_materia) throw new Error("El nombre de la materia es obligatorio");
  }
}

module.exports = Materia;
