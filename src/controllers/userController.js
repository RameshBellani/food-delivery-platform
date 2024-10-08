const User = require("../models/User");

// Get the user's profile
exports.getProfile = async (req, res) => {
  const { _id } = req.user;

  // Validate user ID
  if (!_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const user = await User.findById(_id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong! Please try again later.",
    });
  }
};

// Add an address to the user's profile
exports.addAddress = async (req, res) => {
  const { street, city, zip } = req.body;
  const { _id } = req.user;

  // Validate required fields
  if (!street || !city || !zip) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }
  if (!_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const user = await User.findById(_id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Add new address
    user.addresses.push({ zip, street, city });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong! Please try again later.",
    });
  }
};

// Update the user's profile
exports.updateProfile = async (req, res) => {
  const { _id } = req.user;

  // Validate user ID
  if (!_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const user = await User.findById(_id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update profile fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    

    // Update addresses if provided
    if (req.body.addresses) {
      user.addresses = req.body.addresses;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong! Please try again later.",
    });
  }
};
