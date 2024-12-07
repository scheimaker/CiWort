<template>
  <div class="game-container">
    <!-- Toggle Mode Button -->
    
    <br />
    <button class="mode-toggle" @click="toggleMode">
      {{ currentMode === 'pinyinToText' ? '切换到选择拼音' : '切换到选择文本' }}
    </button>

    <!-- 显示拼音或文本 -->
    <div class="pinyin-display">
      <h2>{{ currentMode === 'pinyinToText' ? currentPinyin : currentText }}</h2>
    </div>

    <!-- 显示地鼠 -->
    <div class="mole-container">
      <button
        v-for="(word, index) in moleWords"
        :key="index"
        class="mole"
        @click="handleMoleClick(word)"
      >
        {{ currentMode === 'pinyinToText' ? word.text : word.pinyin }}
      </button>
    </div>

    <!-- 显示分数 -->
    <div class="score-display">
      <p>得分: {{ score }}</p>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import {  getRandomWords, fetchWordsFromWordbank  } from 'src/api/words'; // Import backend API functions

var words = [];
const moleWords = ref([]);

const currentPinyin = ref('');
const currentText = ref('');
const score = ref(0);
const currentMode = ref('pinyinToText'); // Define the current game mode ('pinyinToText' or 'textToPinyin')

// 获取词汇并初始化游戏
const initializeGame = async () => {
  try {
    const response = await fetchWordsFromWordbank(); // Fetch words from the backend
    console.log(response);
    if (response ) {
      words = response;

      startNewRound(words);
    } else {
      console.error('Failed to fetch words or no words available.');
    }
  } catch (error) {
    console.error('Error fetching words:', error);
  }
};

// 开始新的一轮
const startNewRound = (allWords) => {
  if (!allWords || allWords.length === 0) {
    console.error('No words available to start a new round.');
    return;
  }

  const randomIndex = Math.floor(Math.random() * allWords.length);
  const correctWord = allWords[randomIndex];

  // Check if correctWord is defined
  if (!correctWord) {
    console.error('Correct word is undefined.');
    return;
  }

  if (currentMode.value === 'pinyinToText') {
    currentPinyin.value = correctWord.pinyin;
    currentText.value = '';
  } else {
    currentText.value = correctWord.text;
    currentPinyin.value = '';
  }

  moleWords.value = getRandomWords(allWords, correctWord,6);
};

// 切换模式
const toggleMode = () => {
  currentMode.value = currentMode.value === 'pinyinToText' ? 'textToPinyin' : 'pinyinToText';
  startNewRound(words);
};

// 处理玩家点击地鼠
const handleMoleClick = (selectedWord) => {
  let isCorrect = false;
  if (currentMode.value === 'pinyinToText') {
    const correctWord = moleWords.value.find((word) => word.pinyin === currentPinyin.value);
    isCorrect = selectedWord.text === correctWord.text;
  } else {
    const correctWord = moleWords.value.find((word) => word.text === currentText.value);
    isCorrect = selectedWord.pinyin === correctWord.pinyin;
  }

  if (isCorrect) {
    score.value += 1; // 玩家选择正确，增加得分
    startNewRound(words); // 开始下一轮
  } else {
    alert('选择错误，继续加油！');
  }
};

onMounted(initializeGame);
</script>

<style scoped>
.game-container {
  text-align: center;
}

.pinyin-display {
  margin-bottom: 20px;
  font-size: 24px;
}

.mole-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.mole {
  font-size: 24px;
  padding: 10px;
  background-color: #f0c040;
  border: none;
  cursor: pointer;
}

.score-display {
  font-size: 20px;
}

.mode-toggle {
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
}
</style>
