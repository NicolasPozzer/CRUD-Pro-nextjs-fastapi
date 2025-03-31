import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api', // Usamos el proxy de Next.js
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;