import React from 'react';

type InputProps = {
  id?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'danger';
  type?: 'text' | 'password' | 'email' | 'number' | 'file';
  rounded?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  placeholder?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly?: boolean; // readonly プロパティを追加
};

const Input: React.FC<InputProps> = ({ 
  id,
  size = 'medium',
  variant = 'primary',
  type = 'text',
  rounded = 'md',
  placeholder = '',
  className = '',
  leftIcon, 
  rightIcon,
  value,
  onChange,
  readonly = false // デフォルトは false
}) => {
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'input-primary',
    danger: 'input-danger',
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
    <div className={`flex items-center border transition-all duration-200 ease-in-out ${className} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses[rounded]} ${readonly ? 'cursor-not-allowed' : ''}`}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      <input
        id={id}
        type={type}
        value={type !== 'file' ? value : undefined}
        onChange={!readonly ? onChange : undefined}
        placeholder={type !== 'file' ? placeholder : undefined}
        className={`w-full outline-none ${readonly ? 'cursor-not-allowed' : ''}`}
        readOnly={readonly}
      />
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </div>
  );
};

export default Input;