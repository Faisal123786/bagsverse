import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { placeOrder, syncCartToDB } from "../api"; // Import BOTH apis
import toast from "react-hot-toast";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const navigate = useNavigate();
  // const dispatch = useDispatch(); // Uncomment if you want to clear cart after success

  // --- STATE FOR FORM DATA ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    phone: "",
    zip: ""
  });

  const [loading, setLoading] = useState(false);

  // --- CALCULATE TOTALS ---
  let subtotal = 0;
  let shipping = 250.0;
  let totalItems = 0;

  state.forEach((item) => {
    subtotal += item.price * item.qty;
    totalItems += item.qty;
  });

  const totalAmount = subtotal + shipping;

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // --- HANDLE PLACE ORDER API (UPDATED FLOW) ---
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // STEP 1: PREPARE PRODUCTS FOR CART API
      // Backend expects 'products' array with { product, quantity, price, totalPrice }
      const productsPayload = state.map((item) => ({
        product: item.id || item._id, // Product ID
        quantity: item.qty,
        price: item.price,
        totalPrice: item.price * item.qty
      }));

      // STEP 2: SAVE CART TO DATABASE
      // calling /cart/add
      const cartResponse = await syncCartToDB({ products: productsPayload });

      if (!cartResponse.success || !cartResponse.cartId) {
        throw new Error("Failed to generate Cart ID");
      }

      const cartId = cartResponse.cartId;
      console.log("Cart saved to DB. ID:", cartId);

      // STEP 3: PLACE ORDER USING CART ID
      // Backend /order/add expects { cartId, total, user(from token) }
      const orderPayload = {
        cartId: cartId,
        total: totalAmount,
        // Note: Your current backend logic (in the snippet provided) 
        // does not seem to save address/phone from req.body.
        // It only takes cart, user, and total. 
        // If your backend Order model supports address, you can add it here.
      };

      await placeOrder(orderPayload);

      toast.success("Order Placed Successfully!");

      // Optional: Clear Redux Cart here
      // dispatch({ type: "CLEAR_CART" }); 
      localStorage.removeItem("cart"); // Clear local storage if using it directly

      // STEP 4: NAVIGATE
      navigate("/order-placed");

    } catch (error) {
      console.error("Order failed:", error);
      const errMsg = error.response?.data?.error || error.message || "Failed to place order.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
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
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label">Last name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        placeholder="1234 Main St"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone (WhatsApp)</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        placeholder="+92 300 1234567"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        id="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                      />
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

                  <button
                    className="w-100 btn btn-dark btn-lg mt-4 rounded-pill"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span><i className="fa fa-spinner fa-spin me-2"></i> Processing...</span>
                    ) : (
                      `Place Order (Rs ${Math.round(totalAmount)})`
                    )}
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
                      <span className="text-muted">Rs {Math.round(item.price * item.qty)}</span>
                    </li>
                  ))}

                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Subtotal</span>
                    <strong>Rs {Math.round(subtotal)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Shipping</span>
                    <strong>Rs {shipping}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 border-top mt-2 pt-3">
                    <span className="fw-bold fs-5">Total</span>
                    <strong className="fw-bold fs-5">Rs {Math.round(totalAmount)}</strong>
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

      <div className="container my-3 py-3">
        <h1 className="text-center display-6 fw-bold">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>

    </>
  );
};

export default Checkout;