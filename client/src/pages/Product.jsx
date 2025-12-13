import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import ProductTabs from "../components/ProductTabs";
import ProductReviews from "../components/ProductReviews";
import { Footer, Navbar } from "../components";
import { fetchProductById } from "../api"; // Import your API function

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();

  const addProductToCart = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(id);
        setProduct(data);

        // Note: Logic for "Similar Products" depends on your backend API.
        // If you have an endpoint like fetchProductsByCategory(data.category), add it here.
        // For now, I'm setting loading2 to false since we aren't fetching similar yet.
        setLoading2(false);

      } catch (error) {
        console.error("Failed to load product", error);
        setLoading(false);
      }
      setLoading(false);
    };

    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 py-3">
            <Skeleton height={400} width={400} />
          </div>
          <div className="col-md-6 py-5">
            <Skeleton height={30} width={250} />
            <Skeleton height={90} />
            <Skeleton height={40} width={70} />
            <Skeleton height={50} width={110} />
            <Skeleton height={120} />
            <Skeleton height={40} width={110} inline={true} />
            <Skeleton className="mx-3" height={40} width={110} />
          </div>
        </div>
      </div>
    );
  };

  const ShowProduct = () => {
    const [qty, setQty] = useState(1);

    const handleQty = (type) => {
      if (type === "dec" && qty > 1) {
        setQty(qty - 1);
      }
      if (type === "inc") {
        setQty(qty + 1);
      }
    };

    // Safety check for image
    const mainImage = product.images && product.images.length > 0
      ? product.images[0].imageUrl
      : "https://via.placeholder.com/400";

    return (
      <div className="container my-2 py-2">
        <div className="row">
          {/* --- LEFT SIDE: IMAGE --- */}
          <div className="col-md-6 col-sm-12 py-3">
            <img
              className="img-fluid sticky-top"
              src={mainImage}
              alt={product.name}
              width="400px"
              height="400px"
              style={{ objectFit: "contain", maxHeight: "500px" }}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400?text=No+Image" }}
            />
          </div>

          {/* --- RIGHT SIDE: DETAILS --- */}
          <div className="col-md-6 col-sm-12 py-3">

            {/* 1. Header: Title + Heart Icon */}
            <div className="d-flex justify-content-between align-items-start">
              <div>
                {/* Changed product.title to product.name based on your DB schema */}
                <h2 className="display-6 fw-normal mb-0">{product.name}</h2>
                {/* <span className="text-muted small">{product.category}</span> */}
              </div>
              <button className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="fa fa-heart-o"></i>
              </button>
            </div>

            {/* Price */}
            <h3 className="my-3 fw-bold">Rs. {product.price} PKR</h3>

            {/* Reviews (Static for now since DB doesn't have ratings yet) */}
            <div className="mb-4 d-flex align-items-center">
              <span className="text-danger me-2">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </span>
              <span className="text-muted small">
                {/* Fallback to 0 if no rating data */}
                {(product.rating && product.rating.count) || 0} reviews
              </span>
            </div>

            {/* Description (Added from DB) */}
            <p className="lead fs-6 mb-4">{product.description}</p>

            {/* 2. Quantity & Add to Cart */}
            <div className="mb-3">
              <p className="mb-2 small fw-bold">Quantity</p>
              <div className="d-flex gap-3">
                <div
                  className="d-flex align-items-center justify-content-between border rounded-0"
                  style={{ width: "120px", height: "48px" }}
                >
                  <button className="btn border-0 px-3 no-focus" onClick={() => handleQty("dec")}>-</button>
                  <span className="fw-bold">{qty}</span>
                  <button className="btn border-0 px-3 no-focus" onClick={() => handleQty("inc")}>+</button>
                </div>

                <button
                  className="btn btn-outline-dark flex-grow-1 text-uppercase fw-bold rounded-0"
                  style={{ height: "48px" }}
                  onClick={() => addProductToCart(product)}
                >
                  Add to cart
                </button>
              </div>
            </div>

            {/* 3. Buy It Now */}
            <Link
              to="/cart"
              className="btn btn-dark w-100 py-2 mb-4 text-uppercase fw-bold rounded-0"
              style={{ height: "48px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Buy it now
            </Link>

            {/* Share */}
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 cursor-pointer text-muted">
                <i className="fa fa-share-alt"></i>
                <span className="small">Share</span>
              </div>
            </div>

            {/* Shipping Info */}
            <hr />
            <div className="d-flex align-items-center gap-3 text-muted my-4" style={{ fontSize: '0.9rem' }}>
              <i className="fa fa-cube fa-lg"></i>
              <span>Free Shipping on all orders above Rs. 7,999 PKR!</span>
            </div>

            {/* 4. Accordions */}
            <div className="mt-4">
              <Accordion flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Disclaimer</Accordion.Header>
                  <Accordion.Body className="text-muted small">
                    Actual colors may vary. This is due to computer monitors displaying colors differently.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Cleaning Instruction</Accordion.Header>
                  <Accordion.Body className="text-muted small">
                    To clean this product, wipe with a soft, dry cloth. Avoid using harsh chemicals.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const Loading2 = () => {
    return (
      <div className="my-4 py-4">
        <div className="d-flex">
          {/* Skeletons... */}
          {[1, 2, 3, 4].map(n => (
            <div className="mx-4" key={n}>
              <Skeleton height={400} width={250} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ShowSimilarProduct = () => {
    // You'll need to update this once you have a real "Similar Products" API
    // For now, it returns empty or you can map similarProducts if you fetch them later
    if (similarProducts.length === 0) return null;

    return (
      <div className="py-4 my-4">
        <div className="d-flex">
          {similarProducts.map((item) => {
            const simImg = item.images && item.images.length > 0 ? item.images[0].imageUrl : "https://via.placeholder.com/300";
            return (
              <div key={item.id} className="card mx-4 text-center">
                <img
                  className="card-img-top p-3"
                  src={simImg}
                  alt={item.name}
                  height={300}
                  width={300}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {item.name.substring(0, 15)}...
                  </h5>
                </div>
                <div className="card-body">
                  <Link to={"/product/" + item.id} className="btn btn-dark m-1">
                    Buy Now
                  </Link>
                  <button className="btn btn-dark m-1" onClick={() => addProductToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container-lg container-fluid">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row"><ProductTabs /></div>
        <div className="row"><ProductReviews /></div>

        {/* Only show marquee if there are similar products */}
        {similarProducts.length > 0 && (
          <div className="row my-2 py-2">
            <div className="d-none d-md-block">
              <h2 className="">You may also Like</h2>
              <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
                {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
              </Marquee>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Product;