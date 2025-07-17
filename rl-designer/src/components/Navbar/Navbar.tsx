import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, easeOut } from 'framer-motion';

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

    return (
        <div className="navbar"> {/* Use header semantic tag */}
            <div className="navbar__container"> {/* Container for centering */}
                <div className="navbar__logo">
                    {/* Use NavLink for logo to link to home */}
                    <Link to="/" className="navbar__logo-link">
                        <span className="navbar__logo">RL Designer</span>
                    </Link>
                </div>
                <nav className="navbar__links">
                    <ul>
                        <AnimatedNavItem to="/">Home</AnimatedNavItem>
                        <AnimatedNavItem to="/about">About</AnimatedNavItem>
                        <AnimatedNavItem to="/my-collection">My Collection</AnimatedNavItem>
                        <AnimatedNavItem to="/explore">Explore</AnimatedNavItem>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Navbar;