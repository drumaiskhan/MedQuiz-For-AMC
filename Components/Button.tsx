
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = "px-8 py-4 rounded-[1.25rem] font-bold transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.97] whitespace-nowrap text-sm tracking-tight";
  
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-black shadow-[0_10px_30px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.4)]",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.5)]",
    outline: "border-[1.5px] border-slate-200 text-slate-700 hover:bg-slate-50 bg-white hover:border-slate-300",
    ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
  };

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
