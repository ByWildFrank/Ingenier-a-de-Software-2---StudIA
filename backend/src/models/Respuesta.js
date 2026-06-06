class Respuesta {
  constructor({ id_respuesta, id_flashcard, texto_respuesta, es_correcta, activo }) {
    this.id_respuesta = id_respuesta;
    this.id_flashcard = id_flashcard;
    this.texto_respuesta = texto_respuesta?.trim();
    this.es_correcta = es_correcta;
    this.activo = activo;
  }

  // --- Getters ---

  getTextoRespuesta() {
    return this.texto_respuesta;
  }

  getEsCorrecta() {
    return this.es_correcta;
  }

  getActivo() {
    return this.activo;
  }

  // --- Setters ---

  setTextoRespuesta(textoRespuesta) {
    this.texto_respuesta = textoRespuesta;
  }

  setEsCorrecta(esCorrecta) {
    this.es_correcta = esCorrecta;
  }

  setActivo(activo) {
    this.activo = activo;
  }

  // --- Métodos de Infraestructura ---

  static desdeDB(row) {
    return new Respuesta(row);
  }

  toJSON() {
    return {
      id_respuesta: this.id_respuesta,
      id_flashcard: this.id_flashcard,
      texto_respuesta: this.texto_respuesta,
      es_correcta: this.es_correcta,
      activo: this.activo
    };
  }

  static validar(data) {
    if (!data.id_flashcard) throw new Error("La respuesta debe pertenecer a una flashcard");
    if (!data.texto_respuesta) throw new Error("El texto de la respuesta es obligatorio");
  }
}

module.exports = Respuesta;
