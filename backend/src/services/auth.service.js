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

exports.register = async (nombre, correo, contraseña, nivelEducativo) => {
  const pool = await getConnection();

  // Asumiremos que tenemos un procedimiento almacenado sp_Usuario_Register o haremos un INSERT directo
  // Haremos un INSERT directo seguro por ahora que devuelva al usuario insertado.
  // Es común usar contraseñas encriptadas, pero ajustaremos a la arquitectura actual.
  try {
    const result = await pool.request()
      .input('nombre', nombre)
      .input('correo', correo)
      .input('contraseña', contraseña)
      .input('nivel_educativo', nivelEducativo || null)
      .input('id_tipo_usuario', 2) // Por defecto tipo de usuario 2 (usuario estándar)
      .execute('sp_Usuario_Crear');

    if (result.recordset.length === 0) return null;

    const newId = Object.values(result.recordset[0])[0];
    
    return new Usuario({
      id_usuario: newId,
      nombre,
      correo,
      nivel_educativo: nivelEducativo || null,
      id_tipo_usuario: 2
    });
  } catch (error) {
    console.error('Database Error in Register:', error);
    throw error;
  }
};
