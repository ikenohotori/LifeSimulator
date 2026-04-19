import type { LifeEvent, LifeStateSnapshot } from '../types'

export const lifeEvents: LifeEvent[] = [
  {
    id: 'park_day',
    title: { ja: '公園で深呼吸' },
    description: { ja: '新鮮な空気で心身が落ち着いた。' },
    probability: 1.1,
    stages: ['toddler', 'child', 'senior'],
    effect: { health: 6, happiness: 5 }
  },
  {
    id: 'study_group',
    title: { ja: '勉強会に参加' },
    description: { ja: '知識が深まり、視野が広がった。' },
    probability: 1.3,
    stages: ['child', 'teen', 'adult'],
    condition: ({ stats }) => stats.intelligence < 95,
    effect: { intelligence: 9, happiness: 3 }
  },
  {
    id: 'volunteer',
    title: { ja: 'ボランティア' },
    description: { ja: '誰かを助けることで自分も救われた。' },
    probability: 1.2,
    stages: ['teen', 'adult', 'senior'],
    effect: { morality: 10, happiness: 6 }
  },
  {
    id: 'late_night',
    title: { ja: '寝不足' },
    description: { ja: '集中が続かず、体力が削られた。' },
    probability: 0.9,
    stages: ['teen', 'adult'],
    condition: ({ stats }) => stats.intelligence > 40,
    effect: { health: -10, intelligence: -4, happiness: -6 }
  },
  {
    id: 'job_offer',
    title: { ja: '仕事のオファー' },
    description: { ja: '経験を積むチャンスだが、負荷も増える。' },
    probability: 1,
    stages: ['adult'],
    effect: { wealth: 14, health: -6, happiness: -4 }
  },
  {
    id: 'mentorship',
    title: { ja: 'メンターとの出会い' },
    description: { ja: '道徳と知恵を授かった。' },
    probability: 0.7,
    stages: ['adult', 'senior'],
    condition: ({ inventory, stats }) => inventory.has('book') || stats.intelligence > 65,
    effect: { intelligence: 6, morality: 8 }
  },
  {
    id: 'windfall',
    title: { ja: '臨時収入' },
    description: { ja: '思わぬ収入に心が軽くなった。' },
    probability: 0.6,
    stages: ['teen', 'adult', 'senior'],
    effect: { wealth: 16, happiness: 5 }
  },
  {
    id: 'donation',
    title: { ja: '寄付を決断' },
    description: { ja: '持ち物を手放し、心が軽くなった。' },
    probability: 0.9,
    stages: ['adult', 'senior'],
    condition: ({ inventory, stats }) => inventory.has('coin') || stats.wealth > 60,
    effect: { wealth: -10, morality: 12, happiness: 6 }
  },
  {
    id: 'bad_news',
    title: { ja: '悲報' },
    description: { ja: '精神的な負担が大きい。' },
    probability: 0.8,
    stages: ['adult', 'senior'],
    effect: { happiness: -12, morality: -4 }
  }
]

export const pickEvent = (
  snapshot: LifeStateSnapshot,
  rng: () => number = Math.random
): LifeEvent | null => {
  const pool = lifeEvents.filter((event) => {
    const matchesStage = !event.stages || event.stages.includes(snapshot.stageId)
    const matchesCondition = event.condition ? event.condition(snapshot) : true
    return matchesStage && matchesCondition
  })

  const total = pool.reduce((sum, event) => sum + event.probability, 0)
  if (total === 0) {
    return null
  }

  const roll = rng() * total
  let cursor = 0
  for (const event of pool) {
    cursor += event.probability
    if (roll <= cursor) {
      return event
    }
  }
  return null
}
