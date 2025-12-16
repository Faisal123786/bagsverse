import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Layout from './Layouts/Layout';
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
  MerchantDashboard,
  ShippingPage,
  SellWithUs,
  AccountDetails,
  OrderPage, OrderPlaced,
  TrackOrder, OrderDetails
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

          <Route path='/' element={<Layout />}>
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/product' element={<ProtectedRoute><Products /> </ProtectedRoute>} />
            <Route path='/product/:id' element={<ProtectedRoute><Product /></ProtectedRoute>} />
            <Route path='/about' element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            <Route path='/contact' element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
            <Route path='/shipping' element={<ProtectedRoute><ShippingPage /></ProtectedRoute>} />
            <Route path='/sell' element={<ProtectedRoute><SellWithUs /></ProtectedRoute>} />
            <Route path='/account-details' element={<ProtectedRoute><AccountDetails /></ProtectedRoute>} />
            <Route path='/orders' element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
            <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/order-placed" element={<ProtectedRoute><OrderPlaced /></ProtectedRoute>} />
            <Route path="/order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            <Route path="/order/track/:id" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
            <Route
              path='/checkout'
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
          </Route>

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
