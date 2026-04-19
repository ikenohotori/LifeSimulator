import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/LifeSimulator/',
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      reporter: ['text', 'json-summary']
    }
  }
})
