const bcrypt = require('bcryptjs');
const admin = require('../config/firebase'); // Firebase Admin SDK for interacting with Firestore
const { v4: uuidv4 } = require('uuid');
const db = admin.firestore(); // Firestore instance

// Controller for handling user registration
// const admin = require('firebase-admin'); // Firebase Admin SDK
const { getAuth } = require('firebase-admin/auth'); // Firebase Authentication module


// Controller for handling user registration
// const registerUser = async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   console.log('Registering user:', username, email);

//   try {
//     // Check if the user already exists in Firebase Authentication
//     const existingUserSnapshot = await db.collection('users').where('email', '==', email).get();
//     if (!existingUserSnapshot.empty) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create the user in Firebase Authentication
//     const userRecord = await getAuth().createUser({
//       email,
//       password,
//       displayName: username,
//     });

//     console.log('Firebase Authentication User created:', userRecord.uid);

//     // Get the current registration time
//     const registrationTime = new Date().toISOString();

//     // Save additional user details to Firestore (e.g., username)
//     await db.collection('users').doc(userRecord.uid).set({
//       userId: userRecord.uid,
//       username,
//       email,
//       registrationTime,
//     });

//     // No need to create a wordbank here. Words will be added later with GUIDs

//     res.status(201).json({ message: 'User registered successfully', userId: userRecord.uid });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

const registerUser = async (req, res) => {
  const { uid, username, email } = req.body;


  try {
   

    // Store additional user details in Firestore
    await admin.firestore().collection('users').doc(uid).set({
      username,
      email,
      createdAt: new Date().toLocaleString(),
    });

    const userRef = admin.firestore().collection('users').doc(uid);
    const wordBankRef = userRef.collection('wordbank').doc('defaultWordbank');

   
    // Return success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message });
  }
};



const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split("Bearer ")[1]; // Extract the Firebase ID token

  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid; // Attach the decoded token (which includes uid) to the request
    next(); // Attach the decoded token (which includes uid) to the request
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};


// Controller for handling user login
const checkLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // In Firebase Authentication, you don't check login on the backend.
    // The frontend will use Firebase SDK to handle login and return an ID token.

    const auth = getAuth();
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // The frontend will handle login and token generation, you just return a success message here
    res.status(200).json({ message: 'User exists in Firebase, login handled on frontend' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//controller to add a wordbank for the user
const initializeWordbank = async (req, res) => {
  const { wordbank } = req.body;
  const userId = req.user.uid; // Get the user's Firebase UID from the decoded token

  if (!Array.isArray(wordbank) || wordbank.length === 0) {
    return res.status(400).json({ message: 'Invalid input: Please provide a list of word references.' });
  }

  try {
    // Reference to the user's wordbank collection in Firestore
    const wordBankRef = db.collection('users').doc(userId).collection('wordbank');

    const batch = db.batch(); // Use batch to handle multiple writes

    // Loop over each word reference from the request body
    for (const wordRef of wordbank) {
      const { wordId } = wordRef;  // wordId should reference a word in sharedWordbank

      // Check if the wordbank entry already exists for the user
      const userWordSnapshot = await wordBankRef.where('wordId', '==', wordId).limit(1).get();
      if (userWordSnapshot.empty) {
        // If no existing wordbank entry for this word, initialize it for the user
        const newUserWordDocRef = wordBankRef.doc(); // Auto-generate an ID for the user's wordbank entry
        batch.set(newUserWordDocRef, {
          wordId,  // Reference to the shared word
          rightTimes: 0,
          wrongTimes: 0,
          addedTimestamp: new Date().toISOString(),
        });
      }
    }

    // Commit the batch write to Firestore
    await batch.commit();

    res.status(201).json({ message: 'Wordbank initialized successfully for the user', wordCount: wordbank.length });
  } catch (error) {
    console.error('Error initializing wordbank:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser, checkLogin , verifyToken,initializeWordbank}; // Export the controller functions