const { getConnection } = require('../database/db');

exports.getByUnidad = async (unidadId) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('unidadId', unidadId)
    .query(`
      SELECT FlashcardID, UnidadID, Pregunta
      FROM Flashcards
      WHERE UnidadID = @unidadId
    `);

  return result.recordset;
};

exports.create = async (data) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('unidadId', data.unidadId)
    .input('pregunta', data.pregunta)
    .query(`
      INSERT INTO Flashcards (UnidadID, Pregunta)
      VALUES (@unidadId, @pregunta);
      SELECT SCOPE_IDENTITY() AS id;
    `);

  return { id: result.recordset[0].id, ...data };
};
