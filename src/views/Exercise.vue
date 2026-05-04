<template>
  <div class="container">
    <!-- 做题阶段 -->
    <div v-if="!finished">
      <!-- 进度 -->
      <div class="progress">{{ currentIndex + 1 }} / {{ list.length }}</div>

      <!-- 卡片 -->
      <div class="flip_card_container">
        <div
          class="flip_card"
          :class="{ flipped: showAnswer }"
          @click="handleCardClick"
        >
          <!-- 正面：题目 -->
          <div class="face front">
            <h3>{{ current.question }}</h3>
          </div>

          <!-- 背面：答案 -->
          <div class="face back">
            <div>
              <h3>{{ isCorrect ? "✔ 正确" : "❌ 错误" }}</h3>
              <p>正确答案：{{ current.options[current.answer] }}</p>
              <p>{{ current.explanation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 选项 -->
      <div class="options">
        <label v-for="(opt, i) in current.options" :key="i">
          <input
            type="radio"
            :value="i"
            v-model="selected"
            :disabled="showAnswer"
          />
          {{ opt }}
        </label>
      </div>

      <!-- 提交 -->
      <button class="submit" @click="submit">提交</button>
    </div>

    <!-- 结果页 -->
    <div v-else class="result">
      <h2>完成！</h2>

      <p>
        正确率：
        {{ Math.round((correctCount / list.length) * 100) }}%
      </p>

      <h3>错题：</h3>

      <div v-if="wrongList.length === 0">全对 🎉</div>

      <ul v-else>
        <li v-for="(item, i) in wrongList" :key="i">
          <p>第 {{ item.index + 1 }} 题</p>
          <p>{{ item.question }}</p>
          <p>正确答案：{{ item.correct }}</p>
        </li>
      </ul>

      <button class="restart" @click="restart">再来一遍</button>
    </div>
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
const finished = ref(false);

const wrongList = ref<any[]>([]);

const current = computed(() => list[currentIndex.value]);

const isCorrect = computed(() => {
  return selected.value === current.value.answer;
});

// 提交
const submit = () => {
  if (selected.value === null || hasAnswered.value) return;

  if (selected.value === current.value.answer) {
    correctCount.value++;
  } else {
    wrongList.value.push({
      index: currentIndex.value,
      question: current.value.question,
      correct: current.value.options[current.value.answer],
    });
  }

  hasAnswered.value = true;
  showAnswer.value = true;
};

// 点击卡片 → 下一题
const handleCardClick = () => {
  if (!showAnswer.value) return;

  if (currentIndex.value < list.length - 1) {
    currentIndex.value++;
    reset();
  } else {
    finished.value = true;
  }
};

// 重置
const reset = () => {
  selected.value = null;
  showAnswer.value = false;
  hasAnswered.value = false;
};

// 再来一遍
const restart = () => {
  currentIndex.value = 0;
  correctCount.value = 0;
  wrongList.value = [];
  finished.value = false;
  reset();
};
</script>

<style scoped lang="scss">
@use "sass:color";

$primary-bg: #a3c1ad;
$text-main: #2c3e50;

.container {
  max-width: 520px;
  margin: 40px auto;
  padding: 0 16px;
  text-align: center;
}
// 做题进度
.progress {
  margin-bottom: 16px;
  font-size: 14px;
  opacity: 0.6;
}
// 卡片容器
.flip_card_container {
  width: 100%;
  height: 220px;
  perspective: 1000px;
  margin-bottom: 20px;
  // 卡片和卡片效果
  .flip_card {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.6s;

    &:hover {
      transform: translateY(-4px);
    }

    &.flipped {
      transform: rotateY(180deg);
    }

    .face {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      backface-visibility: hidden;
    }
    .front {
      transform: rotateY(0deg);
      h3 {
        font-size: 18px;
        line-height: 1.5;
      }
    }
    .back {
      transform: rotateY(180deg);

      h3 {
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }
}

.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
  margin-bottom: 12px;
}

/* 按钮 */
.submit,
.restart {
  background: linear-gradient(
    135deg,
    color.adjust($primary-bg, $lightness: 6%),
    color.adjust($primary-bg, $lightness: -6%)
  );

  color: $text-main;

  border-radius: 999px;
  padding: 10px 18px;
  border: none;
  cursor: pointer;

  transition: all 0.2s ease;

  /* 关键：让按钮“浮出来”，而不是融进去 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.6) inset;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1) inset;
  }
}

.result {
  text-align: left;

  h2 {
    text-align: center;
  }

  ul {
    margin-top: 10px;
    padding-left: 0;
    list-style: none;

    li {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 10px;

      background: rgba(255, 0, 0, 0.05);
    }
  }
}
</style>
