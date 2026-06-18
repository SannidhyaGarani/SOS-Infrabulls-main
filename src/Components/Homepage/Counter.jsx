import React, { useState, useEffect, useRef } from "react";
import "./Counter.css";

const CounterCard = ({ item, delay }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = item.value;
    const duration = 2500;
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    const increment = end / totalFrames;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [hasStarted, item.value]);

  return (
    <div 
      className={`pc-card ${hasStarted ? "pc-visible" : ""}`} 
      ref={cardRef}
      style={{ "--pc-delay": `${delay}s` }}
    >
      <div className="pc-card-inner">
        {/* Centered Icon Section */}
        <div className="pc-icon-wrapper">
          <div className="pc-icon-box">
            <i className={`fas fa-${item.icon}`}></i>
          </div>
          <div className="pc-icon-ring"></div>
        </div>

        {/* Centered Content Section */}
        <div className="pc-content">
          <h2 className="pc-number">
            {count.toLocaleString()}<span>+</span>
          </h2>
          <div className="pc-divider"></div>
          <p className="pc-label">{item.label}</p>
        </div>
      </div>
      
      {/* Premium Decorative Light Leak */}
      <div className="pc-light-leak"></div>
    </div>
  );
};

export default function Counter() {
  const data = [
    { icon: "heart", value: 10000, label: "Success Stories" },
    { icon: "smile", value: 20000, label: "Satisfied Clients" },
    { icon: "calendar-alt", value: 6, label: "Years Experience" },
    { icon: "building", value: 27, label: "Total Projects" }
  ];

  return (
    <section className="pc-wrapper">
      <div className="pc-container">
        <div className="pc-header">
          <span className="pc-badge">Performance Metrics</span>
          <h2 className="pc-main-title">
            Driving growth with <br />
            <span className="pc-gradient-text">precision & scale</span>
          </h2>
        </div>

        <div className="pc-grid">
          {data.map((item, index) => (
            <CounterCard key={index} item={item} delay={index * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}
