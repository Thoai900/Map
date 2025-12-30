export interface Link {
  label: string;
  url: string;
}

export interface MindMapData {
  id: string;
  label: string;
  description?: string; // Short summary
  content?: string; // Long rich text/markdown
  icon?: string;
  color?: string;
  images?: string[]; // Array of image URLs
  links?: Link[];
  children?: MindMapData[];
  isExpanded?: boolean;
  // Coordinate properties for layout
  x?: number;
  y?: number;
}

export interface TransformState {
  x: number;
  y: number;
  scale: number;
}