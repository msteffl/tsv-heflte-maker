export class GamedayService {
  public timeZweite: string
  public timeErste: string
  public gamedayNumber: string

  constructor() {
  }

  public setGamedayNumber(gameday: string) {
    if(!this.gamedayNumber) {
      this.gamedayNumber = gameday
    }
  }

  public setTimeErste(time: string) {
    if(!this.timeErste) {
      this.timeErste = time
    }
  }

  public setTimeZweite(time: string) {
    if(!this.timeZweite) {
      this.timeZweite = time
    }
  }
}