import axios from 'axios';
import { FIREBASE_CONFIG } from '../config/firebase';

const api = axios.create({
  baseURL: FIREBASE_CONFIG.databaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
