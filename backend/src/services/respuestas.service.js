const { obtenerConexion } = require('../database/db');
const Respuesta = require('../models/Respuesta');

exports.obtenerPorFlashcard = async (flashcardId) => {
  const pool = await obtenerConexion();
  const result = await pool.request()
    .input('id_flashcard', flashcardId)
    .execute('sp_Respuesta_ObtenerPorFlashcard');

  return result.recordset.map(row => Respuesta.desdeDB(row));
};

exports.crear = async (data) => {
  const pool = await obtenerConexion();
  const result = await pool.request()
    .input('id_flashcard', data.id_flashcard)
    .input('texto_respuesta', data.texto_respuesta)
    .input('es_correcta', data.es_correcta)
    .execute('sp_Respuesta_Crear');

  return Respuesta.desdeDB({
    id_respuesta: Object.values(result.recordset[0])[0],
    ...data
  });
};
