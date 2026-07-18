import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

// Interceptor injeta o token dos cookies em cada requisição do cliente
api.interceptors.request.use((config) => {
  const token = Cookies.get('garagefy_token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const swrFetcher = (url: string) =>
  api.get(url).then((res) => {
    const body = res.data;
    if (Array.isArray(body)) return body;
    if (body && Array.isArray(body.data)) return body.data;
    return body;
  });