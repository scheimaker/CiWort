<template>
  <q-layout>
    <!-- Header with Settings Button -->
    <q-header elevated>
      <q-toolbar class="custom-toolbar">
        <q-item-label class="q-ml-auto text-center">
          Current Wordbank: {{ currentWordbank }}</q-item-label
        >
        <!-- Button to navigate to SettingsPage -->
        <q-btn
          flat
          dense
          round
          icon="settings"
          aria-label="Settings"
          @click="navigateTo('/settings')"
          class="q-ml-auto "
        />
      </q-toolbar>
    </q-header>

    <q-page class="row justify-center items-center q-pa-md">
      <!-- Bubble Buttons -->
       <q-card-section/> 
      
      <div class="bubbles-container">
        <q-btn
          v-for="(item, index) in bubbles"
          :key="index"
          class="bubble-button"
          :style="{ animationDelay: `${index * 0.5}s` }"
          unelevated
          @click="navigateTo(item.route)"
        >
          <template v-slot:default>
            <div class="bubble-content">
              <div
                class="bubble-front"
                :style="{ backgroundColor: item.color }"
              >
                <span>{{ item.label }}</span>
              </div>
              <div class="bubble-back">
                <img :src="item.image" alt="" class="bubble-image-full" />
              </div>
            </div>
          </template>
        </q-btn>
      </div>
    </q-page>
  </q-layout>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentWordbank } from 'src/api/words'; // Assume this API fetches the current wordbank

const router = useRouter();
const bubbles = ref([
  {
    label: 'Input',
    route: '/input',
    color: '#87cefa',
    image: '../public/images/input.png',
  },
  {
    label: 'Flash',
    route: '/flash',
    color: '#32cd32',
    image: '../public/images/flash.png',
  },
  {
    label: 'Learn',
    route: '/learn',
    color: '#ff7f50',
    image: '../public/images/learn.png',
  },
  {
    label: 'Quiz',
    route: '/quiz',
    color: '#ffd700',
    image: '../public/images/quiz.png',
  },
  {
    label: 'Game',
    route: '/game',
    color: '#800080',
    image: '../public/images/game.png',
  },
  {
    label: 'Dictionary',
    route: '/dictionary',
    color: '#804080',
    image: '../public/images/game.png',
  },
]);

// Global variable for currentWordbank
const currentWordbank = ref(null);
 // Provide currentWordbank globally
 provide('currentWordbank', currentWordbank);
const navigateTo = (route) => {
  router.push(route);
};

// Fetch current wordbank on component mount
onMounted(async () => {
  try {
    const response = await getCurrentWordbank();
    currentWordbank.value = response.value.value; // Save current wordbank globally
    console.log('Current Wordbank:', currentWordbank.value);
   
  } catch (error) {
    console.error('Failed to fetch current wordbank:', error);
    currentWordbank.value = 'Unknown'; // Fallback if fetching fails
  }
});
</script>

<style scoped>
.q-page {
  background-color: #f5f5f5;
  overflow: hidden;
}

.current-wordbank-label {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.bubbles-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.bubble-button {
  border-radius: 60% !important;
  width: 200px !important;
  height: 180px !important;
  margin: 20px;
  font-size: 18px;
  animation: float 4s ease-in-out infinite;
  color: white;
  transition: transform 0.6s, animation-duration 0.3s;
  overflow: hidden;
  perspective: 1000px;
}

.bubble-button:hover {
  transform: scale(1.1);
  animation-duration: 1s;
}

.bubble-content {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.bubble-button:hover .bubble-content {
  transform: rotateY(180deg);
}

.bubble-front,
.bubble-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 150%;
}

.bubble-front {
  background-color: inherit;
}

.bubble-back {
  transform: rotateY(180deg);
}

.bubble-image-full {
  width: 120%;
  height: 120%;
  object-fit: cover;
}

.custom-toolbar {
  height: 10px; /* Adjust the height */
  background-color: #ffffff; /* Set your desired background color */
  color: rgb(0, 153, 255); /* Optional: change text color */
  font-size: 18px; /* Optional: adjust font size */
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
