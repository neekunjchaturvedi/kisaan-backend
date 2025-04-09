const express = require("express");
const {
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getAllOrdersOfAllUsers,
} = require("../controllers/orderscontroller");

const router = express.Router();
router.get("/all", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus); 

module.exports = router;
