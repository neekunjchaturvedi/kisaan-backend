const express = require("express");

const { upload } = require("../helpers/cloudinary");
const {
  getProductsByCategory,
  handleImageUpload,
  addProduct,
  editProduct,
  deleteProduct,
  fetchAllProducts,
  getCategories,
} = require("../controllers/productcontroller");

const router = express.Router();

router.post("/upload-image", upload.single("file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/categories", getCategories);

module.exports = router;
