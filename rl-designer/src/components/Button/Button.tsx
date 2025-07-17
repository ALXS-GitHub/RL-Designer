import React from 'react';
import './Button.scss';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent) => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    className?: string;
    disabled?: boolean; // Prop to control disabled state
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    size = "medium",
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = "",
    disabled,
}) => {
    const buttonClasses = [
        "button",
        `button--${variant}`,
        `button--${size}`,
        fullWidth ? "button--full-width" : "",
        isLoading ? "button--loading" : "",
        disabled ? "button--disabled" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    // Combine disabled from props with isLoading
    const isDisabled = disabled || isLoading;

    const handleClick = (event: React.MouseEvent) => {
        if (isDisabled) {
            event.preventDefault();
            return;
        }
        onClick?.(event);
    };

    return (
        <div className={buttonClasses} onClick={handleClick}>
            {isLoading && <span className="button__spinner"></span>}

            {!isLoading && leftIcon && (
                <span className="button__icon button__icon--left">
                    {leftIcon}
                </span>
            )}

            <span
                className={`button__text ${
                    isLoading ? "button__text--hidden" : ""
                }`}
            >
                {children}
            </span>

            {!isLoading && rightIcon && (
                <span className="button__icon button__icon--right">
                    {rightIcon}
                </span>
            )}
        </div>
    );
};

export default Button;