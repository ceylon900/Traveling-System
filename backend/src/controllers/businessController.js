const Business = require("../models/Business");
const Package = require("../models/Package");
const User = require("../models/User");

exports.registerBusiness = async (req, res) => {
  try {
    const newBusiness = new Business(req.body);
    const savedBusiness = await newBusiness.save();
    res.status(201).json(savedBusiness);
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedBusiness);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.getUserBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.params.userId });
    if (!business) {
      return res.status(404).json({ message: "No business found for this owner." });
    }
    res.status(200).json(business);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getBusinessByPackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    const foundPackage = await Package.findById(packageId);
    
    if (!foundPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (!foundPackage.creator) {
      return res.status(404).json({ message: "Package creator info not found" });
    }

    const creatorId = foundPackage.creator;
    const business = await Business.findOne({ owner: creatorId });
    
    if (!business) {
      return res.status(404).json({ message: "No business registered for this user" });
    }

    res.status(200).json(business);

  } catch (err) {
    console.error("🔥 Server Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getDetailedBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate("owner", "username email")
      .populate("location", "name");
    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await User.find({ accountType: "business" }).select("-password");
    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching businesses", error: err.message });
  }
};

exports.suspendBusiness = async (req, res) => {
  try {
    await Business.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Business removed from system" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
