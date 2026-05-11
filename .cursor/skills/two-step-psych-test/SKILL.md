---
name: 心理测试生成器（两步式合体版）
description: 两步式合体版（原 two-step-psych-test）。
背景：心理测试产品经常需要反复改题库/人格/配色/文案，直接改代码成本高且易漏改。
目标：把“内容策划”和“工程落地”拆成可编辑 Spec → 可复用引擎落地，确保可修改、可复刻、可部署。
作用：Step1 仅生成一份可复制粘贴编辑的 YAML Spec（主题/配色/视觉/结果人格/题库/交互/文案/交付计划）；Step2 解析/校验/补全 Spec，生成 `questions.json` + `testConfig.js` + `App.jsx` + `index.css`（React+Tailwind，mobile-first），实现 manual-next、回退改选实时重算、2s loading、结果匹配模块、html2canvas 海报导出，并执行 Deep Check/Final Check。
交付：可运行命令 + 独立 Netlify 站点部署链接（每个测试一个站点，互不覆盖）。
disable-model-invocation: true
---

# Two-step Psych Test（两步式生成）

目标：让用户能**方便地改题目/人格/配色/文案**。因此强制“两步走”：

> ✅ 合体说明：本 skill **已内置**落地引擎的 Hard Constraints/Output Contract/Deep Check。
> 也就是说：完成一个心理测试产品**只需要调用本 skill**（不需要再调用 `心理测试生成skill`）。

## Step 1：生成方案文档（Spec Doc）

当用户说“生成一个心理测试/想要某主题”，你必须只输出一份**可复制可编辑**的方案文档（不要写代码、不要落地文件）。

### 输出格式（必须一字不差包含这些 section 标题）

```yaml
specVersion: 1
meta:
  title: "六一童年人格测试"
  campaignName: "示例：六一回忆放映季"
  audience: "18-35"
  tone: "网易传媒感 | 甜但不幼稚 | 轻吐槽"
  techStack: "React + Tailwind"

style:
  visualStyle: "NetEase-media candy magazine"
  # 可选：封面展示策略（用户提供豆包成片时默认 contain）
  coverDisplayMode: "contain"   # contain | cover
  coverMaxViewport: "95svh"     # 92–96svh 之间微调，避免留白/压迫
  palette:
    primary: "#FF5CA8"
    secondary: "#1E1B4B"
    accent: "#22C55E"
    background: "#FFF7FB"
  uiElements:
    - "Card + glassmorphism"
    - "Floating stickers / blobs"
    - "Stepper + progress bar"
    - "Poster-like result layout"
  motion:
    transition: "fade"
    buttonFeedback: "press/scale-down"

interaction:
  answerMode: "manual-next"
  allowBackEdit: true
  loadingDurationMs: 2000

engine:
  scoringModel: "type-sum"
  resultTypeCount: 4
  tieBreaker: "stable-order"
  matchCount: 2
  reachabilityCheck: "required"

resultTypes:
  - id: "candy"
    name: "糖果治愈派"
    emoji: "🍬"
    # 结果页右侧置信度卡用的渐变（与整体 palette 协调）
    color: "from-[#FF5CA8] to-[#F9A8D4]"
    headline: "你是班级的快乐补给站"
    badge: "一句话徽章"
    quote: "扎心金句（安全）"
    strengths: ["优点1","优点2","优点3"]
    roasts: ["轻吐槽一句（安全）","轻吐槽一句（可选）"]
    metrics: { play: 4, bravery: 2, kindness: 5, focus: 3, social: 4 }
    description: "100-180 字画像"
  # ... 共 4 个类型

metrics:
  - key: "play"
    label: "玩心值"
    weight: 1.2
  - key: "bravery"
    label: "勇气值"
    weight: 1.2
  - key: "kindness"
    label: "温柔值"
    weight: 1.1
  - key: "focus"
    label: "专注值"
    weight: 1.1
  - key: "social"
    label: "社交值"
    weight: 1.0

questions:
  - id: 1
    title: "微型情景剧题干（必须具体场景）"
    options:
      - text: "可直接选的行为描述"
        # scores 的 key 必须是 resultTypes 里存在的 id
        scores: { candy: 3, mint: 1 }
      - text: "..."
        scores: { mint: 3, candy: 1 }
      - text: "..."
        scores: { soda: 3, mint: 1 }
      - text: "..."
        scores: { cocoa: 3, candy: 1 }
  # ... 共 8 题（默认）

uxCopy:
  landing:
    brandPill: "Children’s Day Memory Lab"
    subtitle: "8 道童年情境题，测出你是哪种回忆底色"
    liveCounterLabel: "已有 XXX 人参与"
    hint: "选你最像的反应，不要想正确答案"
    cta: "开始测试"
  loading:
    title: "正在生成你的童年画像..."
    desc: "沉浸式解释一行"
  result:
    matchTitle: "匹配度（童年搭子/克星）"
    posterFooter: "Children’s Day Memory Test | Poster Ready"

deliverable:
  filePlan:
    - "src/questions.json"
    - "src/testConfig.js"
    - "src/App.jsx"
    - "src/index.css"
  deploy:
    provider: "netlify"
    siteNameRule: "use campaignName slug"

cover:
  # 封面生成提示词（给用户复制到豆包/任意文生图工具用）
  # 必须与 meta.title / style.visualStyle / style.palette 强相关，且包含“要写的字”（标题/副标题）
  # 输出 2 份：一个“精简版”一个“加强版”（更细的构图/安全边距/字体层级/元素），必须是中文
  promptLite: "（在这里输出）"
  promptPro: "（在这里输出）"
```

### Step 1 硬约束

- 题目必须“微型情景剧”，禁止抽象人格形容词/是非题。
- 每题 4 选项；每个选项必须有 `scores`，并体现差异信号。
- 结果类型必须包含：爆款标签（headline）+ 徽章（badge）+ 金句（quote）+ 3 优点 + 1-2 条轻吐槽（`roasts[]`）+ 画像；并提供可用于结果卡的 `color` 渐变。
- 配色、交互、加载时长必须显式写在文档里。
- 文档必须可被用户直接编辑（保持 YAML 结构）。
- 必须输出 `cover.promptLite` 与 `cover.promptPro`，并明确“封面上要写的字”（标题/副标题/角标）。

在 Step 1 结束时：提示用户“**直接改这份文档**（题干/选项/配色/结果文案均可），然后把修改后的文档发回来进入 Step 2”。
同时提示：用户把 `cover.prompt*` 复制到豆包生成封面图后，把生成的 PNG/JPG 发回来一起进入 Step 2。

## Step 2：根据方案文档落地生成 H5（Implementation）

当用户把修改后的 Spec Doc 发回来，你必须：

1. **Validate**：校验 YAML 结构完整性，缺字段则用合理默认补齐；如果 id 不一致（typeId/score key），必须修正并在输出里说明修正点。
   - 如果用户还附带了封面图（PNG/JPG），记录为 `coverImageInput`（来自用户上传文件）。
2. **Map Spec → Files（只做数据映射，不造新引擎）**：
   - `src/questions.json` ← `questions`
   - `src/testConfig.js` ← `style.palette` + `interaction` + `metrics` + `resultTypes`（产出 `THEME/INTERACTION_CONFIG/METRIC_KEYS/TYPES`）
   - `src/index.css` ← `style.palette`（用 CSS 变量注入主题色；并按 `style.visualStyle/uiElements` 生成背景层与卡片质感）
   - `src/assets/cover.(png|jpg)` ← 用户上传封面图（如果提供）
   - `src/App.jsx` 首页需展示封面：优先渲染 `cover` 资产（若缺失则回退到图标/插画占位）；移动端**整图可见**规则见下方 Hard Constraints「Mobile Landing & Cover Poster」
3. **Implementation（落地实现 / 内置引擎规则）**
   - Step 2 的实现必须遵循下方 “Hard Constraints（硬约束）” 与 “Output Contract（输出顺序）”
   - 不允许临时发明新的交互/计分/结果页结构，除非 Spec Doc 明确要求且不违反硬约束
4. **Reachability（可达性）**：确保所有结果类型可达（必要时调整少量 score，但必须符合选项语义；禁止“为了可达性硬拧分数”）。
5. **Final QA Pass（最终自检）**：按 “Deep Check + The Final Check” 输出逐条回答。
6. **Deploy（独立站点，避免覆盖）**：
   - 使用 Netlify CLI 创建新 site（siteName 使用 `campaignName` 的 slug；若冲突加短随机后缀）
   - `npm run build`
   - `netlify deploy --prod --dir dist --site <siteId>`
   - 返回 Prod URL + Unique deploy URL
   - **账号归属（必须写入说明，避免误解）**：
     - Skill **不包含**任何 Netlify 账号；**谁在执行部署，就要用谁（或其团队）的 Netlify 身份**。
     - 常见方式：执行者本机 `netlify login` 完成浏览器授权；或使用该账号在 **User settings → Applications → Personal access tokens** 生成的 PAT，通过 `netlify deploy --auth "<PAT>"`（PAT 切勿提交到仓库或贴到聊天）。
     - **站点、额度（credits/build）、账单**均归属该登录账号所在的 **Team**；遇到 `Forbidden` / credit limit，需在对应账号的 Billing/Usage 中处理，或由执行者换一个可用账号/改用其他托管（如自行拖拽 `dist` 上传、或 Vercel 等）。
     - CI/CD 场景同理：流水线里配置的仍是**项目方的** `NETLIFY_AUTH_TOKEN` / site id，与本 skill 无绑定。

---

## Hard Constraints（硬约束 / Step 2 必须满足）

### 1) Question & Option Quality（题目/选项质量）
- 必须“微型情景剧”：具体场景 + 可执行行为（scene-based + behavior-based）
- 默认每题 4 选项；选项长度/吸引力接近
- 禁止：是/否、同意/不同意、抽象人格词（如“我很理性”）、明显更正确的选项
- 每个选项必须有 `scores` 映射到结果 id（或明确写 `resultId` 简化模式）

### 2) Interaction Closed Loop（交互闭环）
- `manual-next`：未选不能下一题（Next disabled → selected 才可点）
- `allowBackEdit`：可回退；修改后必须**实时重算**（scores 从 answers 全量重算）
- 题间过渡：按 `transition`（默认 fade）
- 最后一题进入 loading，并强制等待 `loadingDurationMs`（默认 2000ms）

### 3) Result Copy Standard（结果页海报感）
结果类型必须包含：
- `headline`（爆款标签/称号）+ `badge`（徽章句）+ `quote`（金句，安全不冒犯）
- `strengths`（3条优点）+ `roasts`（1-2条轻吐槽）
- `description`（100-180字画像，具体可分享）
结果页必须包含：
- 匹配模块（match）：至少 2 个（灵魂伴侣/克星）并有 reason 文案
- 海报导出：`html2canvas`，只截结果卡（非全屏乱截）
- 首页封面：如果用户提供封面图，必须接入为首屏视觉（并确保海报导出不受影响）；**成片海报须 `object-contain` + 主题底色填边**，避免裁切 Logo/标题（见 Hard Constraints §5）

### 4) Data Decoupling（数据解耦）
- `questions.json` 作为题库唯一真源
- `testConfig.js`（或同等 config）存放：palette / interaction / metrics / resultTypes
- 组件里不得硬编码结果文案与配色（除非作为 fallback）

### 5) Mobile Landing & Cover Poster（移动端封页 / 豆包封面「整图可见」）

用户提供的封面多为**带 Logo、标题字、贴纸、品牌角标**的成片海报。落地时必须**优先保证整张海报入框可见**，避免出现「Logo 只剩一半、标题被裁切」。

#### 强制规则（Step 2 实现 `App.jsx` 首屏时必须遵守）

1. **展示策略：默认 `object-contain`，禁止默认 `object-cover`**
   - 外层容器：`flex items-center justify-center`、`overflow-hidden`、`rounded-*`，背景填 **`THEME.background`（如 `bg-[var(--bg)]`）**，用于 `contain` 时上下或两侧的留白（letterbox），视觉上要干净、跟主题一致。
   - `<img>`：`max-h-full max-w-full object-contain object-center`。**不要用 `h-full w-full object-cover`** 作为主展示逻辑（会把成片海报当「氛围图」裁切）。
   - 仅在 Spec **明文约定**「封面可作全屏氛围底图、允许裁切非关键信息」时，才可采用 `cover`。

2. **信息量：封页克制**
   - 移动端首屏默认**不要堆**「你会得到」「适合」「长说明卡片」等（除非用户在 Spec 中明确要求）。
   - **CTA**：「开始测试」叠在海报**底部安全区**（半透明磨砂条/圆角容器），避免再增加一层独立大按钮区挤压海报。

3. **高度与留白（可配置，须在实现里一次性调顺）**
   - 卡片整体高度可与视口挂钩，例如 **`min-h-[min(95svh, calc(100dvh - 与 safe-area 相关项))]`**（数值可按反馈在 **92–96svh** 间微调）；目标是**底部不过度空**，又**不把 UI 压得压迫**。
   - `intro` 阶段外层 `section`：`flex flex-col`、`min-h-[100dvh]`、底部 `pb-0`；`Intro` 根容器 **`flex-1 min-h-0`**，必要时配合 **`grid-rows-[minmax(0,1fr)]`**，让海报区域吃下去剩余高度，避免出现大块纯色「假留白」。
   - 必须使用 **`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`**（配合 `max(...)`）适配刘海与 Home 条。

4. **叠加贴片（如 TRENDING / 活动角标）**
   - 若贴片遮挡海报自带的 Logo/标题，必须**缩小、改位置或移除**（以成片海报可读性为准）。

5. **桌面预览**
   - 右侧/模块内「封面预览」小图同样建议 **`object-contain`**，与移动端逻辑一致，避免桌面端裁切与手机不一致。

#### Step 1 Spec 可选字段（建议在 `style` 或 `uxCopy.landing` 中补充）

```yaml
style:
  coverDisplayMode: "contain"   # contain | cover（默认 contain）
  coverMaxViewport: "95svh"     # 可与实现约定，便于复刻
```

---

## Output Contract（输出顺序 / Response Order）
当用户要“完整交付”时，输出顺序必须是：
1) Product definition（标题/一句话 hook/人群/语气）
2) Spec Doc（最终版 YAML，按用户修改后的）
3) Result types（核对 id/文案/匹配规则）
4) `questions.json`
5) UX flow（landing/quiz/loading/result/poster）
6) Implementation details（哪些文件改了 + 运行命令）
7) Deep Check
8) The Final Check（4 句回答）

## Deep Check（自检清单）
- Contract/Spec 完整：yes/no
- 题目与选项不空泛：yes/no
- 每个选项都有映射：yes/no
- 每个结果都可达：yes/no
- back/edit 每题都可用：yes/no
- manual-next guard 正常：yes/no
- loading 时长正确：yes/no
- 匹配模块存在且有 reason：yes/no
- 海报导出可用：yes/no
- **移动端封面：整张云海报可见（`object-contain` + 主题底填边），Logo/标题未被 `cover` 裁切：yes/no**
- **封页叠加角标未挡海报关键信息：yes/no**
- **安全区（刘海/Home 条）-padding 合理：yes/no**
- 视觉/配色贯穿：yes/no
- build/lint 已跑：yes/no/not-available

## The Final Check（最终必答）
- Content：题目是否有趣且可直接选择？
- Accuracy：分数与结果映射是否严格一致？
- Completeness：返回修改与流程闭环是否完整？
- Consistency：视觉风格与配色是否贯穿全链路？

