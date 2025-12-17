import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import { Navbar } from '../components';
import Account from './Account';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import ProductList from './ProductList';
import CategoryList from './CategoryList';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import ReviewList from './ReviewList';
import ShippingPolicy from './ShippingPolicy';
import Banner from './Banner';
import Promocard from './Promocard';
import UserList from './UserList';
// Example: get user from localStorage
const getUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

const AdminLayout = () => {
  const user = getUser(); // { role: 'ROLE ADMIN' } or 'ROLE MERCHANT'

  // Define sidebar links based on role
  let sidebarLinks = [
    // { name: 'My Account', path: '/admin/account' },
    { name: 'Categories', path: '/admin/categories' },
    // { name: 'Address', path: '/admin/address' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Users', path: '/admin/user' },
    // { name: 'Orders', path: '/admin/orders' },
    { name: 'Reviews', path: '/admin/reviews' },
    { name: 'Shipping Policy', path: '/admin/shipping-policy' },
    { name: 'Banner', path: '/admin/banner' },
    { name: 'Promocard', path: '/admin/promocard' },
    // { name: 'WishList', path: '/admin/wishlist' },
    // { name: 'Support', path: '/admin/support' }
  ];

  if (user?.role === 'ROLE ADMIN') {
    sidebarLinks.unshift({ name: 'Dashboard', path: '/admin' });
  } else if (user?.role === 'ROLE MERCHANT') {
    sidebarLinks.unshift({ name: 'Merchant Dashboard', path: '/admin' });
  }

  return (
    <div className='admin-layout d-flex flex-column vh-100'>
      <Navbar />

      <div className='main-layout d-flex flex-grow-1 justify-content-center'>
        <div className='container-layout d-flex w-100'>
          {/* ===== Sidebar ===== */}
          <div className='sidebar bg-light text-dark p-0 shadow'>
            <ul className='nav flex-row  gap-2 gap-md-0 flex-md-column justify-content-center p-3 p-md-0 justify-content-md-start'>
              {sidebarLinks.map((link, index) => (
                <li key={index} className='nav-item mb-0 sidebar-item'>
                  <NavLink
                    to={link.path}
                    end
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active-link' : ''}`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Content ===== */}
          <div className='content flex-grow-1 p-3'>
            <Routes>
              {user?.role === 'ROLE ADMIN' && (
                <>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/add-product' element={<AddProduct />} />
                  <Route path='/product/:id' element={<EditProduct />} />
                  <Route path='/products' element={<ProductList />} />
                  <Route path='/categories' element={<CategoryList />} />
                  <Route path='/add-category' element={<AddCategory />} />
                  <Route path='/category/:id' element={<EditCategory />} />
                  <Route path='/reviews' element={<ReviewList />} />
                  <Route path='/shipping-policy' element={<ShippingPolicy />} />
                  <Route path='/banner' element={<Banner />} />
                  <Route path='/promocard' element={<Promocard />} />
                  <Route path='/user' element={<UserList />} />
                </>
              )}
              {user?.role === 'ROLE MERCHANT' && (
                <Route path='/' element={<Dashboard />} />
              )}
              <Route path='account' element={<Account />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* ===== Inline CSS ===== */}
      <style>{`
        .admin-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
        }

        .main-layout {
          display: flex;
          flex-grow: 1;
          width: 100%;
          overflow: hidden;
          padding: 20px;
        }

        .container-layout {
          display: flex;
          width: 100%;
          max-width: 1200px;
          background-color: transparent;
        }

        .sidebar {
          flex: 0 0 0;
          min-width: 180px;
          max-width: 250px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .sidebar-item {
          background-color: #fff;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          margin-bottom: 10px;
          transition: all 0.3s;
        }

        .sidebar-item:hover {
          background-color: #f1f3f5;
        }

        .nav-link {
          display: block;
          padding: 12px 16px;
          color: #343a40;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.3s, color 0.3s;
        }

        .nav-link.active-link {
          background-color: #343a40;
          color: #fff !important;
          border-radius: 6px;
        }

        .content {
          flex-grow: 1;
          margin-left: 20px;
          overflow-y: auto;
          min-width: 0;
        }

        @media (max-width: 1200px) {
          .container-layout {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .container-layout {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            max-width: 100%;
            margin-bottom: 15px;
          }

          .content {
            width: 100%;
            margin-left: 0;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;