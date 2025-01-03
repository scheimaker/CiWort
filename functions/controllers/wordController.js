const admin = require("../config/firebase");
const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});
const measureExecutionTime = require("./performanceTester");
const {v4: uuidv4} = require("uuid");
const {uniqBy, sortBy} = require("lodash");

const FetchWordsCount = 100;

// Fetch all wordbanks for a user
const fetchWordbanks = async (req, res) => {
  try {
    const userId = req.uid; // Extract user ID from token

    // Reference to the user's wordbanks collection
    const userWordbanksRef = db
        .collection("users")
        .doc(userId)
        .collection("wordbanks");
    const wordbanksSnapshot = await userWordbanksRef.get();

    if (wordbanksSnapshot.empty) {
      return res
          .status(404)
          .json({message: "No wordbanks found for the user"});
    }

    // Map wordbank documents to an array
    const wordbanks = wordbanksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({wordbanks});
  } catch (error) {
    console.error("Error fetching wordbanks:", error);
    res.status(500).json({message: "Failed to fetch wordbanks"});
  }
};

// Create a new wordbank for a user
const createWordbank = async (req, res) => {
  const {name} = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({message: "Wordbank name is required"});
  }

  try {
    const userId = req.uid; // Extract user ID from token

    // Generate a unique ID for the wordbank
    const wordbankId = uuidv4();

    // Reference to the user's wordbanks collection
    const userWordbanksRef = db
        .collection("users")
        .doc(userId)
        .collection("wordbanks");

    // Add a new wordbank document
    await userWordbanksRef.doc(wordbankId).set({
      id: wordbankId,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      words: [], // Initialize with an empty words array
    });

    res
        .status(201)
        .json({message: "Wordbank created successfully", id: wordbankId});
  } catch (error) {
    console.error("Error creating wordbank:", error);
    res.status(500).json({message: "Failed to create wordbank"});
  }
};

// Add words to a specific wordbank
const addWordsToWordbank = async (req, res) => {
  const {wordbankId, words} = req.body;
  if (!wordbankId || !Array.isArray(words) || words.length === 0) {
    return res
        .status(400)
        .json({message: "Wordbank ID and words are required"});
  }

  try {
    const userId = req.uid; // Extract user ID from token

    // Reference to the specific wordbank document
    const wordbankRef = db
        .collection("users")
        .doc(userId)
        .collection("wordbanks")
        .doc(wordbankId);

    // Check if the wordbank exists
    const wordbankDoc = await wordbankRef.get();
    if (!wordbankDoc.exists) {
      return res.status(404).json({message: "Wordbank not found"});
    }

    // Get the current words array
    const currentWords = wordbankDoc.data().words || [];

    // Add new words to the existing array
    const updatedWords = [
      ...currentWords,
      ...words.map((word) => ({
        id: uuidv4(),
        text: word.text,
        language: word.language,
        rightTimes: 0,
        wrongTimes: 0,
        timestamps: [Date.now()],
      })),
    ];

    // Update the wordbank with the new words
    await wordbankRef.update({words: updatedWords});

    res.status(200).json({message: "Words added successfully", wordbankId});
  } catch (error) {
    console.error("Error adding words to wordbank:", error);
    res.status(500).json({message: "Failed to add words to wordbank"});
  }
};

// Fetch words from a specific wordbank
const getWordsFromCurrentWordbank = async (req, res) => {
  const userId = req.uid; // Extract user ID from token

  // Reference to the user's document
  const userRef = db.collection("users").doc(userId);

  // Fetch the user's document
  const userDoc = await userRef.get();

  // Extract the currentWordbank field
  const {currentWordbank} = userDoc.data();
  const wordbankId = currentWordbank.value;
  console.log("get wordbankId here:", currentWordbank);
  try {
    // Fetch words from the user's wordbank
    const userWordbankResponse = await getWordsFromUserWordbank(
        wordbankId,
        userId,
    );

    if (
      !userWordbankResponse.words ||
      userWordbankResponse.words.length === 0
    ) {
      return res
          .status(404)
          .json({message: "No words found in the user wordbank"});
    }

    // Sort words by wrongTimes and rightTimes
    const sortedWordIds = sortWords(userWordbankResponse.words);


    // Fetch word details from the main wordbank
    const mainWordDetails = await getWordsFromMainWordbank(sortedWordIds);

    // Combine user wordbank data with main wordbank details
    const combinedResults = sortedWordIds
        .map((id) => {
          const userWord = userWordbankResponse.words.find(
              (word) => word.id === id,
          );
          const mainWord = mainWordDetails.find((word) => word.id === id);

          if (userWord && mainWord) {
            return {
              id: id,
              ...mainWord, // Main wordbank details
              wrongTimes: userWord.wrongTimes, // User-specific metadata
              rightTimes: userWord.rightTimes,
            };
          }
          return null; // If no matching main word is found
        })
        .filter(Boolean); // Remove any null values

    res.status(200).json({words: combinedResults});
  } catch (error) {
    console.error("Error fetching words from wordbank:", error);
    res.status(500).json({message: "Failed to fetch words from wordbank"});
  }
};

// #region Helper Functions For getting words from  wordbank
const getWordsFromUserWordbank = async (wordbankId, userId) => {
  const wordbankRef = db
      .collection("users")
      .doc(userId)
      .collection("wordbanks")
      .doc(wordbankId);
  const wordbankDoc = await wordbankRef.get();

  if (!wordbankDoc.exists) {
    return {message: "Wordbank not found"};
  }

  return {words: wordbankDoc.data().words};
};

const sortWords = (words) => {
  // Step 1: Filter by conditions
  const filteredWords = words.filter((word) => word.rightTimes <= 5);
  const wordsWithWrongTimes = filteredWords.filter((word) => word.wrongTimes > 0);
  const wordsWithRightTimesZero = filteredWords.filter((word) => word.rightTimes === 0);
  const wordsWithRightTimesOne = filteredWords.filter((word) => word.rightTimes === 1);

  // Step 2: Combine and remove duplicates using lodash's `uniqBy`
  const combinedWords = uniqBy(
      [...wordsWithWrongTimes, ...wordsWithRightTimesZero, ...wordsWithRightTimesOne],
      "id", // Ensures unique words by their `id`
  );

  // Step 3: Sort the combined unique words
  const sortedWords = sortBy(
      combinedWords,
      [(word) => -word.wrongTimes, (word) => word.rightTimes], // Sort by wrongTimes descending, then rightTimes ascending
  );

  // Step 4: Extract the IDs of the top 100 words
  return sortedWords.slice(0, FetchWordsCount).map((word) => word.id);
};

const getWordsFromMainWordbank = async (topWordIds) => {
  // Extract IDs of the top words

  try {
    const wordbankCollection = db.collection("wordbank");
    const mainWords = [];

    for (const id of topWordIds) {
      const wordDoc = await wordbankCollection.doc(id).get();
      if (wordDoc.exists) {
        mainWords.push({id: wordDoc.id, ...wordDoc.data()});
      }
    }

    return mainWords;

    // Respond with the results
  } catch (error) {
    console.error("Error fetching words from main wordbank:", error);
    throw error;
  }
};

// #endregion

const updateWords = async (req, res) => {
  const {wordbankId} = req.params; // Extract wordbankId from params
  const wordsToUpdate = req.body; // Expecting a list of word objects [{ id, rightTimes, wrongTimes }, ...]

  if (!Array.isArray(wordsToUpdate) || wordsToUpdate.length === 0) {
    return res.status(400).json({message: "A list of words to update is required"});
  }

  try {
    const userId = req.uid; // Extract user ID from token

    // Reference to the user's specific wordbank
    const wordbankRef = db
        .collection("users")
        .doc(userId)
        .collection("wordbanks")
        .doc(wordbankId);

    const wordbankDoc = await wordbankRef.get();
    if (!wordbankDoc.exists) {
      return res.status(404).json({message: "Wordbank not found"});
    }

    const wordbank = wordbankDoc.data();

    // Update each word in the wordbank's words array
    const updatedWords = wordbank.words.map((word) => {
      const update = wordsToUpdate.find((w) => w.id === word.id);
      if (update) {
        return {
          ...word,
          ...(update.rightTimes !== undefined && {rightTimes: update.rightTimes || word.rightTimes}),
          ...(update.wrongTimes !== undefined && {wrongTimes: update.wrongTimes || word.wrongTimes}),
          updated: [...(word.updated || []), new Date().toISOString()], // Add new timestamp
        };
      }
      return word; // Leave the word unchanged if it's not in the update list
    });

    console.log("Updated words:", updatedWords);

    // Update the wordbank document with the modified words array
    await wordbankRef.update({words: updatedWords});

    res.status(200).json({message: "Words updated successfully"});
  } catch (error) {
    console.error("Error updating words:", error);
    res.status(500).json({message: "Failed to update words"});
  }
};


const testFunction = async (req, res) => {
  try {
    const userId = req.uid; // Extract user ID from the authenticated request

    // Reference to the user's wordbank collection
    const userWordbankRef = db
        .collection("users")
        .doc(userId)
        .collection("wordbank");
    const userWordbankSnapshot = await userWordbankRef.get();

    if (userWordbankSnapshot.empty) {
      return res
          .status(404)
          .json({message: "No words found in the user's wordbank"});
    }

    // Fetch all words from the user's wordbank
    const userWords = userWordbankSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Reference to the `wordbanks` collection for this user
    const chineseWordbankRef = db
        .collection("users")
        .doc(userId)
        .collection("wordbanks");

    // Check if the "Chinese" wordbank already exists
    const chineseWordbankDoc = await chineseWordbankRef
        .where("name", "==", "Chinese")
        .get();

    let wordbankId;
    if (chineseWordbankDoc.empty) {
      // Create a new wordbank if "Chinese" doesn't exist
      wordbankId = db
          .collection("users")
          .doc(userId)
          .collection("wordbanks")
          .doc().id;
      await chineseWordbankRef.doc(wordbankId).set({
        id: wordbankId,
        name: "Chinese",
        createdAt: new Date().toISOString(),
        words: [],
      });
    } else {
      // Use the existing "Chinese" wordbank
      wordbankId = chineseWordbankDoc.docs[0].id;
    }

    const chineseWordbankDocRef = chineseWordbankRef.doc(wordbankId);

    // Fetch the current words in the "Chinese" wordbank
    const chineseWordbankDocSnapshot = await chineseWordbankDocRef.get();
    const existingWords = chineseWordbankDocSnapshot.exists ?
      chineseWordbankDocSnapshot.data().words || [] :
      [];

    // Combine the existing words with the new words (ensure no duplicates by `wordId`)
    const updatedWords = [
      ...existingWords,
      ...userWords.map((word) => ({
        id: word.id,
        text: word.text,
        language: word.language || "CHN", // Set default language to Chinese
        rightTimes: word.rightTimes || 0,
        wrongTimes: word.wrongTimes || 0,
        timestamps: word.timestamps || [],
        confidenceLevel: word.confidenceLevel || "low",
        difficultyLevel: word.difficultyLevel || "medium",
      })),
    ];

    // Remove duplicate words based on `id`
    const uniqueWords = Array.from(
        new Map(updatedWords.map((word) => [word.id, word])).values(),
    );

    // Update the "Chinese" wordbank with the combined words
    await chineseWordbankDocRef.update({words: uniqueWords});

    res.status(200).json({
      message: "Words successfully exported to the 'Chinese' wordbank",
      wordbankId,
    });
  } catch (error) {
    console.error("Error exporting words to the 'Chinese' wordbank:", error);
    res
        .status(500)
        .json({message: "Failed to export words to the 'Chinese' wordbank"});
  }
};

const setCurrentWordbank = async (req, res) => {
  const {wordbankId} = req.body; // Extract userId and wordbankId from the request body
  const userId = req.uid; // Extract user ID from token

  if (!userId || !wordbankId) {
    return res
        .status(400)
        .json({message: "Missing userId or wordbankId in the request"});
  }

  try {
    // Reference to the user's document
    const userRef = db.collection("users").doc(userId);

    // Update the "currentWordbank" field
    await userRef.update({
      currentWordbank: wordbankId,
    });

    console.log(`Current wordbank set to "${wordbankId}" for user "${userId}"`);
    return res
        .status(200)
        .json({message: "Current wordbank updated successfully"});
  } catch (error) {
    console.error("Error updating currentWordbank:", error);
    return res
        .status(500)
        .json({message: "Failed to update current wordbank"});
  }
};

const getCurrentWordbank = async (req, res) => {
  const userId = req.uid; // Extract user ID from token

  if (!userId) {
    return res.status(400).json({message: "Missing userId in the request"});
  }

  try {
    // Reference to the user's document
    const userRef = db.collection("users").doc(userId);

    // Fetch the user's document
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({message: "User not found"});
    }

    // Extract the currentWordbank field
    const {currentWordbank} = userDoc.data();

    if (!currentWordbank) {
      return res
          .status(404)
          .json({message: "No current wordbank set for this user"});
    }

    console.log(
        `Current wordbank for user "${userId}" is "${currentWordbank.label}"`,
    );
    return res.status(200).json({currentWordbank});
  } catch (error) {
    console.error("Error retrieving currentWordbank:", error);
    return res
        .status(500)
        .json({message: "Failed to retrieve current wordbank"});
  }
};

const lookupWord = async (req, res) => {
  const text = req.body.word;
  const userId = req.uid; // Extract user ID from token

  if (!text) {
    return res.status(400).json({message: "Word text is required"});
  }

  try {
    // Step 1: Query the public "wordbank" collection for a matching word by text
    const publicWordbankSnapshot = await db
        .collection("wordbank")
        .where("text", "==", text)
        .get();

    if (publicWordbankSnapshot.empty) {
      return res
          .status(404)
          .json({message: "Word not found in the public wordbank"});
    }

    // Collect matched word data from the public wordbank
    const matchedPublicWords = [];
    publicWordbankSnapshot.forEach((doc) => {
      matchedPublicWords.push({id: doc.id, ...doc.data()});
    });

    // Step 2: Extract the IDs of the matched words from the public wordbank
    const publicWordIds = matchedPublicWords.map((word) => word.id);

    // Step 3: Query the user's wordbanks to check for matching words by ID
    const userWordbanksSnapshot = await db
        .collection("users")
        .doc(userId)
        .collection("wordbanks")
        .get();

    const matchedUserWordbanks = [];

    // Loop through user's wordbanks and check if the word exists with the same ID
    userWordbanksSnapshot.forEach((wordbankDoc) => {
      const wordbankData = wordbankDoc.data();
      const matchingWords = wordbankData.words.filter((word) =>
        publicWordIds.includes(word.id),
      );

      if (matchingWords.length > 0) {
        matchedUserWordbanks.push({
          wordbankId: wordbankDoc.id,
          matchingWords,
        });
      }
    });

    // If no matches are found in user's wordbanks
    if (matchedUserWordbanks.length === 0) {
      return res
          .status(200)
          .json({message: "No matching words found in user's wordbanks"});
    }

    return res.status(200).json({
      message: "Word found",
      publicWord: matchedPublicWords,
      userWordbanks: matchedUserWordbanks,
    });
  } catch (error) {
    console.error("Error looking up word:", error);
    return res.status(500).json({message: "Failed to lookup word"});
  }
};

// Export the functions
module.exports = {
  fetchWordbanks,
  createWordbank,
  setCurrentWordbank,
  addWordsToWordbank,
  getWordsFromCurrentWordbank,
  getCurrentWordbank,
  lookupWord,
  updateWords,
  testFunction,
};
