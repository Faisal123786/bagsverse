import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const infoLinks = [
    { id: 0, name: 'Contact Us', to: '/contact' },
    { id: 1, name: 'Sell With Us', to: '/sell' },
    { id: 2, name: 'Shipping', to: '/shipping' }
  ];

  const accountLinks = [
    { id: 0, name: 'Account Details', to: '/dashboard' },
    { id: 1, name: 'Orders', to: '/dashboard/orders' }
  ];

  const footerStyle = {
    position: 'relative',
    backgroundImage:
      "url('https://media.istockphoto.com/id/2174548176/photo/fashionable-multi-colored-trendy-womens-bags-on-a-white-background-fashion-and-beauty-concept.jpg?s=612x612&w=0&k=20&c=hO_gtB60RBTHWM6MXG19XdEmZ9oocdKYK8K_X_h0i8k=')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    paddingTop: '5rem',
    paddingBottom: '3rem',
    zIndex: 0
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.89)',
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2
  };

  const columnStyle = {
    borderRight: '1px solid rgba(255, 255, 255, 0.3)',
    paddingRight: '1rem'
  };

  const lastColumnStyle = {
    paddingRight: '0'
  };

  const linkStyle = {
    display: 'block',
    padding: '0.5rem 0',
    color: 'white',
    textDecoration: 'none'
  };

  return (
    <footer style={footerStyle}>
      <div style={overlayStyle}></div>
      <div className='container text-center text-md-start' style={contentStyle}>
        <div className='row'>
          {/* Customer Service Links */}
          <div className='col-md-4 mb-4' style={columnStyle}>
            <h5 className='text-uppercase'>Customer Service</h5>
            <ul className='list-unstyled'>
              {infoLinks.map(link => (
                <li key={link.id}>
                  <Link to={link.to} style={linkStyle}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div className='col-md-4 mb-4' style={columnStyle}>
            <h5 className='text-uppercase'>Account</h5>
            <ul className='list-unstyled'>
              {accountLinks.map(link => (
                <li key={link.id}>
                  <Link to={link.to} style={linkStyle}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className='col-md-4 mb-4' style={lastColumnStyle}>
            <h5 className='text-uppercase'>Newsletter</h5>
          </div>
        </div>

        {/* Logo & Social */}
        <div className='d-flex justify-content-center align-items-center my-4'>
          <Link to='/'>
            <img
              src='./assets/logo2.png'
              alt='BagsVerse'
              style={{ width: '150px', height: '150px', objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* Copyright */}
        <div className='text-center pb-3'>
          <p className='mb-0'>
            © {new Date().getFullYear()} BagsVerse. Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
