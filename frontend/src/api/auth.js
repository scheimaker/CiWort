// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../../functions/firebase/firebase';
// Backend base
import axios from 'axios';
import { BASE_URL } from './utils';
// Function to register a user
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from 'firebase/auth';
const auth = getAuth();

export const registerUser = async (username, email, password) => {
  // Get Firebase Auth instance

  try {
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update the user profile with the username
    await updateProfile(user, { displayName: username });
    // send email and username to the backend and save it in the database
    const uid = user.uid;
    const response = await axios.post(`${BASE_URL}/register`, {
      uid,
      username,
      email,
    });

    console.log('User registered and profile updated:', user);
    console.log('Backend response:', response.data);

    return { message: 'User registered successfully', user };
  } catch (error) {
    console.error('Error during registration:', error.message);
    throw new Error(error.message || 'Registration failed');
  }
};

// Function to log in a user
export const loginUser = async (email, password) => {
  // Get Firebase Auth instance

  try {
    // Sign in the user using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get the user's ID token for backend authorization
    const idToken = await user.getIdToken();

    console.log('User logged in successfully:', user);

    // You can return the token or any other user details as needed
    return { message: 'Login successful', token: idToken };
  } catch (error) {
    console.error('Error during login:', error.message);
    throw new Error(error.message || 'Login failed');
  }
};

// Call this when your app starts to monitor user sign-in state

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user);
  } else {
    console.log('No user is signed in.');
    // Prompt user to sign in if necessary
  }
});
