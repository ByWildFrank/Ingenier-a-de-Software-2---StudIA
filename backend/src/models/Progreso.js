class Progreso {
  constructor({ id_progreso, id_usuario, id_materia, avance_porcentual, comentarios, activo }) {
    this.id_progreso = id_progreso;
    this.id_usuario = id_usuario;
    this.id_materia = id_materia;
    this.avance_porcentual = avance_porcentual;
    this.comentarios = comentarios?.trim();
    this.activo = activo;
  }

  static fromDB(row) {
    return new Progreso(row);
  }

  toJSON() {
    return {
      id_progreso: this.id_progreso,
      id_usuario: this.id_usuario,
      id_materia: this.id_materia,
      avance_porcentual: this.avance_porcentual,
      comentarios: this.comentarios,
      activo: this.activo
    };
  }
}

module.exports = Progreso;
