const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  description: { type: String },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
