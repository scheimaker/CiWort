const { v4: uuidv4 } = require("uuid");
const { pinyin } = require("pinyin-pro");

const LanguageType = {
  CHN: "CHN",
  DEU: "DEU",
  ENG: "ENG",
  ESP: "ESP",
  FRA: "FRA",
  ITA: "ITA",
  JPN: "JPN",
  KOR: "KOR",
  RUS: "RUS",
};

class SharedWord {
  constructor(text, language, meaning = '', partOfSpeech = '', pronunciation = '', translations = {}, interestingThings = []) {
    this.id = uuidv4(); // Unique ID (GUID)
    this.text = text; // The word text
    this.language = language; // Language of the word
    this.meaning = meaning; // Meaning of the word
    this.partOfSpeech = partOfSpeech; // Noun, verb, etc.
    this.pinyin = this.getPinyin(text); // Get Pinyin for Chinese words
    this.pronunciation = pronunciation; // Pronunciation guide
    this.translations = translations; // Translations in different languages
    this.interestingThings = interestingThings; // Additional notes or interesting facts
  }

  // Get Pinyin for a Chinese word
  getPinyin(text) {
    if (this.language === 'CHN') {
      return pinyin(text, { type: 'array' }).join(' ');
    }
    return '';
  }
}

class UserWord {
  constructor(wordId) {
    this.wordId = wordId; // Reference to the word ID in the shared database
    this.timestamps = []; // Array to store interaction history
    this.sessionCount = 0; // Number of sessions with this word
    this.correctStreak = 0; // Consecutive correct responses
    this.incorrectStreak = 0; // Consecutive incorrect responses
    this.confidenceLevel = 'low'; // Confidence level (e.g., low, medium, high)
    this.lastResponse = null; // 'correct' or 'incorrect'
    this.comments = ''; // User comments or notes about the word
  }

  // Method to add an interaction record (timestamp and correctness)
  addInteraction(correct) {
    const timestamp = new Date().toISOString();
    this.timestamps.push({ timestamp, correct });
    this.sessionCount++;

    if (correct) {
      this.correctStreak++;
      this.incorrectStreak = 0; // Reset incorrect streak on correct answer
      this.lastResponse = 'correct';
    } else {
      this.incorrectStreak++;
      this.correctStreak = 0; // Reset correct streak on incorrect answer
      this.lastResponse = 'incorrect';
    }

    // Update confidence level based on streaks (this is an example; you can customize logic)
    if (this.correctStreak >= 5) {
      this.confidenceLevel = 'high';
    } else if (this.correctStreak >= 2) {
      this.confidenceLevel = 'medium';
    } else {
      this.confidenceLevel = 'low';
    }
  }
}



module.exports = { SharedWord, UserWord, LanguageType };
