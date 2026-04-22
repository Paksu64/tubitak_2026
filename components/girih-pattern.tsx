"use client"

import { useEffect, useRef } from "react"

interface GirihPatternProps {
  className?: string
}

export function GirihPattern({ className }: GirihPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Girih tile angles (36° and 72° based - the golden ratio connection)
    const PHI = (1 + Math.sqrt(5)) / 2
    const ANGLE_36 = Math.PI / 5
    const ANGLE_72 = (2 * Math.PI) / 5

    // Draw a 10-pointed star (common in Girih patterns)
    const drawDecagonStar = (
      cx: number,
      cy: number,
      outerRadius: number,
      innerRadius: number,
      rotation: number,
      alpha: number
    ) => {
      ctx.beginPath()
      for (let i = 0; i < 10; i++) {
        const angle = (i * ANGLE_36) + rotation
        const r = i % 2 === 0 ? outerRadius : innerRadius
        const x = cx + r * Math.cos(angle - Math.PI / 2)
        const y = cy + r * Math.sin(angle - Math.PI / 2)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // Draw pentagon (Girih base shape)
    const drawPentagon = (
      cx: number,
      cy: number,
      radius: number,
      rotation: number,
      alpha: number
    ) => {
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * ANGLE_72) + rotation
        const x = cx + radius * Math.cos(angle - Math.PI / 2)
        const y = cy + radius * Math.sin(angle - Math.PI / 2)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw connecting lines (strapwork)
    const drawStrapwork = (
      cx: number,
      cy: number,
      radius: number,
      rotation: number,
      alpha: number
    ) => {
      for (let i = 0; i < 5; i++) {
        const angle1 = (i * ANGLE_72) + rotation
        const angle2 = ((i + 2) * ANGLE_72) + rotation
        
        const x1 = cx + radius * Math.cos(angle1 - Math.PI / 2)
        const y1 = cy + radius * Math.sin(angle1 - Math.PI / 2)
        const x2 = cx + radius * Math.cos(angle2 - Math.PI / 2)
        const y2 = cy + radius * Math.sin(angle2 - Math.PI / 2)
        
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha * 0.3})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    // Draw hexagonal grid lines
    const drawHexGrid = (
      cx: number,
      cy: number,
      size: number,
      alpha: number
    ) => {
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3
        const x = cx + size * Math.cos(angle)
        const y = cy + size * Math.sin(angle)
        
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(x, y)
        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha * 0.15})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    const animate = () => {
      timeRef.current += 0.002
      const time = timeRef.current

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Background gradient
      const gradient = ctx.createRadialGradient(
        window.innerWidth / 2,
        window.innerHeight / 2,
        0,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerWidth * 0.8
      )
      gradient.addColorStop(0, "rgba(30, 28, 35, 1)")
      gradient.addColorStop(1, "rgba(15, 14, 18, 1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Pattern parameters
      const baseSize = Math.min(window.innerWidth, window.innerHeight) * 0.15
      const spacing = baseSize * 2.5

      // Calculate grid to cover the screen with some overflow
      const cols = Math.ceil(window.innerWidth / spacing) + 2
      const rows = Math.ceil(window.innerHeight / spacing) + 2
      const offsetX = (window.innerWidth - (cols - 1) * spacing) / 2
      const offsetY = (window.innerHeight - (rows - 1) * spacing) / 2

      // Draw the Girih pattern grid
      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = offsetX + col * spacing + (row % 2 === 0 ? 0 : spacing / 2)
          const cy = offsetY + row * spacing * 0.866 // sin(60°) for hex grid

          // Distance from center for fade effect
          const dx = cx - window.innerWidth / 2
          const dy = cy - window.innerHeight / 2
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = Math.sqrt(
            Math.pow(window.innerWidth / 2, 2) + Math.pow(window.innerHeight / 2, 2)
          )
          const distFactor = 1 - (dist / maxDist) * 0.7

          // Animated alpha based on distance and time
          const waveAlpha = 0.3 + 0.2 * Math.sin(time * 2 - dist * 0.005)
          const alpha = waveAlpha * distFactor

          // Slow rotation
          const rotation = time * 0.3 + (row + col) * 0.1

          // Draw the Girih elements
          drawHexGrid(cx, cy, baseSize * 1.5, alpha)
          drawDecagonStar(cx, cy, baseSize, baseSize * PHI * 0.38, rotation, alpha)
          drawPentagon(cx, cy, baseSize * 0.6, rotation + ANGLE_36, alpha * 0.7)
          drawStrapwork(cx, cy, baseSize * 0.85, rotation, alpha)
        }
      }

      // Central focal point - larger, more prominent pattern
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const centralSize = baseSize * 2

      // Glowing center effect
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        centralSize * 2
      )
      glowGradient.addColorStop(0, "rgba(212, 175, 55, 0.1)")
      glowGradient.addColorStop(0.5, "rgba(212, 175, 55, 0.03)")
      glowGradient.addColorStop(1, "rgba(212, 175, 55, 0)")
      ctx.fillStyle = glowGradient
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Central star
      drawDecagonStar(
        centerX,
        centerY,
        centralSize,
        centralSize * PHI * 0.38,
        time * 0.2,
        0.6
      )
      drawPentagon(centerX, centerY, centralSize * 0.6, time * 0.2 + ANGLE_36, 0.5)
      drawStrapwork(centerX, centerY, centralSize * 0.85, time * 0.2, 0.6)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className || ""}`}
      style={{ background: "transparent" }}
    />
  )
}
