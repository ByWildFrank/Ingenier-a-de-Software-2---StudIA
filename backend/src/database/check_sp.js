const { obtenerConexion } = require('./db');

async function obtenerProcedimientosAlmacenados() {
    try {
        const pool = await obtenerConexion();
        const result = await pool.request().query(`
            SELECT name 
            FROM sys.procedures
            WHERE name LIKE 'sp_Usuario_%' OR name LIKE 'sp_%';
        `);
        console.log("Stored Procedures encontrados:", result.recordset);
        process.exit(0);
    } catch (err) {
        console.error("Error al consultar DB:", err);
        process.exit(1);
    }
}

obtenerProcedimientosAlmacenados();
