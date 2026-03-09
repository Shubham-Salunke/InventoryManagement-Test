const router = require("express").Router();
const productController = require("../controllers/product.controller");
const validate = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
} = require("../validations/product.validation");

// Everyone with a valid login (ADMIN, MANAGER, STAFF) can see products
router.get(
  "/getProduct",
  auth,
  role("ADMIN", "MANAGER", "STAFF"),
  validate(listProductsSchema, "query"),
  productController.getProducts
);
// Only ADMIN and MANAGER can create
router.post(
  "/createProduct",
  auth,
  role("ADMIN", "MANAGER"),
  validate(createProductSchema),
  productController.createProduct
);

router.get(
  "/getById/:id",
  auth,
  role("ADMIN", "MANAGER", "STAFF"),
  productController.getProductById
);
// Update – only ADMIN and MANAGER
router.put(
  "/updateProduct/:id",
  auth,
  role("ADMIN", "MANAGER"),
  validate(updateProductSchema),
  productController.updateProduct
);
// Soft-delete – only ADMIN and MANAGER
router.delete(
  "/deleteProduct/:id",
  auth,
  role("ADMIN", "MANAGER"),
  productController.deleteProduct
);

module.exports = router;
