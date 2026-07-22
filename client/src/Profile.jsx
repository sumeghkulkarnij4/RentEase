import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Settings, Package, Heart, Camera, LogOut, Lock } from "lucide-react";
import { motion } from "framer-motion";
import "./styles/profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login to view profile");
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
    
    // Simulate fetching profile stats
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container">
        
        <div className="profile-layout">
          
          {/* SIDEBAR */}
          <motion.div 
            className="profile-sidebar card-premium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="profile-user-card" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="profile-avatar-container">
                <User />
                <div className="profile-edit-avatar">
                  <Camera size={16} />
                </div>
              </div>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>
              {user.role === "admin" && (
                <span className="profile-role-badge">Admin</span>
              )}
            </div>

            <nav className="profile-nav">
              <div 
                className={`profile-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <User size={20} /> Account Overview
              </div>
              <div 
                className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={20} /> Settings
              </div>
              <div className="profile-nav-item" onClick={() => navigate('/orders')}>
                <Package size={20} /> My Orders
              </div>
              <div className="profile-nav-item" onClick={() => navigate('/wishlist')}>
                <Heart size={20} /> Wishlist
              </div>
              
              <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }}></div>
              
              <div className="profile-nav-item" style={{ color: 'var(--danger)' }} onClick={handleLogout}>
                <LogOut size={20} /> Log Out
              </div>
            </nav>
          </motion.div>

          {/* CONTENT AREA */}
          <motion.div 
            className="profile-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {activeTab === 'overview' && (
              <>
                <div className="profile-section-header">
                  <h2 className="profile-section-title">Welcome back, {user.name.split(' ')[0]}!</h2>
                  <p className="profile-section-desc">Manage your account details, track orders, and discover new premium rentals.</p>
                </div>

                {loading ? (
                  <div className="profile-stats-grid">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="card-premium profile-stat-card skeleton" style={{ height: '100px' }}></div>
                    ))}
                  </div>
                ) : (
                  <div className="profile-stats-grid">
                    <div className="card-premium profile-stat-card">
                      <div className="profile-stat-icon">
                        <Package size={24} />
                      </div>
                      <div className="profile-stat-info">
                        <h4>3</h4>
                        <p>Active Orders</p>
                      </div>
                    </div>
                    <div className="card-premium profile-stat-card">
                      <div className="profile-stat-icon" style={{ color: 'var(--success)', background: 'var(--success-bg)' }}>
                        <Lock size={24} />
                      </div>
                      <div className="profile-stat-info">
                        <h4>1</h4>
                        <p>Active Rentals</p>
                      </div>
                    </div>
                    <div className="card-premium profile-stat-card">
                      <div className="profile-stat-icon" style={{ color: 'var(--danger)', background: 'var(--danger-bg)' }}>
                        <Heart size={24} />
                      </div>
                      <div className="profile-stat-info">
                        <h4>12</h4>
                        <p>Wishlist Items</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card-premium settings-card">
                  <div className="profile-section-header">
                    <h3 className="profile-section-title">Personal Information</h3>
                  </div>
                  
                  <div className="profile-form-grid">
                    <div className="form-group">
                      <label className="form-label" style={{ position: 'static', transform: 'none', marginBottom: '8px', display: 'block', fontSize: '13px' }}>Full Name</label>
                      <input type="text" className="input-premium" defaultValue={user.name} disabled />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ position: 'static', transform: 'none', marginBottom: '8px', display: 'block', fontSize: '13px' }}>Email Address</label>
                      <input type="email" className="input-premium" defaultValue={user.email} disabled />
                    </div>
                    <div className="form-group profile-form-full">
                      <label className="form-label" style={{ position: 'static', transform: 'none', marginBottom: '8px', display: 'block', fontSize: '13px' }}>Phone Number</label>
                      <input type="tel" className="input-premium" placeholder="Add your phone number" />
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-premium btn-primary">Save Changes</button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'settings' && (
              <div className="card-premium settings-card">
                <div className="profile-section-header">
                  <h3 className="profile-section-title">Security Settings</h3>
                  <p className="profile-section-desc">Update your password and secure your account.</p>
                </div>
                
                <div className="profile-form-grid">
                  <div className="form-group profile-form-full">
                    <label className="form-label" style={{ position: 'static', transform: 'none', marginBottom: '8px', display: 'block', fontSize: '13px' }}>Current Password</label>
                    <input type="password" className="input-premium" placeholder="Enter current password" />
                  </div>
                  <div className="form-group profile-form-full">
                    <label className="form-label" style={{ position: 'static', transform: 'none', marginBottom: '8px', display: 'block', fontSize: '13px' }}>New Password</label>
                    <input type="password" className="input-premium" placeholder="Enter new password" />
                  </div>
                  <div className="form-group profile-form-full">
                    <label className="form-label" style={{ position: 'static', transform: 'none', marginBottom: '8px', display: 'block', fontSize: '13px' }}>Confirm New Password</label>
                    <input type="password" className="input-premium" placeholder="Confirm new password" />
                  </div>
                </div>
                
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-premium btn-primary">Update Password</button>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Profile;