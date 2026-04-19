import type { Language, LocaleText } from '../types'

const currentLanguage: Language = 'ja'

export const dictionary: Record<string, LocaleText> = {
  title: { ja: 'ライフシミュレーター' },
  startHint: { ja: 'タップでジャンプ / 2回で二段ジャンプ' },
  autoRun: { ja: '自動で走ります。障害物を避け、アイテムを拾おう。' },
  stageLabel: { ja: 'ステージ' },
  timeLabel: { ja: '経過' },
  stageComplete: { ja: '次のライフステージへ' },
  depleted: { ja: 'どれかのステータスが尽きました' },
  runAgain: { ja: 'もう一度' },
  resultTitle: { ja: '人生の振り返り' },
  survival: { ja: '生存' },
  collapse: { ja: '途中で力尽きた' },
  bestRecord: { ja: 'ベスト' },
  lastRecord: { ja: '今回' },
  morality: { ja: '道徳' },
  health: { ja: '体力' },
  happiness: { ja: '幸福' },
  wealth: { ja: '資産' },
  intelligence: { ja: '知性' },
  eventLog: { ja: 'イベントログ' },
  hint: { ja: 'ヒント' },
  resume: { ja: '再スタート' }
}

export const translateText = (text: LocaleText, lang: Language = currentLanguage): string => {
  if (lang === 'ja') return text.ja
  return text.ja
}

export const t = (key: keyof typeof dictionary, lang: Language = currentLanguage): string =>
  translateText(dictionary[key], lang)

export const getLanguage = (): Language => currentLanguage
