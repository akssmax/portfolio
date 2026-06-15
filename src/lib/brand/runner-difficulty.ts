import { getMilestoneIndex } from "@/lib/brand/runner-milestones"

export const INITIAL_SPEED = 5.5
export const MAX_SPEED = 13
export const MIN_OBSTACLE_GAP = 300
export const MAX_OBSTACLE_GAP = 540

export function getScore(distance: number): number {
  return Math.floor(distance / 10)
}

export function getTargetSpeed(distance: number): number {
  const score = getScore(distance)
  const milestoneIndex = getMilestoneIndex(distance)
  const tier = Math.floor(score / 50)
  const milestoneBoost = milestoneIndex * 0.18
  return Math.min(MAX_SPEED, INITIAL_SPEED + tier * 0.35 + milestoneBoost)
}

export function lerpSpeed(current: number, target: number, dt: number): number {
  return current + (target - current) * 0.02 * dt
}

export function getNextObstacleGap(speed: number): number {
  const t = Math.min(1, speed / MAX_SPEED)
  const range = MAX_OBSTACLE_GAP - MIN_OBSTACLE_GAP
  const scaledMax = MAX_OBSTACLE_GAP - range * t * 0.35
  return MIN_OBSTACLE_GAP + Math.random() * (scaledMax - MIN_OBSTACLE_GAP)
}
