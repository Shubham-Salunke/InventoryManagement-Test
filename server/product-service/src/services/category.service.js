const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");

exports.createCategory = async (data, userId) => {
  if (!data.name) {
    throw new ApiError(400, "Category name is required");
  }

  try {
    const category = await Category.create({
      ...data,
      createdBy: userId,
    });

    return category;
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, "Category with this name already exists");
    }
    throw err;
  }
};

exports.getCategories = async (filters = {}) => {
  /* =====================================================
     1️⃣ Extract & Normalize Query Params
  ===================================================== */
  let {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    status = "ALL",
  } = filters;

  page = Math.max(Number(page) || 1, 1);
  limit = Math.max(Number(limit) || 10, 1);

  status = String(status).toUpperCase();

  /* =====================================================
     2️⃣ Build Match Stage
  ===================================================== */
  const matchStage = {};

  // Only apply filter if not ALL
  if (status === "ALL") {
    matchStage.status = { $ne: "DELETED" };
  } else {
    matchStage.status = status;
  }

  if (search?.trim()) {
    matchStage.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  /* =====================================================
     3️⃣ Sorting
  ===================================================== */
  const sortStage = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  /* =====================================================
     4️⃣ Aggregation Pipeline
  ===================================================== */
  const pipeline = [
    { $match: matchStage },
    { $sort: sortStage },
    {
      $facet: {
        items: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
    {
      $project: {
        items: 1,
        total: {
          $ifNull: [
            { $arrayElemAt: ["$totalCount.count", 0] },
            0,
          ],
        },
      },
    },
  ];

  /* =====================================================
     5️⃣ Execute Query
  ===================================================== */
  const [result] = await Category.aggregate(pipeline);

  const total = result?.total || 0;
  const totalPages =
    total > 0 ? Math.ceil(total / limit) : 1;

  /* =====================================================
     6️⃣ Final Response
  ===================================================== */
  return {
    items: result?.items || [],
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/* ---------------- GET BY ID ---------------- */
exports.getCategoryById = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

/* ---------------- UPDATE ---------------- */
exports.updateCategory = async (id, data, userId) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Invalid category payload");
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { ...data, updatedBy: userId },
    { new: true, runValidators: true },
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

exports.updateCategoryStatus = async (id, status, userId) => {
  const allowedStatuses = ["ACTIVE", "INACTIVE", "ARCHIVED"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const category = await Category.findByIdAndUpdate(
    id,
    {
      status,
      updatedBy: userId,
    },
    { new: true },
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

exports.deleteCategory = async (id, userId) => {

  const category = await Category.findOne({
    _id: id,
    status: { $ne: "DELETED" }
  });

  if (!category) {
    throw new ApiError(
      404,
      "Category not found or already deleted"
    );
  }

  // 🔥 Lifecycle-safe update
  category.previousStatus = category.status;
  category.status = "DELETED";
  category.deletedBy = userId;
  category.deletedAt = new Date();
  category.updatedBy = userId;

  await category.save(); // runs validators + hooks

  return category;
};
exports.restoreCategory = async (id, userId) => {

  // 1️⃣ Find deleted category
  const category = await Category.findOne({
    _id: id,
    status: "DELETED"
  });

  if (!category) {
    throw new ApiError(
      404,
      "Category not found or not deleted"
    );
  }

  // 2️⃣ Restore to previous status (fallback ACTIVE)
  category.status = category.previousStatus;

  category.previousStatus = null;
  category.deletedBy = null;
  category.deletedAt = null;
  category.updatedBy = userId;

  await category.save();

  return category;
};