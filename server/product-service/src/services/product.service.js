const Product = require("../models/product.model");
const Category = require("../models/category.model"); // ✅ NEW
const ApiError = require("../utils/ApiError");

/* ---------------- CREATE ---------------- */
const createProduct = async (data, userId) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Invalid product payload");
  }

  if (!data.sku) {
    throw new ApiError(400, "SKU is required");
  }

  if (!data.category) {
    throw new ApiError(400, "Category is required");
  }

  // 🔹 Validate category existence & status
  const categoryExists = await Category.findOne({
    _id: data.category,
    isActive: true,
  });

  if (!categoryExists) {
    throw new ApiError(400, "Invalid or inactive category");
  }

  // 🔹 Normalize SKU
  data.sku = data.sku.toUpperCase();

  try {
    const product = await Product.create({
      ...data,
      createdBy: userId,
    });

    return product;

  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, "Product with this SKU already exists");
    }
    throw err;
  }
};

/* ---------------- LIST ---------------- */
const getProducts = async (filters) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    sortBy = "createdAt",
    sortOrder = "desc",
    includeInactive = false,
  } = filters;

  const matchStage = {};

  if (!includeInactive) {
    matchStage.isActive = true;
  }

  // 🔹 Category filter (ObjectId)
  if (category) {
    matchStage.category = category;
  }

  // 🔹 Search
  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  const sortStage = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const pipeline = [
    { $match: matchStage },

    { $sort: sortStage },

    {
      $facet: {
        items: [
          { $skip: (page - 1) * limit },
          { $limit: Number(limit) },
        ],
        totalCount: [{ $count: "count" }],
      },
    },

    {
      $project: {
        items: 1,
        total: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
        },
      },
    },
  ];

  const [result] = await Product.aggregate(pipeline);

  return {
    items: result.items,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total: result.total,
      totalPages: Math.ceil(result.total / limit) || 1,
    },
  };
};

/* ---------------- GET BY ID ---------------- */
const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate("category", "name"); // ✅ populate category

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

/* ---------------- UPDATE ---------------- */
const updateProduct = async (id, data, userId) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Invalid product payload");
  }

  if (data.sku) {
    data.sku = data.sku.toUpperCase();
  }

  // 🔹 If category is being changed → validate again
  if (data.category) {
    const categoryExists = await Category.findOne({
      _id: data.category,
      isActive: true,
    });

    if (!categoryExists) {
      throw new ApiError(400, "Invalid or inactive category");
    }
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { ...data, updatedBy: userId },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

/* ---------------- DELETE (SOFT) ---------------- */
const deleteProduct = async (id, userId) => {
  const product = await Product.findByIdAndUpdate(
    id,
    {
      isActive: false,
      deletedBy: userId,
      deletedAt: new Date(),
    },
    { new: true }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
