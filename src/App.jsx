import { useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import questions from './questions.json'
import { COFFEE_ICONS, INTERACTION_CONFIG, METRIC_KEYS, THEME, TYPES } from './testConfig.js'
import coverImage from './assets/cover.png'

function makeInitialScores() {
  return Object.keys(TYPES).reduce((scores, id) => {
    scores[id] = 0
    return scores
  }, {})
}

function calculateScores(answers) {
  const init = makeInitialScores()
  return answers.reduce((scores, answer) => {
    if (!answer) return scores
    Object.entries(answer.scores).forEach(([typeId, point]) => {
      scores[typeId] += point
    })
    return scores
  }, init)
}

function getTopType(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
}

function getConfidence(topScore, secondScore, maxPossible) {
  const base = (topScore / maxPossible) * 100
  const gapBoost = (topScore - secondScore) * 7
  return Math.round(Math.max(55, Math.min(99, base + gapBoost)))
}

function getComplementarityScore(aMetrics, bMetrics) {
  return METRIC_KEYS.reduce((sum, { key, weight }) => {
    const a = aMetrics?.[key] ?? 3
    const b = bMetrics?.[key] ?? 3
    return sum + Math.abs(a - b) * weight
  }, 0)
}

function getComplementReason(aMetrics, bMetrics) {
  const diffs = METRIC_KEYS.map(({ key, label }) => ({
    key,
    label,
    diff: Math.abs((aMetrics?.[key] ?? 3) - (bMetrics?.[key] ?? 3)),
  })).sort((x, y) => y.diff - x.diff)
  const top = diffs[0]
  if (!top || top.diff === 0) return '疲惫底色接近但侧重点不同，搭伙干活更省心。'
  return `在「${top.label}」上互补明显：一个更扛压，一个更会回血。`
}

function renderStars(level) {
  const safe = Math.max(0, Math.min(5, level))
  return `${'★★★★★'.slice(0, safe)}${'☆☆☆☆☆'.slice(0, 5 - safe)}`
}

function getRadarPoint(index, value, total, center, maxRadius) {
  const angle = (-Math.PI / 2) + (index * 2 * Math.PI) / total
  const radius = (Math.max(1, Math.min(5, value)) / 5) * maxRadius
  const x = center + radius * Math.cos(angle)
  const y = center + radius * Math.sin(angle)
  return { x, y }
}

export default function App() {
  const [phase, setPhase] = useState('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finalScores, setFinalScores] = useState(makeInitialScores())
  const [isFading, setIsFading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const posterRef = useRef(null)

  const currentQuestion = questions[currentIndex]
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100)
  const selectedOption = answers[currentIndex]
  const liveScores = useMemo(() => calculateScores(answers), [answers])

  const result = useMemo(() => {
    const typeId = getTopType(finalScores)
    const type = TYPES[typeId]
    const ranking = Object.entries(finalScores).sort((a, b) => b[1] - a[1])
    const maxPossible = questions.length * 3
    const topScore = ranking[0]?.[1] ?? 0
    const secondScore = ranking[1]?.[1] ?? 0
    const matches = Object.entries(TYPES)
      .filter(([id]) => id !== typeId)
      .map(([id, other]) => ({
        id,
        ...other,
        score: getComplementarityScore(type.metrics, other.metrics),
        reason: getComplementReason(type.metrics, other.metrics),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)

    return {
      id: typeId,
      ...type,
      confidence: getConfidence(topScore, secondScore, maxPossible),
      rankingTop3: ranking.slice(0, 3).map(([id, score]) => ({
        id,
        name: TYPES[id].name,
        emoji: TYPES[id].emoji,
        percent: Math.round((score / maxPossible) * 100),
      })),
      matches,
    }
  }, [finalScores])

  const startQuiz = () => {
    setAnswers([])
    setFinalScores(makeInitialScores())
    setCurrentIndex(0)
    setPhase('quiz')
  }

  const finishQuiz = (nextAnswers) => {
    setFinalScores(calculateScores(nextAnswers))
    setPhase('loading')
    setIsFading(false)
    window.setTimeout(() => setPhase('result'), INTERACTION_CONFIG.loadingDurationMs)
  }

  const advanceWithTransition = (nextAnswers) => {
    setIsFading(true)
    window.setTimeout(() => {
      if (currentIndex === questions.length - 1) {
        finishQuiz(nextAnswers)
        return
      }
      setCurrentIndex((index) => index + 1)
      setIsFading(false)
    }, 260)
  }

  const chooseOption = (option) => {
    if (isFading) return
    const nextAnswers = [...answers]
    nextAnswers[currentIndex] = option
    setAnswers(nextAnswers)
  }

  const goNextManual = () => {
    if (isFading || !selectedOption) return
    advanceWithTransition([...answers])
  }

  const goBack = () => {
    if (isFading || currentIndex === 0 || !INTERACTION_CONFIG.allowBackEdit) return
    setIsFading(true)
    window.setTimeout(() => {
      setCurrentIndex((index) => index - 1)
      setIsFading(false)
    }, 220)
  }

  const downloadPoster = async () => {
    if (!posterRef.current) return
    setIsGenerating(true)
    const canvas = await html2canvas(posterRef.current, {
      backgroundColor: null,
      scale: Math.min(window.devicePixelRatio || 2, 3),
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = `打工人疲惫度-${result.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setIsGenerating(false)
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-slate-950">
      <div className="pointer-events-none fixed inset-0 work-gradient" />
      <div className="pointer-events-none fixed inset-0 work-grid" />
      <div className="pointer-events-none fixed inset-0 work-noise" />
      <div className="pointer-events-none fixed left-6 top-10 h-32 w-32 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-10 right-8 h-40 w-40 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      <div className="pointer-events-none fixed inset-0 coffee-float" />

      <section
        className={`relative mx-auto flex w-full max-w-5xl ${
          phase === 'intro'
            ? 'min-h-[100dvh] flex-col items-stretch px-3 pb-0 pt-[max(4px,env(safe-area-inset-top))] lg:min-h-screen lg:flex-row lg:items-center lg:px-8 lg:py-8'
            : 'min-h-screen items-center px-4 py-8 sm:px-6 lg:px-8'
        }`}
      >
        {phase === 'intro' && (
          <Intro className="min-h-0 flex-1" onStart={startQuiz} />
        )}
        {phase === 'quiz' && (
          <QuizCard
            currentIndex={currentIndex}
            isFading={isFading}
            onBack={goBack}
            onChoose={chooseOption}
            onNextManual={goNextManual}
            progress={progress}
            question={currentQuestion}
            selectedOptionText={selectedOption?.text}
            total={questions.length}
            liveScores={liveScores}
          />
        )}
        {phase === 'loading' && <LoadingScreen />}
        {phase === 'result' && (
          <ResultScreen
            isGenerating={isGenerating}
            onDownload={downloadPoster}
            onRestart={startQuiz}
            posterRef={posterRef}
            result={result}
          />
        )}
      </section>
    </main>
  )
}

function CoffeeIllustration({ typeId, size = 220, className = '' }) {
  const icon = COFFEE_ICONS[typeId] ?? '☕'
  return (
    <div className={className}>
      <div
        className="flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-[#EEF2FF] to-[#F8FAFC] shadow-[0_20px_45px_rgba(30,27,75,0.16)]"
        style={{ width: size, height: size }}
      >
        <span className="text-[90px]" role="img" aria-label={`${typeId} workplace fatigue icon`}>
          {icon}
        </span>
      </div>
    </div>
  )
}

function FlavorRadar({ metrics }) {
  const size = 220
  const center = 110
  const maxRadius = 78
  const levels = [1, 2, 3, 4, 5]
  const axisCount = METRIC_KEYS.length

  const shapePoints = METRIC_KEYS.map(({ key }, index) => {
    const point = getRadarPoint(index, metrics?.[key] ?? 3, axisCount, center, maxRadius)
    return `${point.x},${point.y}`
  }).join(' ')

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">职场五维雷达</p>
      <svg className="mx-auto mt-3" height={size} viewBox="0 0 220 220" width={size}>
        {levels.map((level) => {
          const points = METRIC_KEYS.map((_, index) => {
            const point = getRadarPoint(index, level, axisCount, center, maxRadius)
            return `${point.x},${point.y}`
          }).join(' ')
          return <polygon key={level} fill="none" points={points} stroke="rgba(15,23,42,0.14)" strokeWidth="1" />
        })}
        {METRIC_KEYS.map((_, index) => {
          const outer = getRadarPoint(index, 5, axisCount, center, maxRadius)
          return <line key={index} stroke="rgba(15,23,42,0.18)" strokeWidth="1" x1={center} x2={outer.x} y1={center} y2={outer.y} />
        })}
        <polygon fill="rgba(99,102,241,0.18)" points={shapePoints} stroke="rgba(99,102,241,0.85)" strokeWidth="2" />
        {METRIC_KEYS.map(({ key }, index) => {
          const point = getRadarPoint(index, metrics?.[key] ?? 3, axisCount, center, maxRadius)
          return <circle cx={point.x} cy={point.y} fill="rgba(15,23,42,0.92)" key={key} r="4" />
        })}
      </svg>
    </div>
  )
}

function Intro({ className = '', onStart }) {
  return (
    <div
      className={`mx-auto grid min-h-0 w-full grid-rows-[minmax(0,1fr)] gap-6 lg:min-h-0 lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-none lg:items-center ${className}`}
    >
      {/* Mobile: 占满 intro 区域高度，消除底部大块留白 */}
      <div className="mx-auto flex min-h-0 h-full w-full max-w-[min(100%,440px)] flex-col lg:hidden">
        <div className="work-card flex min-h-[min(95svh,calc(100dvh-0.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))] flex-1 flex-col overflow-hidden rounded-[1.5rem] p-1.5 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[var(--bg)]">
            {/* object-contain：整张云海报入框，不裁切 logo / 标题；上下或两侧留边用底色填充 */}
            <img alt="封面海报" className="max-h-full max-w-full object-contain object-center" src={coverImage} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />

            <div className="absolute left-3 right-3 top-3 flex items-center gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-900 shadow-sm backdrop-blur">
                WORKPLACE
              </span>
              <span className="rounded-full bg-[var(--secondary)]/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur">
                职场限定
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              <div className="rounded-2xl bg-white/80 p-2 shadow-[0_12px_40px_rgba(15,23,42,0.15)] backdrop-blur">
                <button
                  className="press cta-ready w-full rounded-xl bg-[var(--primary)] px-5 py-3.5 text-base font-black text-white hover:brightness-105"
                  onClick={onStart}
                  type="button"
                >
                  开始测试
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: 与移动端一致——仅标题层级 + 短说明 + CTA；无 Live/营销小卡片 */}
      <div className="work-card-strong animate-pop hidden rounded-[1.75rem] p-6 sm:p-8 lg:block lg:bg-white/95 lg:backdrop-blur">
        <p className="mb-3 inline-flex rounded-full bg-[var(--secondary)] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white">
          Workplace Battery Lab
        </p>
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          打工人疲惫度心理测试
          <span className="mt-2 block text-xl font-black text-slate-700 sm:text-2xl lg:text-4xl">
            8 道职场情境题，测出你的疲惫底色
          </span>
        </h1>
        <p className="mt-5 text-sm font-bold leading-6 text-slate-600 sm:text-base">
          选你最像的反应即可，结束后可生成一张可晒的疲惫画像海报。
        </p>
        <button
          className="press cta-ready mt-8 w-full rounded-2xl bg-[var(--primary)] px-6 py-4 text-lg font-black text-white hover:brightness-105"
          onClick={onStart}
          type="button"
        >
          开始测试
        </button>
      </div>

      <div className="relative hidden lg:block">
        <div className="work-card overflow-hidden rounded-[1.75rem] p-4 shadow-lg">
          <div className="flex max-h-[min(72vh,640px)] min-h-[320px] items-center justify-center overflow-hidden rounded-2xl bg-[var(--bg)]">
            <img alt="活动封面海报" className="max-h-full max-w-full object-contain object-center" src={coverImage} />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuizStepper({ current, total }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Array.from({ length: total }, (_, index) => {
        const done = index < current
        const active = index === current
        return (
          <span
            className={`h-2.5 w-2.5 rounded-full transition ${
              active ? 'scale-110 bg-[var(--primary)]' : done ? 'bg-[var(--accent)]' : 'bg-[#CBD5E1]'
            }`}
            key={index}
          />
        )
      })}
    </div>
  )
}

function QuizCard({ currentIndex, isFading, onBack, onChoose, onNextManual, progress, question, selectedOptionText, total, liveScores }) {
  const canNext = Boolean(selectedOptionText)

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-5 flex items-center justify-between text-sm font-black text-slate-600">
        <span>
          Q{currentIndex + 1}/{total}
        </span>
        <span>{progress}% 职场信号采集中</span>
      </div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <QuizStepper current={currentIndex} total={total} />
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">
          <span className="text-[var(--primary)]">实时疲惫倾向</span>
          <span className="font-mono">
            {Object.entries(liveScores)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 2)
              .map(([id, score]) => `${TYPES[id].emoji}${score}`)
              .join(' · ')}
          </span>
        </div>
      </div>
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-[var(--primary)] transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <article
        className={`work-card-strong rounded-[1.75rem] p-5 transition duration-300 sm:p-8 ${
          isFading ? 'translate-y-3 opacity-0' : 'opacity-100'
        }`}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--primary)]">Workplace</p>
        </div>

        <h2 className="text-2xl font-black leading-snug sm:text-4xl">{question.title}</h2>
        <div className="mt-4 inline-flex rounded-full border border-indigo-200 bg-[#EEF2FF] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-indigo-800">
          职场情境 · 选你最像的一个
        </div>

        <div className="mt-8 grid gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOptionText === option.text
            return (
              <button
                className={`press group rounded-2xl border-2 p-4 text-left font-bold disabled:cursor-not-allowed disabled:opacity-70 ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[#EEF2FF] shadow-[0_18px_60px_rgba(99,102,241,0.18)]'
                    : 'border-white bg-white hover:border-indigo-200'
                }`}
                disabled={isFading}
                key={option.text}
                onClick={() => onChoose(option)}
                type="button"
              >
                <span
                  className={`mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm text-white transition ${
                    isSelected ? 'bg-[var(--primary)]' : 'bg-[var(--secondary)] group-hover:bg-[var(--primary)]'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                {option.text}
                {isSelected && (
                  <span className="ml-3 inline-flex rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-black text-white">
                    已选择
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1.4fr] sm:items-center">
          <button
            className="press w-full rounded-2xl bg-white px-5 py-4 text-base font-black text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentIndex === 0 || isFading}
            onClick={onBack}
            type="button"
          >
            ← 返回上一题
          </button>
          <button
            className={`press w-full rounded-2xl bg-[var(--primary)] px-5 py-4 text-base font-black text-white hover:brightness-105 disabled:cursor-not-allowed ${
              canNext ? 'cta-ready' : 'cta-disabled'
            }`}
            disabled={!canNext || isFading}
            onClick={onNextManual}
            type="button"
          >
            下一题 →
          </button>
        </div>
      </article>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="mx-auto w-full max-w-sm text-center">
      <div className="work-card rounded-[1.75rem] p-8">
        <div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-8 border-white border-t-[var(--primary)]" />
        <h2 className="text-3xl font-black">正在生成你的疲惫画像...</h2>
        <p className="mt-3 text-slate-600">在回放你的紧绷度、耗竭感与回血方式（约 2 秒）。</p>
      </div>
    </div>
  )
}

function ResultScreen({ isGenerating, onDownload, onRestart, posterRef, result }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div ref={posterRef} className="work-poster rounded-[1.75rem] p-4 shadow-lg sm:p-6">
        <div className="rounded-[1.25rem] bg-white p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-[var(--secondary)] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                Your Fatigue Style
              </p>
              <h2 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
                {result.emoji} {result.name}
              </h2>
              <p className="mt-3 text-lg font-black text-[var(--primary)]">{result.badge}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#FFFBEB] px-4 py-3">
                <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white">
                  高光一句
                </span>
                <span className="text-sm font-black text-[var(--secondary)]">{result.headline}</span>
              </div>
              <p className="mt-4 text-base font-black text-slate-800">“{result.quote}”</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="hidden sm:block">
                <CoffeeIllustration typeId={result.id} size={220} />
              </div>
              <div className={`rounded-3xl bg-gradient-to-br ${result.color} p-5 text-center text-white`}>
                <p className="text-xs font-bold uppercase tracking-[0.2em]">置信度</p>
                <p className="text-5xl font-black">{result.confidence}%</p>
              </div>
            </div>
          </div>

          <p className="mt-7 text-base leading-8 text-slate-700 sm:text-lg">{result.description}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {result.strengths.map((strength) => (
              <div className="rounded-2xl bg-[#EEF2FF] p-4 text-sm font-black text-slate-800" key={strength}>
                #{strength}
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-3xl bg-[#F0F7FF] p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">职场五维</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
              <FlavorRadar metrics={result.metrics} />
              <div className="space-y-3">
                {METRIC_KEYS.map(({ key, label }) => (
                  <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm" key={key}>
                    <span className="text-sm font-black text-slate-700">{label}</span>
                    <span className="font-mono text-sm font-black text-slate-900">{renderStars(result.metrics?.[key] ?? 3)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">观察点（轻松版）</p>
              <ul className="mt-3 space-y-2 text-sm font-bold text-slate-700">
                {(result.roasts ?? []).slice(0, 2).map((line) => (
                  <li className="flex gap-2" key={line}>
                    <span className="mt-0.5 text-[var(--accent)]">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-7 rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">疲惫倾向 Top 3</p>
            <div className="mt-4 space-y-3">
              {result.rankingTop3.map((item) => (
                <div key={item.id}>
                  <div className="mb-1 flex items-center justify-between text-sm font-bold text-slate-700">
                    <span>
                      {item.emoji} {item.name}
                    </span>
                    <span>{item.percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 rounded-3xl bg-[var(--secondary)] p-5 text-white">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--accent)]">匹配度（职场互补 / 轻微克星）</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {result.matches.map((match, index) => (
                <div className="rounded-2xl bg-white/10 p-4" key={match.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xl font-black">
                      {match.emoji} {match.name}
                    </p>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-900">
                      {index === 0 ? '高互补' : '中高互补'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{match.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Workplace Fatigue Test | Poster Ready
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          className="press cta-ready rounded-2xl bg-[var(--primary)] px-6 py-4 text-lg font-black text-white hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
          disabled={isGenerating}
          onClick={onDownload}
          type="button"
        >
          {isGenerating ? '生成中...' : '生成海报'}
        </button>
        <button
          className="press rounded-2xl border-2 border-white bg-white px-6 py-4 text-lg font-black text-slate-950 hover:bg-[#F5F7FA]"
          onClick={onRestart}
          type="button"
        >
          再测一次
        </button>
      </div>
    </div>
  )
}

