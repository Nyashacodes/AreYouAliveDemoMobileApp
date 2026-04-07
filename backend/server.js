const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/check-in', (req, res) => {
  const { timestamp } = req.body;

  console.log('📥 Check-in received:', timestamp);

  res.json({ success: true });
});

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});