<template>
    <q-page class='game-page'>
      <q-card class='q-pa-md text-center q-mb-md'>
        <q-title>Game List</q-title>
      </q-card>
  
      <q-card-section>
        <div class='q-gutter-md'>
          <!-- Loop through the games array to display game cards -->
          <q-card v-for='game in games' :key='game.id' class='game-card'>
            <q-card-section>
              <!-- Game Title -->
              <q-title>{{ game.name }}</q-title>
            </q-card-section>
  
            <q-card-section>
              <!-- Game Description -->
              <p>{{ game.description }}</p>
            </q-card-section>
  
            <q-card-actions align='right'>
              <!-- Start Game Button -->
              <q-btn
                :label="'Play ' + game.name"
                color='primary'
                @click='navigateToGame(game.route)'
              />
            </q-card-actions>
          </q-card>
        </div>
      </q-card-section>
    </q-page>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const router = useRouter();
  
      // Sample game data
      const games = ref([
      {
          id: 1,
          name: 'Hit a Mole Game',
          description: 'Test your memory by matching cards.',
          route: '/mole',
        },
        {
          id: 2,
          name: 'Memory Game',
          description: 'Test your memory by matching cards.',
          route: '/memory-game',
        },
        {
          id: 3,
          name: 'Trivia Quiz',
          description: 'Challenge your knowledge with a fun quiz.',
          route: '/trivia-quiz',
        },
        {
          id: 4,
          name: 'Word Search',
          description: 'Find hidden words in a puzzle.',
          route: '/word-search',
        },
      ]);
  
      // Navigation function to go to a specific game route
      const navigateToGame = (route) => {
        router.push(route);
      };
  
      return {
        games,
        navigateToGame,
      };
    },
  };
  </script>
  
  <style scoped>
  .game-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .game-card {
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
  </style>
  