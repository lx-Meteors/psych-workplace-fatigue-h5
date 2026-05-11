# Templates（模板库 / 可直接复制）

## 1) Requirement Contract（需求合同 / 输入规范）

```yaml
topic: "[测试主题 / test topic]"
audience: "[目标人群 / target audience]"
tone: "[funny | professional | funny-professional | premium]"
style: "[NetEase-media | pixel | skeuomorphic | custom]"
palette:
  primary: "#000000"
  secondary: "#000000"
  accent: "#000000"
  background: "#FFFFFF"
interaction:
  answerMode: "auto-next | manual-next"
  allowBackEdit: true
  transition: "fade"
  loadingDurationMs: 2000
contentSource: "agent-generated"
questionCount: 8
resultTypeCount: 4
scoringModel: "dimension-scores"
techStack: "React + Tailwind CSS"
output: "PRD + content + implementation + Deep Check"
```

## 2) Result Type Template（结果人格模板 / Result Type）

```js
const resultType = {
  id: 'type-id',
  name: '人格名称 / name',
  emoji: '🧩',
  headline: '爆款标签 / viral label（一句称号）',
  badge: '徽章句 / badge line（一句记忆点）',
  quote: '金句 / quote（安全不冒犯）',
  description: '画像 / description（100-180字，具体、可分享）',
  strengths: ['优点1', '优点2', '优点3'],
  roasts: ['轻吐槽1（无害）', '轻吐槽2（无害）'],
  metrics: {
    metricA: 4, // 1-5
    metricB: 3,
    metricC: 5,
  },
}
```

## 3) Question Block Template（题目块模板 / Question Block）

```json
{
  "id": 1,
  "title": "微型情景剧题干（必须具体场景 / scene-based）",
  "options": [
    { "text": "可直接选的行为描述 A", "scores": { "typeA": 3, "typeB": 1 } },
    { "text": "可直接选的行为描述 B", "scores": { "typeB": 3, "typeC": 1 } },
    { "text": "可直接选的行为描述 C", "scores": { "typeC": 3, "typeD": 1 } },
    { "text": "可直接选的行为描述 D", "scores": { "typeD": 3, "typeA": 1 } }
  ]
}
```

## 4) PRD Template（产品需求文档 / PRD）

```markdown
# PRD: [Test Name]

## Product Overview
[1 short paragraph]

## Goals
- [Goal 1]
- [Goal 2]
- [Goal 3]

## Target Users
[Audience + usage context]

## User Flow
1. Landing
2. Quiz
3. Loading
4. Result
5. Poster/share

## Interaction Rules
- [answerMode]
- [allowBackEdit]
- [transition]
- [loadingDuration]

## Scoring Logic
[How scores map to result]

## Technical Plan
- Stack
- Data model
- Data decoupling（题库/结果/配色配置抽离）
- Key files
- Run/build commands
```

## 5) UX Copy Audit（文案审计 / Copy Audit）

```markdown
## Copy Audit

- CTA is specific and action-based: [yes/no]
- Loading text explains process/time: [yes/no]
- Error text avoids blame and gives fix path: [yes/no]
- Terminology consistent across pages: [yes/no]
- Tone matches audience and scenario: [yes/no]
```

## 6) Deep Check（深度自检 / 必须逐项回答）

```markdown
## Deep Check

- Requirement contract complete: [yes/no]
- Options are scene-based and non-generic: [yes/no]
- Every option has score mapping/resultId: [yes/no]
- Every result type reachable: [yes/no]
- Back/edit answer works: [yes/no]
- Manual-next guard works: [yes/no/not-applicable]
- Match module exists with reason: [yes/no]
- Poster generation exists: [yes/no]
- Visual style + palette consistent end-to-end: [yes/no]
- Result copy has viral label + quote + strengths + roast: [yes/no]
- NetEase-media UI elements exist when required (counter/stepper/decorations): [yes/no/not-applicable]
- Build/lint checked: [yes/no/not-available]
```

## 7) The Final Check（最终必答 / 4 句回答）

```markdown
## The Final Check

- Content: 题目是否有趣且可直接选择？
- Accuracy: 分数与结果映射是否严格一致？
- Completeness: 返回修改与流程闭环是否完整？
- Consistency: 视觉风格与配色是否贯穿全链路？
```
