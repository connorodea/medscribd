"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioControllerProps {
  duration: number
  onTimeUpdate: (time: number) => void
  onPlayingChange: (playing: boolean) => void
  className?: string
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3]

export function AudioController({
  duration,
  onTimeUpdate,
  onPlayingChange,
  className,
}: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const previousVolume = useRef(volume)

  // Playback simulation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + (0.1 * playbackSpeed)
          if (next >= duration) {
            setIsPlaying(false)
            onPlayingChange(false)
            return 0
          }
          return next
        })
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, playbackSpeed, duration, onPlayingChange])

  // Sync time updates
  useEffect(() => {
    onTimeUpdate(currentTime)
  }, [currentTime, onTimeUpdate])

  // Sync playing state
  useEffect(() => {
    onPlayingChange(isPlaying)
  }, [isPlaying, onPlayingChange])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const handleStop = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
  }, [])

  const handleSeek = useCallback((value: number[]) => {
    setCurrentTime(value[0] ?? 0)
  }, [])

  const handleSkipBackward = useCallback(() => {
    setCurrentTime((prev) => Math.max(0, prev - 5))
  }, [])

  const handleSkipForward = useCallback(() => {
    setCurrentTime((prev) => Math.min(duration, prev + 5))
  }, [duration])

  const handleVolumeChange = useCallback((value: number[]) => {
    const nextVolume = value[0] ?? 0
    setVolume(nextVolume)
    if (nextVolume > 0) {
      setIsMuted(false)
    }
  }, [])

  const handleToggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(previousVolume.current || 80)
      setIsMuted(false)
    } else {
      previousVolume.current = volume
      setVolume(0)
      setIsMuted(true)
    }
  }, [isMuted, volume])

  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 bg-card border-b border-border/40", className)}>
      {/* Transport Controls */}
      <div className="flex items-center gap-1">
        {/* Skip Back 5s */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={handleSkipBackward}
          title="Rewind 5 seconds"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {/* Play/Pause */}
        <Button
          size="sm"
          className="h-9 w-9 p-0 rounded-full bg-primary hover:bg-primary/90"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>

        {/* Skip Forward 5s */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={handleSkipForward}
          title="Forward 5 seconds"
        >
          <RotateCw className="h-4 w-4" />
        </Button>

        {/* Stop */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={handleStop}
          title="Stop"
        >
          <Square className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Time Display */}
      <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
        <span className="w-12 text-right text-foreground">{formatTime(currentTime)}</span>
        <span className="text-muted-foreground">/</span>
        <span className="w-12 text-muted-foreground">{formatTime(duration)}</span>
      </div>

      {/* Scrubber/Timeline */}
      <div className="flex-1 mx-2">
        <Slider
          value={[currentTime]}
          min={0}
          max={duration}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
      </div>

      {/* Speed Control */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {playbackSpeed}x
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[80px]">
          {PLAYBACK_SPEEDS.map((speed) => (
            <DropdownMenuItem
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={cn(
                "text-xs justify-center",
                playbackSpeed === speed && "bg-primary/10 text-primary"
              )}
            >
              {speed}x
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={handleToggleMute}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="w-20"
        />
      </div>
    </div>
  )
}
