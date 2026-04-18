import Phaser from 'phaser'
import './style.css'
import { BootScene } from './game/BootScene'
import { GameScene } from './game/GameScene'
import { ResultScene } from './game/ResultScene'
import { getLanguage, onLanguageChange, setLanguage, t } from './i18n'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) {
  throw new Error('App container not found')
}

app.innerHTML = `
  <div id="shell">
    <header class="top-bar">
      <div class="title">
        <span id="title-text"></span>
        <span class="dot"></span>
        <span class="subtitle">2D life runner</span>
      </div>
      <div class="actions">
        <button id="lang-toggle" class="pill"></button>
      </div>
    </header>
    <main id="game-wrapper">
      <div id="game-root"></div>
      <div id="overlay">
        <p id="hint-primary"></p>
        <p id="hint-secondary"></p>
      </div>
    </main>
  </div>
`

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  parent: 'game-root',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 360,
    height: 640
  },
  backgroundColor: '#e2e8f0'
})

game.scene.add('game', GameScene)
game.scene.add('result', ResultScene)
game.scene.add('boot', BootScene, true, { language: getLanguage() })

const updateCopy = (): void => {
  const lang = getLanguage()
  const titleEl = document.querySelector<HTMLSpanElement>('#title-text')
  const primary = document.querySelector<HTMLParagraphElement>('#hint-primary')
  const secondary = document.querySelector<HTMLParagraphElement>('#hint-secondary')
  const langButton = document.querySelector<HTMLButtonElement>('#lang-toggle')
  if (titleEl) titleEl.textContent = t('title', lang)
  if (primary) primary.textContent = t('startHint', lang)
  if (secondary) secondary.textContent = t('autoRun', lang)
  if (langButton) langButton.textContent = `${t('language', lang)}: ${lang.toUpperCase()}`
}

const langButton = document.querySelector<HTMLButtonElement>('#lang-toggle')
langButton?.addEventListener('click', () => {
  const next = getLanguage() === 'ja' ? 'en' : 'ja'
  setLanguage(next)
  updateCopy()
  game.events.emit('language-changed', next)
})

onLanguageChange(() => updateCopy())
updateCopy()
