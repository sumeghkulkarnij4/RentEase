import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Truck, Clock } from "lucide-react";
import { API_BASE_URL, getImageUrl } from "./config/api";
import "./styles/home.css";

function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        // Just take first 4 for featured
        setFeaturedProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        
        {/* ===== HERO SECTION ===== */}
        <section className="hero-section">
          <div className="hero-decoration-1" />
          <div className="hero-decoration-2" />
          
          <div className="container hero-container">
            <motion.div 
              className="hero-content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="hero-badge">
                <Star size={16} fill="currentColor" />
                <span>India's #1 Premium Furniture Rental</span>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="h1-premium hero-title">
                Experience Luxury <span>Without the Price Tag.</span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="hero-subtitle">
                Transform your living space with our curated collection of premium furniture and appliances. Rent what you love, upgrade when you want.
              </motion.p>
              
              <motion.div variants={fadeIn} className="hero-actions">
                <button 
                  onClick={() => navigate('/products')}
                  className="btn-premium btn-primary"
                  style={{ padding: '16px 32px', fontSize: '16px' }}
                >
                  Explore Collection <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => document.getElementById('how-it-works').scrollIntoView()}
                  className="btn-premium btn-secondary"
                  style={{ padding: '16px 32px', fontSize: '16px' }}
                >
                  How it works
                </button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="hero-image-wrapper"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000" 
                alt="Premium Living Room" 
                className="hero-image"
              />
            </motion.div>
          </div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">50K+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">12+</div>
                <div className="stat-label">Cities Present</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">₹0</div>
                <div className="stat-label">Maintenance Cost</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">4.9/5</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CATEGORIES ===== */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="h2-premium section-title">Shop by Category</h2>
              <p className="subtitle">Explore our wide range of premium furniture and appliances tailored for your lifestyle.</p>
            </div>
            
            <div className="categories-grid">
              <Link to="/products?category=Furniture" className="category-card">
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" alt="Furniture" className="category-img" />
                <div className="category-content">
                  <h3 className="category-title">Premium Furniture</h3>
                  <div className="category-link">View Collection <ArrowRight size={16} /></div>
                </div>
              </Link>
              <Link to="/products?category=Appliances" className="category-card">
                <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800" alt="Appliances" className="category-img" />
                <div className="category-content">
                  <h3 className="category-title">Smart Appliances</h3>
                  <div className="category-link">View Collection <ArrowRight size={16} /></div>
                </div>
              </Link>
              <Link to="/products?category=Electronics" className="category-card">
                <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800" alt="Electronics" className="category-img" />
                <div className="category-content">
                  <h3 className="category-title">Electronics</h3>
                  <div className="category-link">View Collection <ArrowRight size={16} /></div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" className="section hiw-section">
          <div className="container">
            <div className="section-header">
              <h2 className="h2-premium section-title">How RentEase Works</h2>
              <p className="subtitle">Your journey to a beautiful home, simplified in three easy steps.</p>
            </div>
            
            <div className="hiw-grid">
              <div className="hiw-step">
                <div className="hiw-icon">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="hiw-title">1. Select & Subscribe</h3>
                <p className="hiw-desc">Browse our curated collection and select the products you love. Choose a rental tenure that fits your needs.</p>
              </div>
              <div className="hiw-step">
                <div className="hiw-icon">
                  <Truck size={40} />
                </div>
                <h3 className="hiw-title">2. Free Delivery & Setup</h3>
                <p className="hiw-desc">We deliver and install your products for free within 72 hours. No hidden charges, completely hassle-free.</p>
              </div>
              <div className="hiw-step">
                <div className="hiw-icon">
                  <Clock size={40} />
                </div>
                <h3 className="hiw-title">3. Upgrade or Return</h3>
                <p className="hiw-desc">Bored of the look? Upgrade to new designs anytime, or return them when you're moving out.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section className="section">
          <div className="container">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', textAlign: 'left', maxWidth: '100%', margin: '0 0 40px 0' }}>
              <div>
                <h2 className="h2-premium section-title" style={{ marginBottom: '8px' }}>Trending Right Now</h2>
                <p className="subtitle">Most loved pieces by our community.</p>
              </div>
              <Link to="/products" className="btn-premium btn-secondary hide-mobile">
                View All Products <ArrowRight size={16} />
              </Link>
            </div>
            
            {loading ? (
              <div className="products-grid">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="product-card">
                    <div className="product-img-wrapper skeleton"></div>
                    <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '8px' }}></div>
                    <div className="skeleton" style={{ height: '16px', width: '50%' }}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="products-grid">
                {featuredProducts.map((product) => (
                  <Link to={`/product/${product._id}`} key={product._id} className="product-card card-premium" style={{ textDecoration: 'none', padding: '16px' }}>
                    <div className="product-img-wrapper">
                      {product.stock === 0 && <span className="product-badge">Out of Stock</span>}
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        className="product-img"
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-price">
                        <span>₹{product.rent}</span> / month
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '40px' }} className="hide-desktop">
              <Link to="/products" className="btn-premium btn-secondary">
                View All Products <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}

export default Home;