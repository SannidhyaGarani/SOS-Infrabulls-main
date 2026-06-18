import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        console.log('Subscribed with email:', email);
        setIsSubscribed(true);
        setEmail('');

        // Reset subscription status after 3 seconds
        setTimeout(() => {
            setIsSubscribed(false);
        }, 3000);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsVisible(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const socialLinks = [
        {
            name: 'Facebook',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            ),
            link: 'https://www.facebook.com/profile.php?id=61581331928145',
            color: '#1877F2'
        },
        {
            name: 'LinkedIn',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            ),
            link: 'https://www.linkedin.com/company/sosinfrabulls/',
            color: '#0A66C2'
        },
        {
            name: 'Instagram',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            ),
            link: 'https://www.instagram.com/sosinfrabulls/',
            color: '#E4405F'
        }
    ];

    return (
        <>
            <footer className="premium-footer">
                {/* Top Section - Brand & Social */}
                <div className="premium-footer-top">
                    <div className="container">
                        <div className="premium-footer-brand">
                            <div className="premium-footer-logo">
                                <a href="/" className="premium-logo-link">
                                    <img
                                        src="images/logo/logo@2x.png"
                                        alt="SOS Infrabulls"
                                        width="180"
                                        height="52"
                                        className="premium-logo-img"
                                    />
                                </a>
                                <p className="premium-footer-tagline">
                                    Premium Real Estate Solutions for Discerning Clients
                                </p>
                            </div>
                            <div className="premium-social-section">
                                <span className="premium-social-title">Connect With Us</span>
                                <div className="premium-social-icons-wrapper">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.link}
                                            className="premium-social-icon"
                                            aria-label={social.name}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ '--social-color': social.color }}
                                        >
                                            {social.icon}
                                            <span className="premium-social-tooltip">{social.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="premium-footer-main">
                    <div className="container">
                        <div className="premium-footer-grid">
                            {/* Contact Information */}
                            <div className="premium-footer-column">
                                <h4 className="premium-column-title">
                                    Get In Touch
                                </h4>
                                <div className="premium-contact-info">
                                    <div className="premium-contact-item">
                                        <div className="premium-contact-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 1C6.486 1 2 5.486 2 11C2 16.515 12 23 12 23C12 23 22 16.515 22 11C22 5.486 17.514 1 12 1ZM12 13C10.343 13 9 11.657 9 10C9 8.343 10.343 7 12 7C13.657 7 15 8.343 15 10C15 11.657 13.657 13 12 13Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                        <div className="premium-contact-details">
                                            <p>405 - Shagun tower, Above Apna Sweets, AB Road, Vijay Nagar, Indore, 452001</p>
                                        </div>
                                    </div>
                                    <div className="premium-contact-item">
                                        <div className="premium-contact-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                        <div className="premium-contact-details">
                                            <a href="tel:+917314909915" className="premium-contact-link">
                                                +91 73149 09915
                                            </a>
                                        </div>
                                    </div>
                                    <div className="premium-contact-item">
                                        <div className="premium-contact-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                        <div className="premium-contact-details">
                                            <a href="mailto:info@sosinfrabulls.com" className="premium-contact-link">
                                                info@sosinfrabulls.com
                                            </a>
                                            <a href="mailto:support@sosinfrabulls.com" className="premium-contact-link">
                                                support@sosinfrabulls.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="premium-footer-column">
                                <h4 className="premium-column-title">
                                    <span className="premium-title-icon"></span>
                                    Quick Links
                                </h4>
                                <ul className="premium-footer-links">
                                    <li>
                                        <Link to="/">
                                            <span className="premium-link-icon"></span>Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/projectgallery">
                                            <span className="premium-link-icon"></span>Ongoing Projects
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/complete">
                                            <span className="premium-link-icon"></span>Completed Projects
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/gallery">
                                            <span className="premium-link-icon"></span>Gallery
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <span className="premium-link-icon"></span>Blog & News
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="premium-footer-column">
                                <h4 className="premium-column-title">
                                    <span className="premium-title-icon"></span>
                                    About
                                </h4>
                                <ul className="premium-footer-links">
                                    <li>
                                        <Link to="/about">
                                            <span className="premium-link-icon"></span>About Company
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/aboutdirector">
                                            <span className="premium-link-icon"></span>Director Message
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/contact">
                                            <span className="premium-link-icon"></span>Contact Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/privacy">
                                            <span className="premium-link-icon"></span>Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/terms">
                                            <span className="premium-link-icon"></span>Terms & Conditions
                                        </Link>
                                    </li>
                                </ul>
                            </div>



                            {/* Newsletter Subscription */}
                            <div className="premium-footer-column">
                                <h4 className="premium-column-title">
                                    <span className="premium-title-icon">📧</span>
                                    Stay Updated
                                </h4>
                                <p className="premium-newsletter-desc">
                                    Get the latest property insights and exclusive offers delivered to your inbox.
                                </p>
                                <form className="premium-newsletter-form" onSubmit={handleSubscribe}>
                                    <div className="premium-input-group">
                                        <input
                                            type="email"
                                            className="premium-newsletter-input"
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <button type="submit" className="premium-newsletter-btn">
                                            <span>{isSubscribed ? 'Subscribed!' : 'Subscribe'}</span>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M2.5 10H17.5M17.5 10L12.5 5M17.5 10L12.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                    {isSubscribed && (
                                        <div className="premium-subscription-success">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Thank you for subscribing!
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="premium-footer-bottom">
                    <div className="container">
                        <div className="premium-footer-bottom-content">
                            <div className="premium-copyright">
                                <p>© 2025 SOS Infrabulls. All rights reserved.</p>
                                {/* <p className="premium-company-info">Premium Real Estate Services Since 2019</p> */}
                            </div>
                            <div className="premium-legal-links">

                                <Link to="/terms">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM6 20V4H13V9H18V20H6Z" fill="currentColor" />
                                    </svg>
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <button
                className={`premium-scroll-top ${isVisible ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 19V5M12 5L5 12M12 5L19 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </>
    );
};

export default Footer;