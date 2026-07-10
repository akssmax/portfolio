import * as React from "react"

type UseSpeechRecognitionOptions = {
  onResult: (transcript: string, isFinal: boolean) => void
  onError?: (message: string) => void
  lang?: string
}

function getSpeechRecognitionConstructor():
  | SpeechRecognitionConstructor
  | undefined {
  if (typeof window === "undefined") return undefined
  return window.SpeechRecognition ?? window.webkitSpeechRecognition
}

export function useSpeechRecognition({
  onResult,
  onError,
  lang,
}: UseSpeechRecognitionOptions) {
  const recognitionRef = React.useRef<SpeechRecognition | null>(null)
  const keepListeningRef = React.useRef(false)
  const onResultRef = React.useRef(onResult)
  const onErrorRef = React.useRef(onError)

  const [isSupported, setIsSupported] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)

  React.useEffect(() => {
    onResultRef.current = onResult
    onErrorRef.current = onError
  }, [onError, onResult])

  React.useEffect(() => {
    setIsSupported(Boolean(getSpeechRecognitionConstructor()))
  }, [])

  const stop = React.useCallback(() => {
    keepListeningRef.current = false
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setIsListening(false)
  }, [])

  const start = React.useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor()
    if (!SpeechRecognitionCtor) {
      onErrorRef.current?.("Voice input is not supported in this browser.")
      return false
    }

    stop()

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = lang ?? (typeof navigator !== "undefined" ? navigator.language : "en-US")
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i]
        const transcript = result[0]?.transcript ?? ""
        if (!transcript) continue
        onResultRef.current(transcript, result.isFinal)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted" || event.error === "no-speech") return

      const message =
        event.error === "not-allowed"
          ? "Microphone access was denied. Allow mic permission in your browser settings."
          : event.error === "service-not-allowed"
            ? "Speech recognition is blocked in this browser."
            : "Voice input failed. Try again."

      onErrorRef.current?.(message)
      keepListeningRef.current = false
      setIsListening(false)
    }

    recognition.onend = () => {
      if (!keepListeningRef.current) {
        setIsListening(false)
        recognitionRef.current = null
        return
      }

      try {
        recognition.start()
      } catch {
        keepListeningRef.current = false
        setIsListening(false)
        recognitionRef.current = null
      }
    }

    keepListeningRef.current = true
    recognitionRef.current = recognition

    try {
      recognition.start()
      return true
    } catch {
      keepListeningRef.current = false
      recognitionRef.current = null
      onErrorRef.current?.("Could not start voice input. Try again.")
      return false
    }
  }, [lang, stop])

  React.useEffect(() => stop, [stop])

  return {
    isSupported,
    isListening,
    start,
    stop,
  }
}
