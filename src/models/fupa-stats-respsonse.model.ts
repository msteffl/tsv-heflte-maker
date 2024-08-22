export type FupaStatsResponseModel = FupaStatsResponseContent[]

export interface FupaStatsResponseContent {
  slug: string
  firstName: string
  lastName: string
  image: Image
  matches: number
  goals: number
  assists: number
  penaltiesTotal: number
  penaltiesHit: number
  yellowCards: number
  yellowRedCards: number
  redCards: number
  substitutesIn: number
  substitutesOut: number
  minutesPlayed: number
  topEleven: number
}

export interface Image {
  path: string
  description?: string
  source?: string
  svg: boolean
}
