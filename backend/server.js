const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/checkin-app')
  .then(() => console.log('🟢 MongoDB connected'))
  .catch(err => console.log('❌ DB error:', err));

const UserSchema = new mongoose.Schema({
  deviceId: String,
  lastCheckIn: Date,
});

const User = mongoose.model('User', UserSchema);

app.post('/check-in', async (req, res) => {
  const { timestamp } = req.body;

  console.log('📥 Check-in received:', timestamp);

  try {
    const user = await User.findOneAndUpdate(
      { deviceId: 'user-123' },
      { lastCheckIn: new Date(timestamp) },
      { upsert: true, new: true }
    );

    console.log('💾 Saved to DB:', user);

    res.json({ success: true });
  } catch (err) {
    console.log('❌ DB error:', err);
    res.status(500).json({ error: 'DB failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});