"use client"

import { useEffect, useRef, useCallback } from "react"
import { GirihGenerator, DLENS, TILE_COLORS_GOLD, type GeneratorConfig, type SymmetryMode } from "@/lib/girih-generator"

interface PatternCanvasProps {
  config: Partial<GeneratorConfig>
  algorithm: 1 | 2 | 3
  symmetryMode: SymmetryMode
  showTileFill: boolean
  showStrapwork: boolean
  showOutlines: boolean
  colorScheme: "gold" | "classic" | "monochrome"
  seed?: number
  onGenerated?: (tileCount: number, pointCount: number) => void
}

const COLOR_SCHEMES = {
  gold: {
    tiles: TILE_COLORS_GOLD,
    outline: "rgba(212, 175, 55, 0.4)",
    strapwork1: "rgba(212, 175, 55, 0.9)",
    strapwork2: "rgba(184, 134, 11, 0.7)",
    background: "#0a0a0f",
  },
  classic: {
    tiles: ["rgba(176,196,222,0.5)","rgba(144,238,144,0.5)","rgba(255,160,122,0.5)","rgba(147,112,219,0.5)","rgba(240,230,140,0.5)"],
    outline: "rgba(255, 100, 100, 0.5)",
    strapwork1: "red",
    strapwork2: "blue",
    background: "#1a1a2e",
  },
  monochrome: {
    tiles: Array(5).fill("rgba(255,255,255,0.05)"),
    outline: "rgba(255,255,255,0.15)",
    strapwork1: "rgba(255,255,255,0.9)",
    strapwork2: "rgba(255,255,255,0.5)",
    background: "#000000",
  },
}

export function PatternCanvas({
  config, algorithm, symmetryMode,
  showTileFill, showStrapwork, showOutlines,
  colorScheme, seed, onGenerated,
}: PatternCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const generatorRef = useRef<GirihGenerator | null>(null)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const generator = generatorRef.current
    if (!canvas || !generator) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const colors = COLOR_SCHEMES[colorScheme]
    ctx.fillStyle = colors.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)

    if (showTileFill) {
      for (const tile of generator.tiles) {
        const verts = tile.pointIndexes.map(i => generator.points[i].coords)
        ctx.beginPath()
        ctx.moveTo(verts[0][0], verts[0][1])
        for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i][0], verts[i][1])
        ctx.closePath()
        ctx.fillStyle = colors.tiles[tile.tileType]
        ctx.fill()
      }
    }

    if (showOutlines) {
      for (const tile of generator.tiles) {
        const verts = tile.pointIndexes.map(i => generator.points[i].coords)
        ctx.beginPath()
        ctx.moveTo(verts[0][0], verts[0][1])
        for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i][0], verts[i][1])
        ctx.closePath()
        ctx.strokeStyle = colors.outline
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    if (showStrapwork) {
      for (let tIndex = 0; tIndex < generator.tiles.length; tIndex++) {
        const tile = generator.tiles[tIndex]
        const n = tile.pointIndexes.length
        for (let i = 0; i < n; i++) {
          const { mx, my, beta, gamma } = generator.getMidpoint(tIndex, i)
          const [d1, d2] = DLENS[tile.tileType][(i + tile.offset) % n]
          const length = tile.sideLength

          ctx.beginPath()
          ctx.moveTo(mx, my)
          ctx.lineTo(mx + Math.cos(beta) * length * d1, my + Math.sin(beta) * length * d1)
          ctx.strokeStyle = colors.strapwork1
          ctx.lineWidth = 1.5
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(mx, my)
          ctx.lineTo(mx + Math.cos(gamma) * length * d2, my + Math.sin(gamma) * length * d2)
          ctx.strokeStyle = colors.strapwork2
          ctx.lineWidth = 1.0
          ctx.stroke()
        }
      }
    }

    ctx.restore()

    // Vignette
    const grad = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, 0,
      canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/1.5
    )
    grad.addColorStop(0, "transparent")
    grad.addColorStop(1, "rgba(0,0,0,0.5)")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [colorScheme, showTileFill, showStrapwork, showOutlines])

  const generatePattern = useCallback(() => {
    const originalRandom = Math.random
    if (seed !== undefined) {
      let s = seed
      Math.random = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
    }
    try {
      const generator = new GirihGenerator({
        width: config.width ?? 1200,
        height: config.height ?? 800,
        sideLength: config.sideLength ?? 50,
        iterations: config.iterations ?? 100,
        retries: config.retries ?? 30,
        symmetryMode,
        symmetryCenter: [0, 0],
      })
      generator.generate(algorithm)
      generatorRef.current = generator
      onGenerated?.(generator.tiles.length, generator.points.length)
      render()
    } finally {
      Math.random = originalRandom
    }
  }, [config, algorithm, symmetryMode, seed, onGenerated, render])

  useEffect(() => { generatePattern() }, [generatePattern])
  useEffect(() => { render() }, [render])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const updateSize = () => {
      const c = canvas.parentElement
      if (c) { canvas.width = c.clientWidth; canvas.height = c.clientHeight; render() }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [render])

  return <canvas ref={canvasRef} className="h-full w-full" style={{ display: "block" }} />
}
