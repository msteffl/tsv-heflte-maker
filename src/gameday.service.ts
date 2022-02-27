export class GamedayService {
  public timeZweite: string
  public timeErste: string
  public gamedayNumber: number

  constructor() {
  }

  public setGamedayNumber(gameday: string) {
    if(!this.gamedayNumber) {
      this.gamedayNumber = Number.parseInt(gameday.replace(".", ""))
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