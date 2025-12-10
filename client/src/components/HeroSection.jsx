import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/main.scss'; // Ensure we have access to our styles

const HeroSections = ({ images }) => {
  // We expect an array of 6 images from the backend.
  // Let's assume the backend sends them in this order of importance:
  // Index 0-1: The 2 MAIN images (Big ones)
  // Index 2-5: The 4 SMALLER side images
  
  // If no images provided, return null or a loader
  if (!images || images.length < 6) return null;

  const mainImages = images.slice(0, 2);
  const leftImages = images.slice(2, 4);
  const rightImages = images.slice(4, 6);

  return (
    <Container fluid="lg" className="py-3 hero-section">
      <Row className="g-3 align-items-stretch">
        
        {/* --- LEFT COLUMN (Desktop: Left | Mobile: Bottom Left) --- */}
        {/* Order: 2 on Mobile (after main), 1 on Desktop (first) */}
        <Col xs={6} lg={3} className="d-flex flex-column gap-3 order-2 order-lg-1">
          {leftImages.map((img, index) => (
            <div key={index} className="hero-img-wrapper flex-grow-1">
              <img src={img.url} alt={`Side Left ${index}`} className="img-fluid rounded-3 w-100 h-100 object-fit-cover" />
            </div>
          ))}
        </Col>

        {/* --- CENTER COLUMN (Desktop: Center | Mobile: Top) --- */}
        {/* Order: 1 on Mobile (First), 2 on Desktop (Middle) */}
        <Col xs={12} lg={6} className="d-flex flex-column gap-3 order-1 order-lg-2">
          {mainImages.map((img, index) => (
            <div key={index} className="hero-img-wrapper flex-grow-1 main-hero-img">
              <img src={img.url} alt={`Main ${index}`} className="img-fluid rounded-3 w-100 h-100 object-fit-cover" />
            </div>
          ))}
        </Col>

        {/* --- RIGHT COLUMN (Desktop: Right | Mobile: Bottom Right) --- */}
        {/* Order: 3 on Mobile (Last), 3 on Desktop (Last) */}
        <Col xs={6} lg={3} className="d-flex flex-column gap-3 order-3 order-lg-3">
          {rightImages.map((img, index) => (
            <div key={index} className="hero-img-wrapper flex-grow-1">
              <img src={img.url} alt={`Side Right ${index}`} className="img-fluid rounded-3 w-100 h-100 object-fit-cover" />
            </div>
          ))}
        </Col>

      </Row>
    </Container>
  );
};
const heroImages = [
    { url: "https://api.mallshark.com/uploads/medium/BOX3-DecemberDeals_33704.webp" }, // Main 1 (Books/Gifts)
    { url: "https://api.mallshark.com/uploads/medium/BOX5-DecemberSalesV2_35319.webp" }, // Main 2 (Christmas/Red)
     { url: "https://api.mallshark.com/uploads/medium/BOX1-DecemberDeals_33705.webp" },  // left Side 1 (Makeup)
    { url: "https://api.mallshark.com/uploads/medium/BOX2-DecemberDeals_33707.webp" },  // left Side 2 (Coffee)
    { url: "https://api.mallshark.com/uploads/medium/BOX4-DecemberDeals_33706.webp" },  // right Side 3 (Gadgets)
    { url: "https://api.mallshark.com/uploads/medium/BOX6-CyberMonday_33703.webp" }   // right Side 4 (Boxes)
  ];
export default function HeroSection() {
  return <HeroSections images={heroImages} />;
}
