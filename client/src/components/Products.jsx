import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Accordion } from "react-bootstrap";
import { fetchProducts, fetchCategories } from "../api";
import '../styles/main.scss';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [stockFilter, setStockFilter] = useState({ inStock: false, outOfStock: false });
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(10000);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const maxLimit = 10000;
  const minGap = 0;
  const [sortOption, setSortOption] = useState("Newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // --- 1. FETCH DATA (Products AND Categories) ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch both concurrently for speed
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);

        // A. Process Products
        const rawProducts = productsData.products || productsData || [];
        const mappedProducts = rawProducts.map((item) => ({
          id: item._id,
          title: item.name,
          price: item.price,
          description: item.description,
          inStock: item.quantity > 0,
          quantity: item.quantity,
          image: item.images && item.images.length > 0
            ? item.images[0].imageUrl
            : "https://via.placeholder.com/300?text=No+Image"
        }));

        setProducts(mappedProducts);

        // B. Process Categories
        const rawCategories = categoriesData || [];
        setCategories(rawCategories);

        // --- HANDLE INCOMING NAVIGATION STATE ---
        const incomingPrice = location.state?.price;
        const incomingCategory = location.state?.category;

        // CASE 1: Incoming Category Name (e.g. "Shoulder Bags")
        if (incomingCategory) {
          console.log("Applying Category Filter:", incomingCategory);
          setSelectedCategory(incomingCategory);

          // 1. Find the Category Object matching the name
          const matchedCat = rawCategories.find(c => c.name === incomingCategory);

          if (matchedCat && matchedCat.products) {
            // 2. Filter products that exist in this category's product list
            const categoryFiltered = mappedProducts.filter(p => matchedCat.products.includes(p.id));
            setFilteredProducts(categoryFiltered);
          } else {
            // Category found but has no products, or name didn't match
            setFilteredProducts([]);
          }
        }
        // CASE 2: Incoming Price
        else if (incomingPrice) {
          console.log("Applying Price Filter:", incomingPrice);
          setSelectedCategory("All");

          const extractedPrice = parseInt(String(incomingPrice).replace(/[^0-9]/g, ''), 10);
          if (!isNaN(extractedPrice)) {
            if (extractedPrice < maxLimit) setMaxVal(extractedPrice);
            const priceFiltered = mappedProducts.filter(item => item.price <= extractedPrice);
            setFilteredProducts(priceFiltered);
          } else {
            setFilteredProducts(mappedProducts);
          }
        }
        // CASE 3: Default
        else {
          setSelectedCategory("All");
          setFilteredProducts(mappedProducts);
        }

      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.state]);

  // --- 2. MAIN FILTER LOGIC ---
  // This runs when user clicks "Apply Filters" on the sidebar
  const handleApplyFilter = () => {

    // 1. Start filtering
    let updated = products;

    // 2. Apply Category Logic First
    if (selectedCategory !== "All") {
      const matchedCat = categories.find(c => c.name === selectedCategory);
      if (matchedCat && matchedCat.products) {
        // Only keep products whose IDs are in the category's product array
        updated = updated.filter(p => matchedCat.products.includes(p.id));
      } else {
        updated = [];
      }
    }

    // 3. Apply Price & Stock Logic on the result
    updated = updated.filter(item => {
      // Price Check
      const isPriceMatch = item.price >= minVal && item.price <= maxVal;

      // Stock Check
      let isStockMatch = true;
      if (stockFilter.inStock && !stockFilter.outOfStock) {
        isStockMatch = item.inStock === true;
      } else if (!stockFilter.inStock && stockFilter.outOfStock) {
        isStockMatch = item.inStock === false;
      }

      return isPriceMatch && isStockMatch;
    });

    setCurrentPage(1);
    setFilteredProducts(updated);
  };

  // --- UI HANDLERS (Slider, Checkbox, Sort) ---
  const handleRangeChange = (e, type) => {
    const value = Math.max(Number(e.target.value), 0);
    if (type === 'min') {
      if (value <= maxVal - minGap) setMinVal(value);
    } else {
      if (value >= minVal + minGap) setMaxVal(value);
    }
  };

  const handleStockChange = (e) => {
    const { name, checked } = e.target;
    setStockFilter(prev => ({ ...prev, [name]: checked }));
  };

  const handleSort = (e) => {
    const type = e.target.value;
    setSortOption(type);
    let sorted = [...filteredProducts];
    if (type === "lowToHigh") sorted.sort((a, b) => a.price - b.price);
    else if (type === "highToLow") sorted.sort((a, b) => b.price - a.price);
    else if (type === "Newest") sorted.sort((a, b) => b.id.localeCompare(a.id));
    else sorted.sort((a, b) => a.id.localeCompare(b.id));
    setFilteredProducts(sorted);
  };

  // --- PAGINATION & COUNTS ---
  // Counts need to reflect the current category context
  const currentContextProducts = selectedCategory === "All"
    ? products
    : (() => {
      const cat = categories.find(c => c.name === selectedCategory);
      return cat && cat.products
        ? products.filter(p => cat.products.includes(p.id))
        : [];
    })();

  const inStockCount = currentContextProducts.filter(p => p.inStock).length;
  const outStockCount = currentContextProducts.filter(p => !p.inStock).length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- COMPONENT RENDER ---
  const ProductCard = ({ product }) => (
    <div className="col-md-3 col-sm-6 col-6 mb-4 px-1">
      <div
        className={`custom-card ${!product.inStock ? 'sold-out-card' : ''}`}
        onClick={product.inStock ? () => navigate(`/product/${product.id}`) : undefined}
        style={{ cursor: product.inStock ? 'pointer' : 'not-allowed' }}
      >
        <div className="card-img-wrapper">
          <img
            src={product.image}
            alt={product.title}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300?text=No+Image" }}
          />
          {!product.inStock && (
            <div className="sold-out-circle">
              <span> SOLD</span>
              <span>OUT</span>
            </div>
          )}
        </div>
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="card-price">Rs {product.price}</span>
            <button
              className="cart-icon-btn"
              disabled={!product.inStock}
              style={{ opacity: !product.inStock ? 0.5 : 1 }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addCart(product));
                toast.success("Added to cart");
              }}
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
              {/* Availability */}
              <Accordion.Item eventKey="0" className="border-0 mb-3">
                <Accordion.Header className="px-0 fw-bold">Availability</Accordion.Header>
                <Accordion.Body className="px-0 pt-2">
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" id="stockIn" name="inStock" checked={stockFilter.inStock} onChange={handleStockChange} />
                    <label className="form-check-label" htmlFor="stockIn">In stock ({inStockCount})</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="stockOut" name="outOfStock" checked={stockFilter.outOfStock} onChange={handleStockChange} />
                    <label className="form-check-label text-muted" htmlFor="stockOut">Out of stock ({outStockCount})</label>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* Price */}
              <Accordion.Item eventKey="1" className="border-0">
                <Accordion.Header className="px-0 fw-bold">Price</Accordion.Header>
                <Accordion.Body className="px-0 pt-3">
                  <div className="slider-container mb-3">
                    <input type="range" min="0" max={maxLimit} value={minVal} onChange={(e) => handleRangeChange(e, 'min')} className="thumb thumb--left" />
                    <input type="range" min="0" max={maxLimit} value={maxVal} onChange={(e) => handleRangeChange(e, 'max')} className="thumb thumb--right" />
                    <div className="slider-track"></div>
                    <div className="slider-range" style={{ left: `${(minVal / maxLimit) * 100}%`, width: `${((maxVal - minVal) / maxLimit) * 100}%` }}></div>
                  </div>
                  <div className="price-input-group">
                    <div className="price-box"><span className="text-muted small me-1">Rs</span><span>{minVal}</span></div>
                    <span className="fw-bold">To</span>
                    <div className="price-box"><span className="text-muted small me-1">Rs</span><span>{maxVal}</span></div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <button className="btn-apply-filter" onClick={handleApplyFilter}>Apply Filters</button>
          </div>
        </div>

        {/* --- RIGHT CONTENT --- */}
        <div className="col-lg-9">
          <div className="row mb-4 flex-column flex-sm-row align-items-center justify-content-between mx-1">
            <div className="col-md-6 d-none d-md-flex align-items-center">
              <span className="text-muted me-2">Explore In:</span>
              <span className="fw-bold border rounded px-2 py-1 bg-white text-dark small">"{selectedCategory}"</span>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-end align-items-center">
              <span className="text-muted small me-2">Sort by:</span>
              <select className="form-select form-select-sm py-1 px-1 " style={{ width: '170px', boxShadow: 'none', border: '1px solid #d4b86a' }} onChange={handleSort} value={sortOption}>
                <option value="Newest">Newest</option>
                <option value="lowToHigh">Price Low to High</option>
                <option value="highToLow">Price High to Low</option>
              </select>
            </div>
          </div>

          <div className="row">
            {loading ? (
              <p className="text-center py-5">Loading Products...</p>
            ) : filteredProducts.length > 0 ? (
              currentItems.map((prod) => <ProductCard key={prod.id} product={prod} />)
            ) : (
              <div className="col-12 text-center py-5">
                <i className="fa fa-search fa-3x text-muted mb-3"></i>
                <p className="text-muted">No products found for "{selectedCategory}" with these filters.</p>
                <button className="btn btn-outline-dark btn-sm mt-2" onClick={() => { setSelectedCategory("All"); setFilteredProducts(products); setMinVal(0); setMaxVal(maxLimit); }}>Clear Filters</button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="row mt-5">
              <div className="col-12 d-flex flex-wrap justify-content-center justify-content-md-between align-items-center border-top pt-3">
                <div className="text-muted small me-3">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} Products</div>
                <nav>
                  <ul className="pagination custom-pagination mb-0 mt-2">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => paginate(currentPage - 1)}>&laquo;</button></li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}><button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button></li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => paginate(currentPage + 1)}>&raquo;</button></li>
                  </ul>
                </nav>
              </div>
            </div>
          )}

          {/* --- Category Description Box --- */}
          {selectedCategory !== "All" && (
            <div className="row">
              <div className="col-12">
                <div className="category-desc-box mt-4">
                  <h4 className="text-dark mb-2">Category Description:</h4>
                  <p className="text-muted small mb-0">
                    {(() => {
                      // Find the full category object from the state
                      const currentCat = categories.find(c => c.name === selectedCategory);

                      // Return backend description OR fallback text
                      return currentCat?.description
                        ? currentCat.description
                        : `Explore our exclusive collection of ${selectedCategory}.`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;