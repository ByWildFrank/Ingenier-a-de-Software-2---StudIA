const { obtenerConexion } = require('../database/db');

exports.obtenerPorFlashcard = async (flashcardId) => {
  const pool = await obtenerConexion();
  const result = await pool.request()
    .input('flashcardId', flashcardId)
    .query(`
      SELECT RespuestaID, FlashcardID, Texto, EsCorrecta
      FROM RespuestasFlashcard
      WHERE FlashcardID = @flashcardId
    `);

  return result.recordset;
};

exports.crear = async (data) => {
  const pool = await obtenerConexion();
  const result = await pool.request()
    .input('flashcardId', data.flashcardId)
    .input('texto', data.texto)
    .input('esCorrecta', data.esCorrecta)
    .query(`
      INSERT INTO RespuestasFlashcard (FlashcardID, Texto, EsCorrecta)
      VALUES (@flashcardId, @texto, @esCorrecta);
      SELECT SCOPE_IDENTITY() AS id;
    `);

  return { id: result.recordset[0].id, ...data };
};
