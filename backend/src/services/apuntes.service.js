const { obtenerConexion } = require('../database/db');

exports.obtenerPorMateria = async (materiaId) => {
  const pool = await obtenerConexion();
  const result = await pool.request()
    .input('id_materia', materiaId)
    .execute('sp_Apunte_ObtenerPorMateria');
  return result.recordset;
};

exports.obtenerPorId = async (id_apunte) => {
  const pool = await obtenerConexion();
  const result = await pool.request()
    .input('id_apunte', id_apunte)
    .execute('sp_Apunte_ObtenerPorID');
  return result.recordset[0];
};

exports.crear = async (data) => {
  const pool = await obtenerConexion();
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
