export interface TrainingTactic {
  name: string;
  description: string;
}

export interface TrainingExample {
  title: string;
  body: string;
  redFlags: string[];
}

export interface TrainingQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrainingModuleContent {
  overview: string;
  tactics: TrainingTactic[];
  redFlags: string[];
  objective: string;
  examples: TrainingExample[];
  preventionSteps: string[];
  quiz: TrainingQuiz;
}

export interface TrainingModuleWithContent {
  id: string;
  name: string;
  description: string;
  content: TrainingModuleContent;
  isActive: boolean;
}

export interface UserTrainingStatus {
  completed: boolean;
  completedAt: Date | null;
  assignedAt: Date | null;
}

export interface TrainingModuleAPIResponse {
  module: {
    id: string;
    name: string;
    description: string;
    content: TrainingModuleContent;
  };
  userStatus: UserTrainingStatus | null;
  isRequired: boolean;
}
