'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  SkipBack,
  StepBack,
  Play,
  Pause,
  StepForward,
  SkipForward,
} from 'lucide-react'

interface PlaybackControlsProps {
  isPlaying: boolean
  isAtStart: boolean
  isAtEnd: boolean
  speed: number
  currentStep: number
  totalSteps: number
  onPlay: () => void
  onPause: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onReset: () => void
  onGoToEnd: () => void
  onSpeedChange: (speed: number) => void
  speedLabel?: string
}

export function PlaybackControls({
  isPlaying,
  isAtStart,
  isAtEnd,
  speed,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onGoToEnd,
  onSpeedChange,
  speedLabel = 'Speed',
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          disabled={isAtStart}
          className="h-8 w-8"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onStepBackward}
          disabled={isAtStart}
          className="h-8 w-8"
        >
          <StepBack className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={isPlaying ? onPause : onPlay}
          disabled={isAtEnd && !isPlaying}
          className="h-10 w-10"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onStepForward}
          disabled={isAtEnd}
          className="h-8 w-8"
        >
          <StepForward className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onGoToEnd}
          disabled={isAtEnd}
          className="h-8 w-8"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3 px-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {speedLabel}
        </span>
        <Slider
          value={[1200 - speed]}
          min={0}
          max={1000}
          step={100}
          onValueChange={([v]) => onSpeedChange(1200 - v)}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground font-mono w-16 text-right">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>
    </div>
  )
}
