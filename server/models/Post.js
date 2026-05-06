const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      maxlength: 280,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      maxlength: 80,
      default: '',
    },
    tags: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

postSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80);
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/\s+/g, ' ').slice(0, 200);
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
