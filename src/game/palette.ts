export const stageSpeedToColor = (speed: number): number => {
  if (speed >= 210) return 0x0ea5e9
  if (speed >= 180) return 0x22c55e
  return 0xf59e0b
}
