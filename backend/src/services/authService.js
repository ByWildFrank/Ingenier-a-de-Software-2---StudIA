import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export default {
    async login(correo, contraseña) {
        try {
            const res = await axios.post(`${API_URL}/login`, {
                correo,
                contraseña
            });

            return res.data.usuario;

        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error en login');
        }
    }
};
