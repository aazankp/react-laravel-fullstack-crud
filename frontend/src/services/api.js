import axios from 'axios';

// Create Axios instance
export const api = axios.create({
    baseURL: 'http://localhost:8000', // Laravel backend URL
    // withCredentials: true, // Ensures cookies are sent with every request
    // xsrfCookieName: 'XSRF-TOKEN',
    // xsrfHeaderName: 'XSRF-TOKEN',
    // headers: {
    //     Accept: "application/json"
    // }
});

export const basePath = '/api';

// Export the Axios instance for use in other parts of your app
// export default api;