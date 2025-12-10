/**
 * Responsive Homepage Component
 * Fully optimized for all screen sizes with skeleton loaders
 */

import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import actions from "../../actions";
import banners from "./banners.json";
import CarouselSlider from "../../components/Common/CarouselSlider";
import { responsiveOneItemCarousel } from "../../components/Common/CarouselSlider/utils";

// Skeleton Components
const PromoSkeleton = () => (
  <div className="promo-wrapper">
    <div className="promo-item skeleton-box"></div>
    <div className="promo-item2 skeleton-box"></div>
  </div>
);

const BudgetCardSkeleton = () => (
  <div className="shop-by-budget-card skeleton-budget-card">
    <div className="skeleton-text skeleton-text-small"></div>
    <div className="skeleton-text skeleton-text-large"></div>
  </div>
);

const CategoryItemSkeleton = () => (
  <div className="category-item-container">
    <div className="category-item skeleton-box"></div>
    <div className="skeleton-text skeleton-text-center"></div>
  </div>
);

const BestSellerItemSkeleton = () => (
  <div className="best-seller-item-container">
    <div className="bestSellerCard">
      <div className="best-seller-item skeleton-box"></div>
      <div className="product-info">
        <div className="skeleton-text"></div>
        <div className="skeleton-text skeleton-text-small"></div>
      </div>
    </div>
  </div>
);

class Homepage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      categoriesData: [],
      bestSellerData: [],
    };
  }

  componentDidMount() {
    // Simulate data loading
    this.loadData();
  }

  loadData = () => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      const categoriesData = [
        {
          name: "Electronics",
          slug: "electronics",
          imageUrl:
            "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?cs=srgb&dl=pexels-geyonk-1152077.jpg&fm=jpg",
        },
        {
          name: "Fashion",
          slug: "fashion",
          imageUrl:
            "https://www.shutterstock.com/image-photo/mens-accessories-brown-leather-bags-260nw-380047069.jpg",
        },
        {
          name: "Accessories",
          slug: "accessories",
          imageUrl:
            "https://cdn.pixabay.com/photo/2016/11/23/18/12/bag-1854148_1280.jpg",
        },
        {
          name: "Home & Garden",
          slug: "home-garden",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR8TiG9Jqd3hS7X998xYjiaXd6NThoR0A8Gw7Z49mFR8JVFTRTL2eLSEwk79vbhkuyTAM&usqp=CAU",
        },
        {
          name: "Leather Goods",
          slug: "leather-goods",
          imageUrl:
            "https://www.everhandmade.com/cdn/shop/products/Handmade-leather-Briefcases-men-messenger-Coffee-shoulder-bag-vintage-bag-for-him_2_1469b8f4-c3d7-4334-9538-63e32b100ee2_1024x1024.jpg?v=1571317686",
        },
        {
          name: "Footwear",
          slug: "footwear",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU1GBaNj8uzq_EJzMbviDQBjdjARbY3KK_xAYREOAuzEjSGpqk70vUxcXkdN-YtCBahIw&usqp=CAU",
        },
        {
          name: "Home & Garden",
          slug: "home-garden",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR8TiG9Jqd3hS7X998xYjiaXd6NThoR0A8Gw7Z49mFR8JVFTRTL2eLSEwk79vbhkuyTAM&usqp=CAU",
        },
        {
          name: "Leather Goods",
          slug: "leather-goods",
          imageUrl:
            "https://www.everhandmade.com/cdn/shop/products/Handmade-leather-Briefcases-men-messenger-Coffee-shoulder-bag-vintage-bag-for-him_2_1469b8f4-c3d7-4334-9538-63e32b100ee2_1024x1024.jpg?v=1571317686",
        },
        {
          name: "Footwear",
          slug: "footwear",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU1GBaNj8uzq_EJzMbviDQBjdjARbY3KK_xAYREOAuzEjSGpqk70vUxcXkdN-YtCBahIw&usqp=CAU",
        },
      ];

      const bestSellerData = [
        {
          name: "Men Casual Shoes",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyxra6e_l8gfxEwgEP3IQh-SGX05fPRvJSUqQkdc-eoUVS18wQ7L7BfkPWmOVS5rp-Ct0&usqp=CAU",
          hoverImageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR8TiG9Jqd3hS7X998xYjiaXd6NThoR0A8Gw7Z49mFR8JVFTRTL2eLSEwk79vbhkuyTAM&usqp=CAU",
          price: 3200,
        },
        {
          name: "Women Designer Bags",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyxra6e_l8gfxEwgEP3IQh-SGX05fPRvJSUqQkdc-eoUVS18wQ7L7BfkPWmOVS5rp-Ct0&usqp=CAU",
          hoverImageUrl:
            "https://uppybags.com/cdn/shop/files/girlsandbags.jpg?v=1713526812&width=1890",
          price: 4500,
        },
        {
          name: "Men Formal Shoes",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyxra6e_l8gfxEwgEP3IQh-SGX05fPRvJSUqQkdc-eoUVS18wQ7L7BfkPWmOVS5rp-Ct0&usqp=CAU",
          hoverImageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR8TiG9Jqd3hS7X998xYjiaXd6NThoR0A8Gw7Z49mFR8JVFTRTL2eLSEwk79vbhkuyTAM&usqp=CAU",
          price: 3200,
        },
        {
          name: "Women Leather Bags",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyxra6e_l8gfxEwgEP3IQh-SGX05fPRvJSUqQkdc-eoUVS18wQ7L7BfkPWmOVS5rp-Ct0&usqp=CAU",
          hoverImageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyxra6e_l8gfxEwgEP3IQh-SGX05fPRvJSUqQkdc-eoUVS18wQ7L7BfkPWmOVS5rp-Ct0&usqp=CAU",
          price: 4500,
        },
        {
          name: "Men Sport Shoes",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyxra6e_l8gfxEwgEP3IQh-SGX05fPRvJSUqQkdc-eoUVS18wQ7L7BfkPWmOVS5rp-Ct0&usqp=CAU",
          hoverImageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR8TiG9Jqd3hS7X998xYjiaXd6NThoR0A8Gw7Z49mFR8JVFTRTL2eLSEwk79vbhkuyTAM&usqp=CAU",
          price: 3200,
        },
        {
          name: "Women Handbags",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyxra6e_l8gfxEwgEP3IQh-SGX05fPRvJSUqQkdc-eoUVS18wQ7L7BfkPWmOVS5rp-Ct0&usqp=CAU",
          hoverImageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyxra6e_l8gfxEwgEP3IQh-SGX05fPRvJSUqQkdc-eoUVS18wQ7L7BfkPWmOVS5rp-Ct0&usqp=CAU",
          price: 4500,
        },
      ];

      this.setState({
        isLoading: false,
        categoriesData,
        bestSellerData,
      });
    }, 2000); // 2 second delay to simulate loading
  };

  render() {
    const { isLoading, categoriesData, bestSellerData } = this.state;

    const responsiveCategoryCarousel = {
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 1440 },
        items: 8,
      },
      desktop: {
        breakpoint: { max: 1440, min: 1024 },
        items: 6,
      },
      tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 4,
      },
      mobile: {
        breakpoint: { max: 768, min: 464 },
        items: 2,
      },
      smallMobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
      },
    };

    const responsiveBestSellerCarousel = {
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 1440 },
        items: 5,
      },
      desktop: {
        breakpoint: { max: 1440, min: 1024 },
        items: 4,
      },
      tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 4,
      },
      mobile: {
        breakpoint: { max: 768, min: 464 },
        items: 2,
      },
      smallMobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    };

    return (
      <div className="homepage">
        {/* Promo Section */}
        <Row className="pt-2 g-0">
          <Col xs={12} sm={6} md={6} lg={4} xl={4} className="p-1">
            {isLoading ? (
              <PromoSkeleton />
            ) : (
              <div className="promo-wrapper">
                <div className="promo-item">
                  <img
                    src="https://i.etsystatic.com/13570667/r/il/69c238/6350569617/il_fullxfull.6350569617_eutq.jpg"
                    alt="Promo 1"
                    loading="lazy"
                  />
                </div>
                <div className="promo-item2">
                  <img
                    src="https://fineur.pk/cdn/shop/files/3_20978cbe-0874-4556-aa3a-64ea4c0ffa66.jpg?v=1744725412"
                    alt="Promo 2"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </Col>
          <Col xs={12} sm={6} md={6} lg={4} xl={4} className="p-1">
            {isLoading ? (
              <PromoSkeleton />
            ) : (
              <div className="promo-wrapper">
                <div className="promo-item2">
                  <img
                    src="https://images.pexels.com/photos/16747158/pexels-photo-16747158/free-photo-of-bag-on-brown-background.jpeg"
                    alt="Promo 3"
                    loading="lazy"
                  />
                </div>
                <div className="promo-item">
                  <img
                    src="https://www.harberlondon.com/cdn/shop/files/Everyday-Shopper-Bag-Harber-London-5-min_cfd9970e-4b4c-4f92-ac1f-5f78d3fbc92f.jpg?v=1726737262"
                    alt="Promo 4"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </Col>
          <Col xs={12} sm={6} md={6} lg={4} xl={4} className="p-1">
            {isLoading ? (
              <PromoSkeleton />
            ) : (
              <div className="promo-wrapper">
                <div className="promo-item2">
                  <img
                    src="https://i.pinimg.com/736x/f9/9a/a9/f99aa901495ef299aaa583d8fb75456f.jpg"
                    alt="Promo 5"
                    loading="lazy"
                  />
                </div>
                <div className="promo-item">
                  <img
                    src="https://png.pngtree.com/thumb_back/fh260/background/20251201/pngtree-empty-brown-leather-bag-with-scattered-coins-on-a-dark-surface-image_20611410.webp"
                    alt="Promo 6"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </Col>
        </Row>

        {/* Shop by Budget Section */}
        <h2 className="shop-by-collection">Shop by Budget</h2>
        <Row className="flex-row">
          <Col
            xs="12"
            md="12"
            lg="12"
            xl="12"
            xxl="12"
            className="mx-auto p-0 m-0"
          >
            <div className="shop-by-budget-container">
              {isLoading ? (
                <>
                  <BudgetCardSkeleton />
                  <BudgetCardSkeleton />
                  <BudgetCardSkeleton />
                </>
              ) : (
                <>
                  <div className="shop-by-budget-card">
                    <h6 className="budget-card-mini-heading">Handbags</h6>
                    <h3 className="budget-card-main-heading">Under 1500</h3>
                  </div>
                  <div className="shop-by-budget-card">
                    <h6 className="budget-card-mini-heading">Handbags</h6>
                    <h3 className="budget-card-main-heading">Under 2000</h3>
                  </div>
                  <div className="shop-by-budget-card">
                    <h6 className="budget-card-mini-heading">Handbags</h6>
                    <h3 className="budget-card-main-heading">Under 2500</h3>
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>

        {/* Shop by Collections Section */}
        <h2 className="shop-by-collection">Shop by Collections</h2>
        <Row className="flex-row">
          <Col xs="12" lg="12" className="px-0">
            <div className="category-carousel">
              {isLoading ? (
                <div className="skeleton-carousel-container">
                  {[...Array(15)].map((_, index) => (
                    <CategoryItemSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <CarouselSlider
                  swipeable={true}
                  showDots={false}
                  infinite={true}
                  autoPlay={true}
                  slides={categoriesData}
                  responsive={responsiveCategoryCarousel}
                >
                  {categoriesData.map((cat, index) => (
                    <div className="category-item-container" key={index}>
                      <div className="category-item">
                        <img src={cat.imageUrl} alt={cat.name} />
                      </div>
                      <p className="category-name">{cat.name}</p>
                    </div>
                  ))}
                </CarouselSlider>
              )}
            </div>
          </Col>
        </Row>

        {/* Best Sellers Section */}
        <h2 className="shop-by-collection">Trending on BagsVerse</h2>
        <Row className="flex-row px-0">
          <Col xs="12" lg="12" className="px-0">
            <div className="best-seller-carousel">
              {isLoading ? (
                <div className="skeleton-carousel-container">
                  {[...Array(16)].map((_, index) => (
                    <BestSellerItemSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <CarouselSlider
                  swipeable={true}
                  showDots={false}
                  infinite={true}
                  autoPlay={false}
                  slides={bestSellerData}
                  responsive={responsiveBestSellerCarousel}
                >
                  {bestSellerData.map((product, index) => (
                    <div className="best-seller-item-container" key={index}>
                      <div className="bestSellerCard">
                        <div className="best-seller-item">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="product-image main-img"
                          />
                          <img
                            src={product.hoverImageUrl}
                            alt={product.name}
                            className="product-image hover-img"
                          />
                        </div>

                        <div className="product-info">
                          <h6 className="product-name">{product.name}</h6>
                          <h6 className="product-price">
                            Rs {product.price} PKR
                          </h6>
                        </div>

                        {/* ADD BUTTON MOVED HERE */}
                        <button className="add-to-cart-btn">
                          <i className="fa fa-shopping-cart"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </CarouselSlider>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, actions)(Homepage);
