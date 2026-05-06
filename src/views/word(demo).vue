<template>
  <div class="container">
    <!-- 学习阶段 -->
    <div v-if="!finished">
      <!-- 进度 -->
      <div class="progress">{{ currentIndex + 1 }} / {{ list.length }}</div>

      <!-- 卡片 -->
      <div class="flip_card_container">
        <div class="flip_card" :class="{ flipped }" @click="flipCard">
          <!-- 正面：单词 -->
          <div class="face front">
            <h2>{{ current.word }}</h2>
          </div>

          <!-- 背面：信息 -->
          <div class="face back">
            <div>
              <h3>读音：{{ current.reading }}</h3>
              <p>中文意思：{{ current.meaning }}</p>
              <p>声调：{{ current.accent }}</p>
              <p class="example">例句：{{ current.example }}</p>
              <p class="example chn">
                例句解释：{{ current["example（CHN）"] }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮（翻面后出现） -->
      <div class="actions" v-if="flipped">
        <button @click="markKnown">认识 👍</button>
        <button @click="markUnknown">不认识 👎</button>
      </div>
    </div>

    <!-- 结果页 -->
    <div v-else class="result">
      <h2>完成！</h2>

      <p>认识：{{ knownCount }} / {{ list.length }}</p>

      <h3>不认识的单词：</h3>

      <div v-if="unknownList.length === 0">全认识 🎉</div>

      <ul v-else>
        <li v-for="(item, i) in unknownList" :key="i">
          <p>{{ item.word }}（{{ item.reading }}）</p>
          <p>{{ item.meaning }}</p>
        </li>
      </ul>

      <!-- 按钮 -->
      <div class="actions">
        <button @click="restart">重新全部</button>

        <button v-if="unknownList.length > 0" @click="restartWrong">
          再刷错词
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import rawList from "../content/japanese/words/N5words_demo.json";

const mode = ref<"all" | "wrong">("all");
const currentIndex = ref(0);
const flipped = ref(false);
const finished = ref(false);

const knownCount = ref(0);
const unknownList = ref<any[]>([]);

// 洗牌
const shuffle = (arr: any[]) => {
  const newArr = [...arr];

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const list = ref(shuffle(rawList));
const current = computed(() => list.value[currentIndex.value]);

// 翻卡
const flipCard = () => {
  flipped.value = !flipped.value;
};
// 标记认识
const markKnown = () => {
  knownCount.value++;
  if (mode.value === "wrong") {
    // 如果错的全认识了，就从错词中“消除”
    unknownList.value = unknownList.value.filter(
      (item) => item !== current.value
    );
  }
  next();
};
// 标记不认识
const markUnknown = () => {
  unknownList.value.push(current.value);
  next();
};
// 下一张
const next = () => {
  if (currentIndex.value < list.value.length - 1) {
    currentIndex.value++;
    flipped.value = false;
  } else {
    finished.value = true;
  }
};
// 重做一次
const restart = () => {
  list.value = shuffle(rawList);

  currentIndex.value = 0;
  flipped.value = false;
  finished.value = false;
  knownCount.value = 0;
  unknownList.value = [];
  mode.value = "all";
};
// 错题再刷
const restartWrong = () => {
  if (unknownList.value.length === 0) return;

  list.value = shuffle(unknownList.value);

  currentIndex.value = 0;
  flipped.value = false;
  finished.value = false;
  knownCount.value = 0;

  mode.value = "wrong";
};
</script>

<style scoped lang="scss">
.container {
  max-width: 520px;
  margin: 40px auto;
  text-align: center;
}

.progress {
  margin-bottom: 16px;
  opacity: 0.6;
}

.flip_card_container {
  width: 100%;
  height: 220px;
  perspective: 1000px;
  margin-bottom: 20px;
}

.flip_card {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s;

  &.flipped {
    transform: rotateY(180deg);
  }
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);

  backface-visibility: hidden;
}

.front h2 {
  font-size: 28px;
}

.back {
  transform: rotateY(180deg);

  h3 {
    margin-bottom: 6px;
  }

  p {
    font-size: 14px;
  }

  .example {
    margin-top: 6px;
    opacity: 0.7;
  }

  .chn {
    font-size: 13px;
    opacity: 0.6;
  }
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 12px;

  button {
    padding: 8px 16px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
  }
}

.result {
  text-align: left;
}
</style>
