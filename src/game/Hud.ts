import Phaser from 'phaser'
import type { Language, LifeStats, StatKey } from '../types'
import { STAT_KEYS } from '../types'
import { t } from '../i18n'

const BAR_WIDTH = 200
const BAR_HEIGHT = 10

type Bar = {
  fill: Phaser.GameObjects.Rectangle
  label: Phaser.GameObjects.Text
}

export class Hud {
  private scene: Phaser.Scene
  private bars: Record<StatKey, Bar>
  private stageText: Phaser.GameObjects.Text
  private timerText: Phaser.GameObjects.Text
  private hintText: Phaser.GameObjects.Text
  private eventText: Phaser.GameObjects.Text
  private language: Language

  constructor(scene: Phaser.Scene, lang: Language) {
    this.scene = scene
    this.language = lang
    this.bars = {} as Record<StatKey, Bar>
    this.stageText = scene.add.text(14, 12, '', { fontSize: '16px', color: '#0f172a' })
    this.timerText = scene.add.text(14, 32, '', { fontSize: '14px', color: '#475569' })
    this.hintText = scene.add.text(14, 54, '', { fontSize: '12px', color: '#0f172a' })
    this.eventText = scene.add
      .text(14, 620, '', { fontSize: '14px', color: '#0f172a', wordWrap: { width: 320 } })
      .setOrigin(0, 1)

    const startY = 86
    STAT_KEYS.forEach((key, idx) => {
      const y = startY + idx * 28
      const bg = scene.add.rectangle(14, y, BAR_WIDTH + 4, BAR_HEIGHT + 6, 0xe2e8f0).setOrigin(0, 0.5)
      const fill = scene.add.rectangle(16, y, BAR_WIDTH, BAR_HEIGHT, 0x0ea5e9).setOrigin(0, 0.5)
      const label = scene.add.text(14, y - 12, '', { fontSize: '12px', color: '#0f172a' })
      this.bars[key] = { fill, label }
      // keep background at back
      bg.setDepth(0)
      fill.setDepth(1)
      label.setDepth(2)
    })
  }

  setLanguage(lang: Language): void {
    this.language = lang
  }

  updateStage(stageLabel: string, hint: string): void {
    this.stageText.setText(`${t('stageLabel', this.language)}: ${stageLabel}`)
    this.hintText.setText(`${t('hint', this.language)}: ${hint}`)
  }

  updateTimer(elapsed: number): void {
    this.timerText.setText(`${t('timeLabel', this.language)} ${elapsed.toFixed(1)}s`)
  }

  updateStats(stats: LifeStats): void {
    STAT_KEYS.forEach((key) => {
      const value = Math.round(stats[key])
      const normalized = Math.min(100, Math.max(0, value))
      const width = (normalized / 100) * BAR_WIDTH
      const bar = this.bars[key]
      bar.fill.width = width
      bar.label.setText(`${t(key, this.language)} ${value}`)
    })
  }

  showEvent(text: string): void {
    this.eventText.setText(text)
    this.eventText.setAlpha(1)
    this.scene.tweens.add({
      targets: this.eventText,
      duration: 1200,
      alpha: 0.35,
      yoyo: true
    })
  }
}
