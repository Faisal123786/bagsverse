/**
 *
 * ProductPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import { BagIcon } from '../../components/Common/Icon';
import ProductReviews from '../../components/Store/ProductReviews';
import SocialShare from '../../components/Store/SocialShare';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';

const styles = `
  .main-image-container {
    position: relative;
    width: 100%;
    height: 700px;
    background-color: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-image-container .iiz {
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .main-image-container .iiz__img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    max-width: 100% !important;
    max-height: 100% !important;
  }

  .main-image-container .iiz__zoom-img {
    object-fit: cover !important;
  }

  .main-image-container .item-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Thumbnail Wrapper */
  .image-thumbnails-wrapper {
    width: 100%;
    margin-top: 1rem;
  }

  /* Thumbnail Container with Scrollbar */
  .image-thumbnails {
    display: flex;
    gap: 10px;
    padding-bottom: 10px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
  }

  /* Custom Scrollbar Styling */
  .image-thumbnails::-webkit-scrollbar {
    height: 8px;
  }

  .image-thumbnails::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .image-thumbnails::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  .image-thumbnails::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Firefox Scrollbar */
  .image-thumbnails {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }

  /* Thumbnail Item */
  .thumbnail-item {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fff;
    position: relative;
  }

  .thumbnail-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Thumbnail Hover Effect */
  .thumbnail-item:hover {
    border-color: #999;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* Selected Thumbnail */
  .thumbnail-item.selected {
    border-color: #007bff;
    border-width: 3px;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }

  /* Selected Thumbnail with Active Indicator */
  .thumbnail-item.selected::after {
    content: "✓";
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: #007bff;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .main-image-container {
      height: 400px;
    }

    .thumbnail-item {
      width: 70px;
      height: 70px;
    }
    
    .image-thumbnails {
      gap: 8px;
    }
  }

  @media (max-width: 576px) {
    .main-image-container {
      height: 300px;
    }

    .thumbnail-item {
      width: 60px;
      height: 60px;
    }
    
    .image-thumbnails {
      gap: 6px;
    }
    
    .thumbnail-item.selected::after {
      width: 18px;
      height: 18px;
      font-size: 10px;
    }
  }
`;

class ProductPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mainImage: '' // main zoom image
    };
  }

  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.fetchStoreProduct(slug);
    this.props.fetchProductReviews(slug);
    document.body.classList.add('product-page');

    // Inject styles
    if (!document.getElementById('product-page-thumbnail-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'product-page-thumbnail-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      const slug = this.props.match.params.slug;
      this.props.fetchStoreProduct(slug);
      // Reset mainImage when product changes
      this.setState({ mainImage: '' });
    }

    // set mainImage when product loads (only if mainImage is empty)
    if (
      this.props.product &&
      this.props.product.images &&
      this.props.product.images.length > 0 &&
      !this.state.mainImage
    ) {
      this.setState({ mainImage: this.props.product.images[0].imageUrl });
    }
  }

  componentWillUnmount() {
    document.body.classList.remove('product-page');
  }

  handleThumbnailClick = imageUrl => {
    this.setState({ mainImage: imageUrl });
  };

  handleThumbnailHover = imageUrl => {
    this.setState({ mainImage: imageUrl });
  };

  render() {
    const {
      isLoading,
      product,
      productShopData,
      shopFormErrors,
      itemInCart,
      productShopChange,
      handleAddToCart,
      handleRemoveFromCart,
      addProductReview,
      reviewsSummary,
      reviews,
      reviewFormData,
      reviewChange,
      reviewFormErrors
    } = this.props;

    const { mainImage } = this.state;

    return (
      <div className='product-shop'>
        {isLoading ? (
          <LoadingIndicator />
        ) : Object.keys(product).length > 0 ? (
          <>
            <Row className='flex-row'>
              {/* LEFT COLUMN: IMAGES */}
              <Col xs='12' md='5' lg='5' className='mb-3 px-3 px-md-2'>
                <div className='position-relative'>
                  {/* MAIN ZOOM IMAGE */}
                  <div className='main-image-container'>
                    <InnerImageZoom
                      src={mainImage || '/images/placeholder-image.png'}
                      zoomSrc={mainImage || '/images/placeholder-image.png'}
                      zoomType='hover'
                      zoomPreload={true}
                      className='item-image w-100'
                    />
                  </div>

                  {/* STOCK STATUS */}
                  {product.inventory <= 0 && !shopFormErrors['quantity'] ? (
                    <p className='stock out-of-stock'>Out of stock</p>
                  ) : (
                    <p className='stock in-stock'>In stock</p>
                  )}

                  {/* THUMBNAILS */}
                  {product.images && product.images.length > 1 && (
                    <div className='image-thumbnails-wrapper mt-3'>
                      <div className='image-thumbnails'>
                        {product.images.map((img, index) => (
                          <div
                            key={index}
                            className={`thumbnail-item ${
                              mainImage === img.imageUrl ? 'selected' : ''
                            }`}
                            onClick={() =>
                              this.handleThumbnailClick(img.imageUrl)
                            }
                            onMouseEnter={() =>
                              this.handleThumbnailHover(img.imageUrl)
                            }
                          >
                            <img
                              src={img.imageUrl}
                              alt={`${product.name} thumbnail ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Col>

              {/* RIGHT COLUMN: PRODUCT DETAILS */}
              <Col xs='12' md='7' lg='7' className='mb-3 px-3 px-md-2'>
                <div className='product-container'>
                  <div className='item-box'>
                    <div className='item-details'>
                      <h1 className='item-name one-line-ellipsis'>
                        {product.name}
                      </h1>
                      <p className='sku'>{product.sku}</p>
                      <hr />
                      {product.brand && (
                        <p className='by'>
                          see more from{' '}
                          <Link
                            to={`/shop/brand/${product.brand.slug}`}
                            className='default-link'
                          >
                            {product.brand.name}
                          </Link>
                        </p>
                      )}
                      <p className='item-desc'>{product.description}</p>
                      <p className='price'>${product.price}</p>
                    </div>

                    {/* QUANTITY INPUT */}
                    <div className='item-customize'>
                      <Input
                        type='number'
                        error={shopFormErrors['quantity']}
                        label='Quantity'
                        name='quantity'
                        decimals={false}
                        min={1}
                        max={product.inventory}
                        placeholder='Product Quantity'
                        disabled={
                          product.inventory <= 0 && !shopFormErrors['quantity']
                        }
                        value={productShopData.quantity}
                        onInputChange={(name, value) =>
                          productShopChange(name, value)
                        }
                      />
                    </div>

                    {/* SOCIAL SHARE */}
                    <div className='my-4 item-share'>
                      <SocialShare product={product} />
                    </div>

                    {/* ADD/REMOVE CART BUTTON */}
                    <div className='item-actions'>
                      {itemInCart ? (
                        <Button
                          variant='primary'
                          disabled={
                            product.inventory <= 0 &&
                            !shopFormErrors['quantity']
                          }
                          text='Remove From Bag'
                          className='bag-btn'
                          icon={<BagIcon />}
                          onClick={() => handleRemoveFromCart(product)}
                        />
                      ) : (
                        <Button
                          variant='primary'
                          disabled={
                            product.quantity <= 0 && !shopFormErrors['quantity']
                          }
                          text='Add To Bag'
                          className='bag-btn'
                          icon={<BagIcon />}
                          onClick={() => handleAddToCart(product)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* PRODUCT REVIEWS */}
            <ProductReviews
              reviewFormData={reviewFormData}
              reviewFormErrors={reviewFormErrors}
              reviews={reviews}
              reviewsSummary={reviewsSummary}
              reviewChange={reviewChange}
              addReview={addProductReview}
            />
          </>
        ) : (
          <NotFound message='No product found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const itemInCart = state.cart.cartItems.find(
    item => item._id === state.product.storeProduct._id
  )
    ? true
    : false;

  return {
    product: state.product.storeProduct,
    productShopData: state.product.productShopData,
    shopFormErrors: state.product.shopFormErrors,
    isLoading: state.product.isLoading,
    reviews: state.review.productReviews,
    reviewsSummary: state.review.reviewsSummary,
    reviewFormData: state.review.reviewFormData,
    reviewFormErrors: state.review.reviewFormErrors,
    itemInCart
  };
};

export default connect(mapStateToProps, actions)(ProductPage);
