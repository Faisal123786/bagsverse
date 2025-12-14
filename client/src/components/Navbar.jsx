import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/action/userAction';
import { addCart, delCart } from '../redux/action'; // Added these imports for sidebar functionality
import { fetchCategories } from '../api';
import { GoSearch } from 'react-icons/go';
import { FiUser } from 'react-icons/fi';
import { RiShoppingCartLine } from 'react-icons/ri';
import { RxHamburgerMenu } from 'react-icons/rx';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(state => state.handleCart);
  const user = useSelector(state => state.handleUser.user);

  const [userDropdown, setUserDropdown] = useState(false);
  const [cartSidebar, setCartSidebar] = useState(false);
  const [searchDrawer, setSearchDrawer] = useState(false);
  const [categoryDrawer, setCategoryDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [categories, setCategories] = useState([]);

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        if (Array.isArray(res)) {
          setCategories(res);
        } else if (Array.isArray(res?.data)) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Calculate Subtotal for the Sidebar Button
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Close overlays
  const handleOverlayClick = () => {
    setCartSidebar(false);
    setUserDropdown(false);
    setCategoryDrawer(false);
  };

  // Logout
  const handleLogout = () => {
    dispatch(logoutUser());
    setUserDropdown(false);
    navigate('/login');
  };

  return (
    <>
      {/* MAIN NAVBAR - Sticky */}
      <nav
        className='navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top'
        style={{ top: 0, zIndex: 1030 }}
      >
        <div className='container d-flex align-items-center justify-content-between'>
          {/* LOGO */}
          <NavLink
            className='navbar-brand d-flex align-items-center px-3'
            to='/'
          >
            <img
              src='./assets/logo2.png'
              alt='BagVerse'
              style={{ width: '50px', height: '50px', marginRight: '8px' }}
            />
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

          {/* MOBILE & DESKTOP ICONS */}
          <div className='d-flex align-items-center'>
            {/* Mobile Search Icon */}
            {isMobile && (
              <button
                className='btn'
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '2rem'
                }}
                onClick={() => setSearchDrawer(true)}
              >
                <GoSearch />
              </button>
            )}

            {/* USER DROPDOWN */}
            <div className='position-relative'>
              <button
                className='btn no-focus'
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '2rem'
                }}
                onClick={() => setUserDropdown(!userDropdown)}
              >
                <FiUser />
              </button>

              {userDropdown && (
                <ul
                  className='dropdown-menu show shadow'
                  style={{
                    top: '100%',
                    right: 0,
                    left: 'auto',
                    margin: 0,
                    minWidth: '180px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    borderRadius: '0.25rem',
                    zIndex: 1060,
                    position: 'absolute',
                    backgroundColor: 'white'
                  }}
                >
                  {user ? (
                    <>
                      <li className='dropdown-item'>Hi, {user.firstName}</li>
                      {user.role === 'ROLE ADMIN' && (
                        <li>
                          <NavLink className='dropdown-item' to='/admin' onClick={() => setUserDropdown(false)}>
                            <i className='fa fa-tachometer-alt me-2'></i> Admin Dashboard
                          </NavLink>
                        </li>
                      )}
                      {user.role === 'ROLE MERCHANT' && (
                        <li>
                          <NavLink className='dropdown-item' to='/merchant-dashboard' onClick={() => setUserDropdown(false)}>
                            <i className='fa fa-briefcase me-2'></i> Merchant Dashboard
                          </NavLink>
                        </li>
                      )}
                      <li>
                        <button className='dropdown-item' onClick={handleLogout}>
                          <i className='fa fa-sign-out-alt me-2'></i> Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <NavLink className='dropdown-item' to='/login' onClick={() => setUserDropdown(false)}>
                          <i className='fa fa-sign-in-alt me-2'></i> Sign In
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className='dropdown-item' to='/register' onClick={() => setUserDropdown(false)}>
                          <FiUser /> Sign Up
                        </NavLink>
                      </li>
                    </>
                  )}
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
                  fontSize: '2rem',
                  paddingTop: '0px'
                }}
                onClick={() => setCartSidebar(true)}
              >
                <RiShoppingCartLine />
                {cartItems.length > 0 && (
                  <span
                    className='position-absolute translate-middle badge rounded-pill py-1 bg-danger'
                    style={{ fontSize: '10px', top: '2px', left: '85%' }}
                  >
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
            {isMobile && (
              <button
                className='btn no-focus'
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '2rem'
                }}
                onClick={() => setCategoryDrawer(true)}
              >
                <RxHamburgerMenu />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* DESKTOP CATEGORIES BAR */}
      {!isMobile && (
        <div className='bg-dark text-white sticky-top' style={{ top: '72px', zIndex: 1020 }}>
          <div className='container py-1'>
            <ul className='d-flex list-unstyled gap-4 mb-0 py-2 justify-content-center flex-wrap'>
              {categories.map((item, index) => (
                <li key={index} className="cursor-pointer" onClick={() => navigate('/product', { state: { category: item.name } })}>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* OVERLAY */}
      {(cartSidebar || categoryDrawer) && (
        <div
          className='position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50'
          style={{ zIndex: 1040 }}
          onClick={handleOverlayClick}
        />
      )}

      {/* MOBILE CATEGORY SIDE DRAWER */}
      {isMobile && (
        <div
          className='position-fixed top-0 start-0 vh-100 bg-white shadow-lg'
          style={{
            width: '280px',
            zIndex: 1050,
            transform: categoryDrawer ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out',
            overflowY: 'auto'
          }}
        >
          <div className='d-flex justify-content-between p-2 align-items-centerborder-bottom'>
            <button className='btn btn-sm text-dark w-fit ml-auto no-focus' onClick={() => setCategoryDrawer(false)}>
              <i className='fa fa-times'></i>
            </button>
          </div>
          <h5 className='px-4'>Categories</h5>
          <ul className='list-group list-group-flush'>
            {categories.map((item, index) => (
              <li key={index} className='list-group-item border-0 p-0'>
                <NavLink
                  to={`/category/${item.id || item.name}`}
                  className='d-block text-decoration-none text-dark py-3 px-4'
                  onClick={() => setCategoryDrawer(false)}
                >
                  <i className='fa fa-chevron-right me-2 text-muted'></i>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* MOBILE SEARCH FULLSCREEN */}
      {isMobile && searchDrawer && (
        <div
          className='position-fixed top-0 start-0 w-100 vh-100 bg-white d-flex flex-column'
          style={{ zIndex: 1070, padding: '1rem' }}
        >
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h5 className='mb-0'>Search Products</h5>
            <button className='btn no-focus' onClick={() => setSearchDrawer(false)} style={{ fontSize: '1.5rem' }}>
              <i className='fa fa-times'></i>
            </button>
          </div>
          <div className='input-group w-100' style={{ maxWidth: '500px' }}>
            <input type='text' className='form-control ps-4 py-3' placeholder='Search for products...' />
            <button className='btn btn-dark px-3 no-focus' onClick={() => setSearchDrawer(false)}>
              <i className='fa fa-search text-white'></i>
            </button>
          </div>
        </div>
      )}

      {/* --- CART SIDEBAR (UPDATED DESIGN) --- */}
      <div
        className='position-fixed top-0 end-0 vh-100 bg-white shadow-lg d-flex flex-column'
        style={{
          width: isMobile ? '300px' : '380px', // Slightly wider for better layout
          zIndex: 1050,
          transform: cartSidebar ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {/* 1. Header */}
        <div className='d-flex justify-content-between align-items-center p-4 border-bottom'>
          <h5 className='mb-0 fw-bold' style={{ color: '#000' }}>
            <i className="fa fa-shopping-bag me-2"></i>
            {cartItems.length} item(s)
          </h5>
          <button
            className='btn btn-sm text-muted no-focus'
            style={{ fontSize: '1.2rem' }}
            onClick={() => setCartSidebar(false)}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>

        {/* 2. Scrollable Cart Items */}
        <div className='flex-grow-1 overflow-auto p-3'>
          {cartItems.length === 0 ? (
            <div className='text-center py-5 mt-5'>
              <RiShoppingCartLine style={{ fontSize: '3rem', color: '#eee' }} />
              <p className='text-muted mt-3'>Your cart is empty</p>
              <button
                className='btn btn-dark btn-sm mt-2'
                onClick={() => { setCartSidebar(false); navigate('/product') }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className='list-unstyled mb-0'>
              {cartItems.map((item, index) => (
                <li key={index} className='mb-4 d-flex align-items-start border-bottom pb-4'>

                  {/* Image */}
                  <div className="flex-shrink-0 border rounded p-1 bg-light" style={{ width: '80px', height: '80px' }}>
                    <img
                      src={item.image || (item.images && item.images.length > 0 ? item.images[0].imageUrl : "https://via.placeholder.com/80?text=No+Image")}
                      alt={item.name}
                      className="w-100 h-100 object-fit-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow-1 ms-3">
                    <div className="d-flex justify-content-between">
                      <h6 className='fw-semibold mb-1 text-truncate' style={{ maxWidth: '160px' }}>{item.name || item.title}</h6>
                      <button
                        className="btn btn-link text-muted p-0 text-decoration-none"
                        onClick={() => dispatch(delCart(item))}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      {/* <span className="text-muted text-decoration-line-through small me-2">Rs {Math.round(item.price * 1.2)}</span> */}
                      <span className="fw-bold text-dark">Rs {item.price}</span>
                    </div>

                    {/* Quantity Control */}
                    <div className="d-flex align-items-center">
                      <div className="btn-group btn-group-sm border rounded" role="group">
                        <button
                          className="btn btn-white text-dark py-0 border-end"
                          onClick={() => dispatch(delCart(item))}
                        >
                          -
                        </button>
                        <span className="px-3 d-flex align-items-center bg-white text-dark small fw-bold">
                          {item.qty}
                        </span>
                        <button
                          className="btn btn-white text-dark py-0 border-start"
                          onClick={() => dispatch(addCart(item))}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 3. Footer */}
        {cartItems.length > 0 && (
          <div className='p-4 bg-white border-top shadow-sm'>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Excluding Shipping</span>
            </div>

            <button
              className='btn btn-dark w-100 mb-2 py-2 fw-bold'
              onClick={() => {
                setCartSidebar(false);
                navigate('/checkout');
              }}
            >
              Checkout Now (Rs {Math.round(subtotal)})
            </button>

            <button
              className='btn btn-outline-dark w-100 py-2 fw-bold'
              onClick={() => {
                setCartSidebar(false);
                navigate('/cart');
              }}
            >
              View Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;