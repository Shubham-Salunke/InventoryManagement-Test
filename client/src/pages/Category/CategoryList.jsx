import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  RotateCcw,
} from "lucide-react";

const CategoryList = ({
  categories = [],
  loading,
  onEdit,
  onDelete,
  onStatusChange,
  onRestore,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-10 text-center text-sm">
        Loading...
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-10 text-center text-sm text-gray-500">
        No categories found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

      {/* Header */}
      <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b bg-gray-50 text-sm font-medium text-gray-600">
        <div>Name</div>
        <div>Products</div>
        <div>Status</div>
        <div className="text-center col-span-2">
          Action
        </div>
      </div>

      {categories.map((cat) => {
        const isDeleted =
          cat.status === "DELETED";

        return (
          <div
            key={cat._id}
            className="border-b last:border-none"
          >
            <div className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition">

              {/* NAME */}
              <div className="flex items-center gap-2 font-medium text-gray-800">
                {cat.children?.length ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                {cat.name}
              </div>

              {/* PRODUCTS */}
              <div className="text-sm text-gray-600">
                {cat.productsCount || 0}
              </div>

              {/* STATUS */}
              <div>
                <select
                  disabled={isDeleted}
                  value={cat.status}
                  onChange={(e) =>
                    onStatusChange(
                      cat._id,
                      e.target.value
                    )
                  }
                  className="border rounded-lg px-3 py-1 text-sm bg-gray-50 disabled:opacity-60"
                >
                  <option value="ACTIVE">
                    Active
                  </option>
                  <option value="INACTIVE">
                    Inactive
                  </option>
                  <option value="ARCHIVED">
                    Archived
                  </option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 justify-center col-span-2">

                {!isDeleted ? (
                  <>
                    <button
                      onClick={() =>
                        onEdit(cat)
                      }
                      className="bg-indigo-100 text-indigo-600 p-2 rounded-lg hover:bg-indigo-200 transition"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(cat._id)
                      }
                      className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      onRestore(cat._id)
                    }
                    className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;