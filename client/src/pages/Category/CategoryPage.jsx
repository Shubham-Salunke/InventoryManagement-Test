import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchCategories,
  deleteCategory,
  updateCategoryStatus,
  restoreCategory,
} from "../../features/category/categorySlice";

import { FiPlus } from "react-icons/fi";

import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import DebounceSearch from "../../components/common/DebounceSearch";
import useDebounce from "../../hooks/useDebounce";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import {
  showSuccess,
  showError,
} from "../../components/common/toast.utils";

export default function CategoryPage() {
  const dispatch = useDispatch();

  const { categories, meta, loading } =
    useSelector((s) => s.category);

  /* ================= STATE ================= */

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [openModal, setOpenModal] =
    useState(false);

  const [editData, setEditData] =
    useState(null);

  const debouncedSearch = useDebounce(search, 500);

  /* ================= FETCH ================= */

  const fetchData = useCallback(() => {
    dispatch(
      fetchCategories({
        search: debouncedSearch,
        page,
        limit: 3,
        status: statusFilter,
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    page,
    statusFilter,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= HANDLERS ================= */

  const handleSearchChange =
    useCallback((value) => {
      setSearch(value);
      setPage(1);
    }, []);

  const handlePageChange =
    useCallback((p) => {
      setPage(p);
    }, []);

  const handleOpenCreate =
    useCallback(() => {
      setEditData(null);
      setOpenModal(true);
    }, []);

  const handleEdit = useCallback(
    (category) => {
      setEditData(category);
      setOpenModal(true);
    },
    []
  );

  const handleCloseModal =
    useCallback(() => {
      setOpenModal(false);
      setEditData(null);
    }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Delete category?"))
        return;

      try {
        await dispatch(
          deleteCategory(id)
        ).unwrap();

        showSuccess("Category deleted");
        fetchData();
      } catch (err) {
        showError(err);
      }
    },
    [dispatch, fetchData]
  );

  const handleRestore = useCallback(
    async (id) => {
      if (
        !window.confirm(
          "Restore this category?"
        )
      )
        return;

      try {
        await dispatch(
          restoreCategory(id)
        ).unwrap();

        showSuccess("Category restored");
        fetchData();
      } catch (err) {
        showError(err);
      }
    },
    [dispatch, fetchData]
  );

  const handleStatusChange =
    useCallback(
      async (id, status) => {
        try {
          await dispatch(
            updateCategoryStatus({
              id,
              status,
            })
          ).unwrap();

          showSuccess(
            "Status updated successfully"
          );
        } catch (err) {
          showError(err);
        }
      },
      [dispatch]
    );

  const handleFormSuccess =
    useCallback(() => {
      handleCloseModal();
      fetchData();
    }, [handleCloseModal, fetchData]);

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">
          Categories
        </h1>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FiPlus />
          New Category
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white p-4 rounded-xl shadow border mb-4 flex gap-3">
        <DebounceSearch
          value={search}
          onChange={handleSearchChange}
          placeholder="Search category..."
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded-lg bg-gray-50"
        >
          <option value="ALL">
            All
          </option>
          <option value="ACTIVE">
            Active
          </option>
          <option value="INACTIVE">
            Inactive
          </option>
          <option value="DELETED">
            Deleted
          </option>
        </select>
      </div>

      {/* List */}
      <CategoryList
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onStatusChange={handleStatusChange}
      />

      {/* Pagination */}
      <Pagination
        page={meta?.page || 1}
        limit={meta?.limit || 3}
        total={meta?.total || 0}
        onPageChange={handlePageChange}
      />

      {/* Modal */}
      <Modal
        isOpen={openModal}
        onClose={handleCloseModal}
        title={
          editData
            ? "Update Category"
            : "Create Category"
        }
      >
        <CategoryForm
          editData={editData}
          onSuccess={handleFormSuccess}
        />
      </Modal>
    </div>
  );
}