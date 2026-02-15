'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UsePlaybackOptions {
  totalSteps: number
  defaultSpeed?: number // ms per step
}

export function usePlayback({ totalSteps, defaultSpeed = 800 }: UsePlaybackOptions) {
  const [currentStep, setCurrentStep] = useState(-1) // -1 means initial state (before any transition)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(defaultSpeed)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    if (totalSteps === 0) return
    setIsPlaying(true)
  }, [totalSteps])

  const pause = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
  }, [clearTimer])

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < totalSteps - 1) return prev + 1
      return prev
    })
  }, [totalSteps])

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > -1) return prev - 1
      return prev
    })
  }, [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
    setCurrentStep(-1)
  }, [clearTimer])

  const goToEnd = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
    setCurrentStep(totalSteps - 1)
  }, [totalSteps, clearTimer])

  useEffect(() => {
    if (isPlaying) {
      clearTimer()
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speed)
    }
    return clearTimer
  }, [isPlaying, speed, totalSteps, clearTimer])

  // Reset when totalSteps changes
  useEffect(() => {
    setCurrentStep(-1)
    setIsPlaying(false)
    clearTimer()
  }, [totalSteps, clearTimer])

  const isAtStart = currentStep === -1
  const isAtEnd = currentStep === totalSteps - 1
  const isFinished = isAtEnd && !isPlaying

  return {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    goToEnd,
    isAtStart,
    isAtEnd,
    isFinished,
  }
}
