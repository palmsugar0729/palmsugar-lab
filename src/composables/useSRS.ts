/**
 * SRS (Spaced Repetition System) 组合式函数
 * 实现简化版 SM-2 算法
 */

import { ref } from 'vue'
import type { Word, WordProgress, LearningStats, LevelProgress, JLPTLevel } from '../types/japanese'
import { storage } from '../utils/storage'

const STORAGE_KEY = 'srs-progress'
const STORAGE_KEY_STATS = 'srs-stats'

/** SM-2 算法参数 */
const MIN_EF = 1.3
const INITIAL_EF = 2.5
const MAX_NEW_PER_DAY = 10

/** 用户反馈质量映射 */
export type ReviewQuality = 'known' | 'vague' | 'unknown'

const qualityMap: Record<ReviewQuality, number> = {
  known: 5,      // 认识
  vague: 3,      // 模糊
  unknown: 0,    // 不认识
}

// ========== 本地状态 ==========

const progressMap = ref<Record<string, WordProgress>>(loadProgress())
const stats = ref<Partial<LearningStats>>(loadStats())

// ========== 存储操作 ==========

function loadProgress(): Record<string, WordProgress> {
  return storage.get<Record<string, WordProgress>>(STORAGE_KEY) || {}
}

function saveProgress(): void {
  storage.set(STORAGE_KEY, progressMap.value)
}

function loadStats(): Partial<LearningStats> {
  return storage.get<Partial<LearningStats>>(STORAGE_KEY_STATS) || {}
}

function saveStats(): void {
  storage.set(STORAGE_KEY_STATS, stats.value)
}

// ========== SM-2 算法核心 ==========

/**
 * 计算新的间隔和 EF
 * @param progress 当前进度
 * @param quality 用户反馈质量 (0-5)
 * @returns 更新后的进度
 */
function calculateSM2(progress: WordProgress, quality: number): WordProgress {
  let { ef, repetitions, interval } = progress

  // 计算新的 EF
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (ef < MIN_EF) ef = MIN_EF

  // 计算新的间隔和重复次数
  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    repetitions += 1
    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 6
    } else {
      interval = Math.round(interval * ef)
    }
  }

  const today = new Date()
  const nextReview = new Date(today)
  nextReview.setDate(today.getDate() + interval)

  return {
    ...progress,
    ef,
    repetitions,
    interval,
    nextReview: nextReview.toISOString().split('T')[0],
    lastReviewed: today.toISOString().split('T')[0],
    totalReviews: progress.totalReviews + 1,
  }
}

// ========== 公共 API ==========

/**
 * 提交复习反馈
 * @param wordId 单词 ID
 * @param quality 用户反馈
 */
export function submitReview(wordId: string, quality: ReviewQuality): void {
  const q = qualityMap[quality]
  const existing = progressMap.value[wordId]

  if (existing) {
    progressMap.value[wordId] = calculateSM2(existing, q)
  } else {
    // 新单词的第一次复习
    const today = new Date().toISOString().split('T')[0]
    progressMap.value[wordId] = calculateSM2(
      {
        wordId,
        ef: INITIAL_EF,
        repetitions: 0,
        interval: 0,
        nextReview: today,
        lastReviewed: today,
        totalReviews: 0,
      },
      q
    )
  }

  updateStatsAfterReview()
  saveProgress()
}

/**
 * 获取今日需要复习的单词
 * @param allWords 所有单词列表
 * @returns 今日待复习的单词列表
 */
export function getTodayReviews(allWords: Word[]): Word[] {
  const today = new Date().toISOString().split('T')[0]

  return allWords.filter((word) => {
    const progress = progressMap.value[word.id]
    if (!progress) return false // 新单词不在复习队列
    return progress.nextReview <= today
  })
}

/**
 * 获取新单词（未学习过的）
 * @param allWords 所有单词列表
 * @param count 数量上限
 * @returns 新单词列表
 */
export function getNewWords(allWords: Word[], count: number = MAX_NEW_PER_DAY): Word[] {
  return allWords
    .filter((word) => !progressMap.value[word.id])
    .slice(0, count)
}

/**
 * 获取今日学习队列（复习 + 新词）
 * @param allWords 所有单词列表
 * @param newWordCount 新词数量上限
 * @returns [复习单词, 新单词]
 */
export function getTodayQueue(
  allWords: Word[],
  newWordCount: number = MAX_NEW_PER_DAY
): { reviews: Word[]; newWords: Word[] } {
  return {
    reviews: getTodayReviews(allWords),
    newWords: getNewWords(allWords, newWordCount),
  }
}

/**
 * 获取单词学习状态
 * @param wordId 单词 ID
 */
export function getWordStatus(wordId: string): 'new' | 'learning' | 'mastered' {
  const progress = progressMap.value[wordId]
  if (!progress) return 'new'
  if (progress.repetitions >= 3) return 'mastered'
  return 'learning'
}

/**
 * 获取单词进度
 * @param wordId 单词 ID
 */
export function getWordProgress(wordId: string): WordProgress | undefined {
  return progressMap.value[wordId]
}

/**
 * 获取学习统计
 * @param allWords 所有单词列表
 */
export function getStats(allWords: Word[]): LearningStats {
  const today = new Date().toISOString().split('T')[0]
  const lastStudy = stats.value.lastStudyDate

  // 计算连续天数
  let streakDays = stats.value.streakDays || 0
  if (lastStudy) {
    const lastDate = new Date(lastStudy)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 1) {
      // 昨天学了，连续天数保持
    } else if (diffDays > 1) {
      // 断链了，重置
      streakDays = 0
    }
  }

  const mastered = allWords.filter((w) => getWordStatus(w.id) === 'mastered').length
  const learning = allWords.filter((w) => getWordStatus(w.id) === 'learning').length
  const newWords = allWords.filter((w) => getWordStatus(w.id) === 'new').length

  return {
    totalWords: allWords.length,
    masteredWords: mastered,
    learningWords: learning,
    newWords: newWords,
    todayReviews: getTodayReviews(allWords).length,
    streakDays,
    lastStudyDate: lastStudy || '',
  }
}

/**
 * 获取各级别进度
 * @param allWords 所有单词列表
 */
export function getLevelProgress(allWords: Word[]): LevelProgress[] {
  const levels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']

  return levels.map((level) => {
    const words = allWords.filter((w) => w.level === level)
    return {
      level,
      total: words.length,
      mastered: words.filter((w) => getWordStatus(w.id) === 'mastered').length,
      learning: words.filter((w) => getWordStatus(w.id) === 'learning').length,
      new: words.filter((w) => getWordStatus(w.id) === 'new').length,
    }
  })
}

/**
 * 重置某个单词的进度
 * @param wordId 单词 ID
 */
export function resetWordProgress(wordId: string): void {
  delete progressMap.value[wordId]
  saveProgress()
}

/**
 * 重置所有学习进度（谨慎使用）
 */
export function resetAllProgress(): void {
  progressMap.value = {}
  stats.value = {}
  storage.remove(STORAGE_KEY)
  storage.remove(STORAGE_KEY_STATS)
}

// ========== 内部函数 ==========

function updateStatsAfterReview(): void {
  const today = new Date().toISOString().split('T')[0]
  const lastStudy = stats.value.lastStudyDate

  if (lastStudy !== today) {
    // 今天第一次学习
    let streakDays = stats.value.streakDays || 0
    if (lastStudy) {
      const lastDate = new Date(lastStudy)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        streakDays += 1
      } else if (diffDays > 1) {
        streakDays = 1
      }
    } else {
      streakDays = 1
    }

    stats.value = {
      ...stats.value,
      lastStudyDate: today,
      streakDays,
    }
    saveStats()
  }
}
