<template>
    <q-layout>
      <q-page class="row justify-center items-center q-pa-md">
        <q-card class="q-pa-md" style="max-width: 800px; width: 100%;">
          <q-card-section>
            <div class="text-h6 text-center q-mb-md">Learn New Words</div>
          </q-card-section>
  
          <q-card-section>
            <!-- Display words in chips or a message if there are no words -->
            <div class="word-container" v-if="words.length">
              <q-chip
                v-for="(word, index) in words"
                :key="index"
                color="primary"
                text-color="white"
                class="q-mb-sm"
              >
                {{ word }}
              </q-chip>
            </div>
            <div v-else class="text-center q-mt-md">No words available to learn.</div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-layout>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Sample words to learn
  const words = ref([
    'Apple',
    'Banana',
    'Cat',
    'Dog',
    'Elephant',
    'Fish',
    'Grapes',
    'Hat',
    'Ice',
    'Jacket',
  ]);
  </script>
  
  <style scoped>
  .q-page {
    background-color: #f5f5f5;
    overflow: hidden;
  }
  
  .word-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  </style>
  