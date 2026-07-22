import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CreditCard, Truck, User, ArrowRight, CheckCircle2,
  ShieldCheck, MapPin, Plus, Edit2, Trash2, Tag,
  Building2, Phone, Sparkles, Smartphone, Landmark, Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/shopping.css";

const PAYMENT_METHODS = [
  {
    id: "cod",
    name: "Cash on Delivery",
    category: "COD",
    description: "Pay with cash or UPI upon delivery at your doorstep.",
    icon: Truck,
    badge: "Most Popular",
    isOnline: false
  },
  {
    id: "upi",
    name: "UPI (GPay / PhonePe / Paytm)",
    category: "UPI",
    description: "Instant payment using any UPI app or ID.",
    icon: Smartphone,
    badge: "Instant Approval",
    isOnline: true
  },
  {
    id: "razorpay",
    name: "Razorpay Secure Gateway",
    category: "Razorpay",
    description: "All-in-one payment via Cards, UPI, Netbanking & EMIs.",
    icon: ShieldCheck,
    badge: "Recommended",
    isOnline: true
  },
  {
    id: "credit_card",
    name: "Credit Card",
    category: "Card",
    description: "Visa, Mastercard, RuPay & American Express accepted.",
    icon: CreditCard,
    badge: null,
    isOnline: true
  },
  {
    id: "debit_card",
    name: "Debit Card",
    category: "Card",
    description: "Instant debit from all major nationalized banks.",
    icon: CreditCard,
    badge: null,
    isOnline: true
  },
  {
    id: "net_banking",
    name: "Net Banking",
    category: "Banking",
    description: "Transfer directly from SBI, HDFC, ICICI, Axis & more.",
    icon: Landmark,
    badge: null,
    isOnline: true
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    category: "Wallet",
    description: "Pay using Paytm Wallet, Mobikwik or Amazon Pay.",
    icon: Wallet,
    badge: null,
    isOnline: true
  }
];

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Address State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Payment & Coupon State
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      toast.error("Please login to proceed with checkout.");
      navigate("/login");
      return;
    }
    setUser(storedUser);

    const savedCart = JSON.parse(localStorage.getItem(`cart_${storedUser.email}`)) || [];
    if (savedCart.length === 0) {
      toast.info("Your cart is empty.");
      navigate("/cart");
      return;
    }
    setCart(savedCart);

    // Load saved addresses or set default from user object
    const storedAddresses = JSON.parse(localStorage.getItem(`addresses_${storedUser.email}`)) || [];
    if (storedAddresses.length > 0) {
      setSavedAddresses(storedAddresses);
    } else {
      const defaultAddr = {
        fullName: storedUser.name || "Customer",
        phone: storedUser.phone || "",
        street: storedUser.address || "123 Startup Street, Suite 400",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001"
      };
      setSavedAddresses([defaultAddr]);
      localStorage.setItem(`addresses_${storedUser.email}`, JSON.stringify([defaultAddr]));
    }
  }, [navigate]);

  // Financial Calculations
  const monthlyRent = cart.reduce((acc, item) => acc + item.rent * item.quantity, 0);
  const refundableDeposit = monthlyRent * 2;
  const deliveryCharge = 0; // Free
  const subtotal = monthlyRent + refundableDeposit;
  const gst = Math.round(subtotal * 0.18);
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const totalAmount = Math.max(0, subtotal + gst - discountAmount);

  // Address Handlers
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.fullName.trim()) return toast.error("Full Name is required.");
    if (!/^\d{10}$/.test(addressForm.phone.trim())) return toast.error("Please enter a valid 10-digit phone number.");
    if (!addressForm.street.trim()) return toast.error("Street address is required.");
    if (!addressForm.city.trim()) return toast.error("City is required.");
    if (!addressForm.state.trim()) return toast.error("State is required.");
    if (!/^\d{6}$/.test(addressForm.pincode.trim())) return toast.error("Please enter a valid 6-digit PIN code.");

    let updated = [...savedAddresses];
    if (editingAddressIndex !== null) {
      updated[editingAddressIndex] = addressForm;
      toast.success("Address updated successfully.");
    } else {
      updated.push(addressForm);
      setSelectedAddressIndex(updated.length - 1);
      toast.success("New address added successfully.");
    }

    setSavedAddresses(updated);
    localStorage.setItem(`addresses_${user.email}`, JSON.stringify(updated));
    setShowAddressForm(false);
    setEditingAddressIndex(null);
    setAddressForm({ fullName: "", phone: "", street: "", city: "", state: "", pincode: "" });
  };

  const handleEditAddress = (idx) => {
    setEditingAddressIndex(idx);
    setAddressForm(savedAddresses[idx]);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (idx) => {
    if (savedAddresses.length <= 1) {
      return toast.warning("You must keep at least one delivery address.");
    }
    const updated = savedAddresses.filter((_, i) => i !== idx);
    setSavedAddresses(updated);
    localStorage.setItem(`addresses_${user.email}`, JSON.stringify(updated));
    if (selectedAddressIndex >= updated.length) {
      setSelectedAddressIndex(0);
    }
    toast.info("Address deleted.");
  };

  // Coupon Handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "RENT20" || code === "FIRST20") {
      setAppliedDiscount(20);
      setCouponSuccess("20% Startup discount applied!");
      toast.success("🎉 Promo Code Applied: 20% OFF!");
    } else if (code === "EASE10") {
      setAppliedDiscount(10);
      setCouponSuccess("10% Seasonal discount applied!");
      toast.success("🎉 Promo Code Applied: 10% OFF!");
    } else {
      toast.error("Invalid Promo Code. Try 'RENT20' or 'EASE10'");
    }
  };

  // Main Checkout Order Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const currentAddress = savedAddresses[selectedAddressIndex];
    if (!currentAddress) {
      return toast.error("Please select or add a delivery address.");
    }

    const activePaymentObj = PAYMENT_METHODS.find(m => m.id === selectedPayment);
    if (!activePaymentObj) {
      return toast.error("Please select a payment method.");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = user._id || user.id;

      const orderPayload = {
        userId: userId,
        address: currentAddress,
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        rentalStartDate: new Date().toISOString().split("T")[0],
        rentalEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        paymentMethod: activePaymentObj.name,
        paymentStatus: activePaymentObj.isOnline ? "Paid" : "Pending",
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          rent: item.rent,
          image: item.image,
          quantity: item.quantity,
          tenure: item.tenure
        })),
        total: totalAmount
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (res.ok && (data.success || data.order)) {
        // Clear cart from local storage
        localStorage.removeItem(`cart_${user.email}`);
        window.dispatchEvent(new Event("cartUpdated"));

        toast.success(`Order placed successfully via ${activePaymentObj.name}! 🎉`);
        navigate("/orders");
      } else {
        toast.error(data.message || "Checkout failed. Please verify your order details.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) return null;

  return (
    <div className="shop-page" style={{ paddingBottom: "80px" }}>
      <div className="container">
        {/* HEADER */}
        <div className="shop-header" style={{ marginBottom: "36px" }}>
          <h1 className="h1-premium" style={{ fontSize: "32px" }}>Checkout</h1>
          <p className="subtitle">Review your shipping details & choose your preferred payment mode.</p>
        </div>

        <div className="cart-layout" style={{ alignItems: "flex-start" }}>
          {/* LEFT COLUMN: ADDRESS & PAYMENT */}
          <div className="cart-items-section" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* STEP 1: ADDRESS SECTION */}
            <div className="card-premium" style={{ padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--primary)", color: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900" }}>1</div>
                  <h3 className="h3-premium" style={{ fontSize: "20px", margin: 0 }}>Shipping Address</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddressIndex(null);
                    setAddressForm({ fullName: user.name || "", phone: user.phone || "", street: "", city: "", state: "", pincode: "" });
                    setShowAddressForm(!showAddressForm);
                  }}
                  className="btn-premium btn-secondary"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  <Plus size={14} /> Add Address
                </button>
              </div>

              {/* SAVED ADDRESS CARDS */}
              {!showAddressForm && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                  {savedAddresses.map((addr, idx) => {
                    const isSelected = selectedAddressIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedAddressIndex(idx)}
                        style={{
                          border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                          background: isSelected ? "var(--secondary)" : "transparent",
                          borderRadius: "var(--radius-md)",
                          padding: "20px",
                          cursor: "pointer",
                          transition: "all var(--transition-fast)",
                          position: "relative"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <MapPin size={18} className={isSelected ? "text-primary" : "text-muted"} />
                            <span style={{ fontWeight: "700", fontSize: "15px", color: "var(--text)" }}>{addr.fullName}</span>
                            {isSelected && (
                              <span className="badge badge-info" style={{ fontSize: "11px" }}>Default Delivery</span>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleEditAddress(idx); }}
                              style={{ border: "none", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleDeleteAddress(idx); }}
                              style={{ border: "none", background: "transparent", color: "var(--danger)", cursor: "pointer" }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "4px", paddingLeft: "28px" }}>
                          {addr.street}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", paddingLeft: "28px" }}>
                          Phone: {addr.phone}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ADD / EDIT ADDRESS FORM */}
              <AnimatePresence>
                {showAddressForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSaveAddress}
                    style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}
                  >
                    <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
                      {editingAddressIndex !== null ? "Edit Address" : "New Address Details"}
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                      <div>
                        <label className="form-label" style={{ fontSize: "12px", marginBottom: "6px", display: "block" }}>Full Name</label>
                        <input
                          type="text"
                          className="input-premium"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: "12px", marginBottom: "6px", display: "block" }}>Mobile Phone</label>
                        <input
                          type="tel"
                          className="input-premium"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="10-digit number"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "6px", display: "block" }}>Flat, House no., Building, Street</label>
                      <input
                        type="text"
                        className="input-premium"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        placeholder="House / Street address"
                        required
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                      <div>
                        <label className="form-label" style={{ fontSize: "12px", marginBottom: "6px", display: "block" }}>City</label>
                        <input
                          type="text"
                          className="input-premium"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: "12px", marginBottom: "6px", display: "block" }}>State</label>
                        <input
                          type="text"
                          className="input-premium"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          placeholder="State"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: "12px", marginBottom: "6px", display: "block" }}>Pincode</label>
                        <input
                          type="text"
                          className="input-premium"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          placeholder="6-digit PIN"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button type="submit" className="btn-premium btn-primary" style={{ padding: "10px 20px", fontSize: "14px" }}>
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowAddressForm(false); setEditingAddressIndex(null); }}
                        className="btn-premium btn-secondary"
                        style={{ padding: "10px 20px", fontSize: "14px" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* STEP 2: PAYMENT METHODS */}
            <div className="card-premium" style={{ padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--primary)", color: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900" }}>2</div>
                <div>
                  <h3 className="h3-premium" style={{ fontSize: "20px", margin: 0 }}>Payment Method</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>Select how you would like to pay for your rental.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}>
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedPayment === method.id;
                  const IconComp = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "18px 20px",
                        borderRadius: "var(--radius-md)",
                        border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                        background: isSelected ? "var(--secondary)" : "var(--card)",
                        cursor: "pointer",
                        transition: "all var(--transition-fast)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: isSelected ? "6px solid var(--primary)" : "2px solid var(--text-muted)",
                            background: "var(--background)"
                          }}
                        />
                        <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "var(--background)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                          <IconComp size={20} />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: "700", fontSize: "15px", color: "var(--text)" }}>{method.name}</span>
                            {method.badge && (
                              <span className="badge badge-success" style={{ fontSize: "10px" }}>{method.badge}</span>
                            )}
                          </div>
                          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>{method.description}</p>
                        </div>
                      </div>

                      {isSelected && <CheckCircle2 size={22} className="text-primary" />}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div className="card-premium order-summary" style={{ padding: "28px" }}>
              <h3 className="h3-premium" style={{ fontSize: "20px", marginBottom: "20px" }}>Order Summary</h3>

              {/* ITEMS MINI LIST */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)", maxHeight: "240px", overflowY: "auto" }}>
                {cart.map((item) => (
                  <div key={item._id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <img
                      src={item.image.startsWith("http") ? item.image : `http://localhost:5000/images/${item.image}`}
                      alt={item.name}
                      style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border)" }}
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300"; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: "700", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Qty: {item.quantity} | {item.tenure} Months</p>
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text)" }}>
                      ₹{(item.rent * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              {/* PROMO COUPON FORM */}
              <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                <input
                  type="text"
                  className="input-premium"
                  placeholder="Promo Code (e.g. RENT20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ padding: "10px 14px", fontSize: "13px" }}
                />
                <button type="submit" className="btn-premium btn-secondary" style={{ padding: "10px 16px", fontSize: "13px" }}>
                  Apply
                </button>
              </form>
              {couponSuccess && (
                <p style={{ color: "var(--success)", fontSize: "12px", fontWeight: "600", marginBottom: "16px", marginTop: "-10px" }}>
                  {couponSuccess}
                </p>
              )}

              {/* COST BREAKDOWN */}
              <div className="summary-row">
                <span>Monthly Rent Total</span>
                <span>₹{monthlyRent.toLocaleString("en-IN")}</span>
              </div>

              <div className="summary-row">
                <span>Refundable Security Deposit</span>
                <span>₹{refundableDeposit.toLocaleString("en-IN")}</span>
              </div>

              <div className="summary-row">
                <span>Delivery & Professional Setup</span>
                <span style={{ color: "var(--success)", fontWeight: "700" }}>FREE</span>
              </div>

              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{gst.toLocaleString("en-IN")}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="summary-row" style={{ color: "var(--success)" }}>
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="summary-row total" style={{ marginTop: "16px", paddingTop: "16px", borderTop: "2px solid var(--border)" }}>
                <span>Total Payable Now</span>
                <span style={{ fontSize: "22px", fontWeight: "900", color: "var(--primary)" }}>
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>

              {/* PLACE ORDER BUTTON */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-premium btn-primary"
                style={{ width: "100%", padding: "18px", fontSize: "16px", marginTop: "24px" }}
              >
                {loading ? (
                  <span className="spinner" style={{ width: "24px", height: "24px", borderWidth: "3px", borderBottomColor: "#fff" }}></span>
                ) : (
                  <>
                    Place Order Securely <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--text-muted)", fontSize: "13px" }}>
                <ShieldCheck size={16} className="text-success" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;