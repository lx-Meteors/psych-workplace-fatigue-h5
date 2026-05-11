import fs from 'node:fs'
import path from 'node:path'
import PImage from 'pureimage'

const W = 1024
const H = 1024
const OUT_DIR = path.join(process.cwd(), 'src', 'assets')

const TYPES = [
  { id: 'driver', accessory: 'flag' },
  { id: 'analyst', accessory: 'lens' },
  { id: 'connector', accessory: 'link' },
  { id: 'operator', accessory: 'block' },
]

function ellipse(ctx, x, y, rx, ry) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(rx, ry)
  ctx.beginPath()
  ctx.arc(0, 0, 1, 0, Math.PI * 2)
  ctx.restore()
}

function fillCircle(ctx, x, y, r, color) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

function strokeCircle(ctx, x, y, r, color, width) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()
}

function drawAccessory(ctx, type) {
  const line = '#1f2937'
  if (type === 'flag') {
    ctx.strokeStyle = line
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.moveTo(680, 305)
    ctx.lineTo(680, 435)
    ctx.stroke()
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.moveTo(682, 305)
    ctx.lineTo(760, 332)
    ctx.lineTo(682, 360)
    ctx.closePath()
    ctx.fill()
    return
  }

  if (type === 'lens') {
    strokeCircle(ctx, 705, 343, 44, line, 10)
    ctx.strokeStyle = line
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.moveTo(736, 374)
    ctx.lineTo(780, 418)
    ctx.stroke()
    return
  }

  if (type === 'link') {
    ctx.strokeStyle = line
    ctx.lineWidth = 10
    ellipse(ctx, 678, 346, 38, 28)
    ctx.stroke()
    ellipse(ctx, 730, 346, 38, 28)
    ctx.stroke()
    return
  }

  if (type === 'block') {
    ctx.fillStyle = '#6366f1'
    ctx.fillRect(642, 307, 108, 74)
    ctx.strokeStyle = line
    ctx.lineWidth = 8
    ctx.strokeRect(642, 307, 108, 74)
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(657, 328)
    ctx.lineTo(738, 328)
    ctx.stroke()
  }
}

function drawBee(type) {
  const img = PImage.make(W, H)
  const ctx = img.getContext('2d')

  // transparent background + soft halo
  fillCircle(ctx, 512, 520, 380, 'rgba(43,78,255,0.10)')
  fillCircle(ctx, 590, 480, 280, 'rgba(34,197,94,0.10)')
  fillCircle(ctx, 500, 560, 430, 'rgba(15,23,42,0.06)')

  // wings
  ctx.fillStyle = 'rgba(232,242,255,0.88)'
  ellipse(ctx, 390, 470, 155, 115)
  ctx.fill()
  ellipse(ctx, 640, 450, 165, 120)
  ctx.fill()

  ctx.strokeStyle = 'rgba(30,41,59,0.15)'
  ctx.lineWidth = 6
  ellipse(ctx, 390, 470, 155, 115)
  ctx.stroke()
  ellipse(ctx, 640, 450, 165, 120)
  ctx.stroke()

  // antenna
  ctx.strokeStyle = '#111827'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.moveTo(455, 350)
  ctx.quadraticCurveTo(420, 268, 355, 258)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(565, 350)
  ctx.quadraticCurveTo(602, 270, 668, 260)
  ctx.stroke()
  fillCircle(ctx, 348, 258, 16, '#22c55e')
  fillCircle(ctx, 674, 260, 16, '#2b4eff')

  // body
  ctx.fillStyle = '#f8c652'
  ellipse(ctx, 512, 560, 250, 210)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ellipse(ctx, 450, 496, 140, 74)
  ctx.fill()
  ctx.strokeStyle = '#111827'
  ctx.lineWidth = 12
  ellipse(ctx, 512, 560, 250, 210)
  ctx.stroke()

  // stripes
  ctx.strokeStyle = '#111827'
  ctx.lineWidth = 26
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(315, 520)
  ctx.lineTo(708, 520)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(325, 580)
  ctx.lineTo(698, 580)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(350, 646)
  ctx.lineTo(675, 646)
  ctx.stroke()

  // face
  fillCircle(ctx, 442, 540, 36, 'white')
  fillCircle(ctx, 582, 540, 36, 'white')
  fillCircle(ctx, 442, 540, 23, '#111827')
  fillCircle(ctx, 582, 540, 23, '#111827')
  fillCircle(ctx, 432, 530, 8, 'white')
  fillCircle(ctx, 572, 530, 8, 'white')

  ctx.strokeStyle = '#111827'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.arc(512, 606, 36, 0.12 * Math.PI, 0.88 * Math.PI, false)
  ctx.stroke()

  // cheeks
  fillCircle(ctx, 380, 582, 18, 'rgba(236,72,153,0.35)')
  fillCircle(ctx, 646, 582, 18, 'rgba(236,72,153,0.35)')

  drawAccessory(ctx, type.accessory)

  return img
}

async function savePng(img, outFile) {
  await new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(outFile)
    stream.on('finish', resolve)
    stream.on('error', reject)
    PImage.encodePNGToStream(img, stream).catch(reject)
  })
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true })
  }

  for (const type of TYPES) {
    const img = drawBee(type)
    const out = path.join(OUT_DIR, `bee_${type.id}.png`)
    await savePng(img, out)
    console.log(`Generated ${out}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
