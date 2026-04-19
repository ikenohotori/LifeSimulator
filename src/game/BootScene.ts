import Phaser from 'phaser'
import { spawnables } from '../data/spawnables'
import type { Language } from '../types'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot')
  }

  preload(): void {
    this.createRectTexture('player', 28, 24, 0x0f172a, 6)
    this.createRectTexture('ground', 220, 18, 0x0ea5e9, 4)
    this.createRectTexture('platform', 72, 14, 0x1e293b, 3)
    this.createRectTexture('shadow', 32, 10, 0x111827, 4, 0.15)

    spawnables.forEach((item) => {
      const size = item.kind === 'item' ? 20 : 26
      this.createRectTexture(item.id, size, size, item.color, 6)
    })
  }

  create(): void {
    const lang = (this.scene.settings.data as { language?: Language } | undefined)?.language
    this.scene.start('game', { language: lang })
  }

  private createRectTexture(
    key: string,
    width: number,
    height: number,
    color: number,
    radius = 0,
    alpha = 1
  ): void {
    const graphics = this.add.graphics()
    graphics.fillStyle(color, alpha)
    graphics.fillRoundedRect(0, 0, width, height, radius)
    graphics.generateTexture(key, width, height)
    graphics.destroy()
  }
}
