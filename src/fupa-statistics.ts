import axios from "axios";
import cheerio from "cheerio";
import { IMAGE_PATH } from ".";
import { StatisticModel } from "./models/statistic.model";
import { UrlModel } from "./models/url.model";
import { IMAGE, removeUmlaute, TEXT } from "./utils";
import { FupaStatsResponseModel } from "./models/fupa-stats-respsonse.model";

export class FupaStatistics {
  private ersteMannschaft: string = "tsv-doerzbachklepsau-m1"
  private zweiteMannschaft: string = "tsv-doerzbachklepsau-mr2"
  private key: string
  private result: StatisticModel[] = []

  constructor(mannschaft: 'erste' | 'zweite') {
    this.key = mannschaft === 'erste' ? this.ersteMannschaft : this.zweiteMannschaft
  }

  public async create(): Promise<StatisticModel[]> {
    const url =
      `https://api.fupa.net/v1/widget/teams/${this.key}/stats`
    const AxiosInstance = axios.create();

    const res = (await AxiosInstance.get<FupaStatsResponseModel>(url)).data
    res.sort((a, b) => Number(b.minutesPlayed) - Number(a.minutesPlayed));
    let number = 0
    for (const stat of res) {
      number = number + 1
      const item: StatisticModel = {
        number: number + '',
        name: `${removeUmlaute(stat.firstName)} ${removeUmlaute(stat.lastName)}`,
        games: stat.matches + '',
        scores: stat.goals + '',
        assist: stat.assists + '',
        elevenMeter: stat.penaltiesHit + '/' + stat.penaltiesTotal,
        yellowCard: stat.yellowCards + '',
        yellowRedCard: stat.yellowRedCards + '',
        redCard: stat.redCards + '',
        in: stat.substitutesIn + '',
        out: stat.substitutesOut + '',
        playTime: stat.minutesPlayed + ''
      };
      this.result.push(item);
    }

    return this.transform();
  }

  private createHeaderRow(): StatisticModel {
    return {
      number: TEXT ,
      name: TEXT,
      games: IMAGE + IMAGE_PATH + '/Einsatz.jpg' ,
      scores: IMAGE + IMAGE_PATH + '/Tore.jpg' ,
      assist: IMAGE + IMAGE_PATH + '/Vorlagen.jpg' ,
      elevenMeter: IMAGE + IMAGE_PATH + '/Elfmeter.jpg' ,
      yellowCard: IMAGE + IMAGE_PATH + '/Gelb.jpg' ,
      yellowRedCard: IMAGE + IMAGE_PATH + '/Gelb-Rot.jpg' ,
      redCard: IMAGE + IMAGE_PATH + '/Rot.jpg' ,
      in:  IMAGE + IMAGE_PATH + '/Einwechsel.jpg' ,
      out:  IMAGE + IMAGE_PATH + '/Auswechsel.jpg' ,
      playTime: IMAGE + IMAGE_PATH + '/Gesamtspielzeit.jpg' ,
    }
  }

  public transform(): StatisticModel[]{
    const transformedResult: StatisticModel[] = []
    transformedResult.push(this.createHeaderRow())
    for (const item of this.result) {
      transformedResult.push({
        number: TEXT + item.number,
        name: TEXT + item.name,
        games: TEXT + item.games,
        scores: TEXT + item.scores,
        assist: TEXT + item.assist,
        elevenMeter: TEXT + item.elevenMeter,
        yellowCard: TEXT + item.yellowCard,
        yellowRedCard: TEXT + item.yellowRedCard,
        redCard: TEXT + item.redCard,
        in:  TEXT + item.in,
        out:  TEXT + item.out,
        playTime: TEXT + item.playTime
      })
    }
    return transformedResult
  }
}
