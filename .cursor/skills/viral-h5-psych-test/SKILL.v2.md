---
name: viral-h5-psych-test
description: Build mobile-first viral H5 personality tests with executable rules: requirement contract, 3-solution style proposal, data-driven questions, scoring engine, interaction loop, result/match logic, poster generation, and deep quality checks. Use when the user asks for H5心理测试, 人格测试, questions.json, 结果匹配, 海报分享, 网易媒体风, 搞笑风, 专业风, or campaign quiz pages.
disable-model-invocation: true
---

# Viral H5 Psychology Test

Create complete, runnable quiz products optimized for:
- high completion rate
- screenshot/share motivation
- stable scoring (every result reachable)
- vivid copy (clear, specific, non-generic)

## Use This Skill When

- User asks for an H5 test product, quiz page set, or personality test implementation.
- User needs `questions.json` + scoring + result page + match module + poster.
- User wants specific visual style or palette (NetEase media, playful, premium, pixel, etc.).
- User asks the agent to generate question options directly.

## Do Not Use This Skill When

- User only wants one slogan or one short paragraph.
- User asks for clinical diagnosis, medical claims, or treatment advice.

## Execution Workflow (Must Follow)

1. **Intake**: normalize request into a Requirement Contract.
2. **Propose 3 Solutions First**: output 3 style+interaction方案 and ask user to pick one.
3. **Result System First**: define result types and complement rules before questions.
4. **Question Generation**: write scene-based options with score mapping.
5. **UX Structure**: landing -> quiz -> loading -> result -> poster.
6. **Implementation**: data-driven pages + scoring logic + interaction constraints.
7. **Copy Pass**: polish labels, CTA text, loading copy, and error states.
8. **Deep Check**: run quality checks and explicitly answer The Final Check.

## Requirement Contract

Convert vague user intent into this contract before generation:

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

Rules:
- Ask at most 2 focused questions if critical fields are missing.
- If user is in execution mode, infer defaults and continue.

## Stage Gate: 3-Solution Proposal

Before writing questions, provide exactly 3 options:
- **Option A**: visual style + page elements + palette usage
- **Option B**: visual style + page elements + palette usage
- **Option C**: visual style + page elements + palette usage

Each option must include:
- one-line style statement
- 3-5 concrete UI elements (background, card, badge, progress, button, decoration)
- interaction mode recommendation (`auto-next` or `manual-next`)
- one risk note (for example: heavy visual assets may slow first load)

Then ask user to choose A/B/C or request mixing.

## Hard Constraints

### 1) Question and Option Quality

Required:
- scene-based, behavior-based phrasing
- 4 options per question by default
- each option maps to a clear dimension/type signal
- options are similar in length and attractiveness

Forbidden:
- yes/no, agree/disagree, like/dislike
- abstract trait-only labels (`我很理性`, `我很外向`)
- obviously "correct" or "better" option
- filler like "none of the above"

If options are weak, rewrite the full question block.

### 2) Interaction Closed Loop

- `manual-next`: Next is disabled until one option is selected.
- User can go back and edit previous answers.
- Scores are recomputed from full answer list.
- Between questions, use configured transition (default fade).
- Final question triggers loading screen for configured duration.

### 3) Result Engine Accuracy

Default engine:
1. Initialize all type scores to 0.
2. Aggregate selected option scores.
3. Pick highest score as primary type.
4. Tie-breaker: recent contribution, else fixed type order.
5. Compute 1-2 complementary matches by metric complementarity.

Must validate:
- every result type is reachable by at least one answer path
- option semantics match score mapping
- no accidental single-question dominance unless intentional

### 4) Result Copy Standard

Must include:
- result name + badge line
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

## Technical Rules

- Mobile-first layout, workable at 320px width.
- Use `questions.json` as canonical data source.
- Keep scoring logic separate from display copy.
- Theme via CSS variables/config when palette is provided.
- Use `html2canvas` (or equivalent) for poster export.
- Preserve semantic buttons and readable contrast.

### Data Schema (Default)

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

Simple mode allowed:

```json
{
  "text": "Option text",
  "resultId": "typeA"
}
```

## Output Contract (Response Order)

When user asks for full delivery, output in this order:
1. Product definition (title, hook, audience, tone)
2. Requirement Contract
3. Chosen solution (A/B/C or mixed) and rationale
4. Result type system (name, description, strengths, complement)
5. Question set (`questions.json` ready)
6. UX flow (landing/quiz/loading/result/poster)
7. Implementation details (files, logic, run command)
8. Deep Check + The Final Check

## Deep Check

Before final response, verify:
- contract complete
- options vivid and non-generic
- each option has valid score or resultId
- each result type reachable
- back/edit works
- manual-next guard works when enabled
- match module exists
- poster action exists
- palette/style reflected from landing to poster
- build/lint executed when tooling is available

## The Final Check (Must Answer)

Always answer:
- **Content**: 题目是否有趣且可直接选择？
- **Accuracy**: 分数与结果映射是否严格一致？
- **Completeness**: 返回修改与流程闭环是否完整？
- **Consistency**: 视觉风格与配色是否贯穿全链路？

## Utility Script (Optional but Recommended)

Use script-based validation for reachability when files exist:

```bash
node scripts/validate-reachability.js ./src/questions.json ./src/results.json
```

If `results.json` is unavailable, pass result IDs manually:

```bash
node scripts/validate-reachability.js ./src/questions.json driver,analyst,connector,operator
```

## Additional Resources

- Templates: [templates.md](templates.md)
- Examples: [examples.md](examples.md)
- Visual style library: [references/visual-styles.md](references/visual-styles.md)
- Question patterns: [references/question-patterns.md](references/question-patterns.md)
- Quality checklist: [references/quality-checklist.md](references/quality-checklist.md)
