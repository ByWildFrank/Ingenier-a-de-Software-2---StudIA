const { getConnection } = require('../database/db');

exports.getAll = async (id_usuario) => {
  const pool = await getConnection();
  if (id_usuario) {
    const result = await pool.request()
      .input('id_usuario', id_usuario)
      .query('SELECT * FROM Materia WHERE id_usuario = @id_usuario AND activo = 1');
    return result.recordset;
  } else {
    // Fallback if no user is specified (though all should specify)
    const result = await pool.request().execute('sp_Materia_Obtener');
    return result.recordset;
  }
};

exports.getById = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id_materia', id)
    .execute('sp_Materia_ObtenerPorID');
  return result.recordset[0];
};

exports.create = async (data) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id_usuario', data.id_usuario)
    .input('nombre_materia', data.nombre_materia)
    .input('descripcion', data.descripcion || '')
    .execute('sp_Materia_Crear');

  const id_materia = result.recordset[0] ? Object.values(result.recordset[0])[0] : null;
  return { id_materia, ...data };
};

exports.update = async (id, data) => {
  const pool = await getConnection();
  await pool.request()
    .input('id_materia', id)
    .input('nombre_materia', data.nombre_materia)
    .input('descripcion', data.descripcion || '')
    .execute('sp_Materia_Actualizar');

  return true;
};

exports.remove = async (id) => {
  const pool = await getConnection();
  await pool.request()
    .input('id_materia', id)
    .execute('sp_Materia_Eliminar');

  return true;
};

exports.getWithStats = async (id_usuario) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id_usuario', id_usuario)
    .query(`
      SELECT 
        m.id_materia, 
        m.nombre_materia, 
        m.descripcion,
        (SELECT COUNT(*) FROM Apunte a WHERE a.id_materia = m.id_materia AND a.activo = 1) as totalApuntes,
        (SELECT COUNT(*) FROM Flashcard f INNER JOIN Apunte a2 ON f.id_apunte = a2.id_apunte WHERE a2.id_materia = m.id_materia AND f.activa = 1 AND a2.activo = 1) as totalFlashcards,
        (SELECT COUNT(*) FROM Progreso p WHERE p.id_materia = m.id_materia AND p.id_usuario = @id_usuario AND p.activo = 1) as sesiones,
        (SELECT ISNULL(MAX(p2.avance_porcentual), 0) FROM Progreso p2 WHERE p2.id_materia = m.id_materia AND p2.id_usuario = @id_usuario AND p2.activo = 1) as mejor_puntaje
      FROM Materia m
      WHERE m.id_usuario = @id_usuario AND m.activo = 1
    `);
  return result.recordset;
};
