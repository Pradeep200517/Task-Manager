const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  image: { type: String, default: '' } // image URL optional
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
