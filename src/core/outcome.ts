import type { Language, LifeStats, LocaleText } from '../types'
import { translateText } from '../i18n'

type OutcomeRule = {
  condition: (stats: LifeStats) => boolean
  label: LocaleText
  detail: LocaleText
}

const rules: OutcomeRule[] = [
  {
    condition: (stats) => stats.morality > 90 && stats.intelligence > 80,
    label: { ja: '賢明な導き手' },
    detail: { ja: '知恵と道徳心で周囲を支えた人生。' }
  },
  {
    condition: (stats) => stats.wealth > 95 && stats.happiness > 70,
    label: { ja: '豊潤な開拓者' },
    detail: { ja: '資産を築きながら楽しみを見いだした。' }
  },
  {
    condition: (stats) => stats.health > 85 && stats.happiness > 85,
    label: { ja: '健やかな探求者' },
    detail: { ja: '心身ともに充実した日々を送った。' }
  },
  {
    condition: (stats) => stats.intelligence > 90,
    label: { ja: '知識の架け橋' },
    detail: { ja: '学びを積み重ね、次代に伝えた。' }
  },
  {
    condition: (stats) => stats.morality < 25 || stats.happiness < 25,
    label: { ja: '岐路に立つ旅人' },
    detail: { ja: '迷いもあったが、まだ巻き返せる。' }
  }
]

const fallback: OutcomeRule = {
  condition: () => true,
  label: { ja: '静かな日常' },
  detail: { ja: '揺らぎながらも自分らしい歩みを続けた。' }
}

export const describeOutcome = (stats: LifeStats, lang: Language): { title: string; detail: string } => {
  const matched = rules.find((rule) => rule.condition(stats)) ?? fallback
  return {
    title: translateText(matched.label, lang),
    detail: translateText(matched.detail, lang)
  }
}
