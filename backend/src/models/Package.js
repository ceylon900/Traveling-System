const mongoose = require('mongoose');
const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  location: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Package', PackageSchema);