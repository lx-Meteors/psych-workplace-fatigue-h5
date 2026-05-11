# Examples（示例库 / How-to）

## Example 1: User Request（用户原始需求）

```text
请做一个专业媒体风 H5 心理测试：
- 主题：职场协作人格
- 题量：8题
- 技术栈：React + Tailwind
- questions.json 数据驱动
- 支持返回修改
- manual-next 未选不可下一题
- 最后结果页有匹配度和生成海报
- 配色：primary #2B4EFF, secondary #111827, accent #22C55E, bg #F5F7FA
```

## Example 2: Contracted Input（收敛后的 Contract）

```yaml
topic: "职场协作人格"
audience: "22-35 岁职场人"
tone: "professional"
style: "NetEase-media"
palette:
  primary: "#2B4EFF"
  secondary: "#111827"
  accent: "#22C55E"
  background: "#F5F7FA"
interaction:
  answerMode: "manual-next"
  allowBackEdit: true
  transition: "fade"
  loadingDurationMs: 2000
contentSource: "agent-generated"
questionCount: 8
resultTypeCount: 4
scoringModel: "dimension-scores"
techStack: "React + Tailwind CSS"
output: "PRD + content + implementation"
```

## Example 3: 3-Solution Proposal（A/B/C 方案示例）

```text
Option A（网易传媒感 / NetEase-media）：
- 一句话：强层级标题 + 模块化信息卡 + 低饱和渐变背景，像资讯专题页
- UI 元素：毛玻璃卡片、徽章 chips、stepper+进度条、数据条形图、角标贴纸
- 交互：manual-next（允许回退改选）
- 风险：信息密度高，需控制首屏字量

Option B（高级极简 / Premium minimal）：
- 一句话：留白更大、阴影更轻、内容更克制，适合“洞察型”主题
- UI 元素：细分割线、浅阴影卡片、mono 指标、软胶囊按钮
- 交互：manual-next
- 风险：过于克制可能降低“分享冲动”

Option C（搞笑贴纸 / Playful meme）：
- 一句话：贴纸+梗标题+轻吐槽，结果页更像朋友圈热梗卡
- UI 元素：夸张徽章、彩色贴纸、动效更明显、按钮反馈更强
- 交互：auto-next
- 风险：风格偏强，需注意不冒犯
```

## Example 4: Good Option Writing（高质量选项写法）

```json
{
  "id": 1,
  "title": "需求评审会上，大家对目标理解不一致，你通常怎么做？",
  "options": [
    { "text": "把目标压成一句话并写进群公告，确认范围/标准/截止时间", "scores": { "driver": 3, "analyst": 1 } },
    { "text": "先追问依赖与风险，再决定谁拍板，避免对齐错方向", "scores": { "analyst": 3, "operator": 1 } },
    { "text": "先翻译各方诉求，把冲突拆成可讨论问题，拉回同一语境", "scores": { "connector": 3, "analyst": 1 } },
    { "text": "先列执行步骤和验收标准，保证会后能直接进入落地", "scores": { "operator": 3, "driver": 1 } }
  ]
}
```

## Example 5: Result Copy Snippet（结果页“海报感”片段）

```text
爆款标签（headline）：#把混乱变清晰的人
徽章句（badge）：先对齐目标，再对齐动作
扎心金句（quote）："你不是没情绪，你是先把事做完。"
优点（strengths）：目标感清晰 / 推进干脆 / 抗压稳定
轻吐槽（roast）：你说“我只问一个问题”，通常会问到第十个
匹配说明（match reason）：在「节奏感」上互补明显：一个更快，一个更稳，协作阻力更小。
```

## Example 6: Bad vs Good Microcopy（文案好坏对比）

```text
Bad CTA: 提交
Good CTA: 下一题

Bad Loading: 加载中...
Good Loading: 正在生成你的协作画像（约 2 秒）

Bad Error: 输入错误
Good Error: 请选择一个选项后再进入下一题
```

## Example 7: Final Delivery Skeleton（最终交付结构）

```markdown
1) Product definition
2) Requirement Contract
3) Result types
4) questions.json
5) UX flow
6) Implementation details + run command
7) Deep Check
8) The Final Check (4 answers)
```

## Example 8: Final Check Answer（最终必答示例）

```markdown
## The Final Check

- Content: 是。题目均为具体协作场景，可直接代入选择。
- Accuracy: 是。每个选项分值与人格维度映射一致，按最高分出结果。
- Completeness: 是。支持返回修改，manual-next 未选时 Next 禁用。
- Consistency: 是。配色与视觉层级从首页、答题页到海报页保持一致。
```
