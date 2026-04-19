import Phaser from 'phaser'
import { LifeState } from '../core/lifeState'
import { stages } from '../data/stages'
import { spawnPlan, spawnableById } from '../data/spawnables'
import { pickEvent } from '../data/events'
import { Hud } from './Hud'
import type { Language } from '../types'
import { getLanguage, translateText } from '../i18n'
import { stageSpeedToColor } from './palette'

const GAME_WIDTH = 360
const GAME_HEIGHT = 640
const GROUND_Y = GAME_HEIGHT - 80
const GRAVITY = 980

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private shadow!: Phaser.GameObjects.Image
  private grounds!: Phaser.Physics.Arcade.Group
  private collectibles!: Phaser.Physics.Arcade.Group
  private obstacles!: Phaser.Physics.Arcade.Group
  private hud!: Hud
  private life = new LifeState(stages)
  private spawnElapsed = 0
  private language: Language = getLanguage()
  private jumpsUsed = 0
  private backgroundRect!: Phaser.GameObjects.Rectangle

  constructor() {
    super('game')
  }

  init(data: { language?: Language } = {}): void {
    this.language = data.language ?? getLanguage()
    this.life = new LifeState(stages)
    this.spawnElapsed = 0
    this.jumpsUsed = 0
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#bae6fd')
    this.backgroundRect = this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xcffafe)
      .setOrigin(0)
      .setDepth(-2)

    this.grounds = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })
    this.collectibles = this.physics.add.group({ allowGravity: false, immovable: false })
    this.obstacles = this.physics.add.group({ allowGravity: false, immovable: true })

    this.createGround()
    this.createPlayer()
    this.shadow = this.add.image(this.player.x, GROUND_Y + 6, 'shadow').setOrigin(0.5, 0.5)
    this.shadow.setAlpha(0.4)

    this.physics.add.collider(this.player, this.grounds, () => {
      this.jumpsUsed = 0
    })
    this.physics.add.overlap(this.player, this.collectibles, (_, item) => this.handleCollect(item as Phaser.Physics.Arcade.Sprite))
    this.physics.add.overlap(this.player, this.obstacles, (_, obstacle) =>
      this.handleObstacle(obstacle as Phaser.Physics.Arcade.Sprite)
    )

    this.input.on('pointerdown', () => this.handleJump())

    this.hud = new Hud(this, this.language)
    this.refreshStageUI()
    this.hud.updateStats(this.life.stats)

    this.time.addEvent({
      delay: 6500,
      loop: true,
      callback: this.handleLifeEvent,
      callbackScope: this
    })
  }

  update(_time: number, delta: number): void {
    const deltaSeconds = delta / 1000
    if (this.life.isComplete) return

    const currentStage = this.life.currentStage
    const body = this.player.body as Phaser.Physics.Arcade.Body | null
    if (!body) return
    body.setGravityY(currentStage.gravity || GRAVITY)

    const speed = currentStage.speed
    this.updateEntities(speed)

    const { stageAdvanced } = this.life.update(deltaSeconds)
    this.hud.updateStats(this.life.stats)
    this.hud.updateTimer(this.life.stageElapsed)

    this.spawnElapsed += deltaSeconds
    const spawnInterval = Math.max(0.8, 1.6 - currentStage.spawnRate * 0.35)
    if (this.spawnElapsed >= spawnInterval) {
      this.spawnElapsed = 0
      this.spawnEntity()
    }

    this.shadow.setPosition(this.player.x, GROUND_Y + 6)

    if (stageAdvanced) {
      if (this.life.isComplete) {
        this.finishRun()
        return
      }
      this.refreshStageUI()
    }

    if (this.life.isDepleted) {
      this.finishRun()
    }
  }

  private createPlayer(): void {
    this.player = this.physics.add.sprite(88, GROUND_Y - 48, 'player')
    this.player.setCollideWorldBounds(true)
    this.player.setGravityY(GRAVITY)
    this.player.setBounce(0.05)
    this.player.setDragY(20)
  }

  private createGround(): void {
    const tileWidth = 220
    const tilesNeeded = 3
    for (let i = 0; i < tilesNeeded; i += 1) {
      const x = i * tileWidth
      const tile = this.physics.add.sprite(x, GROUND_Y, 'ground')
      tile.setOrigin(0, 0)
      tile.setImmovable(true)
      tile.setVelocityX(0)
      tile.body.allowGravity = false
      this.grounds.add(tile)
    }
  }

  private handleJump(): void {
    const onGround = (this.player.body as Phaser.Physics.Arcade.Body).blocked.down
    if (onGround) this.jumpsUsed = 0
    if (this.jumpsUsed >= 2) return
    const jumpStrength = -360 - this.jumpsUsed * 30
    this.player.setVelocityY(jumpStrength)
    this.jumpsUsed += 1
  }

  private spawnEntity(): void {
    const plan = spawnPlan.find((p) => p.stageId === this.life.currentStage.id)
    if (!plan) return
    const choice = pickWeighted(plan.pool)
    const config = spawnableById[choice]
    if (!config) return

    if (config.kind === 'item') {
      const y = Phaser.Math.Between(GROUND_Y - 140, GROUND_Y - 80)
      const item = this.collectibles.create(GAME_WIDTH + 40, y, config.id) as Phaser.Physics.Arcade.Sprite
      item.setVelocityX(-this.life.currentStage.speed)
      item.setData('configId', config.id)
    } else {
      const obstacle = this.obstacles.create(
        GAME_WIDTH + 40,
        GROUND_Y - 6,
        config.id
      ) as Phaser.Physics.Arcade.Sprite
      obstacle.setOrigin(0.5, 1)
      obstacle.setVelocityX(-this.life.currentStage.speed)
      obstacle.setData('configId', config.id)
      obstacle.setImmovable(true)
    }
  }

  private updateEntities(speed: number): void {
    this.grounds.getChildren().forEach((ground) => {
      const sprite = ground as Phaser.Physics.Arcade.Sprite
      const body = sprite.body as Phaser.Physics.Arcade.Body | null
      sprite.setVelocityX(-speed)
      if (sprite.x + sprite.width < 0) {
        const maxX = this.grounds.getChildren().reduce((max, g) => Math.max(max, (g as Phaser.GameObjects.Sprite).x), 0)
        const newX = maxX + sprite.width - 6
        sprite.setX(newX)
        body?.reset(newX, sprite.y)
      }
    })

    this.collectibles.getChildren().forEach((item) => {
      const sprite = item as Phaser.Physics.Arcade.Sprite
      sprite.setVelocityX(-speed)
      if (sprite.x < -40) sprite.destroy()
    })
    this.obstacles.getChildren().forEach((obstacle) => {
      const sprite = obstacle as Phaser.Physics.Arcade.Sprite
      sprite.setVelocityX(-speed)
      if (sprite.x < -40) sprite.destroy()
    })

    if (this.player.y > GAME_HEIGHT + 60) {
      this.life.applyEffect({ health: -10 })
      this.player.setY(GROUND_Y - 40)
      this.player.setVelocity(0, -240)
    }
  }

  private handleCollect(item: Phaser.Physics.Arcade.Sprite): void {
    const id = item.getData('configId') as string
    const config = spawnableById[id]
    if (!config) return
    this.life.collectItem(id, config.effect)
    item.destroy()
    this.hud.updateStats(this.life.stats)
    const text = `${translateText(config.label, this.language)} +`
    this.hud.showEvent(text)
  }

  private handleObstacle(obstacle: Phaser.Physics.Arcade.Sprite): void {
    const id = obstacle.getData('configId') as string
    const config = spawnableById[id]
    if (!config) return
    this.life.applyEffect(config.effect)
    obstacle.destroy()
    this.hud.updateStats(this.life.stats)
    const text = `${translateText(config.label, this.language)} -`
    this.hud.showEvent(text)
  }

  private handleLifeEvent = (): void => {
    const event = pickEvent(this.life.snapshot())
    if (!event) return
    this.life.applyEvent(event)
    this.hud.updateStats(this.life.stats)
    const label = translateText(event.title, this.language)
    this.hud.showEvent(`${label}: ${translateText(event.description, this.language)}`)
  }

  private refreshStageUI(): void {
    const stage = this.life.currentStage
    this.backgroundRect.setFillStyle(stage.background)
    const color = stageSpeedToColor(stage.speed)
    this.player.setTint(color)
    this.hud.setLanguage(this.language)
    this.hud.updateStage(translateText(stage.name, this.language), translateText(stage.hint, this.language))
  }

  private finishRun = (): void => {
    this.scene.stop('game')
    this.scene.start('result', { summary: this.life.toSummary(), language: this.language })
  }
}

const pickWeighted = (pool: Array<{ id: string; weight: number }>): string => {
  const total = pool.reduce((sum, item) => sum + item.weight, 0)
  const roll = Math.random() * total
  let cursor = 0
  for (const item of pool) {
    cursor += item.weight
    if (roll <= cursor) {
      return item.id
    }
  }
  return pool[0]?.id ?? ''
}
