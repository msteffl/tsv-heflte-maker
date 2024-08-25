export type FupaGamedayModel = FupaGamedayContentModel[]

export interface FupaGamedayContentModel {
  id: number
  slug: string
  homeTeam: HomeTeam
  awayTeam: AwayTeam
  kickoff: string
  homeGoal: any
  awayGoal: any
  flags: any
  tickerType: any
  section: string
  round: Round
  spectators: any
  updatedAt: number
  streamUpdatedAt: number
  refereeAlias: any
  gallery: any
  tickerReservableUntil: any
}

export interface HomeTeam {
  id: number
  teamId: number
  slug: string
  name: Name
  image: Image
  origin: string
  ageGroup: AgeGroup
  linkUrl: string
  level: number
  clubSlug: string
  club: Club
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

export interface AgeGroup {
  slug: string
  name: string
}

export interface Club {
  id: number
  name: string
  middleName: string
  shortName: string
  image: Image2
  slug: string
}

export interface Image2 {
  path: string
  description?: string
  source?: string
  svg: boolean
}

export interface AwayTeam {
  id: number
  teamId: number
  slug: string
  name: Name2
  image: Image3
  origin: string
  ageGroup: AgeGroup2
  linkUrl: string
  level: number
  clubSlug: string
  club: Club2
}

export interface Name2 {
  full: string
  middle: string
  short: string
}

export interface Image3 {
  path: string
  description?: string
  source?: string
  svg: boolean
}

export interface AgeGroup2 {
  slug: string
  name: string
}

export interface Club2 {
  id: number
  name: string
  middleName: string
  shortName: string
  image: Image4
  slug: string
}

export interface Image4 {
  path: string
  description?: string
  source?: string
  svg: boolean
}

export interface Round {
  id: number
  type: string
  slug: string
  number: number
}
