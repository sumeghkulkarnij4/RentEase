import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import "./styles/auth.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: "" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score < 2) return { score, text: "Weak", class: "strength-weak" };
    if (score < 4) return { score, text: "Fair", class: "strength-fair" };
    if (score < 5) return { score, text: "Good", class: "strength-good" };
    return { score, text: "Strong", class: "strength-strong" };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.error(data.message || "Failed to create account.");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE - ILLUSTRATION */}
      <div className="auth-illustration" style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}>
        <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1200" alt="Premium Bedroom" />
        <motion.div 
          className="auth-illustration-content"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="auth-illustration-title">Upgrade your lifestyle today.</h2>
          <p className="auth-illustration-text">
            Join RentEase and discover a smarter way to furnish your home. Premium quality, zero commitment, endless possibilities.
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="auth-form-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="auth-card"
        >
          <div className="auth-header">
            <Link to="/" className="inline-flex items-center gap-2 mb-8" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>R</div>
              <span className="text-gradient-accent" style={{ fontWeight: '800', fontSize: '20px' }}>RentEase</span>
            </Link>
            <h1>Create an account</h1>
            <p>Start your premium rental journey with us.</p>
          </div>

          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="name" className="form-label">Full Name</label>
              <User size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email" className="form-label">Email address</label>
              <Mail size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <div className="form-group">
              <input
                type="tel"
                id="phone"
                className="form-input"
                placeholder=" "
                value={formData.phone}
                onChange={handleChange}
              />
              <label htmlFor="phone" className="form-label">Phone Number (Optional)</label>
              <Phone size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '4px' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="password" className="form-label">Password</label>
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <>
                  <div className="password-strength-bar">
                    <div className={`strength-segment ${strength.score >= 1 ? strength.class : ''}`}></div>
                    <div className={`strength-segment ${strength.score >= 2 ? strength.class : ''}`}></div>
                    <div className={`strength-segment ${strength.score >= 3 ? strength.class : ''}`}></div>
                    <div className={`strength-segment ${strength.score >= 4 ? strength.class : ''}`}></div>
                  </div>
                  <div className="password-strength-text" style={{ color: strength.score >= 3 ? 'var(--success)' : 'var(--text-secondary)' }}>
                    {strength.text}
                  </div>
                </>
              )}
            </div>

            <label className="remember-me" style={{ marginTop: '0', fontSize: '13px' }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} required />
              <span>I agree to the <Link to="/terms" className="forgot-password">Terms of Service</Link> and <Link to="/privacy" className="forgot-password">Privacy Policy</Link></span>
            </label>

            <button 
              type="submit" 
              className="btn-premium btn-accent auth-btn"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? (
                <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', borderBottomColor: '#fff' }}></span>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: '24px' }}>
            Already have an account? <Link to="/login" style={{ color: '#ea580c' }}>Sign in here</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;