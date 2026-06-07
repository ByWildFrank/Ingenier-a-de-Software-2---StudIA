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

  // --- Getters ---

  getTitulo() {
    return this.titulo;
  }

  getPregunta() {
    return this.pregunta;
  }

  getDificultad() {
    return this.dificultad;
  }

  getActiva() {
    return this.activa;
  }

  getActivo() {
    return this.activo;
  }

  // --- Setters ---

  setTitulo(titulo) {
    this.titulo = titulo;
  }

  setPregunta(pregunta) {
    this.pregunta = pregunta;
  }

  setDificultad(dificultad) {
    this.dificultad = dificultad;
  }

  setActiva(activa) {
    this.activa = activa;
  }

  setActivo(activo) {
    this.activo = activo;
  }

  // --- Métodos de Negocio ---

  /**
   * Evalúa si el texto de respuesta proporcionado coincide con la respuesta correcta.
   * @param {string} textoRespuesta - El texto de la respuesta seleccionada por el usuario.
   * @returns {Boolean} true si la respuesta es correcta.
   */
  evaluarRespuesta(textoRespuesta) {
    if (!this.respuestas || !Array.isArray(this.respuestas)) {
      return false;
    }
    const correcta = this.respuestas.find(r => r.es_correcta === true);
    if (!correcta) return false;
    return (correcta.texto_respuesta || correcta.texto) === textoRespuesta;
  }

  /**
   * Actualiza el nivel de dificultad de la flashcard.
   * @param {Integer} nivel - Nuevo nivel de dificultad (1 a 5).
   */
  actualizarDificultad(nivel) {
    if (nivel < 1 || nivel > 5) {
      throw new Error("La dificultad debe estar entre 1 y 5");
    }
    this.dificultad = nivel;
  }

  // --- Métodos de Infraestructura ---

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
      titulo: this.titulo,
      respuestas: this.respuestas || []
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
