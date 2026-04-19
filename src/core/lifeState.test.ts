import { describe, expect, it } from 'vitest'
import { LifeState } from './lifeState'
import { stages } from '../data/stages'
import { pickEvent } from '../data/events'

describe('LifeState', () => {
  it('advances stages when duration is exceeded', () => {
    const life = new LifeState(stages)
    const firstStageDuration = life.currentStage.duration
    life.update(firstStageDuration + 0.1)
    expect(life.currentStage.id).toBe(stages[1].id)
  })

  it('applies decay over time', () => {
    const life = new LifeState(stages)
    const initialHealth = life.stats.health
    life.update(5)
    expect(life.stats.health).toBeLessThan(initialHealth)
  })

  it('applies event effects', () => {
    const life = new LifeState(stages)
    const snapshot = life.snapshot()
    const forcedEvent = pickEvent(snapshot, () => 0)!
    life.applyEvent(forcedEvent)
    expect(life.history.events).toContain(forcedEvent.id)
  })
})
