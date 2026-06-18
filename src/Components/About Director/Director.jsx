import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Director() {
  useEffect(() => {
    // Enhanced Tilt Effect with smooth easing
    const tiltElements = document.querySelectorAll(".tilt-card");

    tiltElements.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;

        el.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.05)`;
        el.style.transition = "transform 0.1s ease-out";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
        el.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
      });
    });

    // Enhanced Scroll Reveal with staggered animation
    const revealElements = document.querySelectorAll(".reveal");

    const handleReveal = () => {
      revealElements.forEach((el, index) => {
        const top = el.getBoundingClientRect().top;
        const delay = index * 100;

        if (top < window.innerHeight - 100) {
          setTimeout(() => {
            el.classList.add("reveal-visible");
          }, delay);
        }
      });
    };

    handleReveal();
    window.addEventListener("scroll", handleReveal);

    return () => window.removeEventListener("scroll", handleReveal);
  }, []);

  return (
    <>
      <style>{`
        /* ==========================
           PREMIUM ANIMATIONS
        ========================== */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        /* ==========================
           SCROLL REVEAL
        ========================== */
        .reveal {
          opacity: 0;
          transform: translateY(60px) scale(0.95);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }

        .reveal-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ==========================
           PREMIUM HERO SECTION
        ========================== */
        .premium-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          overflow: hidden;
          margin-top: 33px;
        }

        .premium-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(201, 169, 110, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 6rem 0;
          text-align: center;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 300;
          letter-spacing: -0.02em;
          color: white;
          margin-bottom: 1.5rem;
          font-family: 'Georgia', serif;
        }

        .hero-title strong {
          font-weight: 600;
          color: var(--accent);
        }

        .breadcrumb {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .breadcrumb a {
          color: var(--accent);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb a:hover {
          color: white;
          text-decoration: underline;
        }

        /* ==========================
           PREMIUM DIRECTOR SECTION
        ========================== */
        .premium-section {
          padding: 8rem 0;
          background: var(--light-bg);
          position: relative;
        }

        .premium-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }

        .director-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ==========================
           DIRECTOR CARD - PREMIUM
        ========================== */
        .director-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
          margin-bottom: 8rem;
          position: relative;
        }

        .director-card:nth-child(even) .director-photo {
          order: 2;
        }

        .director-card:nth-child(even) .director-content {
          order: 1;
        }

        /* Photo Container */
        .director-photo-container {
          position: relative;
          perspective: 1000px;
        }

        .director-photo {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 
            0 30px 60px rgba(10, 37, 64, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          transform-style: preserve-3d;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .director-photo::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 40%, rgba(201, 169, 110, 0.1));
          z-index: 1;
          pointer-events: none;
        }

        .director-photo img {
          width: 100%;
          height: 650px;
          object-fit: cover;
          object-position: top;
          display: block;
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .photo-frame {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          border: 2px solid var(--accent);
          border-radius: 32px;
          z-index: -1;
          opacity: 0.5;
        }

        .photo-badge {
          position: absolute;
          top: 30px;
          right: 30px;
          background: var(--accent);
          color: #fff;
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          z-index: 2;
          box-shadow: 0 10px 20px rgb(17 116 214);
        }

        /* Content Styling */
        .director-content {
          position: relative;
        }

        .director-title {
          font-size: 3.5rem;
          font-weight: 300;
          color: var(--primary);
          margin-bottom: 0.5rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .director-subtitle {
          display: inline-block;
          color: var(--accent);
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 2.5rem;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .director-subtitle::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 2px;
          background: var(--accent);
        }

        .director-text {
          color: var(--text-light);
          line-height: 1.8;
          font-size: 1.15rem;
          margin-bottom: 2rem;
          font-weight: 300;
        }

        .director-text.highlight {
          background: linear-gradient(120deg, rgba(17, 116, 214, 0.2) 0%, transparent 100%);
          padding: 2rem;
          border-radius: 16px;
          border-left: 3px solid var(--accent);
          font-style: italic;
        }

        /* ==========================
           SIGNATURE & QUOTE
        ========================== */
        .director-signature {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .signature-text {
          font-family: 'Brush Script MT', cursive;
          font-size: 2.5rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .signature-name {
          color: var(--accent);
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        /* ==========================
           RESPONSIVE DESIGN
        ========================== */
        @media (max-width: 1200px) {
          .director-title {
            font-size: 3rem;
          }
          
          .director-card {
            gap: 4rem;
          }
        }

        @media (max-width: 992px) {
          .director-card {
            grid-template-columns: 1fr;
            gap: 4rem;
            margin-bottom: 6rem;
          }

          .director-card:nth-child(even) .director-photo,
          .director-card:nth-child(even) .director-content {
            order: initial;
          }

          .director-photo img {
            height: 500px;
          }

          .hero-title {
            font-size: 3.5rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.8rem;
          }

          .director-title {
            font-size: 2.5rem;
          }

          .premium-section {
            padding: 4rem 0;
          }

          .director-photo img {
            height: 400px;
          }
        }
          /* ==========================
   EXTRA MOBILE RESPONSIVENESS
========================== */

/* Small devices (phones) */
@media (max-width: 576px) {

  /* Hero */
  .hero-content {
    padding: 3rem 1rem;
  }

  .hero-title {
    font-size: 2.2rem;
    line-height: 1.2;
  }

  .breadcrumb {
    flex-wrap: wrap;
    font-size: 0.85rem;
    gap: 0.5rem;
  }

  /* Section spacing */
  .premium-section {
    padding: 3rem 0;
  }

  .director-container {
    padding: 0 1rem;
  }

  /* Card layout */
  .director-card {
    gap: 2.5rem;
    margin-bottom: 4rem;
  }

  /* Image */
 

  .photo-frame {
    display: none; /* cleaner on mobile */
  }

  .photo-badge {
    top: 15px;
    right: 15px;
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }

  /* Text */
  .director-title {
    font-size: 2rem;
  }

  .director-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .director-text {
    font-size: 1rem;
    line-height: 1.7;
  }

  .director-text.highlight {
    padding: 1.2rem;
    font-size: 0.95rem;
  }

  /* Signature */
  .signature-text {
    font-size: 2rem;
  }
}

/* Disable hover tilt on touch devices */
@media (hover: none) {
  .tilt-card {
    transform: none !important;
  }
}


        /* ==========================
           UTILITY CLASSES
        ========================== */
        .text-accent {
          color: var(--accent);
        }

        .mb-3 {
          margin-bottom: 3rem;
        }
      `}</style>

      {/* ==========================
           PREMIUM HERO
      ========================== */}
      

      {/* ==========================
           DIRECTORS SECTION
      ========================== */}
      <section className="premium-section mt-5 mt-md-0">
        <div className="director-container">

          {/* Pawan Tilve */}
          <div className="director-card reveal">
            <div className="director-content">
              <h2 className="director-title">Mr. Pawan Tilve</h2>
              <div className="director-subtitle">Founder & Managing Director</div>

              <p className="director-text">
                Leading with purpose and precision, Mr. Pawan Tilve brings transformative vision to SOS Infrabulls. His leadership is rooted in deep industry expertise and an unwavering commitment to excellence.
              </p>

              <p className="director-text highlight">
                "एक नए कल की शुरुआत, हमारी प्राथमिकता मध्यवर्गीय परिवार की मेहनत से एकत्र की गई जमापूँजी को एक सही जगह निवेश कराना है, ताकि वह अपने सपनों का आशियाना वहाँ बना पाएं..."
              </p>

              <p className="director-text">
                Under his guidance, SOS Infrabulls has redefined real estate standards, focusing on sustainable growth, innovative solutions, and creating lasting value for stakeholders.
              </p>

              {/* <div className="director-signature">
                <div className="signature-text">Pawan Tilve</div>
                <div className="signature-name">Founder & Managing Director</div>
              </div> */}
            </div>
            <div className="director-photo-container">
              <div className="director-photo tilt-card">
                <div className="photo-badge">Founder & MD</div>
                <img src="images/img/01 (1).png" alt="MD Pawan Tilve" />
              </div>
              <div className="photo-frame"></div>
            </div>
          </div>

          {/* Vikas Garg */}
          <div className="director-card reveal">
            <div className="director-photo-container">
              <div className="director-photo tilt-card">
                <div className="photo-badge">CMD</div>
                <img src="images/img/01 (2).png" alt="CMD Vikas Garg" />
              </div>
              <div className="photo-frame"></div>
            </div>

            <div className="director-content">
              <h2 className="director-title">Mr. Vikas Garg</h2>
              <div className="director-subtitle">Chief Managing Director</div>

              <p className="director-text">
                With strategic foresight and decades of experience, Mr. Vikas Garg shapes the future of real estate development. His philosophy centers on trust, transparency, and creating spaces that inspire.
              </p>

              <p className="director-text">
                "सर्वप्रथम हम आपको धन्यवाद देते हैं कि आपने हमसे संपर्क किया और हमारे बारे में जानने के लिए उत्सुक हैं। हम कौन हैं? हम भी बिल्कुल आप ही की तरह हैं..."
              </p>

              <p className="director-text">
                His approach combines meticulous planning with empathetic understanding of client needs, ensuring every project exceeds expectations while maintaining the highest ethical standards.
              </p>

              <p className="director-text highlight mb-3">
                "आप और मैं तभी तो कहलायेंगे 'हम'"
              </p>

              {/* <div className="director-signature">
                <div className="signature-text">Vikas Garg</div>
                <div className="signature-name">Chairman & Managing Director</div>
              </div> */}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default Director;