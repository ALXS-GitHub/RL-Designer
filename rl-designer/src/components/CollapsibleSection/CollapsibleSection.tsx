import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import './CollapsibleSection.scss';
import type { Variants } from 'framer-motion'

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  const headerVariants: Variants = {
    closed: {
      transition: {
        duration: 0.3
      }
    },
    open: {
      transition: {
        duration: 0.3
      }
    }
  };

  const contentVariants: Variants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          duration: 0.3,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.2,
          ease: "easeInOut"
        }
      }
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: 0.3,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.3,
          delay: 0.1,
          ease: "easeInOut"
        }
      }
    }
  };

  const arrowVariants: Variants = {
    closed: {
      rotate: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      rotate: 180,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`collapsible-section ${className}`}>
      {/* Header */}
      <motion.div
        className="collapsible-section__header"
        onClick={toggleSection}
        variants={headerVariants}
        animate={isOpen ? "open" : "closed"}
        whileHover={{ backgroundColor: "var(--gray-50)" }}
        whileTap={{ scale: 0.98 }}
      >
        <h2 className="collapsible-section__title">{title}</h2>
        
        <motion.div
          className="collapsible-section__arrow"
          variants={arrowVariants}
          animate={isOpen ? "open" : "closed"}
        >
          <FaChevronUp />
        </motion.div>
      </motion.div>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="collapsible-section__content"
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ overflow: "hidden" }}
          >
            <div className="collapsible-section__content-inner">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection;