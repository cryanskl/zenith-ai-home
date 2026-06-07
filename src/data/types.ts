export type Profile = {
  name: string;
  title: string;
  headline: string;
  summary: string;
  currentFocus: string[];
  links: {
    label: string;
    href: string;
  }[];
};

export type Project = {
  title: string;
  summary: string;
  problem: string;
  approach: string;
  stack: string[];
  proof?: string;
  links?: { label: string; href: string }[];
};

export type TimelineItem = {
  date: string;
  event: string;
  context: string;
  people?: string[];
  result?: string;
  link?: string;
};

export type PromptItem = {
  scenario: string;
  prompt: string;
  whyItWorks: string;
  variables: string[];
};

export type ReadingItem = {
  title: string;
  source: string;
  reason: string;
  href?: string;
};

export type InsightItem = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
};
