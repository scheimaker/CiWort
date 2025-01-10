const express = require('express');
const path = require('path');

// const admin = require('firebase-admin');
const authRoutes = require('./routes/authRoutes'); // Correct import of authRoutes
const wordRoutes = require('./routes/wordRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const serviceAccount = require('./firebaseServiceAccountKey.json');
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ciwort.firebaseapp.com' // Replace with your database URL
},"CiWort");

const db = admin.firestore(); // Initialize Firestore


const app = express();
app.use(express.json()); // Parse incoming JSON requests

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', authRoutes);
app.use('/api', wordRoutes);
// Basic route to check server is running
// app.get('/', (req, res) => {
//   res.send('Word Learning App API is running');
// });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Serve static files from 'dist/spa' folder
// app.use(express.static(path.join(__dirname, 'dist/spa')));

// Redirect all other routes to index.html (SPA handling)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/spa', 'index.html'));
// });



// Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


exports.app = functions.https.onRequest(app);