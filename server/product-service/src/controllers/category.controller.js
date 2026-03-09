const categoryService = require("../services/category.service");
const asyncHandler = require("../middlewares/asyncHandler");

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(
    req.body,
    req.user.id
  );

  res.status(201).json({
    success: true,
    data: category,
  });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategories(req.query);

  res.json({
    success: true,
    data: result.items,
    meta: result.meta,
  });
});

exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  res.json({
    success: true,
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body,
    req.user.id
  );

  res.json({
    success: true,
    data: category,
  });
});

exports.updateCategoryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const category = await categoryService.updateCategoryStatus(
    req.params.id,
    status,
    req.user.id
  );

  res.json({
    success: true,
    message: "Category status updated successfully",
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.deleteCategory(
    req.params.id,
    req.user.id
  );

  res.json({
    success: true,
    data: category,
  });
});


exports.restoreCategory = asyncHandler(async (req, res) => {

  const category =
    await categoryService.restoreCategory(
      req.params.id,
      req.user.id
    );

  res.json({
    success: true,
    message: "Category restored successfully",
    data: category,
  });
});
