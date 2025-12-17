import React, { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import { useDispatch } from 'react-redux';
import { addCart } from '../redux/action';
import ProductTabs from '../components/ProductTabs';
import ProductReviews from '../components/ProductReviews'; // Updated Component
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { fetchProductById, fetchProducts } from '../api';
import toast from "react-hot-toast";
const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [mainImage, setMainImage] = useState('');
  const [thumbnails, setThumbnails] = useState([]);

  // --- ADD TO CART ---
  const addProductToCart = (productItem, specificImage = null, quantity = 1) => {
    const imageToUse = specificImage
      || (productItem.images && productItem.images.length > 0 ? productItem.images[0].imageUrl : '')
      || productItem.image;

    const productData = {
      ...productItem,
      image: imageToUse,
      qty: quantity
    };

    dispatch(addCart(productData));
    toast.success("Product added to cart!");
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const getProductData = async () => {
      setLoading(true);
      setLoading2(true);
      try {
        const data = await fetchProductById(id);
        setProduct(data);

        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0].imageUrl);
          setThumbnails(data.images.map(img => img.imageUrl));
        } else {
          setMainImage("https://via.placeholder.com/400");
          setThumbnails([]);
        }

        setLoading(false);

        // Fetch Similar
        const response = await fetchProducts();
        const allProducts = response.products || response || [];
        const currentCategoryName = typeof data.category === 'object' ? data.category?.name : data.category;

        const related = allProducts.filter(item => {
          const itemCatName = typeof item.category === 'object' ? item.category?.name : item.category;
          return itemCatName === currentCategoryName && item._id !== data._id;
        });

        setSimilarProducts(related);
        setLoading2(false);

      } catch (error) {
        toast.error("Failed to load product. Please try again later.");
        console.error("Error loading product:", error);
        setLoading(false);
        setLoading2(false);
      }
    };
    getProductData();
  }, [id]);

  const handleImage = index => {
    const selectedImage = thumbnails[index];
    if (selectedImage) setMainImage(selectedImage);
  };

  const Loading = () => (
    <div className='container my-5 py-2'>
      <div className='row'>
        <div className='col-md-6 py-3'><Skeleton height={400} width={400} /></div>
        <div className='col-md-6 py-5'><Skeleton count={6} height={40} /></div>
      </div>
    </div>
  );

  const ShowProduct = () => {
    const [qty, setQty] = useState(1);

    const handleQty = type => {
      if (type === 'dec' && qty > 1) setQty(qty - 1);
      if (type === 'inc') setQty(qty + 1);
    };

    const handleBuyNow = () => {
      addProductToCart(product, mainImage, qty);
      navigate('/checkout');
    };

    return (
      <div className='container my-2 py-2'>
        <div className='row'>
          <div className='col-12 col-md-6 py-3 border px-3'>
            <div className='d-flex flex-column flex-md-row gap-3 justify-content-center align-items-start'>
              <div className='d-flex flex-row flex-sm-column gap-2 overflow-auto' style={{ maxHeight: '600px', maxWidth: '100%', scrollbarWidth: 'none' }}>
                {thumbnails.map((thumbnail, index) => (
                  <div key={index} className='border rounded flex-shrink-0' style={{ width: '80px', height: '80px', cursor: 'pointer', border: mainImage === thumbnail ? '2px solid #000' : '1px solid #ddd' }} onClick={() => handleImage(index)} onMouseEnter={() => handleImage(index)}>
                    <img src={thumbnail} alt={`Thumb ${index}`} className='img-fluid w-100 h-100 rounded' style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <div className='flex-grow-1 d-flex justify-content-center align-items-center' style={{ maxWidth: '100%' }}>
                <div style={{ maxHeight: '600px', width: '450px' }}>
                  <TransformWrapper>
                    <TransformComponent>
                      <img src={mainImage} alt={product.name} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400?text=No+Image" }} />
                    </TransformComponent>
                  </TransformWrapper>
                </div>
              </div>
            </div>
          </div>

          <div className='col-md-6 col-sm-12 py-3'>
            <div className='d-flex justify-content-between align-items-start'>
              <h2 className='display-6 fw-normal mb-0'>{product.name}</h2>
              <button className='btn btn-light border rounded-circle d-flex align-items-center justify-content-center' style={{ width: '40px', height: '40px' }}><i className='fa fa-heart-o'></i></button>
            </div>
            <h3 className='my-3 fw-bold'>Rs. {product.price} PKR</h3>

            {/* Pass Review Count here if available in product object later */}
            <div className='mb-4 d-flex align-items-center'>
              <span className='text-danger me-2'><i className='fa fa-star'></i><i className='fa fa-star'></i><i className='fa fa-star'></i><i className='fa fa-star'></i><i className='fa fa-star'></i></span>
              <span className='text-muted small'>See reviews below</span>
            </div>

            <div className='mb-3'>
              <p className='mb-2 small fw-bold'>Quantity</p>
              <div className='d-flex gap-3'>
                <div className='d-flex align-items-center justify-content-between border rounded-0' style={{ width: '120px', height: '48px' }}>
                  <button className='btn border-0 px-3 no-focus' onClick={() => handleQty('dec')}>-</button>
                  <span className='fw-bold'>{qty}</span>
                  <button className='btn border-0 px-3 no-focus' onClick={() => handleQty('inc')}>+</button>
                </div>
                <button className='btn btn-outline-dark flex-grow-1 text-uppercase fw-bold rounded-0' style={{ height: '48px' }} onClick={() => addProductToCart(product, mainImage, qty)}>Add to cart</button>
              </div>
            </div>
            <button onClick={handleBuyNow} className='btn btn-dark w-100 py-2 mb-4 text-uppercase fw-bold rounded-0' style={{ height: '48px' }}>Buy it now</button>

            <div className='mb-3'><div className='d-flex align-items-center gap-2 cursor-pointer text-muted'><i className='fa fa-share-alt'></i><span className='small'>Share</span></div></div>
            <hr />
            <div className='d-flex align-items-center gap-3 text-muted my-4' style={{ fontSize: '0.9rem' }}><i className='fa fa-cube fa-lg'></i><span>Free Shipping on all orders above Rs. 7,999 PKR!</span></div>
            <div className='mt-4'>
              <Accordion flush>
                <Accordion.Item eventKey='0'><Accordion.Header>Disclaimer</Accordion.Header><Accordion.Body className='text-muted small'>{product.Disclaimer}</Accordion.Body></Accordion.Item>
                <Accordion.Item eventKey='1'><Accordion.Header>Cleaning Instruction</Accordion.Header><Accordion.Body className='text-muted small'>{product.CleaningInstruction}</Accordion.Body></Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Loading2 = () => (<div className='my-4 py-4 d-flex justify-content-center'><Skeleton height={300} width={200} count={4} inline={true} className="mx-3" /></div>);

  const ShowSimilarProduct = () => {
    if (similarProducts.length === 0) return null;
    return (
      <div className="py-4 my-4">
        <div className="d-flex">
          {similarProducts.map((item) => {
            const imgUrl = item.images && item.images.length > 0 ? item.images[0].imageUrl : "https://via.placeholder.com/300";
            return (
              <div key={item._id} className="card mx-4 text-center" style={{ minWidth: '280px' }}>
                <img className="card-img-top p-3" src={imgUrl} alt={item.name} height={300} style={{ objectFit: 'contain' }} />
                <div className="card-body"><h5 className="card-title">{item.name.substring(0, 20)}...</h5><p className="fw-bold">Rs {item.price}</p></div>
                <div className="card-body">
                  <Link to={"/product/" + item._id} className="btn btn-dark m-1" onClick={() => window.scrollTo(0, 0)}>Buy Now</Link>
                  <button className="btn btn-dark m-1" onClick={() => addProductToCart(item)}>Add to Cart</button>
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

      <div className='container-lg container-fluid'>
        <div className='row'>{loading ? <Loading /> : <ShowProduct />}</div>
        <div className='row'><ProductTabs product={product} /></div>

        {/* --- REVIEW SECTION --- */}
        {/* We pass productId and productSlug so it can fetch/post reviews */}
        <div className='row'>
          <ProductReviews
            productId={product._id}
            productSlug={product.slug}
          />
        </div>

        {similarProducts.length > 0 && (
          <div className='row my-2 py-2'>
            <div className='d-flex justify-content-center align-items-center flex-column w-100'>
              <h2 className=''>You may also Like</h2>
              <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>{loading2 ? <Loading2 /> : <ShowSimilarProduct />}</Marquee>
            </div>
          </div>
        )}
      </div>

    </>
  );
};

export default Product;