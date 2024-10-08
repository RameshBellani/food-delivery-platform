const http = require("http");
const socketIO = require("socket.io");
const app = require("./app");
const Order = require("./src/models/Order");
const orderController = require("./src/controllers/orderController");

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socketIO(server);

// Set Socket.IO instance in the order controller
orderController.setSocketIO(io);

// Define event handlers for WebSocket connections
const handleSocketConnection = (socket) => {
  console.log("Client connected to WebSocket");

  socket.on("trackOrder", (orderId) => handleTrackOrder(socket, orderId));
  socket.on("disconnect", handleSocketDisconnection);
};

// Handle tracking of an order
const handleTrackOrder = (socket, orderId) => {
  Order.findById(orderId, (err, order) => {
    if (err || !order) {
      socket.emit("error", "Order not found");
    } else {
      socket.emit("orderStatusUpdate", { status: order.status });
    }
  });
};

// Handle disconnection of a client
const handleSocketDisconnection = () => {
  console.log("Client disconnected from WebSocket");
};

// Register the connection event
io.on("connection", handleSocketConnection);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
