const Wishlist = require('../models/Wishlist');

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const { user } = req;

    // Check if the user has an existing wishlist
    let wishlist = await Wishlist.findOne({ user: user._id });

    // If not, create a new wishlist
    if (!wishlist) {
      wishlist = new Wishlist({ user: user._id });
    }

    // Check if the product already exists in the wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add the product to the wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({ message: 'Product added to wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const { user } = req;

    // Find the user's wishlist and populate it with the products
    const wishlist = await Wishlist.findOne({ user: user._id }).populate('products');

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const { user } = req;

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ user: user._id });

    // If the wishlist doesn't exist, return an error
    if (!wishlist) {
      return res.status(400).json({ message: 'Wishlist not found' });
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter((id) => id !== productId);
    await wishlist.save();

    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
