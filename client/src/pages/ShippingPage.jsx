import React from "react";
import { Footer, Navbar } from "../components";

const ShippingPage = () => {
    return (
        <>
            <Navbar />

            <div className="container my-5 py-4">
                <div className="policy-wrapper">

                    <h1 className="page-title display-5">Shipping Policy</h1>

                    <p>
                        <strong>Shipping Policy:</strong> At BagsVerse, we are committed to providing a seamless and reliable shipping experience to our customers. Our shipping policy is designed to ensure that your orders reach you in the shortest time possible while maintaining transparency throughout the process.
                    </p>

                    {/* --- Section 1 --- */}
                    <h2 className="section-title">Order Processing Time</h2>
                    <ul>
                        <li>
                            All orders are processed within <strong>24-48 hours</strong> of confirmation. This includes order verification, quality checks, and packaging. Please note that orders placed on weekends or public holidays will be processed on the next working day.
                        </li>
                    </ul>

                    {/* --- Section 2 --- */}
                    <h2 className="section-title">Shipping Duration</h2>
                    <ul>
                        <li>
                            Delivery times vary based on your location. Typically, orders are delivered within <strong>3-5 business days</strong> for most regions. However, for remote areas, delivery may take an additional <strong>1-2 business days</strong>.
                        </li>
                    </ul>

                    {/* --- Section 3 --- */}
                    <h2 className="section-title">Shipping Charges</h2>
                    <ul>
                        <li>
                            Standard shipping charges are applied based on the weight and size of the package, as well as the delivery location. Any applicable charges will be clearly mentioned at checkout.
                        </li>
                        <li>
                            Free shipping is offered on orders exceeding a specific value, as advertised on our website or during promotions.
                        </li>
                    </ul>

                    {/* --- Special Tip Box (From Screenshot 2) --- */}
                    <div className="tip-box">
                        <div className="tip-header mb-2">
                            <span style={{ fontSize: '1.2rem' }}>💡</span> Tips to reduce total cost
                        </div>
                        <p className="mb-2 fw-bold">Avoid 4% Tax Instantly</p>
                        <p className="mb-2 small">
                            The government applies a <strong>4% tax on all cash payments</strong>.
                            Make all payments online to save 4% and keep your money in your pocket.
                        </p>
                        <p className="mb-0 small fw-bold">
                            📱 For assistance or setup, contact us on WhatsApp: 0300-1234567
                        </p>
                        <p className="mt-1 small">Pay smart. Pay online. Save 4%.</p>
                    </div>

                    {/* --- Section 4 --- */}
                    <h2 className="section-title">Tracking Your Order</h2>
                    <ul>
                        <li>
                            Once your order is dispatched, you will receive a confirmation email or WhatsApp SMS with a tracking number (upon customer demand) and instructions to monitor the delivery status in real time.
                        </li>
                    </ul>

                    {/* --- Section 5 --- */}
                    <h2 className="section-title">Delivery Issues</h2>
                    <ul>
                        <li>
                            If you experience delays or issues with your delivery, our support team is here to assist you. Please reach out to us at <a href="mailto:support@bagsverse.com">support@bagsverse.com</a> or contact our helpline +92 300 1234567 for quick resolution.
                        </li>
                    </ul>

                    <p className="mt-4">
                        We appreciate your trust in BagsVerse and are dedicated to ensuring your satisfaction with every purchase.
                    </p>

                    <hr className="my-5" />

                    {/* --- Discount Policy Section --- */}
                    <h2 className="section-title mt-0">Discount Policy</h2>
                    <p>
                        At BagsVerse, we are committed to delivering exceptional value through our discounts and promotional offers. Here's a detailed breakdown of our discount policy:
                    </p>

                    <ol className="mt-4">
                        <li>
                            <strong>Limited-Time Discounts:</strong> Enjoy exclusive discounts available for a short duration. Act fast to take advantage of these incredible savings.
                        </li>
                        <li>
                            <strong>Referral Codes:</strong> Share the joy of shopping at BagsVerse by referring friends and family. Referral codes must be redeemed before their expiration date to unlock the savings. Expired codes cannot be reactivated or extended.
                        </li>
                        <li>
                            <strong>Eligibility Criteria:</strong> Discounts are applicable only on eligible items and may not combine with other ongoing promotions unless explicitly stated.
                        </li>
                        <li>
                            <strong>Usage Limits:</strong> Some discounts may have restrictions on the number of times they can be used or a minimum purchase requirement. Please check the terms associated with each promotion.
                        </li>
                        <li>
                            <strong>Non-Transferable:</strong> Discount codes are intended for individual use and cannot be transferred or sold.
                        </li>
                    </ol>

                    <p className="mt-4 text-muted small">
                        Our goal is to provide you with the best deals while maintaining transparency and fairness. If you have any questions about our discount policy or encounter any issues, please feel free to contact us. Happy shopping!
                    </p>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default ShippingPage;