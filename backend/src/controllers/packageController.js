const Package = require('../models/Package');
const Category = require('../models/Category');

exports.createPackage = async (req, res) => {
    try {
        const { name, description, price, category, location, creator } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newPackage = new Package({
            name,
            description,
            price,
            category,
            location,
            creator, 
            image: imagePath 
        });

        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePackage = async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true }
        );
        res.json(updatedPackage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deletePackage = async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);
        res.json({ message: "Package deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find().populate('category');
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPackageById = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id).populate('category');
        res.json(package);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};