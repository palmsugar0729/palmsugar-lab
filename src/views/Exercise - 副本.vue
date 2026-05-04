<template>
  <div class="container">
    <!-- 顶部导航 -->
    <div class="nav">
      <button @click="prev">上一题</button>
      <span>{{ currentIndex + 1 }} / {{ list.length }}</span>
      <button @click="next">下一题</button>
    </div>

    <!-- 卡片（只负责展示） -->
    <div class="flip_card_container">
      <div
        class="flip_card"
        :class="{ flipped: showAnswer }"
        @click="handleCardClick"
      >
        <!-- 正面 -->
        <div class="face front">
          <h3>{{ current.question }}</h3>
        </div>

        <!-- 背面 -->
        <div class="face back">
          <div>
            <h3>{{ isCorrect ? "✔ 正确" : "❌ 错误" }}</h3>
            <p>正确答案：{{ current.options[current.answer] }}</p>
            <p>{{ current.explanation }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 选项区（放外面） -->
    <div class="options">
      <div v-for="(opt, i) in current.options" :key="i">
        <label>
          <input
            type="radio"
            :value="i"
            v-model="selected"
            :disabled="showAnswer"
          />
          {{ opt }}
        </label>
      </div>
    </div>

    <!-- 提交按钮 -->
    <button class="submit" @click="submit">提交</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import list from "@/content/japanese/exercise/exercise_demo.json";

const currentIndex = ref(0);
const selected = ref<number | null>(null);
const showAnswer = ref(false);
const correctCount = ref(0);
const hasAnswered = ref(false);

const current = computed(() => list[currentIndex.value]);

const isCorrect = computed(() => {
  return selected.value === current.value.answer;
});

// 提交
const submit = () => {
  if (selected.value === null || hasAnswered.value) return;

  if (selected.value === current.value.answer) {
    correctCount.value++;
  }

  hasAnswered.value = true;
  showAnswer.value = true;
};

// 点击卡片 → 下一题
const handleCardClick = () => {
  if (showAnswer.value) {
    next();
  }
};

// 下一题
const next = () => {
  if (currentIndex.value < list.length - 1) {
    currentIndex.value++;
    reset();
  } else {
    const rate = Math.round((correctCount.value / list.length) * 100);
    alert(`完成！正确率：${rate}%`);
  }
};

// 上一题
const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    reset();
  }
};

// 重置
const reset = () => {
  selected.value = null;
  showAnswer.value = false;
  hasAnswered.value = false;
};
</script>

<style scoped lang="scss">
.flip_card_container {
  width: 300px;
  height: 200px;
  perspective: 800px;
  position: relative;
}

.flip_card {
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

  &.flipped {
    transform: rotateY(180deg);
  }
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff;
  border-radius: 10px;

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.front {
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
}

.nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.options {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.submit {
  margin-top: 12px;
}
</style>
