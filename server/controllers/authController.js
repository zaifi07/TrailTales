const User = require('../models/User');
const { signToken } = require('../middleware/auth');

exports.signup = async (req, res) => {
  try {
    const { username, name, password } = req.body || {};
    if (!username || !name || !password) {
      return res.status(400).json({ message: 'username, name and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Username already taken' });

    const user = new User({
      username: username.toLowerCase(),
      name: name.trim(),
    });
    await user.setPassword(password);
    await user.save();

    const token = signToken(user);
    return res.status(201).json({ token, user: user.toPublic() });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }
    const user = await User.findOne({ username: username.toLowerCase() }).select('+passwordHash');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    return res.json({ token, user: user.toPublic() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

exports.me = async (req, res) => {
  return res.json({ user: req.user.toPublic() });
};
