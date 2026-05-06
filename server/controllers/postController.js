const Post = require('../models/Post');

// GET /api/posts?author=<userId>&q=<text>&page=1&limit=12
exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '12', 10)));

    const filter = {};
    if (req.query.author) filter.author = req.query.author;
    if (req.query.tag) filter.tags = req.query.tag.toLowerCase();
    if (req.query.q) {
      const rx = new RegExp(req.query.q.trim().slice(0, 80), 'i');
      filter.$or = [{ title: rx }, { excerpt: rx }, { location: rx }];
    }

    const [items, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'username name avatarUrl'),
      Post.countDocuments(filter),
    ]);

    res.json({ items, total, page, limit, hasMore: page * limit < total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load posts' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'username name avatarUrl bio'
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (err) {
    res.status(400).json({ message: 'Invalid post id' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, location, tags } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' });
    }
    const post = await Post.create({
      title: title.trim(),
      content,
      excerpt: (excerpt || '').trim(),
      coverImage: (coverImage || '').trim(),
      location: (location || '').trim(),
      tags: Array.isArray(tags) ? tags.slice(0, 10) : [],
      author: req.user._id,
    });
    const populated = await post.populate('author', 'username name avatarUrl');
    res.status(201).json({ post: populated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

exports.update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }
    const fields = ['title', 'content', 'excerpt', 'coverImage', 'location'];
    for (const f of fields) {
      if (req.body[f] !== undefined) post[f] = req.body[f];
    }
    if (Array.isArray(req.body.tags)) post.tags = req.body.tags.slice(0, 10);
    await post.save();
    const populated = await post.populate('author', 'username name avatarUrl');
    res.json({ post: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

exports.remove = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }
    await post.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};
