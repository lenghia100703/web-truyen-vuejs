import axios from 'axios';

export const http = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8888/v1',
})