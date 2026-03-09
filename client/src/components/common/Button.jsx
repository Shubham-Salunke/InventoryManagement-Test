const Button = ({
  children,
  loading = false,
  className = "",
  variant = "primary",
  ...rest
}) => {
  const base =
    "w-full h-11 rounded-md font-medium transition disabled:opacity-60";

  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  return (
    <button
      {...rest}
      disabled={loading}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
