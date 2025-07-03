import PasswordInput from './PasswordInput';

const FormField = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  required = false,
  showPasswordStrength = false,
  className = '',
}) => {
  const baseInputClasses = `
    mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
    dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors
  `;

  const errorClasses = error 
    ? 'border-red-300 dark:border-red-600' 
    : 'border-gray-300 dark:border-gray-600';

  const inputClasses = `${baseInputClasses} ${errorClasses} ${className}`.trim();

  return (
    <div>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'password' ? (
        <PasswordInput
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={inputClasses}
          error={error}
          showStrengthIndicator={showPasswordStrength}
        />
      ) : type === 'textarea' ? (
        <>
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClasses}
            rows={12}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </>
      ) : (
        <>
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className={inputClasses}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </>
      )}
    </div>
  );
};

export default FormField;
