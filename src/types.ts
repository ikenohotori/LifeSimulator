export type Language = 'ja'

export type LocaleText = {
  ja: string
}

export const STAT_KEYS = ['health', 'happiness', 'wealth', 'intelligence', 'morality'] as const
export type StatKey = (typeof STAT_KEYS)[number]

export type LifeStats = Record<StatKey, number>

export type StatEffect = Partial<LifeStats> & {
  note?: LocaleText
}

export type StageDefinition = {
  id: string
  name: LocaleText
  duration: number
  speed: number
  gravity: number
  background: number
  ground: number
  spawnRate: number
  decayMultiplier: number
  hint: LocaleText
}

export type Spawnable = {
  id: string
  kind: 'item' | 'obstacle'
  label: LocaleText
  description: LocaleText
  effect: StatEffect
  color: number
}

export type StageSpawnPlan = {
  stageId: string
  pool: Array<{
    id: string
    weight: number
  }>
}

export type LifeEvent = {
  id: string
  title: LocaleText
  description: LocaleText
  probability: number
  stages?: string[]
  condition?: (snapshot: LifeStateSnapshot) => boolean
  effect: StatEffect
}

export type LifeStateSnapshot = {
  stats: LifeStats
  stageId: string
  ageSeconds: number
  inventory: Set<string>
}
