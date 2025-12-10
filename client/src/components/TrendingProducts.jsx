import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Container, Button } from 'react-bootstrap';
import '../styles/main.scss';

// 1. Responsive Settings (4 items on desktop as per screenshot)
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 4 },
  desktop: { breakpoint: { max: 1200, min: 992 }, items: 3 },
  tablet: { breakpoint: { max: 992, min: 576 }, items: 2 },
  mobile: { breakpoint: { max: 576, min: 0 }, items: 1 }
};

// 2. The Product Card Component
const ProductCard = ({ image, category, price }) => {
  return (
    <div className="product-card p-3">
      {/* Image Area */}
      <div className="product-img-wrapper mb-3">
        <img src={image} alt={category} className="img-fluid" />
      </div>

      {/* Info Area */}
      <div className="d-flex justify-content-between align-items-end">
        <div className="product-info text-start">
          <span className="product-category text-muted d-block mb-1">{category}</span>
          <h5 className="product-price mb-0">{price}</h5>
        </div>
        
        {/* Cart Button */}
        <Button variant="warning" className="cart-btn rounded-circle text-white">
          <i className="fa fa-shopping-cart"></i>
        </Button>
      </div>
    </div>
  );
};

// 3. Main Section
const TrendingProducts = () => {
  // Dummy Data
  const products = [
    { id: 1, category: "Women Handbags", price: "Rs 4500 PKR", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop" },
    { id: 2, category: "Men Casual Shoes", price: "Rs 3200 PKR", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop" }, // This mimics the active one
    { id: 3, category: "Women Designer Bags", price: "Rs 4500 PKR", img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop" },
    { id: 4, category: "Men Formal Shoes", price: "Rs 3200 PKR", img: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=600&auto=format&fit=crop" },
    { id: 5, category: "Travel Bags", price: "Rs 5500 PKR", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop" },
  ];

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
        {products.map((item) => (
          <ProductCard 
            key={item.id} 
            image={item.img} 
            category={item.category} 
            price={item.price} 
          />
        ))}
      </Carousel>
    </Container>
  );
};

export default TrendingProducts;