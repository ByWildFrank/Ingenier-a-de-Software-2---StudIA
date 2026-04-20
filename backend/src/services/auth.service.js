const { getConnection } = require('../database/db');
const Usuario = require('../models/Usuario');

exports.login = async (correo, contraseña) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('correo', correo)
    .input('contraseña', contraseña)
    .execute('sp_Usuario_Login');

  if (result.recordset.length === 0) return null;

  return Usuario.fromDB(result.recordset[0]);
};
