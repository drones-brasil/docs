export type Author = {
  name: string;
  email: string;
  linkedin: string;
  university: string;
  photoUrl?: string;
};

// This file is generated. Source of truth: content/authors.yml
export const AUTHORS: Record<string, Author> = {
  "vinicius-ceccon": {
    "name": "Vinicius Ceccon",
    "email": "viniceccon@gmail.com",
    "linkedin": "https://www.linkedin.com/in/vinicius-ceccon/",
    "university": "ITA",
    "photoUrl": "https://placehold.co/160x160/png?text=VC"
  }
} as const;
