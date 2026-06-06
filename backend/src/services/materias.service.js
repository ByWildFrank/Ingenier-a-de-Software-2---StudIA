const { obtenerConexion } = require('../database/db');
const Materia = require('../models/Materia');

exports.obtenerTodas = async (id_usuario) => {
  const pool = await obtenerConexion();
  const result = await pool.request()
    .input('id_usuario', id_usuario)
    .execute('sp_Materia_ObtenerPorUsuario');
  return result.recordset.map(row => Materia.desdeDB(row));
};

exports.obtenerPorId = async (id) => {
  const pool = await obtenerConexion();
  const result = await pool.request()
    .input('id_materia', id)
    .execute('sp_Materia_ObtenerPorID');
  return result.recordset[0] ? Materia.desdeDB(result.recordset[0]) : null;
};

exports.crear = async (data) => {
  const pool = await obtenerConexion();
  const result = await pool.request()
    .input('id_usuario', data.id_usuario)
    .input('nombre_materia', data.nombre_materia)
    .input('descripcion', data.descripcion || '')
    .execute('sp_Materia_Crear');

  const id_materia = result.recordset[0] ? Object.values(result.recordset[0])[0] : null;
  return Materia.desdeDB({ id_materia, ...data });
};

exports.actualizar = async (id, data) => {
  const pool = await obtenerConexion();
  await pool.request()
    .input('id_materia', id)
    .input('nombre_materia', data.nombre_materia)
    .input('descripcion', data.descripcion || '')
    .execute('sp_Materia_Actualizar');

  return true;
};

exports.eliminar = async (id) => {
  const pool = await obtenerConexion();
  await pool.request()
    .input('id_materia', id)
    .execute('sp_Materia_Eliminar');

  return true;
};

exports.obtenerConEstadisticas = async (id_usuario) => {
  const pool = await obtenerConexion();
  const result = await pool.request()
    .input('id_usuario', id_usuario)
    .execute('sp_Materia_ObtenerEstadisticas');
  return result.recordset;
};
