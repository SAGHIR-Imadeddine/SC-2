import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.9.67:3030/', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// api.interceptors.request.use(
//     async (config) => {
//     const token = await AsyncStorage.getItem('authToken');
//     if (token) {
      
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default api;