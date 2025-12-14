import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import { fetchProducts } from '../api';
import '../styles/main.scss';

// 1. Responsive Settings
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 4 },
  desktop: { breakpoint: { max: 1200, min: 992 }, items: 3 },
  tablet: { breakpoint: { max: 992, min: 576 }, items: 2 },
  mobile: { breakpoint: { max: 576, min: 0 }, items: 2 }
};

// 2. The Product Card Component (Updated to accept onClick and title)
const ProductCard = ({ image, title, price, onClick }) => {
  return (
    <div className="product-card mb-4" onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Image Area */}
      <div className="product-img-wrapper mb-3">
        <img
          src={image}
          alt={title}
          className="img-fluid"
          // Fallback if image fails to load
          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300?text=No+Image" }}
        />
      </div>

      {/* Info Area */}
      {/* <div className="d-flex justify-content-between align-items-end p-3"> */}
      <div className="product-info text-start px-3 py-2 ">
        <span className="product-category text-muted d-block mb-1 text-truncate" style={{ maxWidth: '150px' }}>
          {title}
        </span>
        <h5 className="product-price mb-0">{price}</h5>
      </div>

      {/* Cart Button */}
      {/* <Button
          variant="warning"
          className="cart-btn rounded-circle text-white"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Add to cart clicked");
          }}
        >
          <i className="fa fa-cart-plus"></i>
        </Button> */}
      {/* </div> */}
    </div>
  );
};

// 3. Main Section
const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        // Assuming the API returns the array of products in 'data.products' or just 'data'
        // Adjust this line based on your exact API response structure
        setProducts(data.products || data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    loadProducts();
  }, []);

  if (!products || products.length === 0) return null; // Hide section if no data

  return (
    <Container fluid="lg" className="py-3">
      <h3 className="section-title mb-4">Trending on BagsVerse</h3>

      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={4000}
        keyBoardControl={true}
        customTransition="transform 500ms ease-in-out"
        transitionDuration={500}
        itemClass="px-2 mt-3"
      >
        {products.map((item) => {
          // 1. Get Image: Check if images array exists and has items
          const imgUrl = item.images && item.images.length > 0
            ? item.images[0].imageUrl
            : "https://via.placeholder.com/300"; // Fallback image

          // 2. Format Price
          const formattedPrice = `Rs ${item.price} PKR`;

          return (
            <ProductCard
              key={item._id}
              image={imgUrl}
              title={item.name}
              price={formattedPrice}
              onClick={() => navigate(`/product/${item._id}`)} // Navigate on click
            />
          );
        })}
      </Carousel>
    </Container>
  );
};

export default TrendingProducts;