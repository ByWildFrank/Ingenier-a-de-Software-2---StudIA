const service = require('../services/auth.service');

exports.iniciarSesion = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const usuario = await service.iniciarSesion(correo, contraseña);

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json({
      message: 'Login exitoso',
      usuario
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno en login' });
  }
};

exports.registrar = async (req, res) => {
  try {
    const { nombre, correo, contraseña, nivel_educativo } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
    }

    const usuarioNuevo = await service.registrar(nombre, correo, contraseña, nivel_educativo);

    if (!usuarioNuevo) {
      return res.status(400).json({ error: 'No se pudo crear la cuenta o el correo ya existe' });
    }

    res.status(201).json({
      message: 'Cuenta creada exitosamente',
      usuario: usuarioNuevo
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al intentar registrar el usuario' });
  }
};
