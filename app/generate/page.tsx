"use client"

import { useState, useCallback, useEffect } from "react"
import { PatternCanvas } from "@/components/pattern-canvas"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, RefreshCw, Download, Settings2, Layers, Palette, Sparkles, ChevronDown } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useLang } from "@/contexts/LanguageContext"
import { LangToggle } from "@/components/lang-toggle"

import { GirihGenerator, DLENS, TILE_COLORS_GOLD, type GeneratorConfig, type SymmetryMode } from "@/lib/girih-generator"

type Algorithm = 1 | 2 | 3
type ColorScheme = "gold" | "classic" | "monochrome"

export default function GeneratePage() {
  const { t } = useLang()
  const [seed, setSeed] = useState(1234)
  const [algorithm, setAlgorithm] = useState<Algorithm>(1)
  const [colorScheme, setColorScheme] = useState<ColorScheme>("gold")
  const [symmetryMode, setSymmetryMode] = useState<SymmetryMode>("none")
  const [sideLength, setSideLength] = useState(50)
  const [iterations, setIterations] = useState(100)
  const [showTileFill, setShowTileFill] = useState(true)
  const [showStrapwork, setShowStrapwork] = useState(true)
  const [showOutlines, setShowOutlines] = useState(false)
  const [tileCount, setTileCount] = useState(0)
  const [pointCount, setPointCount] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); setSeed(Math.floor(Math.random() * 10000)) }, [])

  const handleGenerate = useCallback(() => {
    setIsGenerating(true); setSeed(Math.floor(Math.random() * 10000)); setTimeout(() => setIsGenerating(false), 100)
  }, [])

  const handleDownload = useCallback(() => {
    const canvas = document.querySelector("canvas"); if (!canvas) return
    const link = document.createElement("a"); link.download = `girih-pattern-${seed}.png`; link.href = (canvas as HTMLCanvasElement).toDataURL("image/png"); link.click()
  }, [seed])

  const handleGenerated = useCallback((tiles: number, points: number) => { setTileCount(tiles); setPointCount(points) }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="w-full border-b border-border bg-card p-6 lg:h-screen lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-[Inter] text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />{t.backHome}
          </Link>
          <LangToggle />
        </div>

        <div className="mb-8">
          <h1 className="font-[Playfair_Display] text-2xl font-bold text-foreground">{t.generatorTitle}</h1>
          <p className="mt-2 font-[Inter] text-sm text-muted-foreground">{t.generatorSubtitle}</p>
        </div>

        <div className="mb-6 flex gap-2">
          <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1 gap-2 bg-primary font-[Inter] text-primary-foreground hover:bg-primary/90">
            <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />{t.generateBtn2}
          </Button>
          <Button onClick={handleDownload} variant="outline" className="gap-2 border-border"><Download className="h-4 w-4" /></Button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-border bg-secondary/30 p-4">
          <div className="text-center">
            <div className="font-[Playfair_Display] text-2xl font-bold text-primary">{tileCount}</div>
            <div className="font-[Inter] text-xs text-muted-foreground">{t.tilesLabel}</div>
          </div>
          <div className="text-center">
            <div className="font-[Playfair_Display] text-2xl font-bold text-primary">{pointCount}</div>
            <div className="font-[Inter] text-xs text-muted-foreground">{t.pointsLabel}</div>
          </div>
        </div>

        <div className="space-y-4">
          <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 font-[Inter] text-sm font-medium text-foreground transition-colors hover:bg-secondary/50">
              <span className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-primary" />{t.genSettings}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-4 px-1">
              <div className="space-y-2">
                <Label className="font-[Inter] text-sm text-muted-foreground">{t.algorithmLabel}</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between border-border font-[Inter]">
                      {t.algoNames[algorithm]}<ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {([1, 2, 3] as Algorithm[]).map(alg => (
                      <DropdownMenuItem key={alg} onClick={() => setAlgorithm(alg)} className="font-[Inter]">{t.algoNames[alg]}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <Label className="font-[Inter] text-sm text-muted-foreground">{t.symmetryLabel}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {([["none", t.symNone], ["c5", t.symC5], ["c10", t.symC10]] as [SymmetryMode, string][]).map(([mode, label]) => (
                    <button key={mode} onClick={() => setSymmetryMode(mode)}
                      className={`rounded-lg border p-2 font-[Inter] text-xs transition-all ${symmetryMode === mode ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-[Inter] text-sm text-muted-foreground">{t.tileSizeLabel}</Label>
                  <span className="font-[Inter] text-sm text-primary">{sideLength}px</span>
                </div>
                <Slider value={[sideLength]} onValueChange={([v]) => setSideLength(v)} min={20} max={100} step={5} className="[&_[role=slider]]:bg-primary" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-[Inter] text-sm text-muted-foreground">{t.iterationsLabel}</Label>
                  <span className="font-[Inter] text-sm text-primary">{iterations}</span>
                </div>
                <Slider value={[iterations]} onValueChange={([v]) => setIterations(v)} min={0} max={300} step={1} className="[&_[role=slider]]:bg-primary" />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 font-[Inter] text-sm font-medium text-foreground transition-colors hover:bg-secondary/50">
              <span className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" />{t.displayOptions}</span>
              <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-4 px-1">
              {[
                { label: t.tileFill, val: showTileFill, set: setShowTileFill },
                { label: t.strapworkLines, val: showStrapwork, set: setShowStrapwork },
                { label: t.tileOutlines, val: showOutlines, set: setShowOutlines },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <Label className="font-[Inter] text-sm text-muted-foreground">{item.label}</Label>
                  <Switch checked={item.val} onCheckedChange={item.set} />
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 font-[Inter] text-sm font-medium text-foreground transition-colors hover:bg-secondary/50">
              <span className="flex items-center gap-2"><Palette className="h-4 w-4 text-primary" />{t.colorScheme}</span>
              <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 px-1">
              <div className="grid grid-cols-3 gap-2">
                {(["gold", "classic", "monochrome"] as ColorScheme[]).map(scheme => (
                  <button key={scheme} onClick={() => setColorScheme(scheme)} className={`rounded-lg border p-3 text-center font-[Inter] text-xs capitalize transition-all ${colorScheme === scheme ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                    {t.colorNames[scheme]}
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-secondary/20 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h4 className="font-[Inter] text-sm font-medium text-foreground">{t.aboutGirihTitle}</h4>
              <p className="mt-1 font-[Inter] text-xs leading-relaxed text-muted-foreground">{t.aboutGirihText}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-background">
        <div className="relative h-[60vh] w-full lg:h-screen">
          {mounted ? (
            <PatternCanvas config={{ width: 1600, height: 1000, sideLength, iterations, retries: 30 }} algorithm={algorithm} symmetryMode={symmetryMode} showTileFill={showTileFill} showStrapwork={showStrapwork} showOutlines={showOutlines} colorScheme={colorScheme} seed={seed} onGenerated={handleGenerated} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary/20">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="mt-4 font-[Inter] text-sm text-muted-foreground">{t.initLabel}</p>
              </div>
            </div>
          )}
          {mounted && (
            <div className="absolute bottom-4 right-4 rounded-full border border-border bg-card/80 px-4 py-2 backdrop-blur-sm">
              <span className="font-[Inter] text-xs text-muted-foreground">
                {t.seedLabel}: <span className="font-mono text-primary">{seed}</span>
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}