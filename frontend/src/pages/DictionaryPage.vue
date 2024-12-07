<template>
  <q-page class="dictionary-page">
    <q-card class="q-pa-md">
      <!-- Page Title -->
      <div class="text-center q-mb-md">
        <q-title>Word Lookup</q-title>
      </div>

      <!-- Input Section -->
      <q-input
        v-model="wordInput"
        label="Enter a Word"
        outlined
        filled
        class="q-mb-md"
        placeholder="Type a word to search"
      />

      <!-- Search Button -->
      <q-btn
        label="Search"
        color="primary"
        class="q-mb-md"
        @click="lookupWordInDatabase"
        :disable="isLoading"
      />

      <!-- Back Button -->
     
      <!-- Output Section -->
      <q-card v-if="message" class="q-mt-md">
        <q-card-section>
          <q-title>Result:</q-title>
          <q-input
            v-model="message"
            readonly
            filled
            autogrow
            label="Result Message"
          />
        </q-card-section>
        <q-card-section>
        <q-btn
          label="Back to Home"
          color="secondary"
          class="full-width q-mb-md"
          @click="() => $router.push('/main')"
        />
      </q-card-section>
      </q-card>
    </q-card>
  </q-page>
</template>

<script>
import { lookupWord } from 'src/api/words'; // Import the API function
import { ref } from 'vue';

export default {
  setup() {
    const wordInput = ref(''); // Ref for the input field
    const message = ref(''); // Ref for the output message

    // Function to call the backend API
    const lookupWordInDatabase = async () => {
      if (!wordInput.value) {
        message.value = 'Please enter a word to search.';
        return;
      }
      try {
        // Call the API with the inputted word
        console.log('Looking up word:', wordInput.value);
        const response = await lookupWord(wordInput.value);
        
        message.value = `Word found: ${JSON.stringify(response, null, 2)}`;
      } catch (error) {
        console.error('Error:', error);
        message.value = 'An error occurred while looking up the word.';
      }
    };

    return {
      wordInput,
      message,
      lookupWordInDatabase,
    };
  },
};
</script>

<style scoped>
.dictionary-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.text-center {
  text-align: center;
}

.input-section {
  margin-bottom: 20px;
}

.word-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.search-button {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.search-button:hover {
  background-color: #0056b3;
}

.output-section {
  margin-top: 20px;
}

.result-textarea {
  width: 100%;
  height: 150px;
  padding: 10px;
  font-size: 16px;
  resize: none;
}
</style>
