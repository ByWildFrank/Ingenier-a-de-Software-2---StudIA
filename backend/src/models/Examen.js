class Examen {
  constructor({ id_examen, id_materia, fecha, puntaje, cantidad_preguntas, activo }) {
    this.id_examen = id_examen;
    this.id_materia = id_materia;
    this.fecha = fecha;
    this.puntaje = puntaje;
    this.cantidad_preguntas = cantidad_preguntas;
    this.activo = activo;
  }

  // --- Getters ---

  getFecha() {
    return this.fecha;
  }

  getPuntaje() {
    return this.puntaje;
  }

  getCantidadPreguntas() {
    return this.cantidad_preguntas;
  }

  getActivo() {
    return this.activo;
  }

  // --- Setters ---

  setFecha(fecha) {
    this.fecha = fecha;
  }

  setPuntaje(puntaje) {
    this.puntaje = puntaje;
  }

  setCantidadPreguntas(cantidadPreguntas) {
    this.cantidad_preguntas = cantidadPreguntas;
  }

  setActivo(activo) {
    this.activo = activo;
  }

  // --- Métodos de Negocio ---

  /**
   * Calcula el porcentaje de aprobación del examen.
   * @returns {Float} El porcentaje de aprobación (0 a 100).
   */
  calcularPorcentajeAprobacion() {
    if (!this.cantidad_preguntas || this.cantidad_preguntas === 0) {
      return 0;
    }
    return (this.puntaje / this.cantidad_preguntas) * 100;
  }

  // --- Métodos de Infraestructura ---

  static desdeDB(row) {
    return new Examen(row);
  }

  toJSON() {
    return {
      id_examen: this.id_examen,
      id_materia: this.id_materia,
      fecha: this.fecha,
      puntaje: this.puntaje,
      cantidad_preguntas: this.cantidad_preguntas,
      activo: this.activo
    };
  }
}

module.exports = Examen;
