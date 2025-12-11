import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import '../styles/main.scss';

const ProductReviews = () => {
    const [showForm, setShowForm] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [rating, setRating] = useState(0);

    // Toggle function
    const toggleReviewForm = () => {
        setShowForm(!showForm);
    };

    return (
        <Container className="py-5 border-top ">
            {/* --- SECTION HEADER --- */}
            <h3 className="text-center mb-4 text-dark fw-normal">Customer Reviews</h3>

            {/* --- TOP SUMMARY SECTION (Always Visible) --- */}
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mb-5">

                {/* Left Side: Stars & Text */}
                <div className="text-center">
                    <div className="text-danger fs-4 mb-1">
                        <i className="fa fa-star-o mx-1"></i>
                        <i className="fa fa-star-o mx-1"></i>
                        <i className="fa fa-star-o mx-1"></i>
                        <i className="fa fa-star-o mx-1"></i>
                        <i className="fa fa-star-o mx-1"></i>
                    </div>
                    <p className="text-muted mb-0">Be the first to write a review</p>
                </div>

                {/* Vertical Divider (Hidden on mobile) */}
                <div className="d-none d-md-block" style={{ borderRight: '1px solid #ddd', height: '50px' }}></div>

                {/* Right Side: Toggle Button */}
                <div>
                    <Button
                        className="btn-red px-5 py-2 fw-bold"
                        onClick={toggleReviewForm}
                    >
                        {showForm ? 'Cancel review' : 'Write a review'}
                    </Button>
                </div>
            </div>

            {/* --- FORM SECTION (Conditionally Rendered) --- */}
            {showForm && (
                <div className="review-form-container mx-auto p-4 border-top  bg-white" style={{ maxWidth: '600px' }}>

                    <h4 className="text-center mb-1">Write a review</h4>
                    <p className="text-center text-muted mb-3">Rating</p>

                    {/* Interactive Star Rating */}
                    <div className="text-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`fa ${star <= (hoverRating || rating) ? 'fa-star' : 'fa-star-o'} fs-3 mx-1 cursor-pointer text-danger`}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                style={{ cursor: 'pointer' }}
                            ></i>
                        ))}
                    </div>

                    <Form>
                        {/* Title */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small text-muted">Review Title (100)</Form.Label>
                            <Form.Control type="text" placeholder="Give your review a title" />
                        </Form.Group>

                        {/* Content */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small text-muted">Review content</Form.Label>
                            <Form.Control as="textarea" rows={4} placeholder="Start writing here..." />
                        </Form.Group>

                        {/* Picture Upload Box */}
                        <Form.Group className="mb-3 text-center">
                            <Form.Label className="small text-muted d-block">Picture/Video (optional)</Form.Label>
                            <div className="upload-box d-flex align-items-center justify-content-center mx-auto">
                                <i className="fa fa-upload text-muted fs-4"></i>
                            </div>
                        </Form.Group>

                        {/* Name */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small text-muted">Display name (displayed publicly like <span className="text-danger">John Smith</span>)</Form.Label>
                            <Form.Control type="text" placeholder="Display name" />
                        </Form.Group>

                        {/* Email */}
                        <Form.Group className="mb-4">
                            <Form.Label className="small text-muted">Email address</Form.Label>
                            <Form.Control type="email" placeholder="Your email address" />
                            <Form.Text className="text-muted small d-block mt-2">
                                How we use your data: We’ll only contact you about the review you left, and only if necessary. By submitting your review, you agree to Judge.me’s terms, privacy and content policies.
                            </Form.Text>
                        </Form.Group>

                        {/* Footer Buttons */}
                        <div className="d-flex justify-content-center gap-3">
                            <Button
                                variant="outline-danger"
                                className="px-4 fw-bold"
                                onClick={toggleReviewForm}
                            >
                                Cancel review
                            </Button>
                            <Button
                                className="btn-red px-4 fw-bold"
                                type="submit"
                                onClick={(e) => e.preventDefault()}
                            >
                                Submit Review
                            </Button>
                        </div>
                    </Form>

                </div>
            )}
        </Container>
    );
};

export default ProductReviews;