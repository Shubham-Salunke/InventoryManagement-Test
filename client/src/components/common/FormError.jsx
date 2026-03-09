const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <p className="text-sm text-red-500 mt-1" role="alert">
      {message}
    </p>
  );
};

export default FormError;
