export type Vec2 = [number, number]
export type SymmetryMode = "none" | "c5" | "c10"

export const TILE_ANGLES: number[][] = [
  [4,4,4,4,4,4,4,4,4,4],
  [2,4,4,2,4,4],
  [2,2,6,2,2,6],
  [2,3,2,3],
  [3,3,3,3,3],
]

export const TILE_NAMES = ["Decagon","Elongated Hexagon","Bowtie","Rhombus","Pentagon"]

// Static DLENS lookup — matches tiles.py exactly
export const DLENS: [number, number][][] = [
  Array(10).fill(null).map(() => [0.96, 0.96] as [number,number]),
  Array(6).fill(null).map(() => [0.61, 0.61] as [number,number]),
  Array(6).fill(null).map(() => [0.38, 0.38] as [number,number]),
  Array(4).fill(null).map(() => [0.44, 0.44] as [number,number]),
  Array(5).fill(null).map(() => [0.44, 0.44] as [number,number]),
]

export const TILE_COLORS_GOLD = [
  "rgba(212, 175, 55, 0.25)",
  "rgba(184, 134, 11, 0.25)",
  "rgba(218, 165, 32, 0.25)",
  "rgba(255, 215, 0, 0.25)",
  "rgba(207, 181, 59, 0.25)",
]

export interface Point { coords: Vec2; mask: number[] }
export interface Tile {
  tileType: number; pointIndexes: number[]; offset: number
  sideLength: number; rotationDeg: number; masks: Map<number, number[]>
}

export interface GeneratorConfig {
  width: number; height: number; sideLength: number
  iterations: number; retries: number
  symmetryMode: SymmetryMode; symmetryCenter: Vec2
}

const EPS = 0.1

function masksCompatible(m1: number[], m2: number[]): boolean {
  let cnt = 0
  for (let i = 0; i < 10; i++) {
    if (m1[i] + m2[i] > 1) return false
    if (m1[i] + m2[i] === 1) cnt++
  }
  return cnt !== 9
}
function addMasks(m1: number[], m2: number[]): number[] {
  for (let i = 0; i < 10; i++) m1[i] += m2[i]
  return m1
}
function removeMask(point: Point, mask: number[]): void {
  for (let i = 0; i < 10; i++) if (mask[i] === 1) point.mask[i] = 0
}

export class GirihGenerator {
  width: number; height: number; sideLength: number
  iterations: number; retries: number
  symmetryMode: SymmetryMode; symmetryCenter: Vec2
  points: Point[] = []; tiles: Tile[] = []
  pointDistances: [number, number][] = []

  constructor(config: Partial<GeneratorConfig> = {}) {
    this.width = config.width ?? 1000
    this.height = config.height ?? 1000
    this.sideLength = config.sideLength ?? 50
    this.iterations = config.iterations ?? 500
    this.retries = config.retries ?? 10
    this.symmetryMode = config.symmetryMode ?? "none"
    this.symmetryCenter = config.symmetryCenter ?? [0, 0]
  }

  reset(): void { this.points = []; this.tiles = []; this.pointDistances = [] }

  private tryAddPoint(length: number, coords: Vec2, mask: number[]): number {
    const [x, y] = coords
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i]
      if (Math.abs(p.coords[0]-x) < EPS*length && Math.abs(p.coords[1]-y) < EPS*length) {
        if (masksCompatible(p.mask, mask)) { p.mask = addMasks(p.mask, mask); return i }
        return -1
      }
    }
    const idx = this.points.length
    this.points.push({ coords, mask: [...mask] })
    const dist = Math.hypot(x, y)
    this.registerDistance(idx, dist)
    return idx
  }

  private registerDistance(idx: number, dist: number): void {
    let inserted = false
    for (let i = 0; i < this.pointDistances.length; i++) {
      if (dist < this.pointDistances[i][1]) {
        this.pointDistances.splice(i, 0, [idx, dist]); inserted = true; break
      }
    }
    if (!inserted) this.pointDistances.push([idx, dist])
  }

  private testTileOverlap(newIdxs: number[], length: number): boolean {
    const mind = (1 - EPS) * length
    for (const ni of newIdxs) {
      const [px, py] = this.points[ni].coords
      for (let i = 0; i < this.points.length; i++) {
        if (i === ni || newIdxs.includes(i)) continue
        if (Math.hypot(this.points[i].coords[0]-px, this.points[i].coords[1]-py) < mind) return false
      }
    }
    return true
  }

  // ── Symmetry ────────────────────────────────────────────────────────

  private symmetrySteps(): number[] {
    if (this.symmetryMode === "c5") return [0, 2, 4, 6, 8]
    if (this.symmetryMode === "c10") return [0,1,2,3,4,5,6,7,8,9]
    return [0]
  }

  private rotateAboutCenter(x: number, y: number, degrees: number): Vec2 {
    const [cx, cy] = this.symmetryCenter
    const rad = (degrees * Math.PI) / 180
    const dx = x - cx, dy = y - cy
    return [cx + dx*Math.cos(rad) - dy*Math.sin(rad),
            cy + dx*Math.sin(rad) + dy*Math.cos(rad)]
  }

  private orbitPlacements(x: number, y: number, angleDeg: number): [number, number, number][] {
    const placements: [number,number,number][] = []
    const seen = new Set<string>()
    for (const step of this.symmetrySteps()) {
      const rotDeg = step * 36
      const [rx, ry] = this.rotateAboutCenter(x, y, rotDeg)
      const ra = (angleDeg + rotDeg) % 360
      const key = `${rx.toFixed(6)},${ry.toFixed(6)},${ra.toFixed(6)}`
      if (!seen.has(key)) { seen.add(key); placements.push([rx, ry, ra]) }
    }
    return placements
  }

  // ── Core tile placement ──────────────────────────────────────────────

  private addTileSingle(tileType: number, offset: number, length: number,
                         x: number, y: number, angleDeg: number): number {
    const angles = TILE_ANGLES[tileType]
    const n = angles.length
    const rollback = this.points.length
    const idxs: number[] = []
    const maskRoll = new Map<number, number[]>()
    let cx = x, cy = y, alfa = angleDeg

    for (let i = 0; i < n; i++) {
      const ang = angles[(i + offset) % n]
      const prev = angles[(i + offset + n - 1) % n]
      const mask = Array(10).fill(0)
      const betaSector = alfa / 36
      for (let j = 0; j < prev; j++) mask[Math.floor((j + betaSector + 10) % 10)] = 1

      const pIdx = this.tryAddPoint(length, [cx, cy], mask)
      if (pIdx < 0) {
        for (const [pid, m] of maskRoll) removeMask(this.points[pid], m)
        this.points = this.points.slice(0, rollback)
        this.pointDistances = this.pointDistances.filter(([idx]) => idx < rollback)
        return -1
      }
      maskRoll.set(pIdx, [...mask]); idxs.push(pIdx)
      const rad = (alfa * Math.PI) / 180
      cx += Math.cos(rad) * length; cy += Math.sin(rad) * length
      alfa += 180 - ang * 36
    }

    const newIdxs = Array.from({length: this.points.length - rollback}, (_, i) => rollback + i)
    if (!this.testTileOverlap(newIdxs, length)) {
      for (const [pid, m] of maskRoll) removeMask(this.points[pid], m)
      this.points = this.points.slice(0, rollback)
      this.pointDistances = this.pointDistances.filter(([idx]) => idx < rollback)
      return -1
    }

    this.tiles.push({ tileType, pointIndexes: idxs, offset, sideLength: length, rotationDeg: alfa, masks: maskRoll })
    return this.tiles.length - 1
  }

  addTile(tileType: number, offset: number, length: number,
          x: number, y: number, angleDeg: number): number {
    const orbit = this.orbitPlacements(x, y, angleDeg)
    if (orbit.length === 1) return this.addTileSingle(tileType, offset, length, x, y, angleDeg)

    const rollback = this.points.length
    const tilesRollback = this.tiles.length
    const pdRollback = [...this.pointDistances]
    const placed: number[] = []

    for (const [rx, ry, ra] of orbit) {
      const tIdx = this.addTileSingle(tileType, offset, length, rx, ry, ra)
      if (tIdx < 0) {
        // Roll back entire orbit
        for (const tile of this.tiles.slice(tilesRollback)) {
          for (const [pid, m] of tile.masks) {
            if (pid < this.points.length) removeMask(this.points[pid], m)
          }
        }
        this.points = this.points.slice(0, rollback)
        this.tiles = this.tiles.slice(0, tilesRollback)
        this.pointDistances = pdRollback
        return -1
      }
      placed.push(tIdx)
    }
    return placed.length ? placed[0] : -1
  }

  // ── Slot filling ─────────────────────────────────────────────────────

  private fillSlot(length: number, x: number, y: number, ff: number, n: number): void {
    if (n < 2 || n > 8) return
    const place = (t: number, ofs: number) => this.addTile(t, ofs, length, x, y, ff * 36)
    const rc = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

    if (n === 2) { place(...rc([[1,1],[1,4],[2,1],[2,2],[3,1]] as [number,number][])); return }
    if (n === 3) { place(...rc([[3,2],[4,1]] as [number,number][])); return }
    if (n === 4) {
      if (Math.random() > 0.5) place(...rc([[0,1],[1,2],[1,3]] as [number,number][]))
      else { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,2) }
      return
    }
    if (n === 5) {
      if (Math.random() > 0.5) { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,3) }
      else { this.fillSlot(length,x,y,ff,3); this.fillSlot(length,x,y,ff+3,2) }
      return
    }
    if (n === 6) {
      const r = Math.floor(Math.random()*5)
      if (r===0) this.addTile(2,3,length,x,y,(ff+3)*36)
      else if (r===1) { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,2); this.fillSlot(length,x,y,ff+4,2) }
      else if (r===2) { this.fillSlot(length,x,y,ff,3); this.fillSlot(length,x,y,ff+3,3) }
      else if (r===3) { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,4) }
      else { this.fillSlot(length,x,y,ff,4); this.fillSlot(length,x,y,ff+4,2) }
      return
    }
    if (n === 7) {
      const r = Math.floor(Math.random()*5)
      if (r===0) { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,2); this.fillSlot(length,x,y,ff+4,3) }
      else if (r===1) { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,3); this.fillSlot(length,x,y,ff+5,2) }
      else if (r===2) { this.fillSlot(length,x,y,ff,3); this.fillSlot(length,x,y,ff+3,2); this.fillSlot(length,x,y,ff+5,2) }
      else if (r===3) { this.fillSlot(length,x,y,ff,3); this.fillSlot(length,x,y,ff+3,4) }
      else { this.fillSlot(length,x,y,ff,4); this.fillSlot(length,x,y,ff+4,3) }
      return
    }
    if (n === 8) {
      const r = Math.floor(Math.random()*10)
      if (r===0) { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,2); this.fillSlot(length,x,y,ff+4,2); this.fillSlot(length,x,y,ff+6,2) }
      else if (r===1) { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,2); this.fillSlot(length,x,y,ff+4,4) }
      else if (r===2) { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,4); this.fillSlot(length,x,y,ff+6,2) }
      else if (r===3) { this.fillSlot(length,x,y,ff,4); this.fillSlot(length,x,y,ff+4,2); this.fillSlot(length,x,y,ff+6,2) }
      else if (r===4) { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,3); this.fillSlot(length,x,y,ff+5,3) }
      else if (r===5) { this.fillSlot(length,x,y,ff,3); this.fillSlot(length,x,y,ff+3,2); this.fillSlot(length,x,y,ff+5,3) }
      else if (r===6) { this.fillSlot(length,x,y,ff,3); this.fillSlot(length,x,y,ff+3,3); this.fillSlot(length,x,y,ff+6,2) }
      else if (r===7) { this.fillSlot(length,x,y,ff,4); this.fillSlot(length,x,y,ff+4,4) }
      else if (r===8) { this.fillSlot(length,x,y,ff,2); this.fillSlot(length,x,y,ff+2,6) }
      else { this.fillSlot(length,x,y,ff,6); this.fillSlot(length,x,y,ff+6,2) }
    }
  }

  fillPoint(idx: number, length: number): number {
    if (idx < 0 || idx >= this.points.length) return -1
    const p = this.points[idx]
    let first = -2, freeCnt = 0

    for (let i = 0; i < 11; i++) {
      const s = p.mask[i % 10]
      if (s === 1 && first === -2) first = -1
      if (s === 0 && first === -1) first = i % 10
    }
    if (first < 0) return -1

    while (p.mask[first % 10] === 0 && freeCnt < 12) { freeCnt++; first++ }
    first -= freeCnt
    if (freeCnt > 10) return -1

    const [x, y] = p.coords
    this.fillSlot(length, x, y, first, freeCnt)
    return 0
  }

  // ── Initial seed ─────────────────────────────────────────────────────

  addInitialDecagon(): void {
    const x = -this.sideLength / 2
    const y = -1.5388 * this.sideLength
    if (this.symmetryMode === "c5" || this.symmetryMode === "c10") {
      // Single centered decagon — gives symmetric modes a stable core
      this.addTileSingle(0, 0, this.sideLength, x, y, 0)
    } else {
      this.addTile(0, 0, this.sideLength, x, y, 0)
    }
  }

  isVisiblePoint(i: number): boolean {
    if (i >= 0 && i < this.points.length) {
      const [x, y] = this.points[i].coords
      return x >= -this.width/2 && x <= this.width/2 && y >= -this.height/2 && y <= this.height/2
    }
    return false
  }

  private pickClosestVisiblePoint(): number | null {
    if (!this.pointDistances.length) return null
    const sorted = [...this.pointDistances].sort((a, b) => a[1] - b[1])
    for (const [idx] of sorted) if (this.isVisiblePoint(idx)) return idx
    return null
  }

  // ── Generation algorithms ─────────────────────────────────────────────

  // Gen1: sequential — iterate points in order as they're created
  runGen1(): void {
    if (!this.tiles.length) this.addInitialDecagon()
    let i = 0, steps = 0
    while (i < this.points.length && steps < this.iterations) {
      if (this.isVisiblePoint(i)) {
        for (let j = 0; j < this.retries; j++) this.fillPoint(i, this.sideLength)
      }
      i++; steps++
    }
  }

  // Gen2: distance-based — always expand nearest visible point
  runGen2(): void {
    if (!this.tiles.length) this.addInitialDecagon()
    for (let iter = 0; iter < this.iterations; iter++) {
      if (!this.pointDistances.length) break
      let placedAny = false
      const L = this.pointDistances.length
      let tried = 0

      while (tried < L && !placedAny) {
        const idx = this.pickClosestVisiblePoint()
        tried++
        if (idx === null) break
        const tilesBefore = this.tiles.length
        for (let j = 0; j < this.retries; j++) this.fillPoint(idx, this.sideLength)
        if (this.tiles.length > tilesBefore) {
          placedAny = true
        } else {
          this.pointDistances = this.pointDistances.filter(([i]) => i !== idx)
        }
      }
      if (!placedAny) break
    }
  }

  // Gen3: BFS queue — expand frontier of partial points
  runGen3(): void {
    if (!this.tiles.length) this.addInitialDecagon()
    const queue: number[] = this.points
      .map((p, i) => ({ i, s: p.mask.reduce((a, b) => a+b, 0) }))
      .filter(({ s }) => s > 0 && s < 10)
      .map(({ i }) => i)
    const inQ = new Set<number>(queue)
    let steps = 0

    while (queue.length && steps < this.iterations) {
      const idx = queue.shift()!
      inQ.delete(idx)
      if (!this.isVisiblePoint(idx)) { steps++; continue }

      const pointsBefore = this.points.length
      const tilesBefore = this.tiles.length
      for (let j = 0; j < this.retries; j++) this.fillPoint(idx, this.sideLength)

      if (this.tiles.length > tilesBefore) {
        for (let ni = pointsBefore; ni < this.points.length; ni++) {
          if (!inQ.has(ni)) { queue.push(ni); inQ.add(ni) }
        }
      }
      steps++
    }
  }

  generate(algorithm: 1 | 2 | 3 = 1): void {
    this.reset()
    if (algorithm === 1) this.runGen1()
    else if (algorithm === 2) this.runGen2()
    else this.runGen3()
  }

  getMidpoint(tileIndex: number, pointIdx: number) {
    const tile = this.tiles[tileIndex]
    const idxs = tile.pointIndexes
    const n = idxs.length, off = tile.offset
    const i1 = (pointIdx + n - off - 1 + n) % n
    const i2 = (pointIdx + n - off + n) % n
    const [x1, y1] = this.points[idxs[i1]].coords
    const [x2, y2] = this.points[idxs[i2]].coords
    const alfa = Math.atan2(x2 - x1, y2 - y1)
    return {
      mx: (x1+x2)/2, my: (y1+y2)/2,
      beta: Math.PI/2 - alfa + (Math.PI*54)/180,
      gamma: Math.PI/2 - alfa + (Math.PI*126)/180,
    }
  }
}
