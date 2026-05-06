const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 24,
      match: [/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscore'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 60,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    bio: {
      type: String,
      maxlength: 240,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(plain, salt);
};

userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    bio: this.bio,
    avatarUrl: this.avatarUrl,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
