---
name: viral-h5-psych-test
description: Build mobile-first viral H5 personality tests with executable rules / 用“可执行规则”生成刷屏级移动端 H5 心理测试：Requirement Contract、3 方案 Gate、数据驱动题库、计分引擎、交互闭环、结果匹配、海报导出与 Deep Check。Use when user asks for H5心理测试/人格测试/questions.json/结果匹配/海报分享/网易媒体风/搞笑风/专业风/活动测试页。
disable-model-invocation: true
---

# Viral H5 Psychology Test（刷屏级 H5 心理测试）

目标：产出**可运行、可分享、可复用**的 H5 测试产品，重点优化：
- **完成率 (completion rate)**：题目顺滑、阻力低
- **分享动机 (share motivation)**：结果页“海报感”+ 社交钩子
- **结果稳定 (stable scoring)**：每个结果都可达 (reachability)
- **文案有画面 (vivid copy)**：具体、场景化、非空泛

## Use This Skill When（适用场景）

- 用户要做 **H5 测试产品** / 测试页面套件 / 心理测试落地实现
- 需要 `questions.json` + 计分 + 结果页 + 匹配模块 + 海报导出
- 需要指定**视觉风格/配色**（网易传媒感、搞笑风、专业风、像素等）
- 希望 AI **直接生成高质量题目选项**（而不是用户手写）

## Do Not Use This Skill When（不适用）

- 只要一句 slogan/一小段文案（不需要产品/题库/交互/引擎）
- 临床诊断、医疗结论、治疗建议（禁止）

## Execution Workflow（执行流程 / Must Follow）

1. **Intake（需求收敛）**：把用户话术规范化为 `Requirement Contract`
2. **Stage Gate：3-Solution Proposal（先出 3 套方案）**：A/B/C（风格+元素+交互）让用户选
3. **Result System First（先定结果体系）**：人格类型 + 匹配/互补规则（先于题目）
4. **Question Generation（再写题库）**：情景化题干 + 可直接选的选项 + 明确 score 映射
5. **UX Structure（页面结构）**：landing → quiz → loading → result → poster
6. **Implementation（落地实现）**：数据驱动渲染 + 计分引擎 + 交互闭环约束
7. **Copy Pass（文案打磨）**：CTA、加载文案、错误态、术语一致
8. **Deep Check（深度自检）**：按清单验收，并明确回答 `The Final Check`

## Requirement Contract（需求合同 / 输入规范）

生成前把模糊需求落地到下面这份 Contract（字段越完整越好）：

```yaml
topic: "职场协作人格测试"
audience: "22-35 岁职场人"
tone: "professional | funny | funny-professional | premium"
style: "NetEase-media | pixel | skeuomorphic | custom"
palette:
  primary: "#2B4EFF"
  secondary: "#111827"
  accent: "#22C55E"
  background: "#F5F7FA"
interaction:
  answerMode: "auto-next | manual-next"
  allowBackEdit: true
  transition: "fade"
  loadingDurationMs: 2000
contentSource: "agent-generated"
questionCount: 8
resultTypeCount: 4
scoringModel: "dimension-scores | direct-result-id"
techStack: "React + Tailwind CSS | Vue + Tailwind CSS"
output: "PRD + content + implementation"
```

Rules（规则）：
- **最多问 2 个关键澄清问题**（只问缺了就会做不下去的字段）
- 如果用户已进入“执行态”，可**合理补默认值**继续推进（不要卡住）

## Stage Gate：3-Solution Proposal（必须先给 3 套方案）

在写题库前，必须输出**且仅输出** 3 套方案：
- **Option A**: visual style + page elements + palette usage
- **Option B**: visual style + page elements + palette usage
- **Option C**: visual style + page elements + palette usage

Each option must include（每套必须包含）：
- **一句话风格定义 (style statement)**
- **3-5 个具体 UI 元素**（背景/卡片/徽章/进度/按钮/装饰）
- **交互推荐**：`auto-next` 或 `manual-next`
- **一个风险提示**：例如“装饰重可能影响首屏加载”

最后让用户选 A/B/C（或说 “AB 混合”）。

## Hard Constraints（硬约束 / 必须满足）

### 1) Question and Option Quality

Required（必须）：
- **情景化 + 行为化**措辞（scene-based / behavior-based）
- 默认**每题 4 选项**
- 每个选项都要映射到**清晰的维度/类型信号**
- 选项长度与吸引力要接近（避免一眼“正确答案”）

Forbidden（禁止）：
- 是/否、同意/不同意、喜欢/不喜欢
- 纯抽象人格词（如：`我很理性`、`我很外向`）
- 明显更好/更道德的“正确选项”
- `none of the above` 这种凑数选项

如果某题选项弱：**整题重写**（不要只修 1 个字）。

### 1.5) NetEase-Media UI/UX Enhancement (Mandatory When Style Includes “网易传媒感”)

**目标 Goal**：信息密度高但清爽（information-dense but clean），层级强、结果页可直接当海报晒。

Landing / Intro（首页）必须包含：
- **Card-based layout** with rounded corners + soft shadow + **glassmorphism** (backdrop blur).
- **Floating background elements** (bubbles / blocks / abstract blobs) for depth.
- A **live participation counter** (“已有 XXX 人参与”) that updates subtly.

Quiz（答题页）必须包含：
- Top **stepper** (dots or steps) + progress bar.
- Bottom **back link/button** (“← 返回上一题”), and it must be disabled on Q1.
- Button press feedback: scale-down/press (no dead clicks).

Loading（加载页）必须包含：
- Forced 2s “psych analysis” / “calculating” immersion copy.
- A visible animation (spinner / bouncing / scanning), consistent with palette.

### 2) Interaction Closed Loop

- `manual-next`: Next is disabled until one option is selected.
- User can go back and edit previous answers.
- Scores are recomputed from full answer list (**must be realtime after back-edit**).
- Between questions, use configured transition (default fade).
- Final question triggers loading screen for configured duration.

### 3) Result Engine Accuracy

Default engine（默认计分引擎）：
1. Initialize all type scores to 0.
2. Aggregate selected option scores.
3. Pick highest score as primary type.
4. Tie-breaker: recent contribution, else fixed type order.
5. Compute 1-2 complementary matches by metric complementarity.

Must validate（必须验证）：
- every result type is reachable by at least one answer path
- option semantics match score mapping
- no accidental single-question dominance unless intentional

### 4) Result Copy Standard

Must include（结果页文案必须包含）：
- result name + badge line
- **viral label**: 1 unique “爆款标签/称号” + 1 “扎心金句”（safe, non-harmful）
- concise insight description
- 3 strengths
- 1-2 safe roast lines (non-harmful)
- match explanation sentence

### 5) UX Copy Clarity Standard

- CTA is specific (`开始测试`, `下一题`, `生成海报`)
- loading text explains what is happening
- no vague system messages
- no blaming tone in error states
- terms stay consistent across all pages

### 6) User-Provided Cover Poster（用户封面 / 豆包成片 · 移动端整图可见）

当首屏使用**用户提供的文生图封面**（含 Logo、成品标题字、网易/品牌角标、装饰）时：

- **默认使用 `object-contain` + 居中**：`max-h-full max-w-full object-contain`，容器背景用 **`background` 主题色**填 letterbox，**禁止默认用 `object-cover` 做主展示**（会裁掉 Logo 与标题边缘）。
- 仅在 Requirement Contract **明文**允许「封面作氛围底图、可裁切」时，才改用 `cover`。
- 移动端封页克制冗余卡片；CTA 叠在海报底部并保留 **safe-area**（`env(safe-area-inset-*)`）。
- 叠加角标（如 TRENDING）不得遮挡成片关键区域；必要时缩小、移位或移除。

更完整的两步 Spec 字段与布局约定见：`two-step-psych-test/SKILL.md` → Hard Constraints **§5 Mobile Landing & Cover Poster**。

## Technical Rules（技术规则）

- Mobile-first layout, workable at 320px width.
- Use `questions.json` as canonical data source.
- Keep scoring logic separate from display copy.
- Theme via CSS variables/config when palette is provided.
- **Data decoupling**: questions/options/result copy/palette must live in `questions.json` + `config.js` (or equivalent), not hardcoded in components.
- Use `html2canvas` (or equivalent) for poster export.
- Preserve semantic buttons and readable contrast.

### Data Schema（数据结构 / Default）

```json
{
  "id": 1,
  "title": "Question text",
  "options": [
    {
      "text": "Option text",
      "scores": { "typeA": 3, "typeB": 1 }
    }
  ]
}
```

Simple mode allowed（简化模式允许）：

```json
{
  "text": "Option text",
  "resultId": "typeA"
}
```

## Output Contract（输出顺序 / Response Order）

用户要“完整交付”时，必须按以下顺序输出：
1. Product definition (title, hook, audience, tone)
2. Requirement Contract
3. Chosen solution (A/B/C or mixed) and rationale
4. Result type system (name, description, strengths, complement)
5. Question set (`questions.json` ready)
6. UX flow (landing/quiz/loading/result/poster)
7. Implementation details (files, logic, run command)
8. Deep Check + The Final Check

## Deep Check（深度自检清单）

最终输出前必须逐项检查：
- contract complete
- options vivid and non-generic
- each option has valid score or resultId
- each result type reachable
- back/edit works
- manual-next guard works when enabled
- match module exists
- poster action exists
- palette/style reflected from landing to poster
- NetEase-media pages have enough elements (counter/stepper/decorations)
- **user cover on landing: full poster visible (`contain` + theme fill); no unintended `cover` crop on logo/title**
- build/lint executed when tooling is available

## The Final Check（最终必答 / Must Answer）

Always answer:
- **Content**: 题目是否有趣且可直接选择？
- **Accuracy**: 分数与结果映射是否严格一致？
- **Completeness**: 返回修改与流程闭环是否完整？
- **Consistency**: 视觉风格与配色是否贯穿全链路？

## Utility Script（可选但推荐 / Optional）

Use script-based validation for reachability when files exist:

```bash
node scripts/validate-reachability.js ./src/questions.json ./src/results.json
```

If `results.json` is unavailable, pass result IDs manually:

```bash
node scripts/validate-reachability.js ./src/questions.json driver,analyst,connector,operator
```

## Additional Resources（补充资料）

- Templates: [templates.md](templates.md)
- Examples: [examples.md](examples.md)
- Visual style library: [references/visual-styles.md](references/visual-styles.md)
- Question patterns: [references/question-patterns.md](references/question-patterns.md)
- Quality checklist: [references/quality-checklist.md](references/quality-checklist.md)
