export interface SlideData {
  title: string;
  content: string[];
  speakerNotes?: string;
  animation?: 'fade' | 'slide' | 'zoom' | 'flip';
  backgroundColor?: string;
  textColor?: string;
  image?: string;
  chartData?: ChartData;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
    }[];
  };
  options?: any;
}

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'tech' | 'education' | 'marketing' | 'personal';
  slides: Partial<SlideData>[];
  thumbnail: string;
}

export interface UserPreferences {
  defaultTheme: string;
  autoSave: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  language: 'en' | 'es' | 'fr' | 'de' | 'it';
  aiModel: 'gemini' | 'gpt' | 'claude';
  exportFormat: 'pdf' | 'pptx' | 'html';
}

export interface CollaborationSession {
  id: string;
  name: string;
  participants: string[];
  owner: string;
  createdAt: string;
  lastModified: string;
}

export interface HistoryItem {
  id: string;
  projectIdea: string;
  slides: SlideData[];
  tags?: string[];
  collaborationId?: string;
  exportedFormats?: string[];
  views?: number;
  favorites?: boolean;
  createdAt: string;
  lastModified: string;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  PRESENTING = 'PRESENTING',
  REPO_VIEW = 'REPO_VIEW',
  GENERATING_CODE = 'GENERATING_CODE',
  CODE_VIEW = 'CODE_VIEW',
  TEMPLATE_SELECTION = 'TEMPLATE_SELECTION',
  COLLABORATION = 'COLLABORATION',
  SETTINGS = 'SETTINGS',
  ANALYTICS = 'ANALYTICS',
  EXPORT = 'EXPORT',
  ERROR = 'ERROR'
}

export type GeneratorMode = 'pitch' | 'repo' | 'template' | 'collaboration';

export interface RepoNode {
  name: string;
  type: 'file' | 'folder';
  children?: RepoNode[];
}

export interface PresentationTheme {
  name: string;
  bg: string;
  accent: string;
  font: string;
}

export type GeneratedCode = Map<string, string>;

// Enhanced types for advanced AI service features
export interface FileAnalysis {
  complexity: number;
  maintainability: number;
  dependencies: string[];
  suggestedRefactoring?: string[];
}

export interface CodeQuality {
  score: number;
  metrics: {
    complexity: number;
    maintainability: number;
    testability: number;
    performance: number;
    security: number;
  };
  suggestions: Array<{
    type: 'error' | 'warning' | 'suggestion';
    message: string;
    line?: number;
    fix?: string;
  }>;
  bestPractices: string[];
}

export interface ProjectMetadata {
  title: string;
  description: string;
  estimatedDuration: number;
  targetAudience: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  framework?: string;
  language?: string;
  complexity?: 'Simple' | 'Moderate' | 'Complex' | 'Enterprise';
}
