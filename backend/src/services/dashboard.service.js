const { getConnection } = require('../database/db');

exports.getStats = async (id_usuario) => {
  const pool = await getConnection();

  // 1. Cantidad de materias activas del usuario
  const materiasRes = await pool.request()
    .input('id_usuario', id_usuario)
    .query(`SELECT COUNT(*) AS total FROM Materia WHERE id_usuario = @id_usuario AND activo = 1`);
  const totalMaterias = materiasRes.recordset[0].total;

  // 2. Total de flashcards generadas (a través de apuntes del usuario)
  const fcRes = await pool.request()
    .input('id_usuario', id_usuario)
    .query(`
      SELECT COUNT(*) AS total
      FROM Flashcard f
      INNER JOIN Apunte a ON f.id_apunte = a.id_apunte
      INNER JOIN Materia m ON a.id_materia = m.id_materia
      WHERE m.id_usuario = @id_usuario AND f.activo = 1
    `);
  const totalFlashcards = fcRes.recordset[0].total;

  // 3. Total de apuntes subidos
  const apuntesRes = await pool.request()
    .input('id_usuario', id_usuario)
    .query(`
      SELECT COUNT(*) AS total
      FROM Apunte a
      INNER JOIN Materia m ON a.id_materia = m.id_materia
      WHERE m.id_usuario = @id_usuario AND a.activo = 1
    `);
  const totalApuntes = apuntesRes.recordset[0].total;

  // 4. Progreso promedio general (mejor progreso por materia, promediado)
  const progresoRes = await pool.request()
    .input('id_usuario', id_usuario)
    .query(`
      SELECT AVG(mejor) AS promedio
      FROM (
        SELECT id_materia, MAX(avance_porcentual) AS mejor
        FROM Progreso
        WHERE id_usuario = @id_usuario AND activo = 1
        GROUP BY id_materia
      ) sub
    `);
  const progresoPromedio = Math.round(progresoRes.recordset[0].promedio || 0);

  // 5. Precisión general (promedio de TODOS los intentos)
  const precisionRes = await pool.request()
    .input('id_usuario', id_usuario)
    .query(`
      SELECT AVG(avance_porcentual) AS precision_promedio
      FROM Progreso
      WHERE id_usuario = @id_usuario AND activo = 1
    `);
  const precision = Math.round(precisionRes.recordset[0].precision_promedio || 0);

  // 6. Últimos registros de progreso (sin depender de fecha_registro)
  const historialRes = await pool.request()
    .input('id_usuario', id_usuario)
    .query(`
      SELECT TOP 5 p.id_progreso, p.id_materia, m.nombre_materia,
             p.avance_porcentual, p.comentarios
      FROM Progreso p
      INNER JOIN Materia m ON p.id_materia = m.id_materia
      WHERE p.id_usuario = @id_usuario AND p.activo = 1
      ORDER BY p.id_progreso DESC
    `);

  // 7. Progreso por materia
  const porMateriaRes = await pool.request()
    .input('id_usuario', id_usuario)
    .query(`
      SELECT m.id_materia, m.nombre_materia, 
             ISNULL(MAX(p.avance_porcentual), 0) AS mejor_puntaje,
             COUNT(p.id_progreso) AS sesiones
      FROM Materia m
      LEFT JOIN Progreso p ON m.id_materia = p.id_materia AND p.activo = 1
      WHERE m.id_usuario = @id_usuario AND m.activo = 1
      GROUP BY m.id_materia, m.nombre_materia
    `);

  return {
    totalMaterias,
    totalFlashcards,
    totalApuntes,
    progresoPromedio,
    precision,
    historial: historialRes.recordset,
    materias: porMateriaRes.recordset
  };
};
