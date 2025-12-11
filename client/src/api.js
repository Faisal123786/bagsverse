import axios from 'axios';

// Create Axios Instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Attach Bearer Token Automatically
API.interceptors.request.use(req => {
  const token = localStorage.getItem('token'); // already a plain string

  if (token) {
    req.headers.Authorization = `${token}`;
  }

  return req;
});

// =========================
//  AUTH APIS
// =========================

export const registerUser = async data => {
  return await API.post('/auth/register', data);
};

export const loginUser = async data => {
  const response = await API.post('/auth/login', data);
  return response.data;
};

// =========================
//   ADMIN / MERCHANT APIs
// =========================

// Get All Products
export const fetchProducts = async () => {
  const response = await API.get('/product');
  return response.data;
};

export const fetchBrands = async () => {
  const response = await API.get('/brand');
  return response.data.brands;
};

export const addProduct = async formData => {
  try {
    const response = await API.post('/product/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to add product');
  }
};

export const fetchProductById = async id => {
  try {
    const response = await API.get(`/product/${id}`);
    return response.data.product;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch product');
  }
};

export const updateProduct = async (id, formData) => {
  try {
    console.log('Sending product data:', formData);
    const payload = {
      product: formData
    };
    const response = await API.put(`/product/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update product');
  }
};

export const deleteProduct = async id => {
  try {
    const response = await API.delete(`/product/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete product');
  }
};

// category

export const fetchCategories = async () => {
  const response = await API.get('/category');
  return response.data.categories;
};
export const addCategory = async data => {
  try {
    const response = await API.post('/category/add', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to add category');
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await API.put(`/category/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update category');
  }
};

export const getCategoryById = async id => {
  try {
    const response = await API.get(`/category/${id}`);
    return response.data.category;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch category');
  }
};
export const deleteCategory = async id => {
  try {
    const response = await API.delete(`/category/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete category');
  }
};
