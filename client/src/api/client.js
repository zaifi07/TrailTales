import axios from 'axios';

// In production the React app is served from the SAME origin as the API,
// so a relative baseURL is correct and survives every EC2 IP change with
// no code changes. In dev, Vite proxies /api -> http://localhost:5000.
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      // token expired/invalid – wipe and let UI handle
      localStorage.removeItem('tt_token');
      localStorage.removeItem('tt_user');
    }
    return Promise.reject(err);
  }
);

export default api;
