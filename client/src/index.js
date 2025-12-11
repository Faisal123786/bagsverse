import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
  MerchantDashboard
} from './pages';

import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminLayout from './admin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <Routes>
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path='/register'
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route path='/' element={<Home />} />
          <Route path='/product' element={<Products />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/cart' element={<Cart />} />

          <Route
            path='/checkout'
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path='/admin/*'
            element={
              <ProtectedRoute rolesAllowed={['ROLE ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          {/* other routes */}

          <Route
            path='/merchant'
            element={
              <ProtectedRoute rolesAllowed={['ROLE MERCHANT']}>
                {/* <MerchantDashboard /> */}
              </ProtectedRoute>
            }
          />

          <Route path='*' element={<PageNotFound />} />
          <Route path='/product/*' element={<PageNotFound />} />
        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);
