export interface GuideInfo {
  name: string;
  title: string;
  description: string;
  language?: string;
}

export interface QueryResult {
  guide: string;
  content: string;
  truncated?: boolean;
}

export interface QuestionAnswer {
  language: string;
  guide: string;
  question: string;
  answer: string;
  context: string;
}
