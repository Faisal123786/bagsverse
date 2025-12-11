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

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <>
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
      </>
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

    return (
      <>
        <div className="container my-2 py-2">
          <div className="row">
            {/* --- LEFT SIDE: IMAGE --- */}
            <div className="col-md-6 col-sm-12 py-3">
              <img
                className="img-fluid sticky-top"
                src={product.image}
                alt={product.title}
                width="400px"
                height="400px"
                style={{ objectFit: "contain", maxHeight: "500px" }}
              />
            </div>

            {/* --- RIGHT SIDE: DETAILS --- */}
            <div className="col-md-6 col-sm-12 py-3">

              {/* 1. Header: Title + Heart Icon */}
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h2 className="display-6 fw-normal mb-0">{product.title}</h2>
                  {/* Category below title like screenshot */}
                  {/* <span className="text-muted small">{product.category}</span> */}
                </div>
                {/* Heart Icon Button */}
                <button className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="fa fa-heart-o"></i>
                </button>
              </div>

              {/* Price */}
              <h3 className="my-3 fw-bold">Rs. {product.price} PKR</h3>

              {/* Reviews */}
              <div className="mb-4 d-flex align-items-center">
                <span className="text-danger me-2"> {/* Red stars per screenshot */}
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                </span>
                <span className="text-muted small">
                  {product.rating && product.rating.count} reviews
                </span>
              </div>

              {/* 2. Quantity & Add to Cart (SAME LINE) */}
              <div className="mb-3">
                <p className="mb-2 small fw-bold">Quantity</p>
                <div className="d-flex gap-3">
                  {/* Quantity Box */}
                  <div
                    className="d-flex align-items-center justify-content-between border rounded-0"
                    style={{ width: "120px", height: "48px" }} // Fixed height
                  >
                    <button className="btn  border-0 px-3 no-focus " onClick={() => handleQty("dec")}>-</button>
                    <span className="fw-bold">{qty}</span>
                    <button className="btn  border-0 px-3 no-focus " onClick={() => handleQty("inc")}>+</button>
                  </div>

                  {/* Add to Cart Button (Takes remaining space) */}
                  <button
                    className="btn btn-outline-dark flex-grow-1 text-uppercase fw-bold rounded-0"
                    style={{ height: "48px" }} // Matches height of qty box
                    onClick={() => addProduct(product)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>

              {/* 3. Buy It Now (Full width below) */}
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

              {/* Shipping Info with Divider */}
              <hr />
              <div className="d-flex align-items-center gap-3 text-muted my-4" style={{ fontSize: '0.9rem' }}>
                <i className="fa fa-cube fa-lg"></i>
                <span>Free Shipping on all orders above Rs. 7,999 PKR!</span>
              </div>

              {/* 4. Accordions (Closed by default - removed defaultActiveKey) */}
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
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item) => {
              return (
                <div key={item.id} className="card mx-4 text-center">
                  <img
                    className="card-img-top p-3"
                    src={item.image}
                    alt="Card"
                    height={300}
                    width={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {item.title.substring(0, 15)}...
                    </h5>
                  </div>
                  {/* <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">${product.price}</li>
                  </ul> */}
                  <div className="card-body">
                    <Link
                      to={"/product/" + item.id}
                      className="btn btn-dark m-1"
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => addProduct(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container-lg container-fluid">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row"><ProductTabs /></div>
        <div className="row"><ProductReviews /></div>
        <div className="row my-2 py-2">
          <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            <Marquee
              pauseOnHover={true}
              pauseOnClick={true}
              speed={50}
            >
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
