export interface DataHistory {
    key: string;
    LeagueScorersPage: LeagueScorersPage;
  }
  interface LeagueScorersPage {
    metaLeague: MetaLeague;
    scorers: Scorer[];
    error?: any;
    nextUrl: string;
    isFetching: boolean;
  }
  interface Scorer {
    id: number;
    player: Player;
    team: Team;
    jerseyNumber?: number;
    statistics: Statistics;
    flags: string[];
  }
  interface Statistics {
    matches: number;
    goals: number;
    assists: number;
    yellowCard: number;
    yellowRedCard: number;
    redCard: number;
    substituteIn: number;
    substituteOut: number;
    minutes: number;
    penaltyHits: number;
    penaltyMisses: number;
    topEleven: number;
  }
  interface Team {
    id: number;
    teamId: number;
    slug: string;
    name: Name;
    image: Image3;
    origin: string;
    linkUrl: string;
    level: number;
    clubSlug: string;
    club: Club;
  }
  interface Club {
    id: number;
    name: string;
    middleName: string;
    shortName: string;
    image: Image3;
    slug: string;
  }
  interface Image3 {
    path: string;
    description?: any;
    source?: string;
    svg: boolean;
  }
  interface Name {
    full: string;
    middle: string;
    short: string;
  }
  interface Player {
    id: number;
    slug: string;
    firstName: string;
    lastName: string;
    birthday?: string;
    image: Image2;
    isDeactivated: boolean;
    position: string;
  }
  interface Image2 {
    path: string;
    description?: string;
    source?: string;
    svg: boolean;
  }
  interface MetaLeague {
    id: number;
    competitionSeasonId: number;
    slug: string;
    season: Season;
    name: string;
    middleName: string;
    shortName: string;
    active: boolean;
    ageGroup: Season;
    image: Image;
    district: District;
    category: Category;
    level: number;
    order: number;
    videoAllowed: boolean;
    standingFormUpdatedAt: number;
    phases: any[];
  }
  interface Category {
    id: number;
    name: string;
  }
  interface District {
    id: number;
    name: string;
    middleName: string;
    shortName: string;
    slug: string;
    region: Region;
  }
  interface Region {
    id: number;
    name: string;
    slug: string;
    linkUrl: string;
  }
  interface Image {
    path: string;
    description?: any;
    source?: any;
    svg: boolean;
  }
  interface Season {
    slug: string;
    name: string;
  }