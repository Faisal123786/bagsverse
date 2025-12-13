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

// 2. Ten Dummy Images (High Quality Fashion/Bags)
const dummyImages = [
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop", // Bag 1
  "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=400&auto=format&fit=crop", // Bag 2
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop", // Bag 3
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=400&auto=format&fit=crop", // Bag 4
  "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop", // Wallet
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop", // Backpack
  "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=400&auto=format&fit=crop", // Purse
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=400&auto=format&fit=crop", // Satchel
  "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=400&auto=format&fit=crop", // Clutch
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop", // Watch/Accessory
];

// 3. The Circular Card Component
const CollectionCard = ({ image, title, onClick }) => {
  return (
    <div className="collection-card text-center mx-2" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="img-wrapper">
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
        console.log("Fetched categories:", data);
        // Ensure data is an array before setting
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
      <h3 className="section-title mb-4">Shop by Collections</h3>

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
          const imgUrl = dummyImages[index % dummyImages.length];

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