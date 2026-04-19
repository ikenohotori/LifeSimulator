import Phaser from 'phaser'
import type { LifeSummary } from '../core/lifeState'
import { describeOutcome } from '../core/outcome'
import { stageById } from '../data/stages'
import { t } from '../i18n'
import type { Language } from '../types'

const STORAGE_KEY = 'life-sim-best'

export class ResultScene extends Phaser.Scene {
  private summary!: LifeSummary
  private best?: LifeSummary
  private language: Language = 'ja'

  constructor() {
    super('result')
  }

  init(data: { summary: LifeSummary; language: Language }): void {
    this.summary = data.summary
    this.language = data.language
    this.best = loadBest()
    const candidate = pickBetterResult(this.best, this.summary)
    if (!this.best || candidate === this.summary) {
      saveBest(this.summary)
      this.best = this.summary
    }
    this.game.events.on('language-changed', this.handleLanguageChange, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('language-changed', this.handleLanguageChange, this)
    })
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#e2e8f0')
    this.add.rectangle(0, 0, 360, 640, 0xffffff, 0.82).setOrigin(0)

    const title = this.add.text(180, 48, t('resultTitle', this.language), {
      fontSize: '22px',
      color: '#0f172a'
    })
    title.setOrigin(0.5, 0)

    const outcome = describeOutcome(this.summary.stats, this.language)
    this.add.text(180, 90, outcome.title, { fontSize: '18px', color: '#0f172a' }).setOrigin(0.5, 0)
    this.add
      .text(180, 116, outcome.detail, { fontSize: '13px', color: '#334155', wordWrap: { width: 300 } })
      .setOrigin(0.5, 0)

    const summaryText = this.buildSummaryText(this.summary)
    this.add
      .text(30, 170, summaryText, {
        fontSize: '13px',
        color: '#0f172a',
        lineSpacing: 6
      })
      .setOrigin(0)

    if (this.best && this.best !== this.summary) {
      const bestText = this.buildSummaryText(this.best)
      this.add
        .text(30, 330, `${t('bestRecord', this.language)}\n${bestText}`, {
          fontSize: '13px',
          color: '#1d4ed8',
          lineSpacing: 4
        })
        .setOrigin(0)
    }

    const buttonBg = this.add.rectangle(180, 560, 200, 44, 0x0ea5e9, 0.9).setInteractive()
    const buttonLabel = this.add.text(180, 560, t('resume', this.language), {
      fontSize: '16px',
      color: '#0b1021'
    })
    buttonLabel.setOrigin(0.5)

    buttonBg.on('pointerdown', () => {
      this.scene.stop('result')
      this.scene.start('game', { language: this.language })
    })
  }

  private buildSummaryText(summary: LifeSummary): string {
    const stageLabel = stageById[summary.stageId]?.name[this.language] ?? summary.stageId
    const lines = [
      `${t('stageLabel', this.language)}: ${stageLabel}`,
      `${t('survival', this.language)}: ${summary.survived ? '✓' : t('collapse', this.language)}`,
      `HP ${summary.stats.health.toFixed(0)} / Joy ${summary.stats.happiness.toFixed(0)}`,
      `Wealth ${summary.stats.wealth.toFixed(0)} / Int ${summary.stats.intelligence.toFixed(0)} / Mor ${summary.stats.morality.toFixed(0)}`,
      `${t('eventLog', this.language)}: ${summary.history.events.length}`
    ]
    return lines.join('\n')
  }

  private handleLanguageChange = (lang: Language): void => {
    this.language = lang
    this.scene.restart({ summary: this.summary, language: lang })
  }
}

const pickBetterResult = (current: LifeSummary | undefined, next: LifeSummary): LifeSummary => {
  if (!current) return next
  const score = (summary: LifeSummary) =>
    summary.stats.health +
    summary.stats.happiness +
    summary.stats.wealth +
    summary.stats.intelligence +
    summary.stats.morality +
    summary.history.events.length * 2 +
    (summary.survived ? 50 : 0)
  return score(next) >= score(current) ? next : current
}

const loadBest = (): LifeSummary | undefined => {
  try {
    if (typeof localStorage === 'undefined') return undefined
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    return JSON.parse(raw) as LifeSummary
  } catch {
    return undefined
  }
}

const saveBest = (summary: LifeSummary): void => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(summary))
}
