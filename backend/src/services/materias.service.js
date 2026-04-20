const { getConnection } = require('../database/db');

exports.getAll = async () => {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT MateriaID, Nombre, Descripcion
    FROM Materias
  `);
  return result.recordset;
};

exports.getById = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', id)
    .query(`
      SELECT MateriaID, Nombre, Descripcion
      FROM Materias
      WHERE MateriaID = @id
    `);

  return result.recordset[0];
};

exports.create = async (data) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('nombre', data.nombre)
    .input('descripcion', data.descripcion)
    .query(`
      INSERT INTO Materias (Nombre, Descripcion)
      VALUES (@nombre, @descripcion);
      SELECT SCOPE_IDENTITY() AS id;
    `);

  return { id: result.recordset[0].id, ...data };
};

exports.update = async (id, data) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', id)
    .input('nombre', data.nombre)
    .input('descripcion', data.descripcion)
    .query(`
      UPDATE Materias
      SET Nombre = @nombre,
          Descripcion = @descripcion
      WHERE MateriaID = @id;

      SELECT @@ROWCOUNT AS affected;
    `);

  return result.recordset[0].affected > 0;
};

exports.remove = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', id)
    .query(`
      DELETE FROM Materias
      WHERE MateriaID = @id;

      SELECT @@ROWCOUNT AS affected;
    `);

  return result.recordset[0].affected > 0;
};
