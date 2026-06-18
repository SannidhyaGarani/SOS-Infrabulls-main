import "./ChooseUs.css"

function ChooseUs() {    
    return (
        <section className="choose-us-section">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Why Choose Us</div>
                    <h2 className="section-title">Our Core Values</h2>
                    <p className="section-subtitle">Discover what makes SOS Infrabulls your trusted partner in real estate</p>
                </div>
                
                <div className="cards-grid">
                    {/* SECURITY Card */}
                    <div className="value-card">
                        <div className="card-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L4 6V12C4 16.5 6.84 20.74 12 22C17.16 20.74 20 16.5 20 12V6L12 2Z" stroke="#1174d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9 12L11 14L15 10" stroke="#1174d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="card-title">Security</h3>
                        <p className="card-description">
                            At SOS we understand that buying a property is a significant investment. That's why we prioritize the security of the investment made by our clients in SOS properties. We take every measure to ensure that your investment is safe and secure, from conducting thorough property inspections to providing transparent and accurate financial reporting.
                        </p>
                    </div>

                    {/* OPPORTUNITY Card */}
                    <div className="value-card">
                        <div className="card-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#ffd782" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="card-title">Opportunity</h3>
                        <p className="card-description">
                            We believe in providing our clients with the opportunity for growth and success. We're passionate about helping people who have invested in our properties achieve their financial goals and maximize their profits. Whether you're looking for long-term rental income or short-term returns on your investment, we'll work with you to create a strategy that meets your needs.
                        </p>
                    </div>

                    {/* SINCERITY Card */}
                    <div className="value-card">
                        <div className="card-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#1174d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="card-title">Sincerity</h3>
                        <p className="card-description">
                            We understand the importance of trust and transparency in the real estate industry. We works closely with you to ensure that your investment aligns with your financial goals and that you have a clear understanding of the risks and rewards involved. With SOS Real Estate, you can trust that we'll always act in your best interests and with the utmost sincerity.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ChooseUs
