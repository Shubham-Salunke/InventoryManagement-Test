export const SIDEBAR_MENU = [
  {
    label: "Dashboard",
    path: "/",
    roles: ["ADMIN", "MANAGER", "STAFF"],
  },

  {
    label: "User Management",
    roles: ["ADMIN", "MANAGER"],
    children: [
      { label: "Invite User", path: "/invite", roles: ["ADMIN", "MANAGER"] },
      { label: "Users", path: "/users", roles: ["ADMIN"] },
    ],
  },

  {
    label: "Inventory",
    roles: ["ADMIN", "MANAGER", "STAFF"],
    children: [
      { label: "Products", path: "/products", roles: ["ADMIN", "MANAGER"] },
      { label: "Categories", path: "/categories", roles: ["ADMIN", "MANAGER"] },
      { label: "Stock",path: "/inventory",roles: ["ADMIN", "MANAGER", "STAFF"]},
    ],
  },
];
