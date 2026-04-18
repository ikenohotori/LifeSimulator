import type { LifeEvent, LifeStateSnapshot, LifeStats, StageDefinition, StatEffect } from '../types'
import { STAT_KEYS } from '../types'

const BASE_DECAY_PER_SECOND: LifeStats = {
  health: 0.6,
  happiness: 0.5,
  wealth: 0.2,
  intelligence: 0.25,
  morality: 0.18
}

const MAX_STAT = 120
const MIN_STAT = 0

export type LifeHistory = {
  events: string[]
  items: string[]
}

export type LifeSummary = {
  survived: boolean
  stageId: string
  stats: LifeStats
  ageSeconds: number
  history: LifeHistory
}

export class LifeState {
  readonly stages: StageDefinition[]
  stats: LifeStats
  stageIndex = 0
  stageElapsed = 0
  ageSeconds = 0
  history: LifeHistory = { events: [], items: [] }
  inventory: Set<string> = new Set()

  constructor(stages: StageDefinition[], initialStats?: LifeStats) {
    if (stages.length === 0) {
      throw new Error('Stages are required')
    }
    this.stages = stages
    this.stats =
      initialStats ??
      ({
        health: 85,
        happiness: 80,
        wealth: 45,
        intelligence: 55,
        morality: 60
      } satisfies LifeStats)
  }

  get currentStage(): StageDefinition {
    const index = Math.min(this.stageIndex, this.stages.length - 1)
    return this.stages[index]
  }

  get isComplete(): boolean {
    return this.stageIndex >= this.stages.length
  }

  get isDepleted(): boolean {
    return STAT_KEYS.some((key) => this.stats[key] <= MIN_STAT)
  }

  snapshot(): LifeStateSnapshot {
    return {
      stats: structuredClone(this.stats),
      stageId: this.currentStage.id,
      ageSeconds: this.ageSeconds,
      inventory: new Set(this.inventory)
    }
  }

  update(deltaSeconds: number): { stageAdvanced: boolean } {
    if (this.isComplete) {
      return { stageAdvanced: false }
    }

    this.ageSeconds += deltaSeconds
    this.stageElapsed += deltaSeconds
    this.applyDecay(deltaSeconds)

    if (this.stageElapsed >= this.currentStage.duration) {
      this.stageIndex += 1
      this.stageElapsed = 0
      return { stageAdvanced: true }
    }

    return { stageAdvanced: false }
  }

  applyEvent(event: LifeEvent): void {
    this.history.events.push(event.id)
    this.applyEffect(event.effect)
  }

  applyEffect(effect: StatEffect): void {
    STAT_KEYS.forEach((key) => {
      const delta = effect[key]
      if (typeof delta === 'number') {
        this.stats[key] = clampStat(this.stats[key] + delta)
      }
    })
  }

  collectItem(id: string, effect: StatEffect): void {
    this.history.items.push(id)
    this.inventory.add(id)
    this.applyEffect(effect)
  }

  toSummary(): LifeSummary {
    const survived = !this.isDepleted && this.isComplete
    return {
      survived,
      stageId: this.isComplete ? this.stages.at(-1)?.id ?? this.currentStage.id : this.currentStage.id,
      stats: { ...this.stats },
      ageSeconds: this.ageSeconds,
      history: structuredClone(this.history)
    }
  }

  private applyDecay(deltaSeconds: number): void {
    const decayScale = this.currentStage.decayMultiplier
    STAT_KEYS.forEach((key) => {
      const decay = BASE_DECAY_PER_SECOND[key] * decayScale * deltaSeconds
      this.stats[key] = clampStat(this.stats[key] - decay)
    })
  }
}

const clampStat = (value: number): number => Math.max(MIN_STAT, Math.min(MAX_STAT, value))
