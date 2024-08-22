export interface FupaStandingsResponseModel {
  competition: Competition
  standings: Standing[]
}

export interface Competition {
  slug: string
  name: string
}

export interface Standing {
  rank: number
  matches: number
  wins: number
  draws: number
  defeats: number
  ownGoals: number
  againstGoals: number
  goalDifference: number
  points: number
  penaltyPoints: number
  team: Team
  mark?: string
  isRequestedTeam: boolean
}

export interface Team {
  id: number
  slug: string
  name: Name
  image: Image
  origin: string
  level: number
  clubSlug: string
}

export interface Name {
  full: string
  middle: string
  short: string
}

export interface Image {
  path: string
  description?: string
  source?: string
  svg: boolean
}
