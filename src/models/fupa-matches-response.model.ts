export type FupaMatchesModel = FupaMatchesContent[]

export interface FupaMatchesContent {
  month: number
  matches: Match[]
}

export interface Match {
  id: number
  slug: string
  kickoff: string
  updatedAt: number
  competitionName: string
  homeGoal: any
  awayGoal: any
  section: string
  flags: any
  homeTeam: HomeTeam
  homeTeamName: string
  awayTeam: AwayTeam
  awayTeamName: string
  streamUpdatedAt: number
  tickerAuthor: any
  resultForTeam: any
}

export interface HomeTeam {
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

export interface AwayTeam {
  id: number
  slug: string
  name: Name2
  image: Image2
  origin: string
  level: number
  clubSlug: string
}

export interface Name2 {
  full: string
  middle: string
  short: string
}

export interface Image2 {
  path: string
  description?: string
  source?: string
  svg: boolean
}
