import {
  Navbar,
  HeroSection,
  PromoSection,
  CategoryCarousel,
  Main,
  Product,
  Footer
} from '../components';

function Home() {
  const heroImages = [
    {
      url: 'https://api.mallshark.com/uploads/medium/BOX3-DecemberDeals_33704.webp'
    }, // Main 1 (Books/Gifts)
    {
      url: 'https://api.mallshark.com/uploads/medium/BOX5-DecemberSalesV2_35319.webp'
    }, // Main 2 (Christmas/Red)
    {
      url: 'https://api.mallshark.com/uploads/medium/BOX1-DecemberDeals_33705.webp'
    }, // left Side 1 (Makeup)
    {
      url: 'https://api.mallshark.com/uploads/medium/BOX2-DecemberDeals_33707.webp'
    }, // left Side 2 (Coffee)
    {
      url: 'https://api.mallshark.com/uploads/medium/BOX4-DecemberDeals_33706.webp'
    }, // right Side 3 (Gadgets)
    {
      url: 'https://api.mallshark.com/uploads/medium/BOX6-CyberMonday_33703.webp'
    } // right Side 4 (Boxes)
  ];
  return (
    <>
      <Navbar />
      <HeroSection images={heroImages} />
      <PromoSection />
      <CategoryCarousel />
      {/* <Main /> */}
      {/* <Product /> */}
      <Footer />
    </>
  );
}

export default Home;
