import axios from "axios";
import cheerio from "cheerio";
import { IMAGE_PATH } from ".";
import { StatisticModel } from "./models/statistic.model";
import { TableModel } from "./models/table.model";
import { UrlModel } from "./models/url.model";
import { downloadImage, getCleanedFileName, HEADER, IMAGE, removeUmlaute, TEXT } from "./utils";
import { FupaStandingsResponseModel } from "./models/fupa-standings-response.model";

export class FupaTable {
  private result: TableModel[] = []
  private ersteMannschaft: string = "tsv-doerzbachklepsau-m1"
  private zweiteMannschaft: string = "tsv-doerzbachklepsau-mr2"
  private key: string

  constructor(mannschaft: 'erste' | 'zweite') {
    this.key = mannschaft === 'erste' ? this.ersteMannschaft : this.zweiteMannschaft
  }

  public async create(): Promise<TableModel[]> {
    try {
      const url =
        `https://api.fupa.net/v1/widget/teams/${this.key}/standings`
      const AxiosInstance = axios.create();

      const res = (await AxiosInstance.get<FupaStandingsResponseModel>(url)).data;

      for (const standing of res.standings) {
        const item: TableModel = {
          number: standing.rank + '',
          team: removeUmlaute(standing.team.name.full),
          logo: IMAGE_PATH + '/' + getCleanedFileName(standing.team.name.full, 'png'),
          games: standing.matches + '',
          wins: standing.wins + '',
          draws: standing.draws + '',
          losses: standing.defeats + '',
          goals: standing.ownGoals + ' : ' + standing.againstGoals,
          diff: standing.goalDifference + '',
          points: standing.points + '',
        };
        await downloadImage(`${standing.team.image.path}/100x100.png`, item.logo)
        this.result.push(item);
      }

      return this.transform();
    } catch (error) {
      console.log(error);
    }
  }

  private createHeaderRow(): TableModel {
    return {
      number: HEADER + '',
      logo: HEADER + '',
      team: HEADER + '',
      games: HEADER + 'S',
      wins: HEADER + 'S',
      draws: HEADER + 'U',
      losses: HEADER + 'N',
      goals: HEADER + 'Tore',
      diff: HEADER + 'Diff',
      points: HEADER + 'P'
    }
  }

  public transform(): TableModel[]{
    const transformedResult: TableModel[] = []
    transformedResult.push(this.createHeaderRow())
    for (const item of this.result) {
      transformedResult.push({
        number: TEXT + item.number,
        logo: IMAGE + item.logo,
        team: TEXT + item.team,
        games: TEXT + item.games,
        wins: TEXT + item.wins,
        draws: TEXT + item.draws,
        losses: TEXT + item.losses,
        goals: TEXT + item.goals,
        diff: TEXT + item.diff,
        points: TEXT + item.points
      })
    }
    return transformedResult
  }
}
