const service = require('../services/dashboard.service');

exports.getStats = async (req, res) => {
  try {
    // Por ahora usamos id_usuario=1 (hasta implementar auth real)
    const id_usuario = req.query.id_usuario || 1;
    const stats = await service.getStats(id_usuario);
    res.json(stats);
  } catch (error) {
    console.error("Error obteniendo stats:", error);
    res.status(500).json({ error: 'Error obteniendo estadísticas del dashboard' });
  }
};
