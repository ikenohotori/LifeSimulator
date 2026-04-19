import type { Spawnable, StageSpawnPlan } from '../types'

export const spawnables: Spawnable[] = [
  {
    id: 'fruit',
    kind: 'item',
    label: { ja: '果物' },
    description: { ja: '体力と幸福を少し回復' },
    effect: { health: 8, happiness: 6 },
    color: 0xffd166
  },
  {
    id: 'book',
    kind: 'item',
    label: { ja: '本' },
    description: { ja: '知性と道徳心を養う' },
    effect: { intelligence: 9, morality: 5 },
    color: 0x6ee7b7
  },
  {
    id: 'coin',
    kind: 'item',
    label: { ja: 'コイン' },
    description: { ja: '資産を増やす' },
    effect: { wealth: 10, happiness: 2 },
    color: 0xf9a8d4
  },
  {
    id: 'compass',
    kind: 'item',
    label: { ja: 'コンパス' },
    description: { ja: '善悪の軸を整える' },
    effect: { morality: 8 },
    color: 0x93c5fd
  },
  {
    id: 'friend',
    kind: 'item',
    label: { ja: '仲間' },
    description: { ja: '幸福感を押し上げる' },
    effect: { happiness: 12 },
    color: 0x2dd4bf
  },
  {
    id: 'rock',
    kind: 'obstacle',
    label: { ja: '岩' },
    description: { ja: 'つまずきで体力を失う' },
    effect: { health: -12, happiness: -4 },
    color: 0x475569
  },
  {
    id: 'stress',
    kind: 'obstacle',
    label: { ja: 'ストレス' },
    description: { ja: '心をすり減らす' },
    effect: { happiness: -10, morality: -6 },
    color: 0x9b65de
  },
  {
    id: 'debt',
    kind: 'obstacle',
    label: { ja: '借金' },
    description: { ja: '資産と幸福を奪う' },
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
