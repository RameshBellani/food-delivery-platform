const Restaurant = require("../models/Restaurant");

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
  const { name, location } = req.body;

  // Validate required fields
  if (!name || !location) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong! Please try again later.",
    });
  }
};

// Update restaurant details
exports.updateRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  // Validate restaurantId
  if (!restaurantId) {
    return res.status(400).json({ message: "Restaurant ID is required." });
  }

  try {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    // Update restaurant details
    restaurant.name = req.body.name || restaurant.name;
    restaurant.location = req.body.location || restaurant.location;
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong! Please try again later.",
    });
  }
};

// Add a new menu item to a restaurant
exports.addMenuItem = async (req, res) => {
  const { restaurantId } = req.params;
  const { name, price, availability, pic } = req.body;

  // Validate required fields
  if (!restaurantId) {
    return res.status(400).json({ message: "Restaurant ID is required." });
  }
  if (!name || !price || !availability || !pic) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    // Add new menu item
    restaurant.menu.push(req.body);
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong! Please try again later.",
    });
  }
};

// Update an existing menu item of a restaurant
exports.updateMenuItem = async (req, res) => {
  const { restaurantId, itemId } = req.params;

  // Validate required fields
  if (!restaurantId) {
    return res.status(400).json({ message: "Restaurant ID is required." });
  }
  if (!itemId) {
    return res.status(400).json({ message: "Menu item ID is required." });
  }

  try {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    // Find the menu item by ID
    const menuItem = restaurant.menu.id(itemId);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found." });
    }

    // Update menu item details
    menuItem.name = req.body.name || menuItem.name;
    menuItem.price = req.body.price || menuItem.price;
    menuItem.category = req.body.category || menuItem.category;
    menuItem.description = req.body.description || menuItem.description;
    menuItem.pic = req.body.pic || menuItem.pic;
    menuItem.availability =
      req.body.availability !== undefined ? req.body.availability : menuItem.availability;

    await restaurant.save();
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong! Please try again later.",
    });
  }
};
