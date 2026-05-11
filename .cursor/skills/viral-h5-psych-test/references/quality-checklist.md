# Quality Checklist（质量清单 / Deep Check）

最终交付前必须跑一遍（建议逐条回答 yes/no）。

## Content（内容/文案）
- [ ] Questions are scene-based and easy to answer quickly
- [ ] Options are specific, balanced, and non-generic
- [ ] Result copy is distinctive, positive, and shareable（可截图可转发）
- [ ] Result has viral label + quote（爆款标签 + 金句，安全不冒犯）
- [ ] Match explanation is meaningful (not random)

## Scoring（计分/可达性）
- [ ] Every option has valid score or resultId mapping
- [ ] Every result type is reachable
- [ ] Tie-break rule is deterministic
- [ ] No accidental dominant question unless intentional

## UX（交互闭环）
- [ ] manual-next blocks next step until selection
- [ ] back/edit works for every question
- [ ] loading page duration follows configuration（强制 2s 等）
- [ ] result page includes poster generation action
- [ ] poster export captures the result card cleanly（非全屏乱截）

## Visual（视觉一致性）
- [ ] Chosen style is reflected on all pages
- [ ] Palette is applied consistently from landing to poster
- [ ] Mobile-first layout remains readable at 320px
- [ ] CTA contrast is clear and clickable
- [ ] NetEase-media enhancement present when required（counter/stepper/decorations）
- [ ] **User/Doubao cover poster: `object-contain` + theme background fills letterbox；成片 Logo/标题不被 `object-cover` 裁切**
- [ ] **Landing overlays (badges) do not obscure the poster’s built-in logo or headline**

## Engineering（工程/可维护）
- [ ] `questions.json` is canonical source
- [ ] Data decoupling: result copy/palette not hardcoded in components
- [ ] build/lint commands executed when available
- [ ] no broken asset references
- [ ] terminology is consistent across UI copy
