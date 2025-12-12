import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Accordion } from "react-bootstrap";
import '../styles/main.scss';

const Products = () => {
  const dispatch = useDispatch();

  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [stockFilter, setStockFilter] = useState({ inStock: false, outOfStock: false });
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(5000);
  const maxLimit = 5000;
  const minGap = 200;
  const [sortOption, setSortOption] = useState("Newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // --- 1. GENERATE DUMMY DATA ---
  useEffect(() => {
    setLoading(true);
    const dummyData = Array.from({ length: 80 }, (_, index) => ({
      id: index + 1,
      title: `Genesis Men's Infinite Polo Shirt ${index + 1}`,
      price: Math.floor(Math.random() * (5000 - 500 + 1)) + 500,
      description: "Discover a world of style...",
      category: index % 2 === 0 ? "Men" : "Accessories",
      // Add 'inStock' property: 80% chance of being true
      inStock: Math.random() > 0.2,
      image: index % 3 === 0
        ? "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"
    }));
    setProducts(dummyData);
    setFilteredProducts(dummyData);
    setLoading(false);
  }, []);

  // --- 2. FILTER LOGIC ---

  // A. Slider Logic
  const handleRangeChange = (e, type) => {
    const value = Math.max(Number(e.target.value), 0);

    if (type === 'min') {
      if (value <= maxVal - minGap) {
        setMinVal(value);
      }
    } else {
      if (value >= minVal + minGap) {
        setMaxVal(value);
      }
    }
  };

  // B. Checkbox Logic
  const handleStockChange = (e) => {
    const { name, checked } = e.target;
    setStockFilter(prev => ({ ...prev, [name]: checked }));
  };

  // C. Apply All Filters
  const handleApplyFilter = () => {
    let updated = products.filter(item => {
      // 1. Price Check
      const isPriceMatch = item.price >= minVal && item.price <= maxVal;

      // 2. Stock Check
      let isStockMatch = true;
      if (stockFilter.inStock && !stockFilter.outOfStock) {
        isStockMatch = item.inStock === true;
      } else if (!stockFilter.inStock && stockFilter.outOfStock) {
        isStockMatch = item.inStock === false;
      }
      // If both checked or neither checked, show all (isStockMatch remains true)

      return isPriceMatch && isStockMatch;
    });

    setCurrentPage(1); // Reset to page 1
    setFilteredProducts(updated);
  };

  // D. Sort Logic
  const handleSort = (e) => {
    const type = e.target.value;
    setSortOption(type);
    let sorted = [...filteredProducts];
    if (type === "lowToHigh") sorted.sort((a, b) => a.price - b.price);
    else if (type === "highToLow") sorted.sort((a, b) => b.price - a.price);
    else if (type === "Newest") sorted.sort((a, b) => b.id - a.id);
    else sorted.sort((a, b) => a.id - b.id);
    setFilteredProducts(sorted);
  };

  // --- 3. COUNTS FOR UI ---
  const inStockCount = products.filter(p => p.inStock).length;
  const outStockCount = products.filter(p => !p.inStock).length;

  // --- 4. PAGINATION HELPERS ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- SUB COMPONENT: PRODUCT CARD ---
  const ProductCard = ({ product }) => (
    <div className="col-md-3 col-sm-6 col-6 mb-4 px-1">
      <div className="custom-card">
        <div className="card-img-wrapper">
          <Link to={`/product/${product.id}`}>
            <img src={product.image} alt={product.title} />
          </Link>

          {/* --- UPDATED SOLD OUT BADGE --- */}
          {!product.inStock && (
            <div className="sold-out-circle">
              <span> SOLD</span>
              <span>OUT</span>
            </div>
          )}

        </div>
        <div className="card-body">
          <Link to={`/product/${product.id}`} className="text-decoration-none">
            <h5 className="card-title">{product.title}</h5>
          </Link>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="card-price">${product.price}</span>
            <button
              className="cart-icon-btn"
              disabled={!product.inStock}
              style={{ opacity: !product.inStock ? 0.5 : 1 }}
              onClick={() => { dispatch(addCart(product)); toast.success("Added to cart"); }}
            >
              <i className="fa fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="row">

        {/* --- LEFT SIDEBAR --- */}
        <div className="col-lg-3 mb-4">
          <div className="filter-sidebar">
            <h5 className="filter-title">Product Filters</h5>

            <Accordion defaultActiveKey={['0', '1']} flush alwaysOpen>

              {/* 1. AVAILABILITY FILTER (Added per requirement) */}
              <Accordion.Item eventKey="0" className="border-0 mb-3">
                <Accordion.Header className="px-0 fw-bold">Availability</Accordion.Header>
                <Accordion.Body className="px-0 pt-2">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="stockIn"
                      name="inStock"
                      checked={stockFilter.inStock}
                      onChange={handleStockChange}
                    />
                    <label className="form-check-label" htmlFor="stockIn">
                      In stock ({inStockCount})
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="stockOut"
                      name="outOfStock"
                      checked={stockFilter.outOfStock}
                      onChange={handleStockChange}
                    />
                    <label className="form-check-label text-muted" htmlFor="stockOut">
                      Out of stock ({outStockCount})
                    </label>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* 2. PRICE FILTER */}
              <Accordion.Item eventKey="1" className="border-0">
                <Accordion.Header className="px-0 fw-bold">Price</Accordion.Header>
                <Accordion.Body className="px-0 pt-3">
                  <div className="slider-container mb-3">
                    <input
                      type="range" min="0" max={maxLimit} value={minVal}
                      onChange={(e) => handleRangeChange(e, 'min')}
                      className="thumb thumb--left"
                    />
                    <input
                      type="range" min="0" max={maxLimit} value={maxVal}
                      onChange={(e) => handleRangeChange(e, 'max')}
                      className="thumb thumb--right"
                    />
                    <div className="slider-track"></div>
                    <div className="slider-range" style={{
                      left: `${(minVal / maxLimit) * 100}%`,
                      width: `${((maxVal - minVal) / maxLimit) * 100}%`
                    }}></div>
                  </div>

                  <div className="price-input-group">
                    <div className="price-box">
                      <span className="text-muted small me-1">Rs</span>
                      <span>{minVal}</span>
                    </div>
                    <span className="fw-bold">To</span>
                    <div className="price-box">
                      <span className="text-muted small me-1">Rs</span>
                      <span>{maxVal}</span>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <button className="btn-apply-filter" onClick={handleApplyFilter}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* --- RIGHT CONTENT --- */}
        <div className="col-lg-9">
          {/* Header Row */}
          <div className="row mb-4 flex-column flex-sm-row align-items-center justify-content-between mx-1">
            <div className="col-md-6 d-none d-md-flex align-items-center">
              <span className="text-muted me-2">Explore In:</span>
              <span className="fw-bold border rounded px-2 py-1 bg-white text-dark small">"Men"</span>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-end align-items-center">
              <span className="text-muted small me-2">Sort by:</span>
              <select
                className="form-select form-select-sm py-1 px-2 "
                style={{ width: '165px', boxShadow: 'none', border: '1px solid #d4b86a' }}
                onChange={handleSort}
                value={sortOption}
              >
                {/* <option value="default">Default</option> */}
                <option value="Newest">Newest</option>
                <option value="lowToHigh">Price Low to High</option>
                <option value="highToLow">Price High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="row">
            {loading ? (
              <p className="text-center py-5">Loading Products...</p>
            ) : (
              currentItems.map((prod) => <ProductCard key={prod.id} product={prod} />)
            )}
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="row mt-5">
              <div className="col-12 d-flex flex-wrap justify-content-center justify-content-md-between align-items-center border-top pt-3">
                <div className="text-muted small me-3">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} Products
                </div>
                <nav>
                  <ul className="pagination custom-pagination mb-0 mt-2">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage - 1)}>&laquo;</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage + 1)}>&raquo;</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}

          {/* Description Box */}
          <div className="row">
            <div className="col-12">
              <div className="category-desc-box mt-4">
                <h4 className="text-dark mb-2">Category Description:</h4>
                <p className="text-muted small mb-0">
                  Discover a world of style and sophistication...
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;