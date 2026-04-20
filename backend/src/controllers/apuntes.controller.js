const service = require('../services/apuntes.service');

exports.getByUnidad = async (req, res) => {
  try {
    const data = await service.getByUnidad(req.params.unidadId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo apuntes' });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevo = await service.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error creando apunte' });
  }
};
