const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.userId });
    const populatedBlog = await Blog.findById(blog._id).populate('author', 'first_name last_name email');
    res.status(201).json({ blog: populatedBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPublishedBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, author, title, tags, order_by = 'createdAt' } = req.query;
    let query = { state: 'published' };
    
    // Search by author name
    if (author) {
      const User = require('../models/User');
      const users = await User.find({
        $or: [
          { first_name: new RegExp(author, 'i') },
          { last_name: new RegExp(author, 'i') }
        ]
      });
      
      if (users.length > 0) {
        const userIds = users.map(u => u._id);
        query.author = { $in: userIds };
      } else {
        // No matching users, return empty
        return res.json({ blogs: [], total: 0, page: Number(page), pages: 0 });
      }
    }
    
    if (title) query.title = new RegExp(title, 'i');
    if (tags) query.tags = { $in: tags.split(',') };
    
    const sortOptions = {};
    if (order_by === 'read_count') sortOptions.read_count = -1;
    else if (order_by === 'reading_time') sortOptions.reading_time = -1;
    else sortOptions.createdAt = -1;
    
    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Blog.countDocuments(query);
    res.json({ blogs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, state: 'published' },
      { $inc: { read_count: 1 } },
      { new: true }
    ).populate('author', 'first_name last_name email');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, state } = req.query;
    const query = { author: req.userId };
    if (state) query.state = state;
    
    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Blog.countDocuments(query);
    res.json({ blogs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'first_name last_name email');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
