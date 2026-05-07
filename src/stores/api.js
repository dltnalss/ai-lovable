import axios from 'axios';

// json-server 연결 axios 인스턴스
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' }
});

export default api;
