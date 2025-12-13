import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/main.scss';
import { useNavigate } from "react-router-dom";
// 1. The Reusable Single Card Component
const PromoCard = ({ image, subtitle, title }) => {
  const navigate = useNavigate();

  // Extract numeric value only
  const priceValue = title.replace("Under ", "");

  const handleClick = () => {
    navigate("/product", {
      state: { price: priceValue }
    });
  };
  return (
    <div
      className="promo-card d-flex align-items-center"
      onClick={handleClick}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="promo-content">
        <span className="promo-subtitle">{subtitle}</span>
        <h3 className="promo-title">{title}</h3>
      </div>
    </div>
  );
};

// 2. The Section Component (Parent)
const PromoSection = () => {
  // Mock Data mimicking your screenshot
  const cardData = [
    {
      id: 1,
      subtitle: "Handbags",
      title: "Under 1500",
      image: "https://www.shutterstock.com/image-photo/woman-beaded-handbag-her-hand-260nw-2482639031.jpg" // Beige/Bag
    },
    {
      id: 2,
      subtitle: "Handbags",
      title: "Under 2000",
      image: "https://img.freepik.com/premium-photo/valentines-day-sale-shopping-concept-dall-with-shopping-bags-banner-with-copy-space_150893-6720.jpg" // Shopping Cart
    },
    {
      id: 3,
      subtitle: "Handbags",
      title: "Under 2500",
      image: "https://www.shutterstock.com/image-photo/fashion-spring-accessories-woman-banner-260nw-2133766287.jpg" // Pink/Bag
    }
  ];

  return (
    <Container fluid="lg" className="py-3">
      <div className="mb-4">
        <h2 className="section-title">Shop by Budget</h2>
      </div>
      <Row className="g-2">
        {cardData.map((card) => (
          // RESPONSIVENESS LOGIC:
          // xs={12} -> Mobile: Full Width (1 per row)
          // lg={4}  -> Large Screen: 33% Width (3 per row)
          <Col xs={12} lg={4} key={card.id}>
            <PromoCard
              image={card.image}
              subtitle={card.subtitle}
              title={card.title}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PromoSection;