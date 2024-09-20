import React from 'react';

type ButtonProps = {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  rounded?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ 
  size = 'medium',
  variant = 'primary',
  type = 'button',
  rounded = 'full',
  className = '',
  children, 
  onClick 
}) => {
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    danger: 'button-danger',
  };

  const roundedClasses = {
    none: 'rounded-none',
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <button
      type={type}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${roundedClasses[rounded]} 
        font-bold cursor-pointer border-none transition-all duration-200 ease-in-out
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;