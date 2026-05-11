export const THEME = {
  primary: '#6366F1',
  secondary: '#0F172A',
  accent: '#F59E0B',
  background: '#F1F5F9',
}

export const INTERACTION_CONFIG = {
  answerMode: 'manual-next',
  allowBackEdit: true,
  transition: 'fade',
  loadingDurationMs: 2000,
}

export const METRIC_KEYS = [
  { key: 'strain', label: '紧绷度', weight: 1.1 },
  { key: 'drain', label: '耗竭感', weight: 1.2 },
  { key: 'hope', label: '期待感', weight: 1.0 },
  { key: 'boundary', label: '边界感', weight: 1.1 },
  { key: 'recovery', label: '回血力', weight: 1.2 },
]

export const COFFEE_ICONS = {
  grind: '🔋',
  recover: '☕',
  drift: '🌫️',
  mask: '🙂',
}

export const TYPES = {
  grind: {
    name: '硬扛型·续航战士',
    headline: '你把疲惫当成默认皮肤',
    badge: '先用意志力顶住的人',
    quote: '“我不是不累，我只是先把事做完。”',
    emoji: '🔋',
    color: 'from-[#6366F1] to-[#4F46E5]',
    metrics: { strain: 5, drain: 4, hope: 2, boundary: 3, recovery: 2 },
    roasts: ['轻槽点：你不是不累，你只是把「歇一会儿」无限延期。'],
    description:
      '你对靠谱的定义是「我能扛」：deadline、突发、连环消息，你都习惯先顶上再喘息。别人看到的是稳定输出，你自己知道是靠意志力和惯性在续航。你不是逞强，而是在不确定里抓住可控的那一点点。',
    strengths: ['承压续航强', '交付意识在线', '关键时刻顶得住'],
  },
  recover: {
    name: '回血型·充电体质',
    headline: '你知道疲惫要靠节奏赎回',
    badge: '会给自己留回血缝的人',
    quote: '“不是逃避，是把电量补回来再打。”',
    emoji: '☕',
    color: 'from-[#F59E0B] to-[#6366F1]',
    metrics: { strain: 2, drain: 2, hope: 4, boundary: 4, recovery: 5 },
    roasts: ['轻槽点：你对工作的底线是——可以不赢，但不能把自己榨干。'],
    description:
      '你不会把「撑」当成唯一答案：散步、热水、睡眠、和朋友吃一顿，都是你认真对待的修复模块。你知道疲惫不是软弱，而是信号；你愿意用边界换可持续，而不是用一口气换短期满分。',
    strengths: ['自我调节快', '边界表达清晰', '续航策略成熟'],
  },
  drift: {
    name: '空心型·情绪漂移',
    headline: '你在人群里在线，心里像在静音',
    badge: '疲惫先从感受断电的人',
    quote: '“我还在岗位，只是灵魂暂时下班了。”',
    emoji: '🌫️',
    color: 'from-[#64748B] to-[#334155]',
    metrics: { strain: 3, drain: 5, hope: 2, boundary: 2, recovery: 2 },
    roasts: ['轻槽点：你不是懒，你是电量显示不准——明明空了还在撑界面。'],
    description:
      '你能完成任务，却越来越难被成就感点亮：情绪像雾一样飘着，注意力也容易偷偷溜走。外人看不出大问题，你自己知道那种「提不起劲」的空。重要的不是硬撑笑容，而是先把消耗源辨认出来。',
    strengths: ['表面稳定', '共情残留强', '对自己诚实的一面正在抬头'],
  },
  mask: {
    name: '营业型·表情管理大师',
    headline: '你把体面当成职场护甲',
    badge: '气氛对了再谈消耗的人',
    quote: '“我可以碎，但那条消息必须先回得像没事。”',
    emoji: '🙂',
    color: 'from-[#0F172A] to-[#6366F1]',
    metrics: { strain: 4, drain: 3, hope: 3, boundary: 4, recovery: 3 },
    roasts: ['轻槽点：你把情绪藏得太好，有时自己都刷卡进门才发现累了。'],
    description:
      '你很擅长「让对方安心」：群里氛围、会议语气、协作体面，你都照顾得到。你不是虚伪，而是在高压协作里用可控来表达可靠。代价是疲惫常被延后处理——直到某天集中袭来。',
    strengths: ['沟通体面', '场面稳定', '协作安全感强'],
  },
}
