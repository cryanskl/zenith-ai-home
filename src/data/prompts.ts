import type { PromptItem } from './types';

export const prompts: PromptItem[] = [
  {
    scenario: '项目复盘',
    prompt:
      '请基于以下项目背景，按「目标、约束、关键决策、失败点、下一步」输出一份工程复盘：{{project_context}}',
    whyItWorks:
      '它把复盘限制在工程决策和后续行动上，避免变成泛泛总结。',
    variables: ['project_context'],
  },
  {
    scenario: 'Prompt 结构化改写',
    prompt:
      '请把下面的自然语言需求改写成可复用 prompt，包含角色、输入、输出格式、约束和自检清单：{{raw_requirement}}',
    whyItWorks:
      '它把一次性需求拆成可维护结构，适合沉淀到个人 prompt 库。',
    variables: ['raw_requirement'],
  },
];
