const { imageUploadUtil } = require("../helpers/cloudinary");
const Product = require("../models/Product");

// Helper function to get current UTC date time in YYYY-MM-DD HH:MM:SS format
const getCurrentUTCDateTime = () => {
  const now = new Date();
  return now.toISOString().replace("T", " ").substring(0, 19);
};

//image upload
const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await imageUploadUtil(dataURI, "admin");

    res.json({
      success: true,
      result: {
        url: result.url,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading image",
    });
  }
};

//add new product
const addProduct = async (req, res) => {
  try {
    const {
      image1,
      image2,
      image3,
      image4,
      productName,
      description,
      productType,
      category,
      price,
      salePrice,
      sku,
      stockQuantity,
      sales,
      remaining,
    } = req.body;

    if (
      !image1 ||
      !productName ||
      !description ||
      !productType ||
      !price ||
      !stockQuantity
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newProduct = new Product({
      image1,
      image2: image2 || "",
      image3: image3 || "",
      image4: image4 || "",
      productName,
      description,
      productType,
      category: category || "",
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      sku: sku || "",
      stockQuantity: Number(stockQuantity),
      sales: Number(sales),
      remaining: Number(remaining),
      createdAt: getCurrentUTCDateTime(),
      createdBy: "admin",
      updatedAt: getCurrentUTCDateTime(),
      updatedBy: "admin",
    });

    await newProduct.save();

    console.log(`New product created: ${productName} by admin`);

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error adding product",
    });
  }
};

//Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching products",
    });
  }
};

//edit product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      updates.productName === "" ||
      updates.description === "" ||
      updates.productType === "" ||
      updates.price === "" ||
      updates.stockQuantity === "" ||
      updates.image1 === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields cannot be empty",
      });
    }

    if (updates.price) updates.price = Number(updates.price);
    if (updates.salePrice) updates.salePrice = Number(updates.salePrice);

    if (updates.stockQuantity)
      updates.stockQuantity = Number(updates.stockQuantity);

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        product[key] = updates[key];
      }
    });

    product.updatedAt = getCurrentUTCDateTime();
    product.updatedBy = "admin";

    await product.save();

    console.log(`Product updated: ${id} by admin`);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Edit product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating product",
    });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log(`Product being deleted: ${id} by admin`);

    await Product.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting product",
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Validate if the category is one of the predefined categories
    const validCategories = [
      "Bearings & Bushings",
      "Hydraulic System Components",
      "Filters & Lubrication System",
      "Fasteners & Fittings",
      "Steering & Suspension Components",
      "Braking System",
    ];

    // Check if category is valid or if we should return all products
    let query = {};
    if (category !== "all" && validCategories.includes(category)) {
      query = { category };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: products.length,
      category: category === "all" ? "All Categories" : category,
      data: products,
    });
  } catch (error) {
    console.error("Fetch products by category error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching products by category",
    });
  }
};

// Get categories with product counts
const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Fetch categories error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching categories",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  getProductsByCategory,
  getCategories,
};
