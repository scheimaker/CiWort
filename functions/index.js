const express = require('express');
// const admin = require('firebase-admin');
const authRoutes = require('./routes/authRoutes'); // Correct import of authRoutes
const wordRoutes = require('./routes/wordRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();
app.use(express.json()); // Parse incoming JSON requests

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', authRoutes);
app.use('/api', wordRoutes);
// Basic route to check server is running
app.get('/', (req, res) => {
  res.send('Word Learning App API is running');
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
