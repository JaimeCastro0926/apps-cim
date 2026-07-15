export interface LessonSlide {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  character: 'mario' | 'luigi' | 'peach' | 'bowser' | 'toad';
  characterDialogue: string;
  visualType: 'point' | 'line' | 'plane' | 'space' | 'examples' | 'intro' | 'summary';
  conceptDetails?: {
    definition: string;
    notation: string;
    marioExample: string;
    realExample: string;
  };
}

export interface InteractiveElement {
  id: string;
  name: string;
  type: 'point' | 'line' | 'plane';
  x: number; // percentage from left
  y: number; // percentage from top
  description: string;
  marioRef: string;
}

export interface ClassifiableItem {
  id: string;
  name: string;
  type: 'point' | 'line' | 'plane';
  icon: string; // Emoji or visual representation
  description: string;
  imageSeed?: string;
}

export interface PlacedElement {
  id: string;
  type: 'point' | 'line' | 'plane';
  coords: { x: number; y: number }[]; // array of points
  name: string;
}

export interface UserProgress {
  slidesCompleted: boolean;
  mission1Score: number; // Identification
  mission1Completed: boolean;
  mission2Completed: boolean; // Drawing
  mission3Score: number; // Classification
  mission3Completed: boolean;
  totalCoins: number;
}
