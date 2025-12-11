import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const registerUser = async data => {
  return await API.post('/auth/register', data);
};
export const loginUser = async data => {
  const response = await API.post('/auth/login', data);
  return response.data;
};
