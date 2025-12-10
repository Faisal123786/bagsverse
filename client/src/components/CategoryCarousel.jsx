import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css'; // Import default carousel styles
import { Container } from 'react-bootstrap';
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

// 2. The Circular Card Component
const CollectionCard = ({ image, title }) => {
  return (
    <div className="collection-card text-center mx-2">
      <div className="img-wrapper">
        <img src={image} alt={title} draggable={false} />
      </div>
      <h5 className="mt-3 collection-title">{title}</h5>
    </div>
  );
};

// 3. Main Section Component
const CategoryCarousel = () => {
  // Dummy Data
  const categories = [
    { id: 1, title: "Leather Goods", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU1GBaNj8uzq_EJzMbviDQBjdjARbY3KK_xAYREOAuzEjSGpqk70vUxcXkdN-YtCBahIw&usqp=CAU" },
    { id: 2, title: "Footwear", img: "https://www.everhandmade.com/cdn/shop/products/Handmade-leather-Briefcases-men-messenger-Coffee-shoulder-bag-vintage-bag-for-him_2_1469b8f4-c3d7-4334-9538-63e32b100ee2_1024x1024.jpg?v=1571317686" },
    { id: 3, title: "Electronics", img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80" },
    { id: 4, title: "Fashion", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" },
    { id: 5, title: "Accessories", img: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400&q=80" },
    { id: 6, title: "Home & Garden", img: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=400&q=80" },
    { id: 7, title: "Beauty", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR8TiG9Jqd3hS7X998xYjiaXd6NThoR0A8Gw7Z49mFR8JVFTRTL2eLSEwk79vbhkuyTAM&usqp=CAU" },
    { id: 8, title: "Sports", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80" },
  ];

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
        {categories.map((cat) => (
          <CollectionCard key={cat.id} image={cat.img} title={cat.title} />
        ))}
      </Carousel>
    </Container>
  );
};

export default CategoryCarousel;