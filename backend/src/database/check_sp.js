const { getConnection } = require('./db');

async function getStoredProcedures() {
    try {
        const pool = await getConnection();
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

getStoredProcedures();
