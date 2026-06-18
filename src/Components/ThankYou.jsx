import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Home, LogIn } from 'lucide-react';
import './ThankYou.css'; // Premium custom styling sheet matching the form layout

const ThankYou = () => {
  const { state } = useLocation();
  const loginId = state?.loginId;
  const emailSent = state?.emailSent;

  return (
    <div className="premium-page-wrapper d-flex align-items-center justify-content-center min-h-screen">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="premium-thankyou-card card text-center">
              
              {/* Success Visual Animation Container */}
              <div className="flex-center mb-4">
                <div className="success-icon-wrapper">
                  <CheckCircle2 size={64} className="success-checkmark-icon" />
                </div>
              </div>

              <h1 className="premium-main-heading mb-3">
                Thank You!
              </h1>
              
              <p className="premium-message-text mb-4">
                Your partner application has been received successfully.
                Our team will review your documents and get back to you within 24-48 hours.
              </p>

              {/* Secure Credentials Data Box */}
              <div className="premium-credentials-box text-start mb-4">
                <p className="premium-box-title mb-2">Agent Panel Login Credentials</p>
                
                {emailSent !== false ? (
                  <p className="premium-box-desc mb-0">
                    Your Login ID and 8-digit password have been sent to your registered email
                    {loginId ? ` (${loginId})` : ''}. Please check your inbox and spam folder.
                  </p>
                ) : (
                  <p className="premium-box-desc mb-0 text-danger-soft">
                    Your account has been created
                    {loginId ? ` with Login ID: ${loginId}` : ''}.
                    Email delivery failed — please contact support to receive your credentials.
                  </p>
                )}
                
                <p className="premium-box-footer mt-2 mb-0">
                  Login ID is your registered email address. Use these credentials to access the Agent Panel.
                </p>
              </div>

              {/* Interactive Navigation Control Group */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link to="/agent/login" className="btn premium-primary-action flex-center gap-2">
                  <LogIn size={16} />
                  <span>Go to Agent Login</span>
                </Link>
                <Link to="/" className="btn premium-secondary-action flex-center gap-2">
                  <Home size={16} />
                  <span>Back to Home</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;