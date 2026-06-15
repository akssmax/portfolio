const RUNNER_HIGH_SCORE_KEY = "monogram-runner-high-score"

export function getRunnerHighScore(): number {
  if (typeof window === "undefined") return 0

  try {
    const raw = window.localStorage.getItem(RUNNER_HIGH_SCORE_KEY)
    if (!raw) return 0
    const parsed = Number.parseInt(raw, 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  } catch {
    return 0
  }
}

export function recordRunnerHighScore(score: number): {
  highScore: number
  isNewHighScore: boolean
} {
  if (!Number.isFinite(score) || score <= 0) {
    return { highScore: getRunnerHighScore(), isNewHighScore: false }
  }

  const current = getRunnerHighScore()
  if (score > current) {
    try {
      window.localStorage.setItem(RUNNER_HIGH_SCORE_KEY, String(score))
    } catch {
      return { highScore: current, isNewHighScore: false }
    }
    return { highScore: score, isNewHighScore: true }
  }

  return { highScore: current, isNewHighScore: false }
}
