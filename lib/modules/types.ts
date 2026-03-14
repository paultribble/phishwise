/**
 * Module Definition Types
 *
 * Each module is a self-contained training unit with:
 * - Educational content
 * - Associated phishing email templates
 * - Difficulty levels for testing proficiency
 */

export interface ModuleTemplate {
  name: string;
  subject: string;
  body: string;
  fromAddress?: string;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=obvious, 5=subtle
  isActive?: boolean;
}

export interface TrainingModuleConfig {
  name: string;
  description: string;
  content: string; // MDX content for the training page
  orderIndex: number;
  isActive?: boolean;
  templates: ModuleTemplate[];
}
