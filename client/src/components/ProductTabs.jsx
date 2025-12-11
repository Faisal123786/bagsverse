import React from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import '../styles/main.scss';

const ProductTabs = () => {
    return (
        <Container fluid="lg" className="py-2">
            <Tabs
                defaultActiveKey="description"
                id="product-details-tabs"
                className="mb-4 custom-tabs"
            >
                {/* --- TAB 1: PRODUCT DESCRIPTION --- */}
                <Tab eventKey="description" title="Product Description" className='tabs' >
                    <div className="tab-content-wrapper">

                        {/* Product Attributes */}
                        <div className="mb-4 text-muted">
                            <p className="mb-1"><strong>Article:</strong> HBH-MIRAS-1</p>
                            <p className="mb-1"><strong>Style:</strong> Tote bag</p>
                            <p className="mb-1"><strong>Color:</strong> Brown</p>
                            <p className="mb-1"><strong>Canvas:</strong> Multi-color Canvas</p>
                            <p className="mb-1"><strong>Material:</strong> Premium quality faux leather and canvas fabric</p>
                        </div>

                        {/* Size Details Heading */}
                        <h4 className="text-uppercase fw-bold mb-3">SIZE DETAILS :</h4>

                        {/* Bullet Points */}
                        <ul className="text-muted product-details-list">
                            <li className="mb-2">Measurements : <strong>Height :</strong> 11.5 " , <strong>Width :</strong> 14 " , <strong>Depth :</strong> 3 "</li>
                            <li className="mb-2">Compartments : 1</li>
                            <li className="mb-2">Small Pocket Inside : 1</li>
                            <li className="mb-2">Soft Base Leather with <strong>4 studs</strong></li>
                        </ul>
                    </div>
                </Tab>

                {/* --- TAB 2: SHIPPING POLICY --- */}
                <Tab eventKey="shipping" title="Shipping Policy" className='tabs'>
                    <div className="tab-content-wrapper text-muted">

                        <p className="mb-4">
                            At HBH.pk, we are committed to providing a seamless and reliable shipping experience to our customers. Our shipping policy is designed to ensure that your orders reach you in the shortest time possible while maintaining transparency throughout the process.
                        </p>

                        {/* Section 1 */}
                        <h4 className="text-dark fw-bold mb-3">Order Processing Time</h4>
                        <ul className="mb-4">
                            <li>All orders are processed within <strong>24-48 hours</strong> of confirmation. This includes order verification, quality checks, and packaging. Please note that orders placed on weekends or public holidays will be processed on the next working day.</li>
                        </ul>

                        {/* Section 2 */}
                        <h4 className="text-dark fw-bold mb-3">Shipping Duration</h4>
                        <ul className="mb-4">
                            <li>Delivery times vary based on your location. Typically, orders are delivered within <strong>3-5 business days</strong> for most regions in Pakistan. However, for remote areas, delivery may take an additional <strong>1-2 business days</strong>.</li>
                        </ul>

                        {/* Section 3 */}
                        <h4 className="text-dark fw-bold mb-3">Tracking Your Order</h4>
                        <ul className="mb-4">
                            <li>Once your order is dispatched, you will receive a confirmation on whatsapp or email with a tracking number (if asked by customer) and instructions to monitor the delivery status in real time.</li>
                        </ul>

                        {/* Section 4 */}
                        <h4 className="text-dark fw-bold mb-3">Delivery Issues</h4>
                        <ul className="mb-4">
                            <li>If you experience delays or issues with your delivery, our support team is here to assist you. Please reach out to us at <a href="mailto:hbh.pk.official@gmail.com" className="text-dark fw-bold">hbh.pk.official@gmail.com</a> or contact our helpline 0300***** (whatsapp) for quick resolution.</li>
                        </ul>

                        <p className="mb-3">We appreciate your trust in HBH Pk and are dedicated to ensuring your satisfaction with every purchase.</p>

                        {/* Section 5: Discount Policy */}
                        <h5 className="text-dark fw-bold mb-2">Discount Policy</h5>
                        <p>At HBH.pk, we are committed to delivering exceptional value through our discounts and promotional offers. Here's a detailed breakdown of our discount policy:</p>
                        <ol className="mt-3">
                            <li className="mb-2"><strong>Limited-Time Discounts:</strong> Enjoy exclusive discounts available for a short duration. Act fast to take advantage of these incredible savings.</li>
                            <li className="mb-2"><strong>Referral Codes:</strong> Share the joy of shopping at HBH.pk by referring friends and family. Referral codes must be redeemed before their expiration date to unlock the savings. Expired codes cannot be reactivated or extended.</li>
                            <li className="mb-2"><strong>Eligibility Criteria:</strong> Discounts are applicable only on eligible items and may not combine with other ongoing promotions unless explicitly stated.</li>
                            <li className="mb-2"><strong>Usage Limits:</strong> Some discounts may have restrictions on the number of times they can be used or a minimum purchase requirement. Please check the terms associated with each promotion.</li>
                        </ol>

                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default ProductTabs;