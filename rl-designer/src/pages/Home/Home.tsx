import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

import Requirements from '@/pages/HowTo/Sections/Requirements';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__title">
            <span className="home__title-main">RL Designer</span>
          </h1>
          <p className="home__subtitle">
            Create, explore, and install custom decals for your Rocket League cars
          </p>
          <div className="home__cta-buttons">
            <Link to="/explore" className="home__cta-primary">
              Explore Decals
            </Link>
            <Link to="/my-collection" className="home__cta-secondary">
              My Collection
            </Link>
          </div>
        </div>
        <div className="home__hero-image">
          <div className="home__car-preview">
            🚗
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home__features">
        <div className="home__container">
          <h2 className="home__section-title">What can you do?</h2>
          <div className="home__features-grid">
            <div className="home__feature-card">
              <div className="home__feature-icon">🎨</div>
              <h3 className="home__feature-title">Design Custom Decals</h3>
              <p className="home__feature-description">
                Create unique decals for your Rocket League cars with our intuitive designer
              </p>
            </div>
            <div className="home__feature-card">
              <div className="home__feature-icon">🔍</div>
              <h3 className="home__feature-title">Explore Community Decals</h3>
              <p className="home__feature-description">
                Browse and download decals created by the community for different car models
              </p>
            </div>
            <div className="home__feature-card">
              <div className="home__feature-icon">📱</div>
              <h3 className="home__feature-title">Easy Installation</h3>
              <p className="home__feature-description">
                One-click installation directly to your AlphaConsole directory
              </p>
            </div>
            <div className="home__feature-card">
              <div className="home__feature-icon">🗂️</div>
              <h3 className="home__feature-title">Manage Your Collection</h3>
              <p className="home__feature-description">
                Organize, view, and manage all your installed decals in one place
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="home__how-it-works">
        <div className="home__container">
          <h2 className="home__section-title">How it works</h2>
          <div className="home__steps">
            <div className="home__step">
              <div className="home__step-number">1</div>
              <div className="home__step-content">
                <h3 className="home__step-title">Browse Decals</h3>
                <p className="home__step-description">
                  Explore our collection of community-created decals for various car models
                </p>
              </div>
            </div>
            <div className="home__step">
              <div className="home__step-number">2</div>
              <div className="home__step-content">
                <h3 className="home__step-title">Preview & Choose</h3>
                <p className="home__step-description">
                  See how decals look on different cars and select your favorites
                </p>
              </div>
            </div>
            <div className="home__step">
              <div className="home__step-number">3</div>
              <div className="home__step-content">
                <h3 className="home__step-title">Install & Play</h3>
                <p className="home__step-description">
                  Download and install decals directly to your AlphaConsole directory
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <Requirements />

      {/* CTA Section */}
      <section className="home__cta">
        <div className="home__container">
          <h2 className="home__cta-title">Ready to customize your ride?</h2>
          <p className="home__cta-description">
            Start exploring amazing decals created by the community
          </p>
          <Link to="/explore" className="home__cta-button">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;