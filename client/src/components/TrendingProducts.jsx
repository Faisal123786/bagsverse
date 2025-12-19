import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../api';
import '../styles/main.scss';

// 1. Responsive Settings
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 4 },
  desktop: { breakpoint: { max: 1200, min: 992 }, items: 4 },
  tablet: { breakpoint: { max: 992, min: 576 }, items: 2 },
  mobile: { breakpoint: { max: 576, min: 0 }, items: 2 }
};

// 2. The Product Card Component - UPDATED with hover functionality
const ProductCard = ({ image, hoverImage, title, price, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className='product-card mb-4'
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Image Area - UPDATED with hover effect */}
      <div
        className='product-img-wrapper mb-3'
        onMouseEnter={() => hoverImage && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Primary Image */}
        <img
          src={image}
          alt={title}
          style={{
            transition: 'opacity 0.4s ease-in-out',
            opacity: isHovered && hoverImage ? 0 : 1,
            width: '100%',
            display: 'block'
          }}
          onError={e => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300?text=No+Image';
          }}
        />

        {/* Hover Image (Second Thumbnail) - Only if exists */}
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${title} - alternate view`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transition: 'opacity 0.4s ease-in-out',
              opacity: isHovered ? 1 : 0,
              pointerEvents: 'none'
            }}
            onError={e => {
              e.target.onerror = null;
              e.target.src = image; // Fallback to primary image
            }}
          />
        )}
      </div>

      <div className='product-info text-start px-3 py-2'>
        <span
          className='product-category text-muted d-block mb-1 text-truncate'
          style={{ maxWidth: '150px' }}
        >
          {title}
        </span>
        <h5 className='product-price mb-0'>{price}</h5>
      </div>
    </div>
  );
};

// 3. Main Section
const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.products || data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    loadProducts();
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <Container fluid='lg' className='py-3'>
      <h3 className='section-title mb-4'>Trending on BagsVerse</h3>

      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={4000}
        keyBoardControl={true}
        customTransition='transform 500ms ease-in-out'
        transitionDuration={500}
        itemClass='px-2 mt-3'
      >
        {products.map(item => {
          // 1. Get Primary Image (First Thumbnail)
          const imgUrl =
            item.thumbnails && item.thumbnails.length > 0
              ? item.thumbnails[0].imageUrl
              : 'https://via.placeholder.com/300';

          // 2. Get Hover Image (Second Thumbnail) - NEW
          const hoverImgUrl =
            item.thumbnails && item.thumbnails.length > 1
              ? item.thumbnails[1].imageUrl
              : null;

          // 3. Format Price
          const formattedPrice = `Rs ${item.price} PKR`;

          return (
            <ProductCard
              key={item._id}
              image={imgUrl}
              hoverImage={hoverImgUrl}
              title={item.name}
              price={formattedPrice}
              onClick={() => navigate(`/product/${item._id}`)}
            />
          );
        })}
      </Carousel>
    </Container>
  );
};

export default TrendingProducts;
