class Flashcard {
  constructor({ id, idApunte, pregunta, dificultad, activa }) {
    this.id = id;
    this.idApunte = idApunte;
    this.pregunta = pregunta?.trim();
    this.dificultad = dificultad ?? null;
    this.activa = activa ?? true;
  }

  static fromDB(row) {
    return new Flashcard({
      id: row.id_flashcard,
      idApunte: row.id_apunte,
      pregunta: row.pregunta,
      dificultad: row.dificultad,
      activa: row.activa
    });
  }

  toJSON() {
    return {
      id: this.id,
      idApunte: this.idApunte,
      pregunta: this.pregunta,
      dificultad: this.dificultad,
      activa: this.activa
    };
  }

  static validate(data) {
    if (!data.idApunte) throw new Error("La flashcard debe pertenecer a un apunte");
    if (!data.pregunta) throw new Error("La pregunta es obligatoria");
    if (data.dificultad !== null && data.dificultad !== undefined) {
      if (data.dificultad < 1 || data.dificultad > 5) {
        throw new Error("La dificultad debe estar entre 1 y 5");
      }
    }
  }
}

module.exports = Flashcard;
