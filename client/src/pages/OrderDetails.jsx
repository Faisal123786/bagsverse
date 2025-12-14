import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { fetchOrderById } from "../api";
import Skeleton from "react-loading-skeleton";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getOrder = async () => {
            setLoading(true);
            try {
                const data = await fetchOrderById(id);
                setOrder(data);
            } catch (error) {
                console.error("Failed to load order", error);
            } finally {
                setLoading(false);
            }
        };
        getOrder();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container my-5">
                    <Skeleton height={400} />
                </div>
                <Footer />
            </>
        );
    }

    if (!order) {
        return (
            <>
                <Navbar />
                <div className="container my-5 text-center">
                    <h3>Order not found</h3>
                    <Link to="/orders" className="btn btn-dark mt-3">Back to Orders</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container my-5 py-4">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Order Details</h2>
                        <p className="text-muted">Order #{order._id}</p>
                    </div>
                    <Link to="/orders" className="btn btn-outline-dark">
                        <i className="fa fa-arrow-left me-2"></i> Back
                    </Link>
                </div>

                <div className="row">

                    {/* LEFT: Items */}
                    <div className="col-lg-8">
                        <div className="detail-card">
                            <h5>Items in your order</h5>
                            {order.products.map((item, index) => (
                                <div key={index} className="item-row">
                                    <img
                                        src={item.product?.imageUrl || item.product?.images?.[0]?.imageUrl || "https://via.placeholder.com/80?text=No+Image"}
                                        alt={item.product?.name}
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-1">{item.product?.name}</h6>
                                        <p className="text-muted small mb-0">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="fw-bold">
                                        Rs {item.totalPrice}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Payment & Shipping Method */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="detail-card">
                                    <h5>Payment</h5>
                                    <p className="mb-1">Payment Method: <strong>Cash on Delivery</strong></p>
                                    <p className="mb-0">Payment Status: <span className="badge bg-warning text-dark">Pending</span></p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="detail-card">
                                    <h5>Shipping</h5>
                                    <p className="mb-1">Standard Shipping</p>
                                    <p className="mb-0">Status: <strong className="text-primary">{order.status || 'Processing'}</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Summary & Address */}
                    <div className="col-lg-4">

                        {/* Address */}
                        <div className="detail-card">
                            <h5>Shipping Address</h5>
                            <p className="fw-bold mb-1">{order.user?.firstName || "Customer"} {order.user?.lastName}</p>
                            {/* Note: If address isn't saved in Order object in backend, this might be empty */}
                            <p className="text-muted small mb-0">
                                {order.user?.email}<br />
                                (Address data depends on backend response)
                            </p>
                        </div>

                        {/* Cost Summary */}
                        <div className="detail-card">
                            <h5>Order Summary</h5>
                            <div className="d-flex justify-content-between mb-2 text-muted">
                                <span>Subtotal</span>
                                <span>Rs {order.total}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 text-muted">
                                <span>Shipping</span>
                                <span>Rs 0 (Free)</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold fs-5">
                                <span>Total</span>
                                <span>Rs {order.total}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderDetails;