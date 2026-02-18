const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  state: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  read_count: {
    type: Number,
    default: 0
  },
  reading_time: {
    type: Number,
    default: 0
  },
  tags: [String],
  body: {
    type: String,
    required: true
  }
}, { timestamps: true });

blogSchema.pre('save', function() {
  const wordCount = this.body.split(/\s+/).length;
  this.reading_time = Math.ceil(wordCount / 200);
});

module.exports = mongoose.model('Blog', blogSchema);
