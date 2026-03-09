import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-lg",
}) {
  /* ---------------- ESC CLOSE ---------------- */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener(
        "keydown",
        handleEsc
      );
    }

    return () =>
      document.removeEventListener(
        "keydown",
        handleEsc
      );
  }, [isOpen, onClose]);

  /* ---------------- PREVENT SCROLL ---------------- */
  useEffect(() => {
    document.body.style.overflow =
      isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        onClick={onClose}
        className="
          absolute inset-0
          bg-black/40 backdrop-blur-sm
          transition-opacity
        "
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white
          w-full ${width}
          mx-4
          rounded-2xl
          shadow-2xl
          animate-fadeIn
          flex flex-col
          max-h-[90vh]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              p-2 rounded-lg
              hover:bg-gray-100
              transition
            "
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
