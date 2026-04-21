require('dotenv').config();
const authService = require('./src/services/auth.service');

async function testLogin() {
  try {
    console.log("Intentando login...");
    const user = await authService.login('rena2@correo.com', '1234');
    console.log("Resultado del login:", user);
  } catch(e) {
    console.error("Error capturado:", e);
  }
}
testLogin();
