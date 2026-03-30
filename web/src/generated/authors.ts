export type Author = {
  name: string;
  email: string;
  linkedin: string;
  teamId: string;
};

// This file is generated. Source of truth: content/authors.yml
export const AUTHORS: Record<string, Author> = {
  "vinicius-ceccon": {
    "name": "Vinicius Ceccon da siLVA DOS SANTOS APARECIDO",
    "email": "viniceccon@gmail.com",
    "linkedin": "https://www.linkedin.com/in/vinicius-ceccon/",
    "teamId": "evtol-ita"
  }
} as const;
