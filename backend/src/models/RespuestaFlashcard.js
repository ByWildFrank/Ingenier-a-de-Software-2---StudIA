class RespuestaFlashcard {
  constructor({ id, flashcardId, texto, esCorrecta }) {
    this.id = id;
    this.flashcardId = flashcardId;
    this.texto = texto?.trim();
    this.esCorrecta = Boolean(esCorrecta);
  }

  static fromDB(row) {
    return new RespuestaFlashcard({
      id: row.RespuestaID,
      flashcardId: row.FlashcardID,
      texto: row.Texto,
      esCorrecta: row.EsCorrecta
    });
  }

  toJSON() {
    return {
      id: this.id,
      flashcardId: this.flashcardId,
      texto: this.texto,
      esCorrecta: this.esCorrecta
    };
  }

  static validate(data) {
    if (!data.flashcardId) throw new Error("La respuesta debe pertenecer a una flashcard");
    if (!data.texto) throw new Error("El texto de la respuesta es obligatorio");
    if (data.esCorrecta === undefined) throw new Error("Debe indicar si la respuesta es correcta");
  }
}

module.exports = RespuestaFlashcard;
