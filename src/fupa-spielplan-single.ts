import axios from "axios";
import { IMAGE_PATH } from ".";
import { GamedayService } from "./gameday.service";
import { SpielplanCompleteModel } from "./models/spielplan-complete.model";
import { SpielplanModel } from "./models/spielplan.model";
import { downloadImage, getCleanedFileName, HEADER, IMAGE, removeUmlaute, TEXT } from "./utils";
import { FupaMatchesModel } from "./models/fupa-matches-response.model";
import { format } from "date-fns";

export class FupaSpielplanSingle {
  private resultComplete: SpielplanCompleteModel[] = []
  private ersteMannschaft: string = "tsv-doerzbachklepsau-m1"
  private zweiteMannschaft: string = "tsv-doerzbachklepsau-mr2"
  private key: string
  private spielplan: SpielplanModel[] = []

  constructor(mannschaft: 'erste' | 'zweite') {
    this.key = mannschaft === 'erste' ? this.ersteMannschaft : this.zweiteMannschaft
  }

  public async createComplete(): Promise<SpielplanModel[]> {
    // this.spielplanErste = await this.create(this.ersteMannschaft)
    // this.spielplanZweite = await this.create(this.zweiteMannschaft)
    this.setGameday()
    return this.transform()
  }

  public async create(): Promise<SpielplanModel[]> {
    try {
      const result: SpielplanModel[] = []
      const url =
        `https://api.fupa.net/v2/widget/teams/${this.key}/matches?categories=league,cup,tournament,relegation`
      const AxiosInstance = axios.create();

      const res = (await AxiosInstance.get<FupaMatchesModel>(url)).data;
      let matchday = 0;
      for (const matchesPerMonth of res) {
        for (const match of matchesPerMonth.matches) {
          const enemy = match.homeTeam.name.short === "TSVDK" ? match.awayTeam : match.homeTeam
          matchday = matchday + 1

          const item: SpielplanModel = {
            matchDay: matchday + '',
            date: match.kickoff + '',
            location: match.homeTeam.name.short === "TSVDK" ? 'H' : 'A',
            logo: IMAGE_PATH + '/' + getCleanedFileName(enemy.name.short, 'png'),
            team: removeUmlaute(enemy.name.full),
            result: match.homeGoal ? `${match.homeGoal}:${match.awayGoal}` : "-:-"
          };
          await downloadImage(`${enemy.image.path}/100x100.png`, item.logo)
          this.spielplan.push(item);
        }
      }
      return this.transform();
    } catch (error) {
      console.log(error);
    }
  }

  private setGameday(): void {
    for (const game of this.spielplan) {
      // if(game.result == "-:-") {
      //   this.gamedayService.setGamedayNumber(game.matchDay)
      //   this.gamedayService.setTimeErste(game.date.substring(13,18))
      //   const zweite = this.spielplanZweite.find(zweite => zweite.matchDay === game.matchDay)
      //   if(zweite) {
      //     this.gamedayService.setTimeZweite(zweite.date.substring(13,18))
      //   }
      // }
    }
  }

  private createHeaderRow(): SpielplanModel {
    return {
        matchDay: HEADER + '',
        date: HEADER + '',
        location: HEADER + '',
        logo: HEADER + '',
        team: HEADER + '',
        result: HEADER + '1.MS'
    }
  }

  public transform(): SpielplanModel[]{
    const transformedResult: SpielplanModel[] = []
    transformedResult.push(this.createHeaderRow())
    for (const item of this.spielplan) {

      // const zweite = this.spielplanZweite.find(zweite => zweite.matchDay === item.matchDay)
      // const zweiteTime = (zweite ? `${zweite.date.substring(13,18)} / `: '')

      transformedResult.push({
        matchDay: TEXT + item.matchDay,
        date: TEXT + format(item.date, "dd.MM.yyyy HH:mm"),
        logo: IMAGE + item.logo,
        location: TEXT + item.location,
        team: TEXT + item.team,
        result: TEXT + item.result,
      })
    }
    return transformedResult
  }
}
