/**
 * 练习进度组合式函数
 * 管理错题本和练习历史
 */

import { ref } from 'vue'
import type { ExerciseSession } from '../types/japanese'
import { storage } from '../utils/storage'

const STORAGE_KEY_WRONG = 'exercise-wrong'
const STORAGE_KEY_HISTORY = 'exercise-history'

// ========== 本地状态 ==========

const wrongSet = ref<Set<string>>(new Set(loadWrongList()))
const history = ref<ExerciseSession[]>(loadHistory())

// ========== 存储操作 ==========

function loadWrongList(): string[] {
  return storage.get<string[]>(STORAGE_KEY_WRONG) || []
}

function saveWrongList(): void {
  storage.set(STORAGE_KEY_WRONG, Array.from(wrongSet.value))
}

function loadHistory(): ExerciseSession[] {
  return storage.get<ExerciseSession[]>(STORAGE_KEY_HISTORY) || []
}

function saveHistory(): void {
  storage.set(STORAGE_KEY_HISTORY, history.value)
}

// ========== 公共 API ==========

/**
 * 记录答题结果
 * @param exerciseId 题目 ID
 * @param isCorrect 是否答对
 */
export function recordAnswer(exerciseId: string, isCorrect: boolean): void {
  if (isCorrect) {
    wrongSet.value.delete(exerciseId)
  } else {
    wrongSet.value.add(exerciseId)
  }
  saveWrongList()
}

/**
 * 获取错题 ID 列表
 */
export function getWrongList(): string[] {
  return Array.from(wrongSet.value)
}

/**
 * 判断某题是否在错题本中
 * @param exerciseId 题目 ID
 */
export function isWrong(exerciseId: string): boolean {
  return wrongSet.value.has(exerciseId)
}

/**
 * 从错题本中移除
 * @param exerciseId 题目 ID
 */
export function removeFromWrong(exerciseId: string): void {
  wrongSet.value.delete(exerciseId)
  saveWrongList()
}

/**
 * 清空错题本
 */
export function clearWrongList(): void {
  wrongSet.value.clear()
  saveWrongList()
}

/**
 * 保存一次练习记录
 * @param session 练习记录
 */
export function saveSession(session: ExerciseSession): void {
  history.value.unshift(session)
  // 最多保留 50 条记录
  if (history.value.length > 50) {
    history.value = history.value.slice(0, 50)
  }
  saveHistory()
}

/**
 * 获取练习历史
 */
export function getHistory(): ExerciseSession[] {
  return history.value
}

/**
 * 获取最近 N 次练习记录
 * @param count 数量
 */
export function getRecentSessions(count: number = 5): ExerciseSession[] {
  return history.value.slice(0, count)
}

/**
 * 获取最近练习的正确率
 * @param count 最近 N 次
 */
export function getRecentAccuracy(count: number = 5): number {
  const sessions = history.value.slice(0, count)
  if (sessions.length === 0) return 0

  const totalCorrect = sessions.reduce((sum, s) => sum + s.correct, 0)
  const totalQuestions = sessions.reduce((sum, s) => sum + s.total, 0)

  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
}

/**
 * 获取错题数量
 */
export function getWrongCount(): number {
  return wrongSet.value.size
}

/**
 * 重置所有练习进度
 */
export function resetAllExerciseProgress(): void {
  wrongSet.value.clear()
  history.value = []
  storage.remove(STORAGE_KEY_WRONG)
  storage.remove(STORAGE_KEY_HISTORY)
}
