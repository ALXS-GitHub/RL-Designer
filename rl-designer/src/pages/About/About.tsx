import React from 'react';
import { Link } from 'react-router-dom';
import './About.scss';
import FrenchFlag from '@/assets/french-flag.png';

const About = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about__hero">
        <div className="about__container">
          <div className="about__hero-content">
            <h1 className="about__title">About RL Designer</h1>
            <p className="about__subtitle">
              Born from a passion for creativity and sharing amazing designs with friends
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about__story">
        <div className="about__container">
          <div className="about__story-content">
            <h2 className="about__section-title">Why I Created This Project</h2>
            <div className="about__story-text">
              <p>
                Hi there! I'm ALXS, and I created RL Designer because I wanted an easy way to share my custom decals with my friends. 
                As someone who loves creating unique designs for Rocket League, I found it frustrating that there wasn't a simple way 
                to distribute and manage custom decals.
              </p>
              <p>
                What started as a personal tool to share my creations with friends has evolved into a platform where anyone can 
                discover, download, and install amazing community-made decals. The goal is to make custom decals accessible to 
                everyone, whether you're a designer or just someone who loves customizing their cars.
              </p>
              <p>
                This project is all about community, creativity, and making the Rocket League experience even more personalized. 
                I hope you find some amazing decals here and maybe even contribute your own designs!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contribute Section */}
      <section className="about__contribute">
        <div className="about__container">
          <h2 className="about__section-title">Want to Contribute?</h2>
          <div className="about__contribute-content">
            <div className="about__contribute-card">
              <div className="about__contribute-icon">🎨</div>
              <h3 className="about__contribute-title">Submit Your Designs</h3>
              <p className="about__contribute-description">
                Anyone can submit their own decal designs to be featured in the app. 
                Share your creativity with the community! 
                Just make a pull request on our GitHub repository with your decal files and a brief description.
              </p>
              <a 
                href="https://github.com/ALXS-GitHub/RL-Designer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="about__contribute-link"
              >
                Submit on GitHub
              </a>
            </div>
            <div className="about__contribute-card">
              <div className="about__contribute-icon">📚</div>
              <h3 className="about__contribute-title">Learn How to Create</h3>
              <p className="about__contribute-description">
                New to creating decals? Check out our comprehensive tutorial on how to create 
                and structure your files properly for submission.
              </p>
              <Link to="/how-to" className="about__contribute-link">
                View Tutorial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="about__contact">
        <div className="about__container">
          <h2 className="about__section-title">Get in Touch</h2>
          <div className="about__contact-content">
            <div className="about__contact-card">
              <h3 className="about__contact-title">Contact Information</h3>
              <div className="about__contact-details">
                <div className="about__contact-item">
                  <span className="about__contact-label">Epic Games:</span>
                  <span className="about__contact-value">ALXS_RL</span>
                </div>
                <div className="about__contact-item">
                  <span className="about__contact-label">Email:</span>
                  <a href="mailto:alxs.rocketleague@gmail.com" className="about__contact-value about__contact-link">
                    alxs.rocketleague@gmail.com
                  </a>
                </div>
                <div className="about__contact-item">
                  <span className="about__contact-label">Location:</span>
                  <span className="about__contact-value">France 
                    <img src={FrenchFlag} alt="French flag" className="about__flag-icon" />
                  </span>
                </div>
              </div>
            </div>
            <div className="about__contact-message">
              <h4 className="about__contact-message-title">Thank You!</h4>
              <p className="about__contact-message-text">
                Thank you for using RL Designer and for contributing to the community. 
                Whether you're downloading decals, creating your own designs, or just spreading 
                the word, every contribution helps make this project better for everyone.
              </p>
              <p className="about__contact-message-text">
                Feel free to reach out with any questions, suggestions, or just to share 
                your amazing creations!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about__cta">
        <div className="about__container">
          <h2 className="about__cta-title">Ready to Start Creating?</h2>
          <p className="about__cta-description">
            Explore our collection of decals or learn how to create your own
          </p>
          <div className="about__cta-buttons">
            <Link to="/explore" className="about__cta-button about__cta-primary">
              Explore Decals
            </Link>
            <Link to="/how-to" className="about__cta-button about__cta-secondary">
              Learn to Create
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;