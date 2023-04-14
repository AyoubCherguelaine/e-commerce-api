const Comment = require('../models/comment');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { user, product, text } = req.body;
    const comment = new Comment({ user, product, text });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get all comments for a product
exports.getCommentsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await Comment.find({ product: productId }).populate('user', 'username');
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
