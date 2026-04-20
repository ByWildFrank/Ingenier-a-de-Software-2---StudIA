class Materia {
  constructor({ id, nombre, descripcion }) {
    this.id = id;
    this.nombre = nombre?.trim();
    this.descripcion = descripcion?.trim();
  }

  static fromDB(row) {
    return new Materia({
      id: row.MateriaID,
      nombre: row.Nombre,
      descripcion: row.Descripcion
    });
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion
    };
  }

  static validate(data) {
    if (!data.nombre) throw new Error("El nombre de la materia es obligatorio");
  }
}

module.exports = Materia;
