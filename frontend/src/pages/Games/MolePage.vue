<template>
  <div class="game-container">
    <h4>打地鼠游戏 - Pinyin Whack-a-Mole</h4>

    <br />
    <q-btn color="red" :disabled="!isLoaded" @click="startGame">{{
      isLoaded ? 'Start' : 'Loading...'
    }}</q-btn>

    <h4>当前拼音: {{ currentPinyin }}</h4>
    <p class="text">Score: {{ score }} Wrong: {{ totalWrongTimes }}</p>

    <!-- Moles grid -->
    <div class="grid">
      <div
        v-for="(hole, index) in holes"
        :key="index"
        class="hole"
        @click="hitMole(index)"
      >
        <div v-if="hole" class="mole">{{ hole.text }}</div>
      </div>
    </div>

    <!-- Show error message if the wrong mole is clicked -->
    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>

    <!-- Start Button -->

    <!-- Button to proceed to the next round if the user doesn't hit a mole -->
    <br />
    <q-btn color="primary" v-if="showNextRoundButton" @click="nextRound"
      >Time is Up</q-btn
    >

    <!-- Back to Main Page Button -->
    <br />
    <br />
    <q-btn color="secondary" @click="$router.push('/game')">返回</q-btn>

    <q-btn color="secondary" @click="goBack">返回主页面</q-btn>
  </div>
</template>

<script>
import { ref, onUnmounted, onMounted } from 'vue';
import {
  getCurrentWordbank,
  fetchWordsFromWordbank,
  getRandomWords,
  updateWords,
} from 'src/api/words'; // API functions
import { useRouter } from 'vue-router';

export default {
  name: 'WhackAMolePinyin',
  setup() {
    const router = useRouter();
    const holes = ref(Array(9).fill(null)); // Initialize 9 holes with null (no moles)
    const score = ref(0);
    const totalWrongTimes = ref(0);
    const errorMessage = ref(''); // Error message
    const showNextRoundButton = ref(false); // Show 'Next Round' button
    const currentPinyin = ref(''); // Store the current Pinyin to guess
    const isLoaded = ref(false); // Track whether words are loaded
    let words = []; // Word list
    let correctWord = null; // Correct word for the current Pinyin
    let timer = null; // Timer for interval management

    var currentWordbank = ref(null); // Store the current wordbank

    // Fetch words from the current wordbank
    const fetchWords = async () => {
      try {
        // Get the current wordbank ID

        // Fetch words from the current wordbank
        const wordsResponse = await fetchWordsFromWordbank();
        words = wordsResponse; // Store the fetched words
        isLoaded.value = true; // Mark as loaded
        console.log('Words loaded successfully');
        console.log(words);
      } catch (error) {
        console.error('Error fetching words:', error);
        errorMessage.value = '无法加载词汇，请稍后再试。'; // Error message in Chinese
      }
    };

    const startGame = () => {
      score.value = 0; // Reset score
      totalWrongTimes.value = 0; // Reset wrong times
      errorMessage.value = ''; // Reset error message
      showNextRoundButton.value = false; // Reset 'Next Round' button visibility

      if (timer) {
        clearInterval(timer);
      }

      nextRound(); // Start the first round

      // Start a new round every 5 seconds if no mole is clicked
      timer = setInterval(() => {
        showNextRoundButton.value = true; // Show 'Next Round' button
        var toUpdateWords = [];
        correctWord.wrongTimes++;
        toUpdateWords.push({
          id: correctWord.id,
          wrongTimes: correctWord.wrongTimes,
        });
        updateWords(currentWordbank.value, toUpdateWords);
      }, 5000);
    };

    const nextRound = () => {
      errorMessage.value = ''; // Clear error message
      showNextRoundButton.value = false; // Hide 'Next Round' button
      clearInterval(timer); // Clear timer

      // Randomly select a correct word from the list
      correctWord = words[Math.floor(Math.random() * words.length)];
      currentPinyin.value = correctWord.pinyin; // Display the correct Pinyin

      // Filter words with the same text length as the correct word
      const wordsWithSameLength = words.filter(
        (word) => word.text.length === correctWord.text.length
      );

      // Get 3 random words (2 incorrect + 1 correct)
      const wordOptions = getRandomWords(wordsWithSameLength, correctWord, 2);

      // Populate 3 random mole positions with words
      const moleIndices = getRandomMoleIndices(3); // Get 3 random indices
      holes.value = Array(9).fill(null); // Reset holes
      moleIndices.forEach((index, i) => {
        holes.value[index] = wordOptions[i]; // Assign a word
      });

      // Start the timer for the next round
      timer = setInterval(() => {
        showNextRoundButton.value = true;
      }, 5000);
    };

    // Function to get distinct random indices for moles
    const getRandomMoleIndices = (count) => {
      const indices = [];
      while (indices.length < count) {
        const randomIndex = Math.floor(Math.random() * holes.value.length);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }
      return indices;
    };

    const hitMole = (index) => {
      var toUpdateWords = [];
      const selectedWord = holes.value[index];
      if (
        selectedWord &&
        selectedWord.pinyin &&
        selectedWord.pinyin === currentPinyin.value
      ) {
        score.value++; // Increment score
        selectedWord.rightTimes++;
        toUpdateWords.push({
          id: selectedWord.id,
          rightTimes: selectedWord.rightTimes,
        });
        updateWords(currentWordbank.value, toUpdateWords);
      } else {
        errorMessage.value = '选错了！继续加油！'; // Wrong selection message
        totalWrongTimes.value++;
        selectedWord.wrongTimes++;
        correctWord.wrongTimes++;
        toUpdateWords.push({
          id: selectedWord.id,
          wrongTimes: selectedWord.wrongTimes,
        });
        toUpdateWords.push({
          id: correctWord.id,
          wrongTimes: correctWord.wrongTimes,
        });
        updateWords(currentWordbank.value, toUpdateWords);
      }
      nextRound(); // Start the next round
    };

    const goBack = () => {
      router.push('/main'); // Navigate back to the main page
    };

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer); // Clear the timer
      }
    });

    onMounted(async () => {
      currentWordbank.value = (await getCurrentWordbank()).currentWordbank.value;
      console.log('Current Wordbank:', currentWordbank.value);
      fetchWords(); // Fetch words when the component is mounted
    });

    // Fetch words from the wordbank and start the game
    return {
      holes,
      score,
      totalWrongTimes,
      currentPinyin,
      startGame,
      hitMole,
      goBack,
      nextRound,
      showNextRoundButton,
      errorMessage,
      isLoaded,
    };
  },
};
</script>

<style scoped>
.game-container {
  text-align: center;
  margin-top: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px); /* 3 columns for 9 holes */
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

/* Mole container */
.hole {
  width: 100px;
  height: 100px;
  background-color: #fd9800;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  margin: 20px;
}

/* Mole with a picture */
.mole {
  width: 100px; /* Make the mole bigger */
  height: 120px;
  background-image: url('../../public/images/mole.png'); /* Add the image */
  background-size: cover; /* Ensure the image covers the entire mole */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Ensure no image repetition */
  border-radius: 30%;
  position: absolute;
  bottom: -150px; /* Start from outside the hole (below the visible area) */
  animation: popUp 0.5s ease forwards; /* Control the pop-up animation */

  font-size: 32px; /* Adjust the font size to make the text bigger */
  color: black; /* Set a color for the text to make it stand out */
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text {
  font-size: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
}

/* Keyframes for the pop-up animation */
@keyframes popUp {
  0% {
    bottom: -80px; /* Start from below the hole */
  }
  100% {
    bottom: 10px; /* Move to a position inside the hole */
  }
}
</style>
