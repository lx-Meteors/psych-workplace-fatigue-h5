#!/usr/bin/env python3
"""
H5 心理测试内容生成脚本
根据用户输入生成完整的测试内容（题目、选项、结果）
"""

import json
import sys
import re
from typing import List, Dict, Any

def parse_requirement(requirement: str) -> Dict[str, Any]:
    """
    解析用户需求，提取关键信息
    """
    # 提取主题
    themes = []
    theme_keywords = ['测试', '测测', '看看', '什么类型', '哪种', '你是']
    
    # 尝试提取具体的测试对象
    patterns = [
        r'什么类型?的(.*?)[？?]',
        r'哪种(.*?)[？?]',
        r'你是(什么|哪种)(.*?)[？?]',
        r'(.*?)(性格|类型|风格|气质)(测试|分析)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, requirement)
        if match:
            theme = match.group(1) if match.lastindex == 1 else match.group(2)
            themes.append(theme.strip())
    
    # 如果没有匹配到，使用整个需求作为主题
    if not themes:
        themes = [requirement.replace('我想', '').replace('做一个', '').replace('测试', '').strip()]
    
    # 提取题目数量偏好
    question_count = 8  # 默认8题
    count_patterns = [
        r'(\d+)[道个题]',
        r'(\d+)题',
    ]
    for pattern in count_patterns:
        match = re.search(pattern, requirement)
        if match:
            question_count = int(match.group(1))
            question_count = max(5, min(12, question_count))  # 限制在5-12题
            break
    
    # 提取风格偏好
    style_hints = []
    style_keywords = {
        '可爱': 'cute',
        '萌': 'cute',
        '简约': 'minimal',
        '极简': 'minimal',
        '复古': 'retro',
        '像素': 'pixel',
        '梦幻': 'dreamy',
        '星空': 'dreamy',
        '国潮': 'chinese',
        '古风': 'chinese',
        '科技': 'tech',
        '未来': 'tech',
        '自然': 'nature',
        '清新': 'nature',
        '甜蜜': 'sweet',
        '马卡龙': 'sweet',
        '活力': 'sporty',
        '运动': 'sporty',
    }
    
    for keyword, style in style_keywords.items():
        if keyword in requirement:
            style_hints.append(style)
    
    return {
        'theme': themes[0] if themes else '性格',
        'question_count': question_count,
        'style_hints': list(set(style_hints)) if style_hints else ['cute'],
        'raw_requirement': requirement
    }

def generate_questions(theme: str, count: int) -> List[Dict]:
    """
    生成题目模板（实际使用时由 AI 填充具体内容）
    这里提供题目结构模板
    """
    question_templates = [
        {
            "type": "scenario",
            "pattern": "当{场景}时，你会{行为}？",
            "examples": ["周末早上醒来", "朋友突然约你", "遇到难题时"]
        },
        {
            "type": "choice",
            "pattern": "如果{条件}，你会选择{选项}？",
            "examples": ["可以拥有一种超能力", "必须放弃一种感官", "可以穿越到任意时代"]
        },
        {
            "type": "preference",
            "pattern": "以下{事物}，你最喜欢{哪种}？",
            "examples": ["四种天气", "三种颜色", "五种食物"]
        },
        {
            "type": "behavior",
            "pattern": "在{场合}，你通常是{角色}？",
            "examples": ["聚会上", "团队合作中", "面对冲突时"]
        },
        {
            "type": "metaphor",
            "pattern": "如果你是一{量词}{事物}，你会是{哪种}？",
            "examples": ["种动物", "种天气", "种颜色", "首歌"]
        }
    ]
    
    questions = []
    for i in range(count):
        template = question_templates[i % len(question_templates)]
        questions.append({
            "id": i + 1,
            "type": template["type"],
            "template": template["pattern"],
            "text": "",  # 待填充
            "options": []  # 待填充
        })
    
    return questions

def generate_result_types(theme: str, count: int = 6) -> List[Dict]:
    """
    生成结果类型模板
    """
    return [
        {
            "id": f"result_{i}",
            "name": "",  # 待填充
            "description": "",  # 待填充
            "traits": [],  # 待填充
            "analysis": "",  # 待填充
            "bestMatch": "",  # 待填充
            "complement": "",  # 待填充
            "image": f"assets/images/result_{i}.png"
        }
        for i in range(count)
    ]

def suggest_visual_style(theme: str, hints: List[str]) -> Dict[str, Any]:
    """
    根据主题推荐视觉风格
    """
    style_mapping = {
        'cute': {
            'name': '可爱插画风',
            'colors': {
                'primary': '#FF9A76',
                'secondary': '#FFF5F0',
                'accent': '#FF6B6B',
                'text': '#4A4A4A'
            },
            'fonts': '圆润、手写体',
            'elements': '卡通形象、圆角、柔和阴影'
        },
        'minimal': {
            'name': '极简现代风',
            'colors': {
                'primary': '#2C3E50',
                'secondary': '#ECF0F1',
                'accent': '#E74C3C',
                'text': '#34495E'
            },
            'fonts': '无衬线字体',
            'elements': '大量留白、几何图形、卡片式布局'
        },
        'retro': {
            'name': '复古像素风',
            'colors': {
                'primary': '#FF6B9D',
                'secondary': '#2D1B4E',
                'accent': '#00F5FF',
                'text': '#FFFFFF'
            },
            'fonts': '像素字体',
            'elements': '8-bit图形、复古配色、游戏UI'
        },
        'dreamy': {
            'name': '梦幻渐变风',
            'colors': {
                'primary': '#6B5B95',
                'secondary': '#1A1A2E',
                'accent': '#88D8B0',
                'text': '#E8E8E8'
            },
            'fonts': '优雅衬线体',
            'elements': '流体渐变、玻璃拟态、发光效果'
        },
        'chinese': {
            'name': '国潮风',
            'colors': {
                'primary': '#C41E3A',
                'secondary': '#F5F5DC',
                'accent': '#D4AF37',
                'text': '#2F2F2F'
            },
            'fonts': '书法字体',
            'elements': '中式纹样、水墨质感、印章元素'
        },
        'tech': {
            'name': '科技感风',
            'colors': {
                'primary': '#00F5FF',
                'secondary': '#0A0A0A',
                'accent': '#FF00FF',
                'text': '#E8E8E8'
            },
            'fonts': '等宽字体',
            'elements': '深色背景、霓虹色、网格线条'
        },
        'nature': {
            'name': '自然治愈风',
            'colors': {
                'primary': '#7EB8A2',
                'secondary': '#F5F9F7',
                'accent': '#FFB347',
                'text': '#3D5A4C'
            },
            'fonts': '手写体',
            'elements': '植物元素、大地色系、水彩质感'
        },
        'sweet': {
            'name': '甜蜜马卡龙风',
            'colors': {
                'primary': '#FFB6C1',
                'secondary': '#FFF0F5',
                'accent': '#98D8C8',
                'text': '#6B5B73'
            },
            'fonts': '圆润字体',
            'elements': '柔和色彩、圆润形状、可爱装饰'
        },
        'sporty': {
            'name': '活力运动风',
            'colors': {
                'primary': '#FF6B35',
                'secondary': '#F7F7F7',
                'accent': '#004E89',
                'text': '#1A1A2E'
            },
            'fonts': '粗体无衬线',
            'elements': '动感线条、高对比度、能量感'
        }
    }
    
    # 根据 hints 选择风格
    if hints and hints[0] in style_mapping:
        return style_mapping[hints[0]]
    
    # 根据主题关键词推荐
    theme_keywords = {
        '猫': 'cute', '狗': 'cute', '宠物': 'cute',
        '咖啡': 'minimal', '茶': 'nature',
        '星座': 'dreamy', '宇宙': 'dreamy',
        '游戏': 'retro', '像素': 'retro',
        '古风': 'chinese', '传统': 'chinese',
        'AI': 'tech', '科技': 'tech',
        '植物': 'nature', '森林': 'nature',
        '甜品': 'sweet', '恋爱': 'sweet',
        '运动': 'sporty', '能量': 'sporty'
    }
    
    for keyword, style in theme_keywords.items():
        if keyword in theme:
            return style_mapping[style]
    
    # 默认返回可爱风
    return style_mapping['cute']

def generate_config(requirement: str) -> Dict[str, Any]:
    """
    生成完整的测试配置
    """
    parsed = parse_requirement(requirement)
    
    config = {
        'theme': parsed['theme'],
        'question_count': parsed['question_count'],
        'result_count': 6,  # 默认6种结果
        'visual_style': suggest_visual_style(parsed['theme'], parsed['style_hints']),
        'interaction_mode': 'confirm',  # 默认确认跳转模式
        'questions': generate_questions(parsed['theme'], parsed['question_count']),
        'results': generate_result_types(parsed['theme'], 6),
        'loading_hints': [
            '正在分析你的选择...',
            '解码你的性格密码...',
            '匹配最适合你的类型...',
            '生成专属结果...'
        ]
    }
    
    return config

def validate_config(config: Dict[str, Any]) -> List[str]:
    """
    验证配置是否完整有效
    """
    issues = []
    
    # 检查题目
    if not config.get('questions'):
        issues.append('缺少题目')
    else:
        for i, q in enumerate(config['questions']):
            if not q.get('text'):
                issues.append(f'第{i+1}题缺少题目文本')
            if not q.get('options') or len(q['options']) < 2:
                issues.append(f'第{i+1}题选项不足')
    
    # 检查结果
    if not config.get('results'):
        issues.append('缺少结果类型')
    else:
        for i, r in enumerate(config['results']):
            if not r.get('name'):
                issues.append(f'结果{i+1}缺少名称')
            if not r.get('description'):
                issues.append(f'结果{i+1}缺少描述')
    
    # 检查视觉配置
    style = config.get('visual_style', {})
    if not style.get('colors'):
        issues.append('缺少配色方案')
    
    return issues

def main():
    """
    命令行入口
    """
    if len(sys.argv) < 2:
        print("Usage: python generate_test.py '<requirement>'")
        print("Example: python generate_test.py '我想做一个测试，看看用户是什么类型的咖啡'")
        sys.exit(1)
    
    requirement = sys.argv[1]
    config = generate_config(requirement)
    
    # 输出配置
    print(json.dumps(config, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()