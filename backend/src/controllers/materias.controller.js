const service = require('../services/materias.service');

exports.getAll = async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;
    const data = await service.getAll(id_usuario);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo materias' });
  }
};

exports.getWithStats = async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;
    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario requerido' });
    }
    const data = await service.getWithStats(id_usuario);
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo materias con stats:", error);
    res.status(500).json({ error: 'Error obteniendo materias con estadísticas' });
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
    const payload = {
      id_usuario: req.body.id_usuario || 1, // Simulación de sesión hasta integrar token
      nombre_materia: req.body.nombre_materia,
      descripcion: req.body.descripcion
    };
    const nueva = await service.create(payload);
    res.status(201).json(nueva);
  } catch (error) {
    console.error(error);
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
