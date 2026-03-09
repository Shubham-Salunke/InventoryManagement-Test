const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  className = "",
  ...rest
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
        className={`
          w-full h-11 px-3
          border rounded-md
          outline-none
          transition
          focus:ring-2 focus:ring-blue-500
          focus:border-blue-500
          ${className}
        `}
      />
    </div>
  );
};

export default Input;
