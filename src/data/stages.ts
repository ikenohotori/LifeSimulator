import type { StageDefinition } from '../types'

export const stages: StageDefinition[] = [
  {
    id: 'toddler',
    name: { ja: '幼児', en: 'Toddler' },
    duration: 18,
    speed: 140,
    gravity: 850,
    background: 0xcffafe,
    ground: 0x86efac,
    spawnRate: 1.05,
    decayMultiplier: 0.7,
    hint: { ja: '明るい場所で走り回って体力を伸ばそう', en: 'Run and play to build health early.' }
  },
  {
    id: 'child',
    name: { ja: '児童', en: 'Child' },
    duration: 20,
    speed: 170,
    gravity: 900,
    background: 0xfaf5ff,
    ground: 0xa78bfa,
    spawnRate: 1.1,
    decayMultiplier: 0.9,
    hint: { ja: '学びと遊びのバランスが鍵', en: 'Balance learning and play.' }
  },
  {
    id: 'teen',
    name: { ja: '青年', en: 'Teen' },
    duration: 22,
    speed: 195,
    gravity: 920,
    background: 0xfffbeb,
    ground: 0xfcd34d,
    spawnRate: 1.2,
    decayMultiplier: 1,
    hint: { ja: '選択が性格を形づくる', en: 'Choices start shaping who you are.' }
  },
  {
    id: 'adult',
    name: { ja: '成人', en: 'Adult' },
    duration: 24,
    speed: 210,
    gravity: 960,
    background: 0xf1f5f9,
    ground: 0x0ea5e9,
    spawnRate: 1.3,
    decayMultiplier: 1.05,
    hint: { ja: '責任は増えるが機会も増える', en: 'More responsibility and new opportunities.' }
  },
  {
    id: 'senior',
    name: { ja: '老年', en: 'Senior' },
    duration: 18,
    speed: 175,
    gravity: 880,
    background: 0xe2e8f0,
    ground: 0x94a3b8,
    spawnRate: 1.15,
    decayMultiplier: 0.95,
    hint: { ja: '穏やかながらも心身を整えよう', en: 'Keep mind and body gentle but active.' }
  }
]

export const stageById = Object.fromEntries(stages.map((stage) => [stage.id, stage]))
