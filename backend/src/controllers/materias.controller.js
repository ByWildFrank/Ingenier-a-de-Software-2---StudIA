const service = require('../services/materias.service');

exports.obtenerTodas = async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;
    const data = await service.obtenerTodas(id_usuario);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo materias' });
  }
};

exports.obtenerConEstadisticas = async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;
    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario requerido' });
    }
    const data = await service.obtenerConEstadisticas(id_usuario);
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo materias con stats:", error);
    res.status(500).json({ error: 'Error obteniendo materias con estadísticas' });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const data = await service.obtenerPorId(req.params.id);
    if (!data) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo materia' });
  }
};

exports.crear = async (req, res) => {
  try {
    const payload = {
      id_usuario: req.body.id_usuario || 1, // Simulación de sesión hasta integrar token
      nombre_materia: req.body.nombre_materia,
      descripcion: req.body.descripcion
    };
    const nueva = await service.crear(payload);
    res.status(201).json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando materia' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const actualizada = await service.actualizar(req.params.id, req.body);
    if (!actualizada) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando materia' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const ok = await service.eliminar(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json({ message: 'Materia eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando materia' });
  }
};
