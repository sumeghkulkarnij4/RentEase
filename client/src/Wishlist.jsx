import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HeartOff, ShoppingCart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/shopping.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to view wishlist");
      navigate("/login");
      return;
    }
    const savedWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.email}`)) || [];
    setWishlist(savedWishlist);
  }, [navigate]);

  const removeFromWishlist = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const updated = wishlist.filter(item => item._id !== id);
    setWishlist(updated);
    localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(updated));
    toast.info("Item removed from wishlist");
  };

  const moveToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    let cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
    const itemIndex = cart.findIndex((i) => i._id === product._id);

    if (itemIndex > -1) {
      cart[itemIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, tenure: 3 }); // Default 3 months
    }

    localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    
    // Remove from wishlist
    removeFromWishlist(product._id);
    toast.success(`${product.name} moved to cart!`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="shop-page">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="shop-header" style={{ marginBottom: '40px' }}>
            <h1 className="h1-premium" style={{ fontSize: '32px' }}>Your Wishlist</h1>
          </div>
          
          <div className="empty-state">
            <HeartOff size={64} style={{ marginBottom: '24px', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '32px' }}>
              You haven't saved any items yet. Start exploring our collection!
            </p>
            <Link to="/products" className="btn-premium btn-primary" style={{ padding: '16px 32px' }}>
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="container">
        
        <div className="shop-header" style={{ marginBottom: '40px' }}>
          <h1 className="h1-premium" style={{ fontSize: '32px' }}>Your Saved Items</h1>
          <p className="subtitle">Keep track of the products you love.</p>
        </div>

        <motion.div 
          className="products-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div 
                key={product._id}
                className="product-card card-premium" 
                style={{ padding: '16px', position: 'relative' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                  <div className="product-img-wrapper">
                    {product.stock === 0 && <span className="product-badge">Out of Stock</span>}
                    <img 
                      src={product.image.startsWith("http") ? product.image : `http://localhost:5000/images/${product.image}`} 
                      alt={product.name} 
                      className="product-img"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price" style={{ marginBottom: '8px' }}>
                      <span>₹{product.rent}</span> / month
                    </div>
                  </div>
                </Link>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button 
                    onClick={() => moveToCart(product)}
                    disabled={product.stock === 0}
                    className="btn-premium btn-primary"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    <ShoppingCart size={16} /> Move to Cart
                  </button>
                  <button 
                    onClick={() => removeFromWishlist(product._id)}
                    className="btn-premium btn-secondary"
                    style={{ padding: '10px 16px', color: 'var(--danger)' }}
                  >
                    <HeartOff size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}

export default Wishlist;