import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { SIDEBAR_MENU } from "../config/sidebar.config";

const Sidebar = () => {
  const role = useSelector((state) => state.auth.role);
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const hasAccess = (roles = []) => roles.includes(role);

  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col">
      <div className="h-14 flex items-center px-6 font-bold text-xl">IMS</div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {SIDEBAR_MENU.map((item) => {
          if (!hasAccess(item.roles)) return null;

          // 🔹 Single link
          if (!item.children) {
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          }

          // 🔹 Dropdown section
          return (
            <div key={item.label}>
              <button
                onClick={() => toggleMenu(item.label)}
                className="w-full flex justify-between items-center px-3 py-2 rounded hover:bg-gray-800"
              >
                <span>{item.label}</span>
                <span>{openMenus[item.label] ? "▾" : "▸"}</span>
              </button>

              {openMenus[item.label] && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) =>
                    hasAccess(child.roles) ? (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded text-sm ${
                            isActive ? "bg-gray-700" : "hover:bg-gray-800"
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ) : null
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
