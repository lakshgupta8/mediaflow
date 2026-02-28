import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

export const tmdb = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        ...(TMDB_ACCESS_TOKEN ? { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` } : {}),
    },
});

// Optional: Add response interceptor for global error handling
tmdb.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('TMDB API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);
