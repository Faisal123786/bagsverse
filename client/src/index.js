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
  AdminDashboard,
  MerchantDashboard
} from './pages';

import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

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
            path='/admin'
            element={
              <ProtectedRoute rolesAllowed={['ADMIN']}>
                {/* <AdminDashboard /> */}
              </ProtectedRoute>
            }
          />

          <Route
            path='/merchant'
            element={
              <ProtectedRoute rolesAllowed={['MERCHANT']}>
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
