import React from "react";
import { Footer, Navbar } from "../components";
import { Link } from "react-router-dom";

const ContactPage = () => {
  return (
    <>
      <Navbar />

      {/* Main Container */}
      <div className="container my-5 py-4">
        <div className="row">

          {/* --- LEFT COLUMN: TEXT CONTENT --- */}
          <div className="col-md-5 mb-5 mb-md-0 d-flex flex-column justify-content-start pt-3">
            <h1 className="fw-bold display-5 mb-3">Contact Us</h1>
            <h3 className="fw-normal text-muted mb-4">How can we help you?</h3>
            <p className="lead text-muted fs-6" style={{ maxWidth: "400px", lineHeight: "1.8" }}>
              We're here to help and answer any question you might have.
              We look forward to hearing from you.
            </p>
          </div>

          {/* --- RIGHT COLUMN: THE FORM CARD --- */}
          <div className="col-md-7">
            <div className="contact-card">
              <form onSubmit={(e) => e.preventDefault()}>

                {/* Row 1: First Name & Last Name */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="firstName" className="form-label">First Name*</label>
                    <input type="text" className="form-control" id="firstName" placeholder="First Name" required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName" placeholder="Last Name" />
                  </div>
                </div>

                {/* Row 2: Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email*</label>
                  <input type="email" className="form-control" id="email" placeholder="name@example.com" required />
                </div>

                {/* Row 3: Support Type (Dropdown) */}
                <div className="mb-3">
                  <label htmlFor="supportType" className="form-label">Support Type*</label>
                  <select className="form-select" id="supportType" defaultValue="" required>
                    <option value="" disabled>Select an option</option>
                    <option value="feature">Feature Request</option>
                    <option value="technical">Technical Issue</option>
                    <option value="order">Order Issue</option>
                    <option value="support">Customer Support</option>
                    <option value="delete">Account Deletion Request</option>
                  </select>
                </div>

                {/* Row 4: Message */}
                <div className="mb-4">
                  <label htmlFor="message" className="form-label">Message*</label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    required
                  ></textarea>
                </div>

                {/* Button */}
                <div className="text-center">
                  <button className="btn-submit-contact" type="submit">
                    <i className="fa fa-paper-plane me-2"></i> Send Message
                  </button>
                </div>

                {/* Disclaimer Text */}
                <p className="text-muted text-center mt-3" style={{ fontSize: "0.8rem" }}>
                  By submitting this form, you agree to our <Link to="/privacy" className="text-dark text-decoration-underline">Privacy Policy</Link> and <Link to="/terms" className="text-dark text-decoration-underline">Terms of Service</Link>.
                </p>

              </form>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;