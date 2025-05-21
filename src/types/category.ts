export interface Category {
  id: number;
  name: string;
  emoji: string;
  color: string;
}

export interface GiftIdea {
  text: string;
}

export interface CategoryWithIdeas extends Category {
  ideas?: string[];
} 