import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

type SelectProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  size?: 'small' | 'medium' | 'large';
  rounded?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  placeholder?: string;
};

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  size = 'medium',
  rounded = 'md',
  className = '',
  placeholder
}) => {
  const sizeClasses = {
    small: 'px-2 py-1.5 text-sm',
    medium: 'px-3 py-2.5 text-base',
    large: 'px-4 py-3.5 text-lg',
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
    <div className={`relative inline-block ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className={`
            ${sizeClasses[size]} 
            ${roundedClasses[rounded]} 
            transition-all duration-200 ease-in-out
            select border focus-visible:border-primary
            w-full
        `}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
    </div>
  );
};

export default Select;