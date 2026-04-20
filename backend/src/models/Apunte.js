class Apunte {
  constructor({ id, unidadId, titulo, archivoURL, fechaSubida }) {
    this.id = id;
    this.unidadId = unidadId;
    this.titulo = titulo?.trim();
    this.archivoURL = archivoURL;
    this.fechaSubida = fechaSubida;
  }

  static fromDB(row) {
    return new Apunte({
      id: row.ApunteID,
      unidadId: row.UnidadID,
      titulo: row.Titulo,
      archivoURL: row.ArchivoURL,
      fechaSubida: row.FechaSubida
    });
  }

  toJSON() {
    return {
      id: this.id,
      unidadId: this.unidadId,
      titulo: this.titulo,
      archivoURL: this.archivoURL,
      fechaSubida: this.fechaSubida
    };
  }

  static validate(data) {
    if (!data.unidadId) throw new Error("El apunte debe pertenecer a una unidad");
    if (!data.titulo) throw new Error("El título del apunte es obligatorio");
    if (!data.archivoURL) throw new Error("El archivo del apunte es obligatorio");
  }
}

module.exports = Apunte;
