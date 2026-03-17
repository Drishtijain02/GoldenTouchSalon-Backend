const router = require('express').Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password required' });
    }

    const exists = await User.findOne({ phone });
    if (exists) {
      return res.json({ message: 'User already exists' });
    }

    const user = new User({
      phone: String(phone),
      password: String(password)
    });

    await user.save();

    res.json({ message: 'User created' });

  } catch (err) {
    console.error("REGISTER ERROR:", err); // 👈 IMPORTANT
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.password !== password) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    res.json({ message: 'Login success' });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;