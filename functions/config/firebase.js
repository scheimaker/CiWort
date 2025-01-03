const admin = require("firebase-admin");

// Import Firebase service account key
const serviceAccount = require("../firebaseServiceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ciwort.firebaseapp.com",
});

module.exports = admin;
