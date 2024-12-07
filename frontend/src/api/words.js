import axios from 'axios';
import { BASE_URL } from './utils';
import { getFirebaseIdToken } from './utils';

// Function to submit words to a specific wordbank
export const submitWordsToWordbank = async (wordbankId, words) => {
  try {
    const idToken = await getFirebaseIdToken();

    const response = await axios.post(
      `${BASE_URL}/wordbanks/add-words`,
      { wordbankId, words },
      {
        headers: {
          Authorization: `Bearer ${idToken}`, // Send token in Authorization header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error submitting words to wordbank:', error);
    throw error;
  }
};

// Function to fetch all wordbanks for the user
export const fetchWordbanks = async () => {
  try {
    const idToken = await getFirebaseIdToken();

    const response = await axios.get(`${BASE_URL}/wordbanks`, {
      headers: {
        Authorization: `Bearer ${idToken}`, // Send token in Authorization header
      },
    });

    return response.data.wordbanks; // Return the list of wordbanks
  } catch (error) {
    console.error('Error fetching wordbanks:', error);
    throw error;
  }
};

// Function to create a new wordbank
export const createWordbank = async (name) => {
  try {
    const idToken = await getFirebaseIdToken();

    const response = await axios.post(
      `${BASE_URL}/wordbanks`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${idToken}`, // Send token in Authorization header
        },
      }
    );

    return response.data; // Return the response data (e.g., new wordbank ID)
  } catch (error) {
    console.error('Error creating wordbank:', error);
    throw error;
  }
};

// Function to fetch words from a specific wordbank
export const fetchWordsFromWordbank = async () => {
  try {
    const idToken = await getFirebaseIdToken();

    const response = await axios.get(`${BASE_URL}/getwords_currentwordbanks`, {
      headers: {
        Authorization: `Bearer ${idToken}`, // Send token in Authorization header
      },
    });

    return response.data.words; // Return the words from the wordbank
  } catch (error) {
    console.error('Error fetching words from wordbank:', error);
    throw error;
  }
};

// Function to update word times (rightTimes or wrongTimes) in a user's wordbank
export const updateWordTimes = async (
  wordbankId,
  wordId,
  rightTimes,
  wrongTimes
) => {
  try {
    const idToken = await getFirebaseIdToken();

    await axios.patch(
      `${BASE_URL}/wordbanks/${wordbankId}/words/${wordId}`,
      { rightTimes, wrongTimes },
      {
        headers: {
          Authorization: `Bearer ${idToken}`, // Send token in Authorization header
        },
      }
    );

    return { message: 'Word times updated successfully' };
  } catch (error) {
    console.error('Error updating word times:', error);
    throw error;
  }
};

// Function to update a word
export const updateWords = async (wordbankId, toUpdateWords) => {
  const idToken = await getFirebaseIdToken();
  return await axios.put(`${BASE_URL}/wordbanks/${wordbankId}`, toUpdateWords, {
    headers: getAuthorizationToken(idToken), // Send token in Authorization header
  });
};

const getAuthorizationToken =  (idToken) => {
  
  return { Authorization: `Bearer ${idToken}` };
};

// Function to get random words (with same length as correct word)
export const getRandomWords = (words, correctWord, count) => {
  const incorrectWords = words
    .filter(
      (word) =>
        word.text !== correctWord.text &&
        word.text.length === correctWord.text.length
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, count);

  const wordOptions = [...incorrectWords, correctWord].sort(
    () => 0.5 - Math.random()
  );

  return wordOptions;
};

export const setCurrentWordbank = async (wordbankId) => {
  const idToken = await getFirebaseIdToken();
  console.log(wordbankId);
  return await axios.post(
    `${BASE_URL}/setcurrentwordbank`,
    { wordbankId },
    {
      headers: {
        Authorization: `Bearer ${idToken}`, // Send token in Authorization header
      },
    }
  );
};
export const getCurrentWordbank = async () => {
  const idToken = await getFirebaseIdToken();
  const response = await axios.get(`${BASE_URL}/getcurrentwordbank`, {
    headers: {
      Authorization: `Bearer ${idToken}`, // Send token in Authorization header
    },
  });
  return response.data;
};

export const lookupWord = async (word) => {
  const idToken = await getFirebaseIdToken();
  const response = await axios.post(
    `${BASE_URL}/lookupword`,
    {
      word, // Add the word in the body as 'text'
    },

    {
      headers: {
        Authorization: `Bearer ${idToken}`, // Send token in Authorization header
      },
    }
  );
  return response.data;
};

export const testFunction = async () => {
  try {
    const idToken = await getFirebaseIdToken();

    await axios.post(
      `${BASE_URL}/test`,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`, // Send token in Authorization header
        },
      }
    );

    return { message: 'test function successfully' };
  } catch (error) {
    console.error('Error updating word times:', error);
    throw error;
  }
};
