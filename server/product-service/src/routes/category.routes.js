const router = require("express").Router();

const categoryController = require("../controllers/category.controller");
const validate = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  createCategorySchema,
  updateCategorySchema,
  listCategoriesSchema,
} = require("../validations/category.validation");



// Get all categories
router.get(
  "/getCategory",
  auth,
  role("ADMIN", "MANAGER"),
  validate(listCategoriesSchema, "query"),
  categoryController.getCategories
);

// Create category
router.post(
  "/createCategory",
  auth,
  role("ADMIN", "MANAGER"),
  validate(createCategorySchema),
  categoryController.createCategory
);

// Get by id
router.get(
  "/getById/:id",
  auth,
  role("ADMIN", "MANAGER"),
  categoryController.getCategoryById
);

// Update category
router.put(
  "/updateCategory/:id",
  auth,
  role("ADMIN", "MANAGER"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.patch(
  "/:id/status",
  auth,
  role("ADMIN", "MANAGER"),
  categoryController.updateCategoryStatus
);
// Soft delete
router.delete(
  "/deleteCategory/:id",
  auth,
  role("ADMIN", "MANAGER"),
  categoryController.deleteCategory
);


router.patch(
  "/restore/:id",
 auth,
  role("ADMIN", "MANAGER"),
  categoryController.restoreCategory
);
module.exports = router;
