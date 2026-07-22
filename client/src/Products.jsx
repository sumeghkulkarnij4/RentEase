import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Filter, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL, getImageUrl } from "./config/api";
import "./styles/shopping.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Filters State
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get("category");
    const searchParam = params.get("search");

    if (catParam) setCategory(catParam);
    if (searchParam) setSearch(searchParam);
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, [category, priceRange, search, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/products?`;
      if (category) url += `category=${category}&`;
      if (search) url += `search=${search}&`;
      if (sort) url += `sort=${sort}&`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      // Client side price filtering
      let filtered = data;
      if (priceRange === "under-1000") {
        filtered = data.filter(p => p.rent < 1000);
      } else if (priceRange === "1000-5000") {
        filtered = data.filter(p => p.rent >= 1000 && p.rent <= 5000);
      } else if (priceRange === "above-5000") {
        filtered = data.filter(p => p.rent > 5000);
      }
      
      setProducts(filtered);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setCategory("");
    setPriceRange("");
    setSearch("");
    setSort("");
  };
console.log("Products state:", products);
console.log("Loading:", loading);
  return (
    <div className="shop-page">
      <div className="container">
        
        <div className="shop-header">
          <div className="shop-title">
            <h1>Premium Collection</h1>
            <p>Discover our carefully curated selection of furniture and appliances.</p>
          </div>
          
          <div className="hide-mobile" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Sort by:</span>
            <select 
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
          
          <button 
            className="btn-secondary hide-desktop" 
            style={{ padding: '10px 16px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        <div className="shop-layout">
          
          {/* SIDEBAR FILTERS (Desktop) */}
          <div className="shop-sidebar hide-mobile">
            <div className="filter-group">
              <h3 className="filter-title">Search</h3>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-premium" 
                  placeholder="Search products..." 
                  style={{ paddingLeft: '36px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Categories</h3>
              <label className="filter-label">
                <input type="radio" name="cat" className="filter-checkbox" checked={category === ""} onChange={() => setCategory("")} /> All Categories
              </label>
              <label className="filter-label">
                <input type="radio" name="cat" className="filter-checkbox" checked={category === "Furniture"} onChange={() => setCategory("Furniture")} /> Furniture
              </label>
              <label className="filter-label">
                <input type="radio" name="cat" className="filter-checkbox" checked={category === "Appliances"} onChange={() => setCategory("Appliances")} /> Appliances
              </label>
              <label className="filter-label">
                <input type="radio" name="cat" className="filter-checkbox" checked={category === "Electronics"} onChange={() => setCategory("Electronics")} /> Electronics
              </label>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Price Range (Monthly)</h3>
              <label className="filter-label">
                <input type="radio" name="price" className="filter-checkbox" checked={priceRange === ""} onChange={() => setPriceRange("")} /> Any Price
              </label>
              <label className="filter-label">
                <input type="radio" name="price" className="filter-checkbox" checked={priceRange === "under-1000"} onChange={() => setPriceRange("under-1000")} /> Under ₹1,000
              </label>
              <label className="filter-label">
                <input type="radio" name="price" className="filter-checkbox" checked={priceRange === "1000-5000"} onChange={() => setPriceRange("1000-5000")} /> ₹1,000 - ₹5,000
              </label>
              <label className="filter-label">
                <input type="radio" name="price" className="filter-checkbox" checked={priceRange === "above-5000"} onChange={() => setPriceRange("above-5000")} /> Above ₹5,000
              </label>
            </div>
            
            {(category || search || priceRange || sort) && (
              <button 
                onClick={clearFilters}
                className="btn-ghost" 
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '14px', fontWeight: '600' }}
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* PRODUCT GRID */}
          <div className="shop-content">
            {loading ? (
              <div className="products-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="product-card">
                    <div className="product-img-wrapper skeleton"></div>
                    <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '8px' }}></div>
                    <div className="skeleton" style={{ height: '16px', width: '50%' }}></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div 
                className="products-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <>
  {products.map((product) => (
    <div
      key={product._id}
      style={{
        color: "white",
        border: "1px solid white",
        margin: "10px",
        padding: "10px",
      }}
    >
      <h3>{product.name}</h3>
      <p>{product.rent}</p>
    </div>
  ))}
</>
              </motion.div>
            ) : (
              <div className="empty-state">
                <Search size={48} />
                <h3 className="h3-premium">No products found</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '24px' }}>Try adjusting your filters or search term.</p>
                <button onClick={clearFilters} className="btn-premium btn-primary">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTERS MODAL */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-menu-overlay hide-desktop"
            style={{ zIndex: 100, top: 0 }}
          >
            <div className="card-premium" style={{ height: '100%', borderRadius: 0, padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="h2-premium" style={{ fontSize: '24px' }}>Filters</h2>
                <button className="btn-icon" onClick={() => setMobileFiltersOpen(false)}><X size={24} /></button>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {/* Same filters as sidebar */}
                <div className="filter-group">
                  <h3 className="filter-title">Categories</h3>
                  <label className="filter-label">
                    <input type="radio" name="mobile-cat" className="filter-checkbox" checked={category === ""} onChange={() => setCategory("")} /> All Categories
                  </label>
                  <label className="filter-label">
                    <input type="radio" name="mobile-cat" className="filter-checkbox" checked={category === "Furniture"} onChange={() => setCategory("Furniture")} /> Furniture
                  </label>
                  <label className="filter-label">
                    <input type="radio" name="mobile-cat" className="filter-checkbox" checked={category === "Appliances"} onChange={() => setCategory("Appliances")} /> Appliances
                  </label>
                  <label className="filter-label">
                    <input type="radio" name="mobile-cat" className="filter-checkbox" checked={category === "Electronics"} onChange={() => setCategory("Electronics")} /> Electronics
                  </label>
                </div>

                <div className="filter-group">
                  <h3 className="filter-title">Sort By</h3>
                  <select 
                    className="sort-select"
                    style={{ width: '100%', marginTop: '8px' }}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="">Recommended</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
                <button onClick={clearFilters} className="btn-secondary" style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-full)', fontWeight: 'bold' }}>Clear</button>
                <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary" style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-full)', fontWeight: 'bold' }}>Apply</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Products;