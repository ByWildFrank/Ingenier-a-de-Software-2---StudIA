const { getConnection } = require('./src/database/db.js');

async function test() {
    try {
        const pool = await getConnection();
        const res = await pool.request()
            .input('id_usuario', 1)
            .input('nombre_materia', 'Ingeniería de Software')
            .input('descripcion', 'Materia de prueba')
            .execute('sp_Materia_Crear');
        console.log("Usuarios en DB:", res.recordset);
    } catch (e) {
        console.error("ERROR DB:", e);
    }
    process.exit(0);
}
test();
