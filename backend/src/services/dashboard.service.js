const { getConnection } = require('../database/db');

exports.getStats = async (id_usuario) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('id_usuario', id_usuario)
    .execute('sp_Dashboard_ObtenerEstadisticas');

  // El SP devuelve 3 tablas (recordsets)
  const totals = result.recordsets[0][0] || {};
  const historial = result.recordsets[1] || [];
  const materias = result.recordsets[2] || [];

  return {
    totalMaterias: totals.totalMaterias || 0,
    totalFlashcards: totals.totalFlashcards || 0,
    totalApuntes: totals.totalApuntes || 0,
    progresoPromedio: Math.round(totals.progresoPromedio || 0),
    precision: Math.round(totals.precision || 0),
    historial,
    materias
  };
};
