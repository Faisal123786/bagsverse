import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from "../api"; // Importing your API
import '../styles/main.scss';

// 1. Configuration for Responsiveness
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1200 },
    items: 6
  },
  desktop: {
    breakpoint: { max: 1200, min: 992 },
    items: 5
  },
  tablet: {
    breakpoint: { max: 992, min: 576 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 576, min: 0 },
    items: 2
  }
};


const CollectionCard = ({ image, title, onClick }) => {
  return (
    <div className="collection-card text-center mx-2" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="img-wrapper" style={{ border: '1px solid #d7d7d7' }}>
        <img src={image} alt={title} draggable={false} />
      </div>
      <h5 className="mt-3 collection-title">{title}</h5>
    </div>
  );
};

// 4. Main Section Component
const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("API did not return an array:", data);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    loadCategories();
  }, []);

  // If API returns empty or is loading, show nothing (or a skeleton if preferred)
  // if (categories.length === 0) return null;

  return (
    <Container fluid="lg" className="py-3">
      <div className="text-center my-2 py-4">
        <div className="d-flex flex-column align-items-center">
          {/* Elegant Top Label */}
          <p className="mb-2" style={{
            letterSpacing: '5px',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            fontWeight: '600',
            color: 'orange'
          }}>
            CURATED SELECTION
          </p>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.8rem',
            color: '#1a1a1a',
            fontWeight: '700',
            lineHeight: '1'
          }}>
            Shop by <span style={{ fontStyle: 'italic', fontWeight: '400', color: 'orange' }}>COLLECTION</span>
          </h2>

          {/* Modern Accent: A dot and a line */}
          <div className="d-flex align-items-center mt-3">
            <div style={{ width: '40px', height: '1px', background: '#ddd' }}></div>
            <div style={{ width: '6px', height: '6px', background: 'orange', borderRadius: '50%', margin: '0 10px' }}></div>
            <div style={{ width: '40px', height: '1px', background: '#ddd' }}></div>
          </div>
        </div>
      </div>

      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        customTransition="transform 500ms ease-in-out"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        itemClass="carousel-item-padding-40-px"
      >
        {categories.map((cat, index) => {
          // Use modulo operator (%) to cycle through the 10 images repeatedly 
          // if there are more categories than images.
          const imgUrl = cat.images[0]?.imageUrl || `https://picsum.photos/seed/category${index % 10}/300/300`;

          return (
            <CollectionCard
              key={cat._id || index}
              image={imgUrl}
              title={cat.name} // Assuming API returns { name: "..." }
              onClick={() => navigate('/product', { state: { category: cat.name } })}
            />
          );
        })}
      </Carousel>
    </Container>
  );
};

export default CategoryCarousel;