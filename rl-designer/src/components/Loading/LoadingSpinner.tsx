import React from 'react';
import './LoadingSpinner.scss';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type SpinnerVariant = 'default' | 'gradient' | 'dots';
type SpinnerPosition = 'default' | 'centered' | 'inline' | 'overlay';

interface LoadingSpinnerProps {
    size?: SpinnerSize | number;
    color?: SpinnerColor;
    variant?: SpinnerVariant;
    position?: SpinnerPosition;
    text?: string;
    showText?: boolean;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'md',
    color = 'primary',
    variant = 'default',
    position = 'default',
    text = 'Loading...',
    showText = false,
    className = ''
}) => {
    const getClassNames = () => {
        const classes = ['loading-spinner'];
        
        if (typeof size === 'string') {
            classes.push(`loading-spinner--${size}`);
        }
        
        classes.push(`loading-spinner--${color}`);
        
        if (variant !== 'default') {
            classes.push(`loading-spinner--${variant}`);
        }
        
        if (position !== 'default') {
            classes.push(`loading-spinner--${position}`);
        }
        
        if (!showText) {
            classes.push('loading-spinner--no-text');
        }
        
        if (className) {
            classes.push(className);
        }
        
        return classes.join(' ');
    };

    const getStyle = () => {
        if (typeof size === 'number') {
            return { width: size, height: size };
        }
        return {};
    };

    return (
        <div className={getClassNames()} style={getStyle()}>
            <div className={`spinner ${variant === 'gradient' ? 'gradient' : ''}`}></div>
            {showText && <div className="loading-text">{text}</div>}
        </div>
    );
};

export default LoadingSpinner;