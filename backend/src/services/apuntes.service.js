const { getConnection } = require('../database/db');

exports.getByMateria = async (materiaId) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id_materia', materiaId)
    .query(`
      SELECT 
        a.id_apunte, a.id_materia, a.titulo, a.ruta_archivo, a.tipo_archivo, a.tamaño_bytes, a.fecha_creacion,
        (SELECT COUNT(*) FROM Flashcard f WHERE f.id_apunte = a.id_apunte AND f.activa = 1) as cantFlashcards
      FROM Apunte a
      WHERE a.id_materia = @id_materia AND a.activo = 1
    `);
  return result.recordset;
};

exports.getById = async (id_apunte) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id_apunte', id_apunte)
    .execute('sp_Apunte_ObtenerPorID');
  return result.recordset[0];
};

exports.create = async (data) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id_materia', data.id_materia)
    .input('titulo', data.titulo)
    .input('ruta_archivo', data.ruta_archivo)
    .input('tipo_archivo', data.tipo_archivo)
    .input('tamaño_bytes', data.tamaño_bytes)
    .execute('sp_Apunte_Crear');

  const nuevoId = result.recordset[0] ? Object.values(result.recordset[0])[0] : null;
  return { id_apunte: nuevoId, ...data };
};
