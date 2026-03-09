const Joi = require("joi");

const baseProductSchema = {
  name: Joi.string().trim().min(2).max(100),
  sku: Joi.string().trim().alphanum().min(3).max(30),

  description: Joi.string().allow("").max(500),

  category: Joi.string()
    .trim()
    .required(), // must be ObjectId string

  brand: Joi.string().trim().max(50).allow("", null),

  unitOfMeasure: Joi.string()
    .valid("pcs", "kg", "ltr")
    .default("pcs"),

  costPrice: Joi.number().min(0),
  sellingPrice: Joi.number().min(0),

  taxRate: Joi.number().min(0).default(0),

  barcode: Joi.string().trim().allow("", null),

  isActive: Joi.boolean(),
};

/* ---------------- CREATE ---------------- */
const createProductSchema = Joi.object({
  name: baseProductSchema.name.required(),
  sku: baseProductSchema.sku.required(),
  description: baseProductSchema.description,

  category: baseProductSchema.category.required(),

  brand: baseProductSchema.brand,
  unitOfMeasure: baseProductSchema.unitOfMeasure,

  costPrice: baseProductSchema.costPrice.required(),
  sellingPrice: baseProductSchema.sellingPrice.required(),

  taxRate: baseProductSchema.taxRate,
  barcode: baseProductSchema.barcode,

  isActive: baseProductSchema.isActive,
});

/* ---------------- UPDATE ---------------- */
const updateProductSchema = Joi.object(baseProductSchema).min(1);

/* ---------------- LIST ---------------- */
const listProductsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),

  search: Joi.string().trim().allow(""),

  category: Joi.string().trim().allow(""),

  sortBy: Joi.string()
    .valid("name", "sellingPrice", "costPrice", "createdAt")
    .default("createdAt"),

  sortOrder: Joi.string().valid("asc", "desc").default("desc"),

  includeInactive: Joi.boolean().default(false),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
};
