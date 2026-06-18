import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInAdmin } from "../Firebase/authHelpers";
import "./Admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInAdmin(email, password);
      navigate("/admin", { replace: true });
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-main-content d-flex align-items-center justify-content-center px-3" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <div className="sidebar-brand-icon mx-auto mb-3" style={{ width: '60px', height: '60px', borderRadius: '15px' }}>
            <span style={{ fontSize: '1.2rem' }}>SOS</span>
          </div>
          <h2 className="fw-bold text-white mb-1">Administrative Login</h2>
          <p className="small text-muted">Enter your secure credentials to proceed</p>
        </div>

        <div className="admin-stat-card p-4 p-md-5">
          <form onSubmit={onSubmit}>
            <div className="admin-form-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="admin@sos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="admin-input"
              />
            </div>

            <div className="admin-form-field mb-4">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="admin-input"
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 mb-4 rounded-3 small border-0" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-admin-primary w-100 justify-content-center py-3"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-decoration-none small text-muted">
            <span className="me-1">←</span> Back to main website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
