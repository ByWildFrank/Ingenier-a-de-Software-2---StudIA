class Examen {
  constructor({ id_examen, id_materia, fecha, puntaje, cantidad_preguntas, activo }) {
    this.id_examen = id_examen;
    this.id_materia = id_materia;
    this.fecha = fecha;
    this.puntaje = puntaje;
    this.cantidad_preguntas = cantidad_preguntas;
    this.activo = activo;
  }

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
