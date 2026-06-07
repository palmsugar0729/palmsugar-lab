<template>
  <div class="container">
    <!-- ========== Dashboard 概览 ========== -->
    <div v-if="mode === 'dashboard'" class="dashboard">
      <h1 class="title">单词记忆</h1>

      <!-- 今日概览卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-number">{{ stats.todayReviews }}</div>
          <div class="stat-label">今日待复习</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.newWords }}</div>
          <div class="stat-label">新单词</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.streakDays }}</div>
          <div class="stat-label">连续学习(天)</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.masteredWords }}</div>
          <div class="stat-label">已掌握</div>
        </div>
      </div>

      <!-- 级别进度 -->
      <div class="level-progress">
        <h3>各级别进度</h3>
        <div class="level-list">
          <div v-for="lp in levelProgress" :key="lp.level" class="level-item">
            <div class="level-name">{{ lp.level }}</div>
            <div class="level-bar">
              <div
                class="level-fill"
                :style="{ width: `${lp.total > 0 ? (lp.mastered / lp.total) * 100 : 0}%` }"
              />
            </div>
            <div class="level-count">{{ lp.mastered }}/{{ lp.total }}</div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button class="btn-primary" @click="startReview">
          📝 开始今日复习 ({{ todayTotal }})
        </button>
        <button class="btn-secondary" @click="mode = 'browse'">
          📖 浏览单词
        </button>
        <button class="btn-secondary" @click="mode = 'stats'">
          📊 学习统计
        </button>
      </div>
    </div>

    <!-- ========== 今日复习模式 ========== -->
    <div v-else-if="mode === 'review'" class="review-mode">
      <div class="review-header">
        <button class="btn-back" @click="mode = 'dashboard'">← 返回</button>
        <div class="review-progress">
          {{ currentIndex + 1 }} / {{ reviewQueue.length }}
        </div>
      </div>

      <!-- 复习队列已空 -->
      <div v-if="reviewQueue.length === 0" class="review-empty">
        <h2>🎉 今日复习已完成！</h2>
        <p>你已经完成了所有到期的复习单词。</p>
        <button class="btn-primary" @click="mode = 'dashboard'">返回主页</button>
      </div>

      <!-- 复习队列完成 -->
      <div v-else-if="currentIndex >= reviewQueue.length" class="review-empty">
        <h2>🎉 完成！</h2>
        <p>本次复习了 {{ reviewQueue.length }} 个单词</p>
        <button class="btn-primary" @click="mode = 'dashboard'">返回主页</button>
      </div>

      <!-- 单词卡片 -->
      <template v-else>
        <div class="flip_card_container">
          <div
            class="flip_card"
            :class="{ flipped: showBack }"
            @click="showBack = !showBack"
          >
            <!-- 正面：单词 -->
            <div class="face front">
              <h2 class="word-text">{{ currentWord?.word }}</h2>
              <p class="word-hint">点击翻面查看详情</p>
            </div>

            <!-- 背面：详情 -->
            <div class="face back">
              <div class="word-detail">
                <h3>{{ currentWord?.reading }}</h3>
                <p class="meaning">{{ currentWord?.meaning }}</p>
                <p class="meta">
                  <span class="type">{{ currentWord?.type }}</span>
                  <span class="accent">声调 {{ currentWord?.accent }}</span>
                </p>
                <div class="example">
                  <p>{{ currentWord?.example }}</p>
                  <p class="example-chn">{{ currentWord?.exampleTranslation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 反馈按钮（翻面后显示） -->
        <div v-if="showBack" class="review-actions">
          <button class="btn-unknown" @click.stop="handleReview('unknown')">
            😵 不认识
          </button>
          <button class="btn-vague" @click.stop="handleReview('vague')">
            😐 模糊
          </button>
          <button class="btn-known" @click.stop="handleReview('known')">
            😊 认识
          </button>
        </div>

        <p v-else class="flip-hint">点击卡片翻面</p>
      </template>
    </div>

    <!-- ========== 单词浏览模式 ========== -->
    <div v-else-if="mode === 'browse'" class="browse-mode">
      <div class="browse-header">
        <button class="btn-back" @click="mode = 'dashboard'">← 返回</button>
        <h2>单词浏览</h2>
      </div>

      <!-- 筛选 -->
      <div class="browse-filters">
        <div class="filter-group">
          <label>级别：</label>
          <select v-model="browseLevel">
            <option value="all">全部</option>
            <option v-for="lv in levels" :key="lv" :value="lv">{{ lv }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>状态：</label>
          <select v-model="browseStatus">
            <option value="all">全部</option>
            <option value="new">未学</option>
            <option value="learning">学习中</option>
            <option value="mastered">已掌握</option>
          </select>
        </div>
        <div class="filter-group search">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索单词、读音、意思..."
          />
        </div>
      </div>

      <!-- 单词列表 -->
      <div class="word-list">
        <div
          v-for="word in filteredWords"
          :key="word.id"
          class="word-item"
          :class="`status-${word.status}`"
        >
          <div class="word-main">
            <span class="word-name">{{ word.word }}</span>
            <span class="word-reading">{{ word.reading }}</span>
            <span class="word-meaning">{{ word.meaning }}</span>
          </div>
          <div class="word-tags">
            <span class="tag-level">{{ word.level }}</span>
            <span class="tag-type">{{ word.type }}</span>
            <span class="tag-status" :class="`status-${word.status}`">
              {{ statusText[word.status] }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="filteredWords.length === 0" class="empty-tip">
        没有符合条件的单词
      </div>
    </div>

    <!-- ========== 统计页 ========== -->
    <div v-else-if="mode === 'stats'" class="stats-mode">
      <div class="stats-header">
        <button class="btn-back" @click="mode = 'dashboard'">← 返回</button>
        <h2>学习统计</h2>
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">{{ stats.totalWords }}</div>
          <div class="stat-name">总单词数</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{ stats.masteredWords }}</div>
          <div class="stat-name">已掌握</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{ stats.learningWords }}</div>
          <div class="stat-name">学习中</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{ stats.newWords }}</div>
          <div class="stat-name">未学习</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{ stats.streakDays }}</div>
          <div class="stat-name">连续学习(天)</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">
            {{ stats.totalWords > 0 ? Math.round((stats.masteredWords / stats.totalWords) * 100) : 0 }}%
          </div>
          <div class="stat-name">总掌握率</div>
        </div>
      </div>

      <!-- 级别详细统计 -->
      <div class="level-stats">
        <h3>各级别详情</h3>
        <table>
          <thead>
            <tr>
              <th>级别</th>
              <th>总数</th>
              <th>已掌握</th>
              <th>学习中</th>
              <th>未学</th>
              <th>掌握率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lp in levelProgress" :key="lp.level">
              <td>{{ lp.level }}</td>
              <td>{{ lp.total }}</td>
              <td>{{ lp.mastered }}</td>
              <td>{{ lp.learning }}</td>
              <td>{{ lp.new }}</td>
              <td>{{ lp.total > 0 ? Math.round((lp.mastered / lp.total) * 100) : 0 }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Word, WordWithStatus, LearningStats, LevelProgress } from '../types/japanese'
import { getAllWords, getAllLevels } from '../api/vocabulary'
import {
  getTodayQueue,
  getStats,
  getLevelProgress,
  getWordStatus,
  submitReview,
  type ReviewQuality,
} from '../composables/useSRS'

// ========== 状态 ==========

type ViewMode = 'dashboard' | 'review' | 'browse' | 'stats'

const mode = ref<ViewMode>('dashboard')
const allWords = ref<Word[]>([])
const reviewQueue = ref<Word[]>([])
const currentIndex = ref(0)
const showBack = ref(false)

// 浏览模式筛选
const browseLevel = ref<string>('all')
const browseStatus = ref<string>('all')
const searchKeyword = ref('')

const levels = getAllLevels()
const statusText = {
  new: '未学',
  learning: '学习中',
  mastered: '已掌握',
}

// ========== 计算属性 ==========

const stats = computed<LearningStats>(() => {
  return getStats(allWords.value)
})

const levelProgress = computed<LevelProgress[]>(() => {
  return getLevelProgress(allWords.value)
})

const todayTotal = computed(() => {
  const queue = getTodayQueue(allWords.value)
  return queue.reviews.length + queue.newWords.length
})

const currentWord = computed(() => {
  if (currentIndex.value < reviewQueue.value.length) {
    return reviewQueue.value[currentIndex.value]
  }
  return undefined
})

const wordsWithStatus = computed<WordWithStatus[]>(() => {
  return allWords.value.map((word) => ({
    ...word,
    status: getWordStatus(word.id),
  }))
})

const filteredWords = computed(() => {
  let result = wordsWithStatus.value

  // 级别筛选
  if (browseLevel.value !== 'all') {
    result = result.filter((w) => w.level === browseLevel.value)
  }

  // 状态筛选
  if (browseStatus.value !== 'all') {
    result = result.filter((w) => w.status === browseStatus.value)
  }

  // 关键词搜索
  const kw = searchKeyword.value.trim()
  if (kw) {
    result = result.filter(
      (w) =>
        w.word.includes(kw) ||
        w.reading.includes(kw) ||
        w.meaning.includes(kw)
    )
  }

  return result
})

// ========== 方法 ==========

function startReview() {
  const queue = getTodayQueue(allWords.value)
  reviewQueue.value = [...queue.reviews, ...queue.newWords]
  currentIndex.value = 0
  showBack.value = false
  mode.value = 'review'
}

function handleReview(quality: ReviewQuality) {
  const word = currentWord.value
  if (!word) return

  submitReview(word.id, quality)
  showBack.value = false

  // 延迟一下再进入下一题，让用户看到反馈
  setTimeout(() => {
    currentIndex.value++
  }, 300)
}

// ========== 生命周期 ==========

onMounted(() => {
  allWords.value = getAllWords()
})
</script>

<style scoped lang="scss">
@use "sass:color";

$primary: #a3c1ad;
$primary-dark: color.adjust($primary, $lightness: -10%);
$text-main: #2c3e50;
$bg-glass: rgba(255, 255, 255, 0.75);
$shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px;
}

.title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 28px;
}

// ========== Dashboard ==========

.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: $bg-glass;
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  box-shadow: $shadow;

  .stat-number {
    font-size: 32px;
    font-weight: bold;
    color: $primary-dark;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 13px;
    opacity: 0.7;
  }
}

.level-progress {
  background: $bg-glass;
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: $shadow;

  h3 {
    margin-bottom: 12px;
    font-size: 16px;
  }
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.level-item {
  display: flex;
  align-items: center;
  gap: 10px;

  .level-name {
    width: 36px;
    font-size: 14px;
    font-weight: bold;
  }

  .level-bar {
    flex: 1;
    height: 10px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 999px;
    overflow: hidden;
  }

  .level-fill {
    height: 100%;
    background: linear-gradient(90deg, $primary, $primary-dark);
    border-radius: 999px;
    transition: width 0.5s ease;
  }

  .level-count {
    width: 48px;
    text-align: right;
    font-size: 12px;
    opacity: 0.7;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

// ========== 按钮 ==========

.btn-primary,
.btn-secondary {
  padding: 14px 24px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, color.adjust($primary, $lightness: 6%), $primary-dark);
  color: $text-main;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  }
}

.btn-secondary {
  background: $bg-glass;
  backdrop-filter: blur(10px);
  color: $text-main;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
}

.btn-back {
  background: transparent;
  border: none;
  color: $text-main;
  cursor: pointer;
  font-size: 14px;
  padding: 8px 0;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
}

// ========== 复习模式 ==========

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.review-progress {
  font-size: 14px;
  opacity: 0.6;
}

.review-empty {
  text-align: center;
  padding: 60px 20px;

  h2 {
    margin-bottom: 12px;
  }

  p {
    margin-bottom: 24px;
    opacity: 0.7;
  }
}

.flip_card_container {
  width: 100%;
  height: 280px;
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

  &:hover {
    transform: translateY(-4px);
  }

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
  padding: 24px;
  background: $bg-glass;
  backdrop-filter: blur(10px);
  box-shadow: $shadow;
  backface-visibility: hidden;
}

.front {
  flex-direction: column;

  .word-text {
    font-size: 42px;
    margin-bottom: 12px;
  }

  .word-hint {
    font-size: 14px;
    opacity: 0.5;
  }
}

.back {
  transform: rotateY(180deg);

  .word-detail {
    text-align: center;

    h3 {
      font-size: 24px;
      margin-bottom: 8px;
      color: $primary-dark;
    }

    .meaning {
      font-size: 20px;
      margin-bottom: 12px;
      font-weight: 500;
    }

    .meta {
      margin-bottom: 16px;

      span {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.05);
        font-size: 13px;
        margin: 0 4px;
      }
    }

    .example {
      p {
        font-size: 15px;
        margin-bottom: 4px;
      }

      .example-chn {
        font-size: 14px;
        opacity: 0.6;
      }
    }
  }
}

.review-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;

  button {
    padding: 12px 20px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-size: 15px;
    transition: all 0.2s ease;
    min-width: 100px;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

.btn-unknown {
  background: #ff6b6b;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.btn-vague {
  background: #ffd93d;
  color: $text-main;
  box-shadow: 0 4px 12px rgba(255, 217, 61, 0.3);
}

.btn-known {
  background: #6bcb77;
  color: white;
  box-shadow: 0 4px 12px rgba(107, 203, 119, 0.3);
}

.flip-hint {
  text-align: center;
  font-size: 14px;
  opacity: 0.5;
  margin-top: 8px;
}

// ========== 浏览模式 ==========

.browse-header,
.stats-header {
  margin-bottom: 20px;

  h2 {
    margin-top: 8px;
  }
}

.browse-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;

  .filter-group {
    display: flex;
    align-items: center;
    gap: 6px;

    label {
      font-size: 14px;
      opacity: 0.7;
    }

    select,
    input {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: $bg-glass;
      backdrop-filter: blur(10px);
      font-size: 14px;
      outline: none;

      &:focus {
        border-color: $primary;
      }
    }

    input {
      min-width: 200px;
    }
  }
}

.word-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.word-item {
  background: $bg-glass;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  .word-main {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 8px;
    flex-wrap: wrap;

    .word-name {
      font-size: 20px;
      font-weight: bold;
    }

    .word-reading {
      font-size: 15px;
      color: $primary-dark;
    }

    .word-meaning {
      font-size: 14px;
      opacity: 0.8;
    }
  }

  .word-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;

    span {
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 12px;
    }

    .tag-level {
      background: rgba(163, 193, 173, 0.25);
      color: $text-main;
    }

    .tag-type {
      background: rgba(0, 0, 0, 0.05);
    }

    .tag-status {
      &.status-new {
        background: rgba(150, 150, 150, 0.15);
      }
      &.status-learning {
        background: rgba(255, 217, 61, 0.25);
      }
      &.status-mastered {
        background: rgba(107, 203, 119, 0.25);
      }
    }
  }
}

.empty-tip {
  text-align: center;
  padding: 40px;
  opacity: 0.5;
}

// ========== 统计页 ==========

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-box {
  background: $bg-glass;
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  box-shadow: $shadow;

  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: $primary-dark;
    margin-bottom: 4px;
  }

  .stat-name {
    font-size: 13px;
    opacity: 0.7;
  }
}

.level-stats {
  background: $bg-glass;
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px;
  box-shadow: $shadow;

  h3 {
    margin-bottom: 12px;
    font-size: 16px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;

    th,
    td {
      padding: 10px 8px;
      text-align: center;
    }

    th {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      font-weight: 600;
      opacity: 0.7;
    }

    td {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
  }
}

// ========== 响应式 ==========

@media (min-width: 600px) {
  .stats-cards {
    grid-template-columns: repeat(4, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .review-actions {
    gap: 20px;

    button {
      min-width: 120px;
      padding: 14px 28px;
      font-size: 16px;
    }
  }
}
</style>
