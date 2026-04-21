const { getConnection } = require('../database/db');

exports.getAll = async (id_usuario) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id_usuario', id_usuario)
    .execute('sp_Materia_ObtenerPorUsuario');
  return result.recordset;
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
    .execute('sp_Materia_ObtenerEstadisticas');
  return result.recordset;
};
