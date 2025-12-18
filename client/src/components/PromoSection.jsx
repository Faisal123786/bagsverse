import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/main.scss';
import { useNavigate } from 'react-router-dom';
import { getPromoCards } from '../api'; // Import the API function

// 1. The Reusable Single Card Component
const PromoCard = ({ image, subtitle, title }) => {
  const navigate = useNavigate();

  // Extract numeric value only
  const priceValue = title.replace('Under ', '');

  const handleClick = () => {
    navigate('/product', {
      state: { price: priceValue }
    });
  };

  return (
    <div
      className='promo-card d-flex align-items-center'
      onClick={handleClick}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className='promo-content'>
        <span className='promo-subtitle'>{subtitle}</span>
        <h3 className='promo-title'>{title}</h3>
      </div>
    </div>
  );
};

// 2. The Section Component (Parent)
const PromoSection = () => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch promo cards from API on component mount
  useEffect(() => {
    const fetchPromoCards = async () => {
      try {
        setLoading(true);
        const data = await getPromoCards();
        console.log(data);

        // Map the API response to the format needed for the component
        const formattedCards = data.map(card => ({
          id: card._id,
          subtitle: card.subtitle,
          title: card.title,
          image: card.imageUrl || '/assets/image.png' // Fallback to default image
        }));

        setCardData(formattedCards);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch promo cards:', err);
        setError('Failed to load promo cards');

        // Fallback to default cards if API fails
        setCardData([
          {
            id: 1,
            subtitle: 'Handbags',
            title: 'Under 1500',
            image: '/assets/image.png'
          },
          {
            id: 2,
            subtitle: 'Handbags',
            title: 'Under 2000',
            image: '/assets/image.png'
          },
          {
            id: 3,
            subtitle: 'Handbags',
            title: 'Under 2500',
            image: '/assets/image.png'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoCards();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Container fluid='lg' className='py-3'>
        <div className='text-center py-5'>
          <div className='spinner-border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  // Error state (still shows fallback cards)
  if (error) {
    console.warn(error);
  }

  return (
    <Container fluid='lg' className='py-3'>
      <div className='mb-4'>
        <h2 className='section-title'>Shop by Budget</h2>
      </div>
      <Row className='g-2'>
        {cardData.map(card => (
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
