import "./Landing.css";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="landing-container">
      {/* Navigation */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <h1>EduConnect</h1>
          </div>
          <div className="header-buttons">
            <button
              className="login-btn"
              onClick={() => handleNavigation("/login")}
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Animated Background Elements */}
        <div className="animated-background">
          <div className="animated-line line-1"></div>
          <div className="animated-line line-2"></div>
          <div className="animated-line line-3"></div>
          <div className="animated-blob blob-1"></div>
          <div className="animated-blob blob-2"></div>
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <h2 className="hero-title">
            Connecting Students with Volunteer Educators
          </h2>
          <p className="hero-subtitle">
            Join our community to explore new subjects and enhance your skills
            with the help of passionate volunteers.
          </p>
          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => handleNavigation("/login")}
            >
              Get Started
            </button>
            <button
              className="secondary-btn"
              onClick={() => handleNavigation("/login")}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h3 className="section-title">Why Choose EduConnect?</h3>
        <p className="section-subtitle">
          Experience education that works for you
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h4>For Students</h4>
            <p>
              Access a wide range of subjects and learn at your own pace with
              dedicated volunteers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h4>For Volunteers</h4>
            <p>
              Share your knowledge and make a difference in students' lives with
              our intuitive platform.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h4>Global Community</h4>
            <p>
              Connect with students and educators from around the world and
              expand your horizons.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h3>Ready to Start Learning?</h3>
          <p>
            Join thousands of students and volunteers who trust EduConnect for
            their educational needs.
          </p>

          <ul className="cta-benefits">
            <li>
              <span className="check-icon">✓</span>
              <span>100% Free for students</span>
            </li>
            <li>
              <span className="check-icon">✓</span>
              <span>24/7 community support</span>
            </li>
            <li>
              <span className="check-icon">✓</span>
              <span>Secure and moderated platform</span>
            </li>
          </ul>

          <button
            className="cta-button"
            onClick={() => handleNavigation("/login")}
          >
            Create Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">🎓</span>
            <span>EduConnect</span>
          </div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} EduConnect. All rights reserved.
          </p>
          <div className="footer-links">
            <button
              onClick={() => handleNavigation("/privacy")}
              className="footer-link"
            >
              Privacy
            </button>
            <button
              onClick={() => handleNavigation("/terms")}
              className="footer-link"
            >
              Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
