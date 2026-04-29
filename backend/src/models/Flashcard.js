class Flashcard {
  constructor({ id_flashcard, id_apunte, pregunta, dificultad, activa, activo, titulo }) {
    this.id_flashcard = id_flashcard;
    this.id_apunte = id_apunte;
    this.pregunta = pregunta?.trim();
    this.dificultad = dificultad ?? null;
    this.activa = activa ?? true;
    this.activo = activo ?? true;
    this.titulo = titulo?.trim() || '';
  }

  static desdeDB(row) {
    return new Flashcard(row);
  }

  toJSON() {
    return {
      id_flashcard: this.id_flashcard,
      id_apunte: this.id_apunte,
      pregunta: this.pregunta,
      dificultad: this.dificultad,
      activa: this.activa,
      activo: this.activo,
      titulo: this.titulo
    };
  }

  static validar(data) {
    if (!data.id_apunte) throw new Error("La flashcard debe pertenecer a un apunte");
    if (!data.pregunta) throw new Error("La pregunta es obligatoria");
    if (data.dificultad !== null && data.dificultad !== undefined) {
      if (data.dificultad < 1 || data.dificultad > 5) {
        throw new Error("La dificultad debe estar entre 1 y 5");
      }
    }
  }
}

module.exports = Flashcard;
