import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "./config/api";
import "./styles/shopping.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to view cart");
      navigate("/login");
      return;
    }
    loadCart(user.email);
  }, [navigate]);

  const loadCart = (email) => {
    const savedCart = JSON.parse(localStorage.getItem(`cart_${email}`)) || [];
    setCart(savedCart);
    calculateTotal(savedCart);
  };

  const calculateTotal = (cartItems) => {
    const sum = cartItems.reduce((acc, item) => acc + item.rent * item.quantity, 0);
    setTotal(sum);
  };

  const updateQuantity = (id, amount) => {
    const user = JSON.parse(localStorage.getItem("user"));
    let updatedCart = cart.map(item => {
      if (item._id === id) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    });
    
    setCart(updatedCart);
    calculateTotal(updatedCart);
    localStorage.setItem(`cart_${user.email}`, JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    calculateTotal(updatedCart);
    localStorage.setItem(`cart_${user.email}`, JSON.stringify(updatedCart));
    toast.info("Item removed from cart");
  };

  if (cart.length === 0) {
    return (
      <div className="shop-page">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="shop-header" style={{ marginBottom: '40px' }}>
            <h1 className="h1-premium" style={{ fontSize: '32px' }}>Your Bag is Empty</h1>
          </div>
          
          <div className="empty-state">
            <ShoppingBag size={64} style={{ marginBottom: '24px', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '32px' }}>
              Looks like you haven't added anything to your bag yet.
            </p>
            <Link to="/products" className="btn-premium btn-primary" style={{ padding: '16px 32px' }}>
              Continue Shopping
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
          <h1 className="h1-premium" style={{ fontSize: '32px' }}>Review your bag.</h1>
          <p className="subtitle">Free delivery and assembly included on all orders.</p>
        </div>

        <div className="cart-layout">
          
          {/* CART ITEMS LIST */}
          <div className="cart-items-section">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item._id}
                  className="card-premium cart-item-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.name} 
                    className="cart-item-img"
                  />
                  
                  <div className="cart-item-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 className="cart-item-title">{item.name}</h3>
                      <button onClick={() => removeFromCart(item._id)} className="cart-item-remove">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                      Tenure: {item.tenure} Months
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="quantity-stepper">
                        <button onClick={() => updateQuantity(item._id, -1)} className="stepper-btn">-</button>
                        <span style={{ fontWeight: '700', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="stepper-btn">+</button>
                      </div>
                      
                      <div className="cart-item-price">
                        ₹{item.rent * item.quantity} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>/ mo</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <div style={{ marginTop: '24px' }}>
              <Link to="/products" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <div className="card-premium order-summary">
              <h3 className="h3-premium" style={{ fontSize: '20px', marginBottom: '24px' }}>Order Summary</h3>
              
              <div className="summary-row">
                <span>Monthly Rent (x{cart.reduce((a, c) => a + c.quantity, 0)} items)</span>
                <span>₹{total}</span>
              </div>
              
              <div className="summary-row">
                <span>Refundable Deposit</span>
                <span>₹{total * 2}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery & Setup</span>
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>Free</span>
              </div>

              <div className="summary-row total">
                <span>Total Due Today</span>
                <span>₹{total + (total * 2)}</span>
              </div>
              
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px', marginTop: '8px' }}>
                Includes GST and all applicable taxes.
              </p>

              <button 
                onClick={() => navigate('/checkout')}
                className="btn-premium btn-primary"
                style={{ width: '100%', padding: '18px', fontSize: '16px' }}
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
              
              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <ShieldCheck size={16} className="text-success" />
                <span>Secure SSL checkout</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Cart;