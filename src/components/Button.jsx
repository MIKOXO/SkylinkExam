import { motion } from "framer-motion";
import { buttonHover, buttonTap } from "../utils/animations";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed transition-colors
  `;

  const variants = {
    primary: `
      text-white bg-primary-600 border border-transparent 
      hover:bg-primary-700 focus:ring-primary-500
    `,
    secondary: `
      text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 
      border border-gray-300 dark:border-gray-600 
      hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-gray-500
    `,
    danger: `
      text-white bg-red-600 border border-transparent 
      hover:bg-red-700 focus:ring-red-500
    `,
    ghost: `
      text-gray-500 dark:text-gray-400 bg-transparent border-none
      hover:text-primary-600 dark:hover:text-primary-400 focus:ring-primary-500
    `,
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
      whileHover={!disabled ? buttonHover : {}}
      whileTap={!disabled ? buttonTap : {}}
      {...props}
    >
      {loading && (
        <motion.svg
          className="w-4 h-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </motion.svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
