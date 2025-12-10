import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const cartItems = useSelector(state => state.handleCart);
  const [userDropdown, setUserDropdown] = useState(false);
  const [cartSidebar, setCartSidebar] = useState(false);
  const [searchDrawer, setSearchDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close all except search drawer
  const handleOverlayClick = () => {
    setCartSidebar(false);
    setUserDropdown(false);
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top'>
      <div className='container d-flex align-items-center justify-content-between'>
        {/* LOGO */}
        <NavLink className='navbar-brand d-flex align-items-center' to='/'>
          <img
            src='./assets/logo2.png'
            alt='BagVerse'
            style={{ width: '50px', height: '50px', marginRight: '8px' }}
          />
          <span className='fw-bold fs-5 text-dark'></span>
        </NavLink>

        {/* DESKTOP SEARCH BAR */}
        {!isMobile && (
          <div className='d-flex flex-grow-1 mx-3'>
            <div className='input-group w-100 shadow-sm rounded-pill overflow-hidden border'>
              <input
                type='text'
                className='form-control border-0 ps-4 py-2'
                placeholder='Search for products...'
              />
              <button className='btn btn-dark px-3'>
                <i className='fa fa-search text-white'></i>
              </button>
            </div>
          </div>
        )}

        {/* MOBILE ICONS */}
        <div className='d-flex align-items-center'>
          {/* Mobile Search Icon */}
          {isMobile && (
            <button
              className='btn me-2'
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '1.5rem'
              }}
              onClick={() => setSearchDrawer(true)}
            >
              <i className='fa fa-search'></i>
            </button>
          )}

          {/* USER DROPDOWN */}
          <div className='position-relative me-3'>
            <button
              className='btn'
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '1.5rem'
              }}
              onClick={() => setUserDropdown(!userDropdown)}
            >
              <i className='fa fa-user'></i>
            </button>

            {userDropdown && (
              <ul
                className='dropdown-menu show shadow'
                style={{
                  top: '100%',
                  right: 0,
                  left: 'auto',
                  margin: 0,
                  minWidth: '150px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  borderRadius: '0.25rem',
                  zIndex: 1060,
                  position: 'absolute',
                  backgroundColor: 'white'
                }}
              >
                <li>
                  <NavLink
                    className='dropdown-item'
                    to='/login'
                    onClick={() => setUserDropdown(false)}
                  >
                    <i className='fa fa-sign-in-alt me-2'></i> Sign In
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className='dropdown-item'
                    to='/register'
                    onClick={() => setUserDropdown(false)}
                  >
                    <i className='fa fa-user-plus me-2'></i> Sign Up
                  </NavLink>
                </li>
              </ul>
            )}
          </div>

          {/* CART ICON */}
          <div className='position-relative'>
            <button
              className='btn'
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '1.5rem'
              }}
              onClick={() => setCartSidebar(true)}
            >
              <i className='fa fa-cart-shopping'></i>
              {cartItems.length > 0 && (
                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* OVERLAY for cart and search (user dropdown excluded) */}
      {cartSidebar && (
        <div
          className='position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50'
          style={{ zIndex: 1040 }}
          onClick={handleOverlayClick}
        />
      )}

      {/* MOBILE SEARCH FULLSCREEN */}
      {isMobile && searchDrawer && (
        <div
          className='position-fixed top-0 start-0 w-100 vh-100 bg-white d-flex flex-column'
          style={{ zIndex: 1070, padding: '1rem' }}
        >
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h5 className='mb-0'>Search Products</h5>
            <button
              className='btn'
              style={{
                fontSize: '1.5rem',
                border: 'none',
                background: 'transparent'
              }}
              onClick={() => setSearchDrawer(false)}
            >
              <i className='fa fa-times'></i>
            </button>
          </div>
          <div className='flex-grow-1 d-flex justify-content-center align-items-start'>
            <div className='input-group w-100' style={{ maxWidth: '500px' }}>
              <input
                type='text'
                className='form-control rounded-pill ps-4 py-3'
                placeholder='Search for products...'
              />
              <button
                className='btn btn-dark px-3'
                onClick={() => setSearchDrawer(false)}
              >
                <i className='fa fa-search text-white'></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART SIDEBAR */}
      <div
        className='position-fixed top-0 end-0 vh-100 bg-white shadow-lg p-3'
        style={{
          width: '320px',
          zIndex: 1050,
          transform: cartSidebar ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h5 className='mb-0'>Your Cart</h5>
          <button
            className='btn btn-outline-dark btn-sm'
            onClick={() => setCartSidebar(false)}
          >
            Close
          </button>
        </div>
        {cartItems.length === 0 ? (
          <p className='text-muted'>Your cart is empty</p>
        ) : (
          <ul className='list-group'>
            {cartItems.map((item, index) => (
              <li
                key={index}
                className='list-group-item d-flex justify-content-between align-items-center'
              >
                {item.name}
                <span className='badge bg-secondary rounded-pill'>
                  {item.qty}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
