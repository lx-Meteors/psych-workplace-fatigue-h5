---
name: 心理测试生成skill
description: 生成刷屏级 H5 心理测试（移动端优先，React/Vue + Tailwind），包含题库/计分/结果匹配/海报导出/质量自检。等同于 viral-h5-psych-test 的稳定版本备份命名。
disable-model-invocation: true
---

# 心理测试生成skill

本 skill 为 `viral-h5-psych-test` 的**稳定版本镜像**，用于“直接一把梭生成并落地”的场景。

> 更新：两步式与落地引擎已合并到 `two-step-psych-test`（合体版单技能）。如果你希望“先出可编辑 Spec → 再落地 + 部署”，建议直接用 `two-step-psych-test`。

## 执行骨架（保持与 viral-h5-psych-test 一致）

1. Intake → Requirement Contract
2. 先给 3 套方案（A/B/C）并让用户选
3. 先定结果人格与匹配规则
4. 再写题库（情景化、可直接选、分值映射明确）
5. 落地：landing → quiz → loading → result → poster
6. Deep Check + Final Check（有趣度/准确度/完整性/一致性）

## 规则与约束

请先阅读 `two-step-psych-test/SKILL.md` 中 **Hard Constraints §5 Mobile Landing & Cover Poster**（用户封面 / 豆包成片须整图可见、`object-contain`、安全区等）。

请直接参考并遵循 `viral-h5-psych-test` 的全部 Hard Constraints 与 Output Contract：
- 题目/选项质量（拒绝空泛）
- 交互闭环（manual-next、回退改选、实时重算）
- 结果引擎可达性
- 结果页海报感（爆款标签 + 金句 + 优点 + 吐槽 + 匹配模块）
- 数据解耦（题库/结果/配色配置抽离）

## 推荐的文件结构（示例）

- `src/questions.json`
- `src/testConfig.js`（palette / types / metrics / interaction）
- `src/App.jsx`（通用渲染 + 引擎）

