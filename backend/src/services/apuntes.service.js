const { getConnection } = require('../database/db');

exports.getByUnidad = async (unidadId) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('unidadId', unidadId)
    .query(`
      SELECT ApunteID, UnidadID, Titulo, ArchivoURL, FechaSubida
      FROM Apuntes
      WHERE UnidadID = @unidadId
    `);

  return result.recordset;
};

exports.create = async (data) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('unidadId', data.unidadId)
    .input('titulo', data.titulo)
    .input('archivoURL', data.archivoURL)
    .query(`
      INSERT INTO Apuntes (UnidadID, Titulo, ArchivoURL, FechaSubida)
      VALUES (@unidadId, @titulo, @archivoURL, GETDATE());
      SELECT SCOPE_IDENTITY() AS id;
    `);

  return { id: result.recordset[0].id, ...data };
};
