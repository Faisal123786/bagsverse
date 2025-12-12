import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { Link, useLocation } from "react-router-dom";

const OrderPage = () => {
    // Sidebar Active State
    const location = useLocation();
    const currentPath = location.pathname;

    // --- STATE ---
    const [activeTab, setActiveTab] = useState("All Orders");

    // --- MOCK DATA ---
    const allOrders = [
        {
            id: "LUX-9928-XA",
            date: "Nov 24, 2024",
            itemCount: 2,
            total: 12400,
            status: "Processing",
            items: [
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200", // Bag
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200"  // Watch
            ]
        },
        {
            id: "LUX-8210-BC",
            date: "Oct 12, 2024",
            itemCount: 1,
            total: 4500,
            status: "Delivered",
            items: [
                "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=200" // Sunglasses
            ]
        },
        {
            id: "LUX-7763-MM",
            date: "Sep 04, 2024",
            itemCount: 3,
            total: 28900,
            status: "Delivered",
            items: [
                "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=200", // Shoes
                "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=200", // Bag
                "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=200"  // Wallet
            ]
        },
        {
            id: "LUX-1102-RR",
            date: "Aug 15, 2024",
            itemCount: 1,
            total: 3355,
            status: "Returns",
            items: [
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=200" // Gadget
            ]
        }
    ];

    // --- FILTER LOGIC ---
    const filteredOrders = activeTab === "All Orders"
        ? allOrders
        : allOrders.filter(order => order.status === activeTab);

    // Status Badge Helper
    const getBadgeStyle = (status) => {
        switch (status) {
            case 'Processing': return 'bg-primary bg-opacity-10 text-primary';
            case 'Shipped': return 'bg-info bg-opacity-10 text-info';
            case 'Delivered': return 'bg-success bg-opacity-10 text-success';
            case 'Returns': return 'bg-danger bg-opacity-10 text-danger';
            default: return 'bg-secondary bg-opacity-10 text-secondary';
        }
    };

    return (
        <>
            <Navbar />

            <div className="container my-5 py-4">

                {/* Page Title Row */}
                <div className="row mb-4">
                    <div className="col-12">
                        <h2 className="display-6 fw-bold">Order History</h2>
                        <p className="text-muted">Track, return, or buy things again.</p>
                    </div>
                </div>

                <div className="row">

                    {/* --- LEFT SIDEBAR (Consistent with Account Page) --- */}
                    <div className="col-lg-3 col-md-4 mb-4">
                        <div className="account-sidebar shadow-sm">
                            <Link
                                to="/orders"
                                className={`sidebar-link ${currentPath === '/orders' ? 'active' : ''}`}
                            >
                                <span><i className="fa fa-shopping-bag me-2"></i> Orders</span>
                                <i className="fa fa-chevron-right small"></i>
                            </Link>

                            <Link
                                to="/account-details"
                                className="sidebar-link"
                            >
                                <span><i className="fa fa-user me-2"></i> Account Details</span>
                                <i className="fa fa-chevron-right small"></i>
                            </Link>

                            <Link to="/login" className="sidebar-link text-danger">
                                <span><i className="fa fa-sign-out me-2"></i> Logout</span>
                            </Link>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT (Orders) --- */}
                    <div className="col-lg-9 col-md-8">

                        {/* Header: Tabs & Filter */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

                            {/* Tabs */}
                            <div className="status-tabs-container">
                                {["All Orders", "Processing", "Shipped", "Delivered", "Returns"].map(tab => (
                                    <button
                                        key={tab}
                                        className={`status-tab ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Filter Input (Visual only) */}
                            <div className="mb-3 mb-md-0">
                                <input type="text" placeholder="Filter by order #" className="order-filter-input" />
                            </div>
                        </div>

                        {/* --- ORDERS LIST --- */}
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <div key={order.id} className="order-card-modern">

                                    {/* Top Row */}
                                    <div className="card-top">
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            <span className="order-id">Order #{order.id}</span>
                                            <span className={`badge rounded-pill ${getBadgeStyle(order.status)} px-3 py-2`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="order-total-label">Total Amount</span>
                                            <span className="order-total-amount">Rs {order.total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Meta Row */}
                                    <div className="order-meta">
                                        Placed on {order.date} • {order.itemCount} Items
                                    </div>

                                    {/* Bottom Row */}
                                    <div className="card-bottom">

                                        {/* Images */}
                                        <div className="img-group">
                                            {order.items.slice(0, 2).map((img, i) => (
                                                <img key={i} src={img} alt="Product" />
                                            ))}
                                            {/* Show counter if more than 2 items */}
                                            {order.items.length > 2 && (
                                                <div className="more-count">+{order.items.length - 2}</div>
                                            )}
                                        </div>

                                        {/* Buttons */}
                                        <div className="d-flex gap-2">
                                            {order.status === 'Delivered' ? (
                                                <>
                                                    <button className="btn-outline-custom">View Invoice</button>
                                                    <button className="btn-gold">Buy Again</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="btn-outline-custom">View Details</button>
                                                    <button className="btn-outline-custom">Track Order</button>
                                                </>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-5 border rounded bg-white">
                                <i className="fa fa-search fa-2x text-muted mb-3"></i>
                                <h5>No orders found</h5>
                                <p className="text-muted">Try changing the filter.</p>
                            </div>
                        )}

                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default OrderPage;