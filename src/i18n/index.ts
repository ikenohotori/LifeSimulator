import type { Language, LocaleText } from '../types'

const STORAGE_KEY = 'life-sim-language'
const hasStorage = typeof localStorage !== 'undefined'

const defaultLanguage: Language = (() => {
  const saved = hasStorage ? localStorage.getItem(STORAGE_KEY) : null
  if (saved === 'ja' || saved === 'en') return saved
  return typeof navigator !== 'undefined' && navigator.language?.startsWith('ja') ? 'ja' : 'en'
})()

let currentLanguage: Language = defaultLanguage
const listeners = new Set<(lang: Language) => void>()

export const dictionary: Record<string, LocaleText> = {
  title: { ja: 'ライフシミュレーター', en: 'Life Simulator' },
  startHint: { ja: 'タップでジャンプ / 2回で二段ジャンプ', en: 'Tap to jump / twice to double jump' },
  autoRun: { ja: '自動で走ります。障害物を避け、アイテムを拾おう。', en: 'You auto-run. Avoid obstacles and grab items.' },
  stageLabel: { ja: 'ステージ', en: 'Stage' },
  timeLabel: { ja: '経過', en: 'Elapsed' },
  stageComplete: { ja: '次のライフステージへ', en: 'Moving to next life stage' },
  depleted: { ja: 'どれかのステータスが尽きました', en: 'A stat dropped to zero.' },
  runAgain: { ja: 'もう一度', en: 'Run again' },
  resultTitle: { ja: '人生の振り返り', en: 'Life recap' },
  survival: { ja: '生存', en: 'Survived' },
  collapse: { ja: '途中で力尽きた', en: 'Fell before the end' },
  bestRecord: { ja: 'ベスト', en: 'Personal best' },
  lastRecord: { ja: '今回', en: 'This run' },
  language: { ja: '言語', en: 'Language' },
  morality: { ja: '道徳', en: 'Morality' },
  health: { ja: '体力', en: 'Health' },
  happiness: { ja: '幸福', en: 'Joy' },
  wealth: { ja: '資産', en: 'Wealth' },
  intelligence: { ja: '知性', en: 'Intellect' },
  eventLog: { ja: 'イベントログ', en: 'Events' },
  hint: { ja: 'ヒント', en: 'Hint' },
  resume: { ja: '再スタート', en: 'Restart' }
}

export const translateText = (text: LocaleText, lang: Language = currentLanguage): string =>
  text[lang] ?? text.ja

export const t = (key: keyof typeof dictionary, lang: Language = currentLanguage): string =>
  translateText(dictionary[key], lang)

export const getLanguage = (): Language => currentLanguage

export const setLanguage = (lang: Language): void => {
  if (currentLanguage === lang) return
  currentLanguage = lang
  if (hasStorage) {
    localStorage.setItem(STORAGE_KEY, lang)
  }
  listeners.forEach((listener) => listener(lang))
}

export const onLanguageChange = (listener: (lang: Language) => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
