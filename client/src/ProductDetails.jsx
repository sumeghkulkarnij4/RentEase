import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Check, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL, getImageUrl } from "./config/api";
import "./styles/shopping.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activePlan, setActivePlan] = useState(3); // default 3 months
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product", err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    
    setAddingToCart(true);
    let cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
    const item = cart.find((i) => i._id === product._id);

    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, tenure: activePlan });
    }

    localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    
    setTimeout(() => {
      setAddingToCart(false);
      toast.success(`${product.name} added to cart!`);
    }, 400);
  };

  if (loading) {
    return (
      <div className="shop-page">
        <div className="container">
          <div className="details-layout">
            <div className="details-gallery skeleton" style={{ minHeight: '600px' }}></div>
            <div className="details-info">
              <div className="skeleton" style={{ height: '40px', width: '80%', marginBottom: '24px' }}></div>
              <div className="skeleton" style={{ height: '30px', width: '40%', marginBottom: '40px' }}></div>
              <div className="skeleton" style={{ height: '20px', width: '100%', marginBottom: '16px' }}></div>
              <div className="skeleton" style={{ height: '20px', width: '100%', marginBottom: '16px' }}></div>
              <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '40px' }}></div>
              <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: '30px' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shop-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state">
          <h2 className="h2-premium mb-4">Product Not Found</h2>
          <Link to="/products" className="btn-premium btn-primary mt-4">Browse Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="container">
        
        <Link to="/products" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to Collection
        </Link>

        <div className="details-layout">
          {/* GALLERY */}
          <motion.div 
            className="details-gallery"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {product.stock === 0 && (
              <span className="badge badge-danger" style={{ position: 'absolute', top: '32px', left: '32px', fontSize: '14px', padding: '6px 16px' }}>
                Out of Stock
              </span>
            )}
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              className="details-image"
            />
          </motion.div>

          {/* INFO SIDEBAR */}
          <motion.div 
            className="details-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="details-brand">{product.category}</div>
            <h1 className="details-title">{product.name}</h1>
            
            <div className="details-price">
              ₹{product.rent} <span>/ month</span>
            </div>
            
            <p className="details-desc">{product.description || "Experience the ultimate comfort and premium design with this highly sought-after piece. Built to elevate your living space effortlessly."}</p>

            <h3 className="h3-premium" style={{ fontSize: '18px', marginBottom: '16px' }}>Select Rental Tenure</h3>
            <div className="plan-selector">
              <div 
                className={`plan-card ${activePlan === 1 ? 'active' : ''}`}
                onClick={() => setActivePlan(1)}
              >
                <span className="plan-months">1 Month</span>
                <span className="plan-discount" style={{ color: 'var(--text-secondary)' }}>Standard Rate</span>
              </div>
              <div 
                className={`plan-card ${activePlan === 3 ? 'active' : ''}`}
                onClick={() => setActivePlan(3)}
              >
                <span className="plan-months">3 Months</span>
                <span className="plan-discount">Save 10%</span>
              </div>
              <div 
                className={`plan-card ${activePlan === 6 ? 'active' : ''}`}
                onClick={() => setActivePlan(6)}
              >
                <span className="plan-months">6+ Months</span>
                <span className="plan-discount">Save 20%</span>
              </div>
            </div>

            <div className="details-actions">
              <button 
                onClick={addToCart} 
                disabled={product.stock === 0 || addingToCart}
                className="btn-premium btn-primary btn-add-cart"
              >
                {addingToCart ? (
                  <span className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px', borderBottomColor: '#fff' }}></span>
                ) : product.stock === 0 ? (
                  "Out of Stock"
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <ShieldCheck size={24} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>RentEase Protection</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Free maintenance and damage waiver included in your plan.</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <Truck size={24} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>Free Delivery & Assembly</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Delivered and set up by professionals within 72 hours.</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <RotateCcw size={24} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>Easy Upgrades</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Swap out items for a new look anytime after 3 months.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;