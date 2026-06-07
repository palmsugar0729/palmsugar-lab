/**
 * 单词数据加载模块
 * 使用 import.meta.glob 在构建时加载 JSON 数据
 */

import type { Word, JLPTLevel } from '../types/japanese'

// 使用 import.meta.glob 加载所有单词 JSON 文件
const wordModules = import.meta.glob<{ default: Word[] }>(
  '../content/japanese/words/*.json',
  { eager: true }
)

/**
 * 获取所有单词
 */
export function getAllWords(): Word[] {
  const words: Word[] = []
  for (const module of Object.values(wordModules)) {
    if (module.default && Array.isArray(module.default)) {
      words.push(...module.default)
    }
  }
  return words
}

/**
 * 按级别获取单词
 * @param level JLPT 级别
 */
export function getWordsByLevel(level: JLPTLevel): Word[] {
  return getAllWords().filter((word) => word.level === level)
}

/**
 * 获取所有级别列表
 */
export function getAllLevels(): JLPTLevel[] {
  return ['N5', 'N4', 'N3', 'N2', 'N1']
}

/**
 * 搜索单词
 * @param keyword 关键词（匹配单词、读音、意思）
 */
export function searchWords(keyword: string): Word[] {
  const lower = keyword.toLowerCase().trim()
  if (!lower) return []

  return getAllWords().filter(
    (word) =>
      word.word.includes(lower) ||
      word.reading.includes(lower) ||
      word.meaning.includes(lower) ||
      word.word.includes(keyword) ||
      word.reading.includes(keyword)
  )
}

/**
 * 根据 ID 获取单词
 * @param id 单词 ID
 */
export function getWordById(id: string): Word | undefined {
  return getAllWords().find((word) => word.id === id)
}
