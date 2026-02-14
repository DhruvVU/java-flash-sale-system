import axios from "axios";

const api = axios.create({
    baseURL: 'https://flash-sale-backend-6r3i.onrender.com',
});


export default api;