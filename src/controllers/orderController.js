const Order = require("../models/Order");

let io;

// Set the Socket.IO instance for real-time updates
exports.setSocketIO = (socketIOInstance) => {
  io = socketIOInstance;
};

// Create a new order
exports.createOrder = async (req, res) => {
  const { restaurantId, items, deliveryAddress, totalCost, estimatedDeliveryTime } = req.body;
  const { _id } = req.user;

  // Validate required fields
  if (!restaurantId || !items || !deliveryAddress || !totalCost || !estimatedDeliveryTime || !_id) {
    return res.status(400).json({ message: "Please fill all required details." });
  }

  try {
    // Create and save a new order
    const order = new Order({
      userId: _id,
      restaurantId,
      items,
      deliveryAddress,
      totalCost,
      estimatedDeliveryTime,
    });
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong! Please try again later." });
  }
};

// Get a specific order by ID
exports.getOrder = async (req, res) => {
  const { orderId } = req.params;

  // Validate required parameters
  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required." });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong! Please try again later." });
  }
};

// Update the status of an order
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  // Validate required fields
  if (!status) {
    return res.status(400).json({ message: "Status is required." });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Update order status and save
    order.status = status;
    await order.save();

    // Emit status update via Socket.IO
    io.emit("orderStatusUpdate", { status: order.status, orderId: order._id });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong! Please try again later." });
  }
};

// Get all orders for a specific user
exports.getOrdersForUser = async (req, res) => {
  const { _id } = req.user;

  // Validate required user ID
  if (!_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const orders = await Order.find({ userId: _id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong! Please try again later." });
  }
};

// Track the status of a specific order
exports.trackOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  // Validate required parameters
  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required." });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({ status: order.status });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong! Please try again later." });
  }
};
