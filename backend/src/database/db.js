const sql = require('mssql');

const config = {
    user: 'studia_user',
    password: '1234',
    server: 'localhost',
    database: 'StudIA',
    port: 1433, // ✔ usamos puerto directo
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function obtenerConexion() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.error('Error completo:', error.message);
        throw error;
    }
}

module.exports = { sql, obtenerConexion };