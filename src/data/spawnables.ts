import type { Spawnable, StageSpawnPlan } from '../types'

export const spawnables: Spawnable[] = [
  {
    id: 'fruit',
    kind: 'item',
    label: { ja: '果物', en: 'Fruit' },
    description: { ja: '体力と幸福を少し回復', en: 'Restores a bit of health and joy.' },
    effect: { health: 8, happiness: 6 },
    color: 0xffd166
  },
  {
    id: 'book',
    kind: 'item',
    label: { ja: '本', en: 'Book' },
    description: { ja: '知性と道徳心を養う', en: 'Raises intellect and empathy.' },
    effect: { intelligence: 9, morality: 5 },
    color: 0x6ee7b7
  },
  {
    id: 'coin',
    kind: 'item',
    label: { ja: 'コイン', en: 'Coin' },
    description: { ja: '資産を増やす', en: 'Adds a bit of wealth.' },
    effect: { wealth: 10, happiness: 2 },
    color: 0xf9a8d4
  },
  {
    id: 'compass',
    kind: 'item',
    label: { ja: 'コンパス', en: 'Compass' },
    description: { ja: '善悪の軸を整える', en: 'Steadies your moral compass.' },
    effect: { morality: 8 },
    color: 0x93c5fd
  },
  {
    id: 'friend',
    kind: 'item',
    label: { ja: '仲間', en: 'Friend' },
    description: { ja: '幸福感を押し上げる', en: 'Boosts happiness with company.' },
    effect: { happiness: 12 },
    color: 0x2dd4bf
  },
  {
    id: 'rock',
    kind: 'obstacle',
    label: { ja: '岩', en: 'Rock' },
    description: { ja: 'つまずきで体力を失う', en: 'A stumble hurts your health.' },
    effect: { health: -12, happiness: -4 },
    color: 0x475569
  },
  {
    id: 'stress',
    kind: 'obstacle',
    label: { ja: 'ストレス', en: 'Stress' },
    description: { ja: '心をすり減らす', en: 'Burns happiness and morality.' },
    effect: { happiness: -10, morality: -6 },
    color: 0x9b65de
  },
  {
    id: 'debt',
    kind: 'obstacle',
    label: { ja: '借金', en: 'Debt' },
    description: { ja: '資産と幸福を奪う', en: 'Drains wealth and joy.' },
    effect: { wealth: -14, happiness: -8, morality: -2 },
    color: 0xd946ef
  }
]

export const spawnPlan: StageSpawnPlan[] = [
  {
    stageId: 'toddler',
    pool: [
      { id: 'fruit', weight: 4 },
      { id: 'book', weight: 2 },
      { id: 'coin', weight: 1 },
      { id: 'rock', weight: 1 }
    ]
  },
  {
    stageId: 'child',
    pool: [
      { id: 'fruit', weight: 3 },
      { id: 'book', weight: 3 },
      { id: 'coin', weight: 2 },
      { id: 'rock', weight: 1 },
      { id: 'friend', weight: 2 }
    ]
  },
  {
    stageId: 'teen',
    pool: [
      { id: 'fruit', weight: 2 },
      { id: 'book', weight: 3 },
      { id: 'coin', weight: 3 },
      { id: 'stress', weight: 2 },
      { id: 'friend', weight: 2 }
    ]
  },
  {
    stageId: 'adult',
    pool: [
      { id: 'coin', weight: 4 },
      { id: 'compass', weight: 2 },
      { id: 'stress', weight: 3 },
      { id: 'debt', weight: 2 },
      { id: 'book', weight: 2 }
    ]
  },
  {
    stageId: 'senior',
    pool: [
      { id: 'fruit', weight: 3 },
      { id: 'compass', weight: 3 },
      { id: 'friend', weight: 2 },
      { id: 'stress', weight: 2 },
      { id: 'debt', weight: 1 }
    ]
  }
]

export const spawnableById = Object.fromEntries(spawnables.map((s) => [s.id, s]))
