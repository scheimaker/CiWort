<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md" style="max-width: 800px; margin: auto;">
      <q-card-section>  
        <q-btn label="test" @click="testClick"></q-btn>
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-center q-mb-md">Manage Word Banks</div>

        
        

      
        <!-- Dropdown to select a wordbank -->
        <q-select
          v-model="selectedWordbank"
          :options="wordbankOptions"
          label="Select Word Bank"
          outlined
          class="q-mb-md"
        />

        <!-- Button to add a new wordbank -->
        <q-input
          v-model="newWordbankName"
          label="New Word Bank Name"
          outlined
          dense
          class="q-mb-md"
        />
        <q-btn label="Add Word Bank" color="primary" class="full-width q-mb-md" @click="addWordbank" />

       
      </q-card-section>

      <!-- Remaining sections for word input -->
      <q-card-section>
        <div class="text-h6 text-center q-mb-md">Enter Words or Phrases</div>

        <!-- Radio button group for switching between word and phrase mode -->
        <q-option-group
          v-model="inputType"
          :options="inputTypes"
          label="Select Input Type"
          type="radio"
          class="q-mb-md"
          inline
        />

        <!-- Radio button for language selection -->
        <q-option-group
          v-model="selectedLanguage"
          :options="languages"
          label="Select Language"
          type="radio"
          class="q-mb-md"
          inline
        />

        <!-- Input Box with Check Button -->
        <q-input
          v-model="inputText"
          label="Input words or phrases (split by space or newline)"
          outlined
          clearable
          type="textarea"
          rows="6"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-btn label="Check" color="primary" @click="processWords" />
          </template>
        </q-input>
      </q-card-section>

      <!-- Grid View to Display Words or Phrases -->
      <q-card-section v-if="words.length">
        <q-table
          :rows="words"
          :columns="columns"
          row-key="index"
          editable
          class="q-mb-md"
        >
          <template v-slot:body-cell-word="props">
            <q-td :props="props">
              <q-input
                v-model="props.row.word"
                dense
                outlined
                class="full-width"
              />
            </q-td>
          </template>
        </q-table>

        <!-- Submit Button -->
        <q-btn
          label="Submit Words or Phrases"
          color="primary"
          class="full-width"
          @click="submitWords"
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
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { submitWordsToWordbank, fetchWordbanks, createWordbank ,testFunction, getCurrentWordbank} from 'src/api/words';

export default {
  setup() {
    const inputText = ref('');
    const words = ref([]);
    const wordbankOptions = ref([]);
    const selectedWordbank = ref(null);
    const newWordbankName = ref('');
    // const selectedWordbankName = ref('');
    const selectedLanguage = ref('CHN');
    const inputType = ref('word');
    var currentWordbank = null;
    const inputTypes = [
      { label: 'Word', value: 'word' },
      { label: 'Phrase', value: 'phrase' },
    ];

    const languages = [
      { label: 'Chinese', value: 'CHN' },
      { label: 'English', value: 'ENG' },
      { label: 'German', value: 'DEU' },
    ];

    const columns = [
      {
        name: 'word',
        required: true,
        label: 'Word/Phrase',
        align: 'left',
        field: 'word',
        format: (val) => `${val}`,
        editable: true,
      },
    ];

    const $q = useQuasar();

    const loadWordbanks = async () => {
      try {
        const response = await fetchWordbanks();
        wordbankOptions.value = response.map((wordbank) => ({
          label: wordbank.name,
          value: wordbank.id,
        }));

        if (response.length > 0) {
           currentWordbank = await getCurrentWordbank();
          selectedWordbank.value = currentWordbank.label;
        }
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: 'Failed to load wordbanks',
          position: 'top',
        });
      }
    };

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
        const newWordbank = await createWordbank(newWordbankName.value);
        wordbankOptions.value.push({
          label: newWordbank.name,
          value: newWordbank.id,
        });
        selectedWordbank.value = newWordbank.id;
        newWordbankName.value = '';

        $q.notify({
          color: 'positive',
          message: 'Wordbank created successfully',
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

    const processWords = () => {
      if (inputType.value === 'word') {
        const wordList = inputText.value
          .split(/[\s\n]+/)
          .filter((word) => word.trim() !== '');

        words.value = wordList.map((word, index) => ({
          word,
          index,
          language: selectedLanguage.value,
        }));
      } else if (inputType.value === 'phrase') {
        words.value = [
          {
            word: inputText.value,
            index: 0,
            language: selectedLanguage.value,
          },
        ];
      }
    };

    const submitWords = async () => {
      if (!selectedWordbank.value) {
        $q.notify({
          color: 'negative',
          message: 'Please select a wordbank',
          position: 'top',
        });
        return;
      }

      try {
        await submitWordsToWordbank(
          currentWordbank.value,
          words.value.map((item) => ({ text: item.word, language: item.language }))
        );

        $q.notify({
          color: 'positive',
          message: 'Words or phrases submitted successfully!',
          position: 'top',
        });

        inputText.value = '';
        words.value = [];
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: 'Failed to submit words or phrases',
          position: 'top',
        });
      }
    };

    const testClick = async () => {
      try {
        console.log('test click');
        await testFunction();
      } catch (error) {
        console.log(error);
        $q.notify({
          
          color: 'negative',
          message: 'Failed to test function',
          position: 'top',
        });
      }
    };

    onMounted(loadWordbanks);

    return {
      inputText,
      words,
      wordbankOptions,
      selectedWordbank,
      newWordbankName,
      selectedLanguage,
      testClick,
      inputType,
      inputTypes,
      languages,
      columns,
      processWords,
      submitWords,
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
