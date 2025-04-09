const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image1: { type: String, required: true },
  image2: { type: String },
  image3: { type: String },
  image4: { type: String },
  productName: { type: String, required: true },
  description: { type: String, required: true },
  productType: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  sku: { type: String },
  stockQuantity: { type: Number, required: true },
  sales: { type: Number }, //whenever an order is created from user side do update these fields from user backend side(Order.save())
  remaining: { type: Number }, //updte the same way on user side
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  createdBy: { type: String },
  updatedBy: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
