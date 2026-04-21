class Apunte {
  constructor({ id_apunte, id_materia, titulo, ruta_archivo, tipo_archivo, tamaño_bytes, fecha_creacion, activo }) {
    this.id_apunte = id_apunte;
    this.id_materia = id_materia;
    this.titulo = titulo?.trim();
    this.ruta_archivo = ruta_archivo;
    this.tipo_archivo = tipo_archivo;
    this.tamaño_bytes = tamaño_bytes;
    this.fecha_creacion = fecha_creacion;
    this.activo = activo;
  }

  static fromDB(row) {
    return new Apunte(row);
  }

  toJSON() {
    return {
      id_apunte: this.id_apunte,
      id_materia: this.id_materia,
      titulo: this.titulo,
      ruta_archivo: this.ruta_archivo,
      tipo_archivo: this.tipo_archivo,
      tamaño_bytes: this.tamaño_bytes,
      fecha_creacion: this.fecha_creacion,
      activo: this.activo
    };
  }

  static validate(data) {
    if (!data.id_materia) throw new Error("El apunte debe pertenecer a una materia");
    if (!data.titulo) throw new Error("El título del apunte es obligatorio");
    if (!data.ruta_archivo) throw new Error("La ruta del archivo es obligatoria");
  }
}

module.exports = Apunte;
