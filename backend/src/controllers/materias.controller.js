const service = require('../services/materias.service');

exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo materias' });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo materia' });
  }
};

exports.create = async (req, res) => {
  try {
    const nueva = await service.create(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error creando materia' });
  }
};

exports.update = async (req, res) => {
  try {
    const actualizada = await service.update(req.params.id, req.body);
    if (!actualizada) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando materia' });
  }
};

exports.remove = async (req, res) => {
  try {
    const ok = await service.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json({ message: 'Materia eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando materia' });
  }
};
