class Materia {
  constructor({ id_materia, id_usuario, nombre_materia, descripcion, activo }) {
    this.id_materia = id_materia;
    this.id_usuario = id_usuario;
    this.nombre_materia = nombre_materia?.trim();
    this.descripcion = descripcion?.trim();
    this.activo = activo;
  }

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
