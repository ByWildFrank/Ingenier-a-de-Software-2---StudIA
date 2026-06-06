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

  // --- Getters ---

  getTitulo() {
    return this.titulo;
  }

  getRutaArchivo() {
    return this.ruta_archivo;
  }

  getTipoArchivo() {
    return this.tipo_archivo;
  }

  getTamanoBytes() {
    return this.tamaño_bytes;
  }

  getFechaCreacion() {
    return this.fecha_creacion;
  }

  getActivo() {
    return this.activo;
  }

  // --- Setters ---

  setTitulo(titulo) {
    this.titulo = titulo;
  }

  setRutaArchivo(rutaArchivo) {
    this.ruta_archivo = rutaArchivo;
  }

  setTipoArchivo(tipoArchivo) {
    this.tipo_archivo = tipoArchivo;
  }

  setTamanoBytes(tamanoBytes) {
    this.tamaño_bytes = tamanoBytes;
  }

  setFechaCreacion(fechaCreacion) {
    this.fecha_creacion = fechaCreacion;
  }

  setActivo(activo) {
    this.activo = activo;
  }

  // --- Métodos de Negocio ---

  /**
   * Extrae el texto del documento usando la estrategia correspondiente según el tipo de archivo.
   * Delega al servicio de IA que implementa el Patrón Estrategia.
   * @returns {Promise<{tipo: string, datos: object}>} Objeto tipado con el resultado de la estrategia.
   */
  async extraerTextoDocumento() {
    const path = require('path');
    const aiService = require('../services/ai.service');
    const filePath = path.join(__dirname, '../../uploads', this.ruta_archivo);
    return await aiService.extraerTextoSiEsNecesario(filePath);
  }

  /**
   * Genera flashcards a partir del contenido del apunte usando inteligencia artificial.
   * Delega al servicio de flashcards para la generación y persistencia.
   * @returns {Promise<List<Flashcard>>} Lista de flashcards generadas.
   */
  async generarFlashcardsPorIA() {
    const flashcardsService = require('../services/flashcards.service');
    return await flashcardsService.generarYGuardar(this.id_apunte);
  }

  // --- Métodos de Infraestructura ---

  static desdeDB(row) {
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

  static validar(data) {
    if (!data.id_materia) throw new Error("El apunte debe pertenecer a una materia");
    if (!data.titulo) throw new Error("El título del apunte es obligatorio");
    if (!data.ruta_archivo) throw new Error("La ruta del archivo es obligatoria");
  }
}

module.exports = Apunte;
