import React from 'react';
import { BrowserRouter, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, easeOut } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Logo from '@/assets/logo.png';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import './Navbar.scss';

type NavbarProps = Record<string, never>;

interface AnimatedNavItemProps {
    children: React.ReactNode;
    to: string;
    className?: string;
};
  
const navItemVariants = {
    tap: {
      scale: 0.98,
    }
  };
  

const underlineVariants = {
    rest: {
    scaleX: 0,
    originX: 0.5,
    },
    hover: {
    scaleX: 1,
    originX: 0.5,
    transition: {
        type: "tween" as const,
        duration: 0.25,
        ease: easeOut,
    },
    },
};

const arrowBubbleVariants: Variants = {
    rest: {
        scale: 0,
        transition: {
            duration: 0.3,
            ease: easeOut
        }
    },
    hover: {
        scale: 1,
        transition: {
            duration: 0.3,
            ease: easeOut
        }
    }
};

const arrowIconVariants: Variants = {
    rest: {
        color: "var(--gray-600)",
        transition: {
            duration: 0.3
        }
    },
    hover: {
        color: "#ffffff",
        transition: {
            duration: 0.3
        }
    }
};

const ArrowButton: React.FC<{ onClick: () => void; icon: React.ReactNode }> = ({ onClick, icon }) => {
    return (
        <motion.button
            className="navbar__arrow"
            onClick={onClick}
            type="button"
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            variants={{
                tap: { scale: 0.95 }
            }}
        >
            <motion.span
                className="navbar__arrow-bubble"
                variants={arrowBubbleVariants}
            />
            <motion.span
                className="navbar__arrow-icon"
                variants={arrowIconVariants}
            >
                {icon}
            </motion.span>
        </motion.button>
    );
};
  
  const AnimatedNavItem: React.FC<AnimatedNavItemProps> = ({ children, to, className, ...rest }) => {
    return (
      <motion.li
        className={`navbar__nav-item ${className || ''}`}
        variants={navItemVariants}
        whileTap="tap"
        initial="rest"
        whileHover="hover"
        animate="rest" 
        {...rest}
        >
        <Link to={to}>
          {children}
          <motion.span
            className="navbar__underline"
            variants={underlineVariants}
            />
        </Link>
      </motion.li>
    );
  };

const Navbar: React.FC<NavbarProps> = () => {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    const handleForward = () => {
        navigate(1);
    }

    return (
        <div className="navbar">
            {/* Use header semantic tag */}
            <div className="navbar__container">
                {/* Container for centering */}
                <div className="navbar__left">
                    <div className="navbar__logo">
                        {/* Use NavLink for logo to link to home */}
                        <Link to="/" className="navbar__logo-link">
                            <img src={Logo} alt="RL Designer" className="navbar__logo-image" />
                            <span className="navbar__logo-text">RL Designer</span>
                        </Link>
                    </div>
                    <div className="navbar__arrows">
                        <ArrowButton onClick={handleBack} icon={<FaArrowLeft />} />
                        <ArrowButton onClick={handleForward} icon={<FaArrowRight />} />
                    </div>
                </div>
                <div className="navbar__links">
                    <ul>
                        <AnimatedNavItem to="/">Home</AnimatedNavItem>
                        <AnimatedNavItem to="/about">About</AnimatedNavItem>
                        <AnimatedNavItem to="/my-collection">
                            My Collection
                        </AnimatedNavItem>
                        <AnimatedNavItem to="/explore">Explore</AnimatedNavItem>
                        <AnimatedNavItem to="/how-to">How to</AnimatedNavItem>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;