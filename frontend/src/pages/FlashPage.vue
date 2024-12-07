<template>
  <q-page class="q-pa-md row justify-center items-center">
    <!-- Flashcard QCard -->
    <div class="column q-col-gutter-md" style="width: 100%; max-width: 600px">
      <q-card class="q-pa-md">
        <q-card-section class="text-center">
          <div class="text-h5">
            Score: {{ TotalRightTimes }} Wrong: {{ TotalWrongTimes }}
          </div>
        </q-card-section>
      </q-card>

      <q-card
        v-if="currentWord"
        class="q-pa-md"
        style="max-width: 600px; width: 100%"
      >
        <q-card-section class="text-center">
          <!-- Make the word text larger -->
          <div class="text-h1 q-mb-md">{{ currentWord.text }}</div>
        </q-card-section>

        <q-card-section class="text-center q-mt-md">
          <!-- "Yes I know" button with larger size -->
          <q-btn
            label="Yes I know"
            color="positive"
            class="q-mr-md q-px-lg q-py-md"
            style="font-size: 1.2rem"
            @click="handleYes"
          />

          <!-- "No" button with larger size -->
          <q-btn
            label="No"
            color="negative"
            class="q-px-lg q-py-md"
            style="font-size: 1.2rem"
            @click="handleNo"
          />
        </q-card-section>

        <q-card-section class="text-center">
          <q-btn label="Back" color="blue" @click="handleBack" />
        </q-card-section>
      </q-card>

      <div v-else>
        <q-banner class="q-mt-md" type="positive" icon="check_circle">
          All words reviewed. Great job!
        </q-banner>
      </div>
    </div>
    <!-- Responsive Star Container -->
    <div class="star-container row no-wrap">
      <div v-for="(star, index) in starCount" :key="index" class="star-static">
        ⭐
      </div>
    </div>

    <!-- Moving star element -->
    <div v-if="showMovingStar" class="star-moving" ref="movingStar">⭐</div>
  </q-page>
</template>

<script setup lang="js">
import { ref, computed, nextTick ,onMounted} from 'vue';
import { useQuasar } from 'quasar';
import { fetchWordsFromWordbank ,updateWords,getCurrentWordbank} from 'src/api/words'; // Import backend API functions
import { useRouter } from 'vue-router';

const router = useRouter();
const $q = useQuasar();
const TotalRightTimes = ref(0);
const TotalWrongTimes = ref(0);

// State: Words and the index of the current word
let words = ref([]); // Words array fetched from the backend
const currentIndex = ref(0); // Index of the current word
const starCount = ref(0); // Star counter

const showMovingStar = ref(false); // Track if the moving star is visible
const movingStar = ref(null); // Reference for the moving star

// Compute the current word reactively based on the current index
const currentWord = computed(() => words.value[currentIndex.value]);
var currentWordbank = ref(null); // Store the current wordbank

console.log(currentWord.value);
// Fetch words from the backend and shuffle them
const fetchWords = async () => {
  try {
    const response = await fetchWordsFromWordbank(); // Fetch words from the backend
    console.log(response);
    words.value = response; // Populate the words array
    // console.log(words.value);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Failed to load words',
      position: 'top',
    });
  }
};




// "Yes I know" button click handler
const handleYes = async () => {
  if (currentWord.value) {
    TotalRightTimes.value++;
    currentWord.value.rightTimes++;
    var toUpdateWords = [];
    toUpdateWords.push({
          id: currentWord.value.id,
          rightTimes: currentWord.value.rightTimes,
        });
        goToNextWord();
    await updateWords(toUpdateWords); // Update the word on the backend

    await animateStar(); // Animate a star toward the star container
    
  }
};

// "No" button click handler
const handleNo = async () => {
 // Update the word on the backend
TotalWrongTimes.value++;
var toUpdateWords = [];
  if (currentWord.value) {
    toUpdateWords.push({
          id: currentWord.value.id,
          wrongTimes: currentWord.value.wrongTimes,
        });
    await updateWords(toUpdateWords);
    goToNextWord();
  }
};

// Navigate back to the main page
const handleBack = () => {
  router.push('main');
};

// Animate a star toward the end of the star line in the star container
const animateStar = async () => {
  showMovingStar.value = true;

  await nextTick(); // Wait for DOM to update

  const star = movingStar.value;
  const starContainer = document.querySelector('.star-container');

  if (star && starContainer) {
    const containerBounds = starContainer.getBoundingClientRect();
    const starBounds = star.getBoundingClientRect();

    // Get all stars in the container
    const stars = starContainer.children;
    let translateX = 0;
    let translateY = 0;

    if (stars.length > 0) {
      const lastStar = stars[stars.length - 1]; // Get the last star in the container
      const lastStarBounds = lastStar.getBoundingClientRect();

      // Calculate total width of stars in the current row
      const totalWidth = lastStarBounds.right - containerBounds.left + starBounds.width + 10; // Add margin

      // If the total width exceeds the container width, wrap to the next row
      if (totalWidth > window.innerWidth) {
        // Move to the next row by adjusting the Y-axis
        translateX = 0; // Start new row from the left
        translateY = lastStarBounds.bottom - starBounds.top + 10; // Adjust vertical position with margin
      } else {
        // Place the new star at the end of the current row
        translateX = lastStarBounds.right - starBounds.left + 10; // Adjust horizontal position with margin
        translateY = lastStarBounds.top - starBounds.top; // Keep the same row
      }
    } else {
      // If no stars exist yet, place the star at the start of the container
      translateX = containerBounds.left - starBounds.left;
      translateY = containerBounds.top - starBounds.top;
    }

    star.style.transition = 'transform 1s ease-in-out';
    star.style.transform = `translate(${translateX}px, ${translateY}px)`;

    // After the animation completes, add the star to the star container and reset
    setTimeout(() => {
      starCount.value++; // Add a new star to the container
      showMovingStar.value = false; // Hide the moving star
      star.style.transition = ''; // Reset the transition
      star.style.transform = ''; // Reset position for next animation
    }, 400);
  }
};

// Function to move to the next word
const goToNextWord = () => {
  if (currentIndex.value < words.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0; // End of the words list
  }
};

// Fetch words on mount
onMounted(async () => {
      currentWordbank.value = (await getCurrentWordbank()).currentWordbank.value;
      console.log('Current Wordbank:', currentWordbank.value);
      fetchWords(); // Fetch words when the component is mounted
    });
</script>

<style scoped>
.q-page {
  background-color: #f5f5f5;
  position: relative;
  overflow: hidden;
}

.q-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Star Container */
.star-container {
  position: fixed;
  top: 60px; /* Adjust this value to move the container down */
  left: 20px; /* Left-align the container */
  display: flex;
  flex-wrap: wrap; /* Enable wrapping of stars */
  align-items: flex-start;
  justify-content: flex-start;
  width: calc(100% - 40px); /* Responsive width */
  max-width: 100%; /* Ensure the container doesn't overflow */
  padding: 5px;
  gap: 10px; /* Space between stars */
}

/* Stars in the container */
.star-static {
  font-size: 2rem; /* Static star size */
  color: #ffd700; /* Gold star */
}

/* Moving star */
.star-moving {
  position: fixed;
  bottom: 50%;
  left: 50%;
  font-size: 2rem; /* Size of the moving star */
  color: #ffd700; /* Gold star */
  transform: translate(0, 0); /* Reset position for next move */
}
</style>
