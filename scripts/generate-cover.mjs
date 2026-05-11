import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env: ${name}`)
  return value
}

function safeSlug(input) {
  return (
    String(input || '')
      .trim()
      .toLowerCase()
      .replace(/[\u4e00-\u9fa5]/g, '') // keep slug ascii-ish
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'psych-test'
  )
}

function pickFirstGroup(match) {
  return match?.[1]?.trim() || ''
}

async function readProjectThemeFromApp() {
  const appPath = resolve(process.cwd(), 'src/App.jsx')
  const content = await readFile(appPath, 'utf8')

  // Try to extract Intro h1 main title and subtitle span.
  const title = pickFirstGroup(content.match(/<h1[^>]*>\s*([^<\n]+)\s*<span/s))
  const subtitle = pickFirstGroup(content.match(/<span[^>]*>\s*([^<\n]+)\s*<\/span>/s))

  return {
    title: title || '',
    subtitle: subtitle || '',
  }
}

async function readPaletteFromConfig() {
  const cfgPath = resolve(process.cwd(), 'src/testConfig.js')
  const content = await readFile(cfgPath, 'utf8')

  const primary = pickFirstGroup(content.match(/primary:\s*'([^']+)'/))
  const accent = pickFirstGroup(content.match(/accent:\s*'([^']+)'/))
  const background = pickFirstGroup(content.match(/background:\s*'([^']+)'/))

  return { primary, accent, background }
}

function buildPrompt({ title, subtitle, tone = '网易传媒感、清爽杂志风', palette }) {
  const primary = palette?.primary ?? '#1D4ED8'
  const accent = palette?.accent ?? '#22C55E'
  const background = palette?.background ?? '#F5FAFF'

  // Cover spec: 1080x1920, mobile-first, safe margins, readable text.
  return [
    `为移动端H5心理测试生成封面海报，尺寸1080x1920（竖版），风格：${tone}。`,
    `主题：${title}。副标题：${subtitle}。必须包含清晰可读的大标题与副标题（中文）。`,
    `版式：网易媒体专题封面风——强层级排版、信息卡片、留白、轻毛玻璃卡片。`,
    `元素：与主题强相关的贴纸/图标（不出现真人脸），右上角可有“TRENDING/热度”小角标。`,
    `配色：primary ${primary}，accent ${accent}，background ${background}。整体清爽、对比清晰。`,
    `约束：四周安全边距>=96px；文字不要贴边；避免大面积密集小字；适合截图分享。`,
    `输出：高质感插画风/平面风均可，但要像“杂志封面”，不要幼稚卡通。`,
  ].join('\n')
}

async function arkGenerateImage({ baseUrl, apiKey, endpointId, prompt, size = '1080x1920' }) {
  const url = `${baseUrl}/images/generations`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: endpointId,
      prompt,
      size,
      n: 1,
      response_format: 'b64_json',
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Ark image generation failed: ${res.status} ${res.statusText}\n${text}`)
  }

  const json = await res.json()
  const b64 = json?.data?.[0]?.b64_json
  if (!b64) throw new Error(`Unexpected response: missing data[0].b64_json`)
  return Buffer.from(b64, 'base64')
}

async function main() {
  // Minimal .env loading (no dependency): user can set env in shell, or create a .env and use `node --env-file=.env`.
  const baseUrl = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
  const apiKey = requireEnv('ARK_API_KEY')
  const modelOrEndpoint =
    process.env.ARK_IMAGE_MODEL_OR_ENDPOINT || process.env.ARK_IMAGE_ENDPOINT_ID || process.env.ARK_IMAGE_MODEL
  if (!modelOrEndpoint) throw new Error(`Missing env: ARK_IMAGE_MODEL_OR_ENDPOINT (or legacy ARK_IMAGE_ENDPOINT_ID)`)

  const autoFromProject = (process.env.COVER_FROM_PROJECT || '1') !== '0'
  const projectTheme = autoFromProject ? await readProjectThemeFromApp().catch(() => ({ title: '', subtitle: '' })) : { title: '', subtitle: '' }
  const projectPalette = autoFromProject ? await readPaletteFromConfig().catch(() => ({})) : {}

  const title = process.env.COVER_TITLE || projectTheme.title || '心理测试'
  const subtitle = process.env.COVER_SUBTITLE || projectTheme.subtitle || '8 道情境题，测出你的专属画像'
  const tone = process.env.COVER_TONE || '网易传媒感、清爽夏日杂志风'
  const palette = {
    primary: process.env.COVER_PRIMARY || projectPalette.primary,
    accent: process.env.COVER_ACCENT || projectPalette.accent,
    background: process.env.COVER_BG || projectPalette.background,
  }
  const prompt = buildPrompt({ title, subtitle, tone, palette })

  const outFile = process.env.COVER_OUT_FILE || 'src/assets/cover.png'
  const outAbs = resolve(process.cwd(), outFile)

  const png = await arkGenerateImage({ baseUrl, apiKey, endpointId: modelOrEndpoint, prompt })
  await mkdir(dirname(outAbs), { recursive: true })
  await writeFile(outAbs, png)

  console.log(`OK: wrote cover -> ${outFile}`)
  console.log(`Tip: set COVER_TITLE/COVER_SUBTITLE to override; slug: ${safeSlug(title)}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

