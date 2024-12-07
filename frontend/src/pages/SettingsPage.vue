<template>
    <q-page class="q-pa-md">
      <q-card class="q-pa-md" style="max-width: 800px; margin: auto;">
        <q-card-section>
          <div class="text-h6 text-center q-mb-md">Manage Word Banks</div>
          <div class="text-h7 text-center q-mb-md">Current Word Bank: {{selectedWordbank}}</div>
  
          <!-- Dropdown to select a wordbank -->
          <q-select
            v-model="selectedWordbank"
            :options="wordbankOptions"
            label="Select Word Bank"
            outlined
            class="q-mb-md"
          />
  
          <!-- Button to confirm the selected wordbank -->
          <q-btn
            label="Confirm Word Bank"
            color="primary"
            class="full-width q-mb-md"
            :disable="!selectedWordbank"
            @click="confirmSelection"
          />
  
          <!-- Section to add a new wordbank -->
          <div class="text-h6 text-center q-mb-md">Create a New Word Bank</div>
          <q-input
            v-model="newWordbankName"
            label="New Word Bank Name"
            outlined
            dense
            class="q-mb-md"
          />
          <q-btn
            label="Add Word Bank"
            color="primary"
            class="full-width q-mb-md"
            @click="addWordbank"
          />
  
          <!-- Feedback message -->
          <q-banner v-if="feedbackMessage" dense class="q-mt-md">
            {{ feedbackMessage }}
          </q-banner>
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
    </q-page>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import { fetchWordbanks, createWordbank, setCurrentWordbank ,getCurrentWordbank} from 'src/api/words'; // Import the setCurrentWordbank API function
  
  export default {
    name: 'SettingsPage',
    setup() {
      const wordbankOptions = ref([]); // List of available wordbanks
      const selectedWordbank = ref(null); // Currently selected wordbank
      const newWordbankName = ref(''); // Name for the new wordbank
      const feedbackMessage = ref(''); // Feedback message for the user
      const $q = useQuasar(); // Quasar Notify plugin
  
      // Load the user's wordbanks from the backend
      const loadWordbanks = async () => {
        try {
          const response = await fetchWordbanks(); // Fetch wordbanks from the API
          wordbankOptions.value = response.map((wordbank) => ({
            label: wordbank.name, // Display the name of the wordbank
            value: wordbank.id,  // Use the ID as the value
          }));
  
          // Automatically select the first wordbank if available
        
          
        } catch (error) {
          $q.notify({
            color: 'negative',
            message: 'Failed to load wordbanks',
            position: 'top',
          });
        }
      };

      const loadCurrentWordbank = async () => {
        try {
          const currentWordbank = await getCurrentWordbank();
          selectedWordbank.value = currentWordbank.label; 
          console.log(currentWordbank);
        } catch (error) {
          $q.notify({
            color: 'negative',
            message: 'Failed to load wordbanks',
            position: 'top',
          });
        }
      };
  
      // Confirm the selected wordbank
      const confirmSelection = async () => {
        if (!selectedWordbank.value) {
          $q.notify({
            color: 'negative',
            message: 'No wordbank selected!',
            position: 'top',
          });
          return;
        }
  
        try {
          // Set the current wordbank for the user
          await setCurrentWordbank(selectedWordbank.value);
  
          const selectedWordbankName = wordbankOptions.value.find(
            (bank) => bank.value === selectedWordbank.value
          )?.label;
  
          feedbackMessage.value = `You selected the wordbank: ${selectedWordbankName}`;
          $q.notify({
            color: 'positive',
            message: 'Wordbank selected successfully!',
            position: 'top',
          });
        } catch (error) {
          $q.notify({
            color: 'negative',
            message: 'Failed to set the current wordbank',
            position: 'top',
          });
        }
      };
  
      // Add a new wordbank
      const addWordbank = async () => {
        if (!newWordbankName.value.trim()) {
          $q.notify({
            color: 'negative',
            message: 'Please enter a valid wordbank name',
            position: 'top',
          });
          return;
        }
  
        try {
          const newWordbank = await createWordbank(newWordbankName.value); // Create the wordbank in the backend
          wordbankOptions.value.push({
            label: newWordbank.name,
            value: newWordbank.id,
          });
  
          // Automatically select the new wordbank
          selectedWordbank.value = newWordbank.id;
          newWordbankName.value = ''; // Clear the input field
  
          $q.notify({
            color: 'positive',
            message: 'Wordbank created successfully!',
            position: 'top',
          });
        } catch (error) {
          $q.notify({
            color: 'negative',
            message: 'Failed to create wordbank',
            position: 'top',
          });
        }
      };
  
      // Load wordbanks on component mount
      onMounted(loadWordbanks);
      onMounted(loadCurrentWordbank);
      return {
        wordbankOptions,
        selectedWordbank,
        newWordbankName,
        feedbackMessage,
        confirmSelection,
        addWordbank,
      };
    },
  };
  </script>
  
  <style scoped>
  .full-width {
    width: 100%;
  }
  </style>
  