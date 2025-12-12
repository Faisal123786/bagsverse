import React from "react";
import { Footer, Navbar } from "../components";
import { Link, useLocation } from "react-router-dom";

const AccountDetails = () => {
    // To handle active state
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            <Navbar />

            <div className="container my-5 py-4">

                {/* Page Title */}
                <div className="row mb-4">
                    <div className="col-12">
                        <h2 className="display-6 fw-bold">My Account</h2>
                    </div>
                </div>

                <div className="row">

                    {/* --- LEFT SIDEBAR (Navigation) --- */}
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
                                className={`sidebar-link ${currentPath === '/account-details' ? 'active' : ''}`}
                            >
                                <span><i className="fa fa-user me-2"></i> Account Details</span>
                                <i className="fa fa-chevron-right small"></i>
                            </Link>

                            <Link
                                to="/login"
                                className="sidebar-link text-danger"
                            >
                                <span><i className="fa fa-sign-out me-2"></i> Logout</span>
                            </Link>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT (Form) --- */}
                    <div className="col-lg-9 col-md-8">
                        <div className="contact-card">
                            <h4 className="fw-bold mb-4">Account Details</h4>

                            <form onSubmit={(e) => e.preventDefault()}>

                                {/* Personal Info */}
                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label className="form-label">First Name *</label>
                                        <input type="text" className="form-control" defaultValue="John" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Last Name *</label>
                                        <input type="text" className="form-control" defaultValue="Doe" required />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Display Name</label>
                                    <input type="text" className="form-control" defaultValue="John Doe" />
                                    <div className="form-text">This will be how your name will be displayed in the account section and in reviews.</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email Address *</label>
                                    <input type="email" className="form-control" defaultValue="john.doe@example.com" required />
                                </div>

                                {/* Password Change Divider */}
                                <h5 className="mt-5 mb-3 pb-2 border-bottom">Password Change</h5>

                                <div className="mb-3">
                                    <label className="form-label">Current Password (leave blank to leave unchanged)</label>
                                    <input type="password" className="form-control" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">New Password (leave blank to leave unchanged)</label>
                                    <input type="password" className="form-control" />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Confirm New Password</label>
                                    <input type="password" className="form-control" />
                                </div>

                                {/* Submit */}
                                <button className="btn-submit-contact mt-2 w-auto px-5" type="submit">
                                    Save Changes
                                </button>

                            </form>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default AccountDetails;