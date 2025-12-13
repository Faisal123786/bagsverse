import React from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const navigate = useNavigate();

  // Handle Form Submit
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Here you would typically send data to the backend API (addProduct logic, etc)
    // For now, we simulate success and navigate
    navigate("/order-placed");
  };

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/products" className="btn btn-dark mx-4">
              <i className="fa fa-arrow-left me-2"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 250.0; // Fixed shipping for COD usually
    let totalItems = 0;

    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });

    return (
      <>
        <div className="container py-5">
          <div className="row my-4">

            {/* --- LEFT SIDE: BILLING FORM --- */}
            <div className="col-md-7 col-lg-8">
              <div className="checkout-card mb-4">
                <h4 className="mb-4 fw-bold">Billing Address</h4>

                <form className="needs-validation" onSubmit={handlePlaceOrder}>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label">First name</label>
                      <input type="text" className="form-control" required />
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label">Last name</label>
                      <input type="text" className="form-control" required />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" placeholder="you@example.com" required />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <input type="text" className="form-control" placeholder="1234 Main St" required />
                    </div>

                    <div className="col-12">
                      <label className="form-label">City</label>
                      <input type="text" className="form-control" required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone (WhatsApp)</label>
                      <input type="tel" className="form-control" placeholder="+92 300 1234567" required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Zip Code</label>
                      <input type="text" className="form-control" required />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h4 className="mb-3 fw-bold">Payment Method</h4>

                  {/* COD SELECTION BOX */}
                  <div className="payment-method-box">
                    <i className="fa fa-money"></i>
                    <div>
                      <p className="method-title">Cash on Delivery (COD)</p>
                      <p className="method-desc">Pay with cash upon delivery.</p>
                    </div>
                    <div className="ms-auto">
                      <input type="radio" className="form-check-input" checked readOnly style={{ width: '20px', height: '20px' }} />
                    </div>
                  </div>

                  <button className="w-100 btn btn-dark btn-lg mt-4 rounded-pill" type="submit">
                    Place Order
                  </button>
                </form>
              </div>
            </div>

            {/* --- RIGHT SIDE: ORDER SUMMARY --- */}
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="checkout-card">
                <h5 className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold">Your Cart</span>
                  <span className="badge bg-dark rounded-pill">{totalItems}</span>
                </h5>
                <ul className="list-group list-group-flush mb-3">
                  {state.map((item) => (
                    <li className="list-group-item d-flex justify-content-between lh-sm px-0" key={item.id}>
                      <div>
                        <h6 className="my-0 text-truncate" style={{ maxWidth: '180px' }}>{item.title}</h6>
                        <small className="text-muted">Qty: {item.qty}</small>
                      </div>
                      <span className="text-muted">Rs {(item.price * item.qty).toFixed(2)}</span>
                    </li>
                  ))}

                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Subtotal</span>
                    <strong>Rs {subtotal.toFixed(2)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Shipping</span>
                    <strong>Rs {shipping.toFixed(2)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 border-top mt-2 pt-3">
                    <span className="fw-bold fs-5">Total</span>
                    <strong className="fw-bold fs-5">Rs {(subtotal + shipping).toFixed(2)}</strong>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center display-6 fw-bold">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;