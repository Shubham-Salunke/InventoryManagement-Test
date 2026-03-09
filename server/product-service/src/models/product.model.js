// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     sku: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       uppercase: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     // quantity: {
//     //   type: Number,
//     //   required: true,
//     //   min: 0,
//     // },
//     category: {
//       type: String,
//       default: "",
//       trim: true,
//       index: true,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//       index: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     deletedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     deletedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// productSchema.index({ name: "text", description: "text", sku: 1 });

// const Product = mongoose.model("Product", productSchema);

// module.exports = Product;

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    unitOfMeasure: {
      type: String,
      enum: ["pcs", "kg", "ltr"],
      default: "pcs",
    },

    costPrice: {
      type: Number,
      min: 0,
      required: true,
    },

    sellingPrice: {
      type: Number,
      min: 0,
      required: true,
    },

    taxRate: {
      type: Number,
      min: 0,
      default: 0,
    },
    priceIncludesTax: {
      type: Boolean,
      default: false, // false = GST extra, true = GST inclusive (MRP)
    },

    barcode: {
      type: String,
      trim: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🔹 Audit fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// 🔹 Search index
productSchema.index({
  name: "text",
  description: "text",
  sku: "text",
  barcode: "text",
});

module.exports = mongoose.model("Product", productSchema);
