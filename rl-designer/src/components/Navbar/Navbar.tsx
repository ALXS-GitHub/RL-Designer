import React, { useState } from 'react';
import { BrowserRouter, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, easeOut } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Logo from '@/assets/logo.png';
import { FaArrowLeft, FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import type { DropdownItem } from '@/components/DropdownMenu/Dropdown';

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleBack = () => {
        navigate(-1);
    }

    const handleForward = () => {
        navigate(1);
    }

    type NavigationItem = DropdownItem & {
        route: string;
    };

    const navigationItems: NavigationItem[] = [
        {
            children: <div>Home</div>,
            route: '/',
            onClick: () => {
                navigate('/');
                setIsMobileMenuOpen(false);
            }
        },
        {
            children: <div>About</div>,
            route: '/about',
            onClick: () => {
                navigate('/about');
                setIsMobileMenuOpen(false);
            }
        },
        {
            children: <div>My Collection</div>,
            route: '/my-collection',
            onClick: () => {
                navigate('/my-collection');
                setIsMobileMenuOpen(false);
            }
        },
        {
            children: <div>Explore</div>,
            route: '/explore',
            onClick: () => {
                navigate('/explore');
                setIsMobileMenuOpen(false);
            }
        },
        {
            children: <div>How to</div>,
            route: '/how-to',
            onClick: () => {
                navigate('/how-to');
                setIsMobileMenuOpen(false);
            }
        }
    ];

    return (
        <div className="navbar">
            <div className="navbar__container">
                <div className="navbar__left">
                    <div className="navbar__logo">
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
                
                {/* Desktop Navigation */}
                <div className="navbar__links navbar__links--desktop">
                    <ul>
                        {navigationItems.map((item) => (
                            <AnimatedNavItem
                                key={item.route}
                                to={item.route}
                            >
                                {item.children}
                            </AnimatedNavItem>
                        ))}
                    </ul>
                </div>

                {/* Mobile Navigation */}
                <div className="navbar__links navbar__links--mobile">
                    <DropdownMenu
                        items={navigationItems}
                        isOpen={isMobileMenuOpen}
                        setIsOpen={setIsMobileMenuOpen}
                        button={
                            <div
                                className="navbar__burger"
                            >
                                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </div>
                        }
                        dropdownClassName="navbar__mobile-dropdown"
                    />
                </div>
            </div>
        </div>
    );
}

export default Navbar;