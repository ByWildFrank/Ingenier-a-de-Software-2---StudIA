const service = require('../services/apuntes.service');

exports.getByMateria = async (req, res) => {
  try {
    const data = await service.getByMateria(req.params.materiaId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo apuntes' });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Debes enviar un archivo' });
    }
    const data = {
      id_materia: req.body.id_materia,
      titulo: req.body.titulo || req.file.originalname,
      ruta_archivo: req.file.filename,
      tipo_archivo: req.file.mimetype,
      tamaño_bytes: req.file.size
    };
    const nuevo = await service.create(data);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando apunte' });
  }
};
