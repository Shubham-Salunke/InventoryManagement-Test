import React from "react";
import { Search } from "lucide-react";

const DebounceSearch = ({
  value,
  onChange,
  placeholder = "Search...",
  width = "w-80",
}) => {
 
  return (
    <div
      className={`
        flex items-center border
        rounded-lg px-3 py-2
        bg-gray-50 ${width}
      `}
    >
      <Search
        size={18}
        className="text-gray-500"
      />

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="
          bg-transparent outline-none
          ml-2 w-full text-sm
        "
      />
    </div>
  );
};

/* MEMO → Prevent rerender if props same */
export default React.memo(
  DebounceSearch
);
