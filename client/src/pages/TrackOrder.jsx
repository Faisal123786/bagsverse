import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { fetchOrderById } from "../api";

const TrackOrder = () => {
    const { id } = useParams();
    const [status, setStatus] = useState("Processing");
    const [loading, setLoading] = useState(true);

    // Status Steps Definition
    const steps = ["Placed", "Processing", "Shipped", "Delivered"];

    useEffect(() => {
        const getOrder = async () => {
            setLoading(true);
            try {
                const data = await fetchOrderById(id);
                // Normalize status (Backend might return 'Not processed', we map it to 'Placed' or 'Processing')
                let currentStatus = data.status || "Processing";
                if (currentStatus === "Not processed") currentStatus = "Placed";
                setStatus(currentStatus);
            } catch (error) {
                console.error("Error", error);
            } finally {
                setLoading(false);
            }
        };
        getOrder();
    }, [id]);

    // Helper to determine step state (completed, active, or pending)
    const getStepClass = (stepName) => {
        const currentIndex = steps.indexOf(status);
        const stepIndex = steps.indexOf(stepName);

        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "active";
        return "";
    };

    return (
        <>

            <div className="container my-5 py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fw-bold">Track Order</h2>
                            <span className="text-muted">#{id}</span>
                        </div>

                        <div className="tracking-wrapper">
                            {loading ? (
                                <p className="text-center">Loading status...</p>
                            ) : (
                                <div className="timeline-container">

                                    {/* Step 1: Placed */}
                                    <div className={`timeline-item ${getStepClass("Placed")}`}>
                                        <div className="timeline-icon">
                                            {getStepClass("Placed") === "completed" ? <i className="fa fa-check"></i> : "1"}
                                        </div>
                                        <h5 className="fw-bold">Order Placed</h5>
                                        <p className="text-muted small">We have received your order.</p>
                                    </div>

                                    {/* Step 2: Processing */}
                                    <div className={`timeline-item ${getStepClass("Processing")}`}>
                                        <div className="timeline-icon">
                                            {getStepClass("Processing") === "completed" ? <i className="fa fa-check"></i> : "2"}
                                        </div>
                                        <h5 className="fw-bold">Processing</h5>
                                        <p className="text-muted small">Your order is being prepared.</p>
                                    </div>

                                    {/* Step 3: Shipped */}
                                    <div className={`timeline-item ${getStepClass("Shipped")}`}>
                                        <div className="timeline-icon">
                                            {getStepClass("Shipped") === "completed" ? <i className="fa fa-check"></i> : "3"}
                                        </div>
                                        <h5 className="fw-bold">Shipped</h5>
                                        <p className="text-muted small">Your order is on the way.</p>
                                    </div>

                                    {/* Step 4: Delivered */}
                                    <div className={`timeline-item ${getStepClass("Delivered")}`}>
                                        <div className="timeline-icon">
                                            {getStepClass("Delivered") === "completed" ? <i className="fa fa-check"></i> : "4"}
                                        </div>
                                        <h5 className="fw-bold">Delivered</h5>
                                        <p className="text-muted small">Package has been delivered.</p>
                                    </div>

                                </div>
                            )}
                        </div>

                        <div className="text-center mt-4">
                            <Link to="/orders" className="btn btn-outline-dark">
                                Back to Orders
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

        </>
    );
};

export default TrackOrder;