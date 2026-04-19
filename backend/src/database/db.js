const sql = require('mssql');

const config = {
    user: 'franco_sql',
    password: '0974',
    server: 'Franco-Laptop\SQLEXPRESS',
    database: 'StudIA',
    options: {
        trustServerCertificate: true
    }
};
async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.error('Error de conexión a SQL Server:', error);
        throw error;
    }
}

module.exports = { sql, getConnection };
module.exports = {
    sql,
    config
};
