import DashboardLayout from "../../components/layout/DashboardLayout";

const Dashboard = () => {
  return (
   <div>
      <h2 className="text-2xl font-semibold mb-6">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Products</p>
          <h3 className="text-2xl font-bold">0</h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Low Stock Items</p>
          <h3 className="text-2xl font-bold text-red-500">0</h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Active Users</p>
          <h3 className="text-2xl font-bold">0</h3>
        </div>
      </div>
 </div>
  );
};

export default Dashboard;
