const service = require('../services/flashcards.service');

exports.getByUnidad = async (req, res) => {
  try {
    const data = await service.getByUnidad(req.params.unidadId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo flashcards' });
  }
};

exports.create = async (req, res) => {
  try {
    const nueva = await service.create(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error creando flashcard' });
  }
};
