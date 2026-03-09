const productService = require("../services/product.service");
const asyncHandler = require("../middlewares/asyncHandler");

const createProduct = asyncHandler(async (req, res) => {

  const product = await productService.createProduct(req.body, req.user.id);

  res.status(201).json({
    success: true,
    data: product,
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);
  res.json({
    success: true,
    data: result.items,
    meta: result.meta,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id, req.user.id);
  res.json({
    success: true,
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.user.id);
  res.json({
    success: true,
    data: product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  res.json({
    success: true,
    data: product,
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

