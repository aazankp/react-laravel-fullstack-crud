import axios from 'axios';

// Create Axios instance
export const api = axios.create({
    baseURL: 'http://localhost:8000', // Laravel backend URL
});

export const basePath = '/api';