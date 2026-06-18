import React from 'react';
import './Terms.css'; // using the SAME CSS file

const Privacy = () => {
  return (
    <section className="terms">
      <div className="container">
        <header className="terms__header" data-aos="fade-up">
          <h1>Privacy Policy</h1>
          <p className="terms__meta">Last updated: November 25, 2025</p>
        </header>

        <div className="terms__content">
          <article className="terms__card" data-aos="fade-up" data-aos-delay="50">
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy explains how SOS Infrabulls (“we,” “our,” or
              “us”) collects, uses, and protects any information you provide
              when using this website.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="100">
            <h2>2. Information We May Collect</h2>
            <p>We may collect the following information if you choose to share it with us:</p>
            <ul className="terms__list">
              <li>Name and contact information (email, phone number).</li>
              <li>Details of your property interests or inquiries.</li>
              <li>Demographic information such as postcode and preferences.</li>
              <li>Technical data like IP address and browser type for website analytics.</li>
            </ul>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="150">
            <h2>3. How We Use This Information</h2>
            <p>
              We require this information to understand your needs and provide
              you with better service, including:
            </p>
            <ul className="terms__list">
              <li>Responding to your inquiries.</li>
              <li>Sending relevant project updates or marketing communications (if you have opted in).</li>
              <li>Improving our website and services.</li>
            </ul>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="200">
            <h2>4. Security</h2>
            <p>
              We are committed to ensuring that your information is secure.
              Suitable physical, electronic, and managerial procedures have
              been implemented to prevent unauthorized access or disclosure.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="250">
            <h2>5. Controlling Your Personal Information</h2>
            <p>
              We will not sell, distribute, or lease your personal information
              to third parties unless we have your permission or are required by
              law to do so.
            </p>
            <p>
              You may request details of the personal information we hold about
              you or ask for it to be corrected or deleted by contacting us via
              the details provided on our website.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="300">
            <h2>6. Links to Other Websites</h2>
            <p>
              Our website may contain links to other websites. Once you leave
              our site, we do not have control over that other website and
              cannot be responsible for the protection and privacy of any
              information you provide there.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="350">
            <h2>7. Updates to This Policy</h2>
            <p>
              We may change this policy from time to time by updating this page.
              You should check this page periodically to ensure you are happy
              with any changes.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="400">
            <h2>Contact</h2>
            <p>
              For any questions regarding this privacy policy, please contact us
              through the <strong>‘Contact Us’</strong> section available on our
              website.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
