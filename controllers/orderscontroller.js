const Order = require("../models/orders");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId"
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (typeof status !== "string" || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getAllOrdersOfAllUsers,
};
