export type Team = {
  name: string;
  university: string;
  linkedin?: string;
  gitOrgUrl?: string;
};

// This file is generated. Source of truth: content/teams.yml
export const TEAMS: Record<string, Team> = {
  "evtol-ita": {
    "name": "eVTOL ITA",
    "university": "ITA",
    "linkedin": "https://www.linkedin.com/company/evtol-ita",
    "gitOrgUrl": "https://github.com/Equipe-eVTOL-ITA"
  }
} as const;
