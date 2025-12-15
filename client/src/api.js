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

// =========================
//  CATEGORY APIs
// =========================

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

// =========================
//  ORDER APIs (NEW)
// =========================

export const placeOrder = async (orderData) => {
  try {
    // Now expects { cartId: "...", total: 1234 }
    const response = await API.post('/order/add', orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to place order');
  }
};

export const fetchMyOrders = async () => {
  try {
    const response = await API.get('/order/me');
    return response.data.orders || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch orders');
  }
};

// 3. Fetch Single Order Details (For View Invoice/Details)
export const fetchOrderById = async (id) => {
  try {
    const response = await API.get(`/order/${id}`);
    return response.data.order;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch order details');
  }
};

// =========================
//  CART APIs (NEW - Add this)
// =========================
export const syncCartToDB = async (cartData) => {
  try {
    // Expects { products: [...] }
    const response = await API.post('/cart/add', cartData);
    return response.data; // This will return { success: true, cartId: "..." }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to sync cart');
  }
};

// =========================
//  NEWSLETTER APIs
// =========================

export const subscribeToNewsletter = async (email) => {
  try {
    // Assuming your route prefix in server.js is '/newsletter'
    const response = await API.post('/newsletter/subscribe', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to subscribe');
  }
};

// =========================
//  USER PROFILE APIs
// =========================

// 1. Fetch Current User Details
export const fetchProfile = async () => {
  try {
    const response = await API.get('/user/me');
    return response.data.user;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch profile');
  }
};

// 2. Update User Profile
export const updateProfile = async (profileData) => {
  try {
    // Backend expects req.body.profile
    const payload = { profile: profileData };

    const response = await API.put('/user', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update profile');
  }
};

// =========================
//  CONTACT APIs
// =========================

export const submitContact = async (data) => {
  try {
    // Matches router.post('/add', ...) mounted at /contact
    const response = await API.post('/contact/add', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to send message');
  }
};

// =========================
//  SEARCH APIs
// =========================

export const searchProducts = async (keyword) => {
  try {
    // Option 1: If you have a specific backend route (e.g. /product/search?q=...) use that.
    // Option 2 (Implemented here): Fetch all and filter client-side (Robust for now)

    const response = await API.get('/product');
    const allProducts = response.data.products || response.data || [];

    if (!keyword) return [];

    // Filter logic: Match Name or Category (Case Insensitive)
    const lowerKeyword = keyword.toLowerCase();

    const filtered = allProducts.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(lowerKeyword);
      // Handle category if it's an object or string
      const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;
      const catMatch = categoryName ? categoryName.toLowerCase().includes(lowerKeyword) : false;

      return nameMatch || catMatch;
    });

    return filtered.slice(0, 5); // Return top 5 matches
  } catch (error) {
    console.error("Search API Error", error);
    return [];
  }
};

// =========================
//  REVIEW APIs
// =========================

export const addReview = async (reviewData) => {
  try {
    const response = await API.post('/review/add', reviewData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to add review');
  }
};

export const fetchReviewsBySlug = async (slug) => {
  try {
    const response = await API.get(`/review/${slug}`);
    return response.data.reviews;
  } catch (error) {
    // If 404 (no reviews yet or product not found), return empty array
    return [];
  }
};

// =========================
//  ADMIN REVIEW APIs
// =========================

// Fetch all reviews (with pagination support if needed)
export const fetchAllReviews = async (page = 1) => {
  try {
    const response = await API.get(`/review?page=${page}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch reviews');
  }
};

// Approve a review
export const approveReview = async (reviewId) => {
  try {
    const response = await API.put(`/review/approve/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to approve review');
  }
};

// Reject a review
export const rejectReview = async (reviewId) => {
  try {
    const response = await API.put(`/review/reject/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to reject review');
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await API.delete(`/review/delete/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete review');
  }
};
// =========================
//  ADMIN USER APIs
// =========================

export const fetchAllUsers = async (page = 1) => {
  try {
    // Matches router.get('/', ...) in your backend user.js
    const response = await API.get(`/user?page=${page}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch users');
  }
};