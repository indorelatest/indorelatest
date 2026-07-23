const Subscriber = require('../models/Subscriber');

// POST subscribe
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.json({ success: true, message: 'Already subscribed!' });
      }
      existing.isActive = true;
      await existing.save();
      return res.json({ success: true, message: 'Re-subscribed successfully!' });
    }

    await Subscriber.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all subscribers (admin)
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE unsubscribe
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.params;
    await Subscriber.findOneAndUpdate({ email }, { isActive: false });
    res.json({ success: true, message: 'Unsubscribed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { subscribe, getAllSubscribers, unsubscribe };
