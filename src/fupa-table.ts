import axios from "axios";
import cheerio from "cheerio";
import { IMAGE_PATH } from ".";
import { StatisticModel } from "./models/statistic.model";
import { TableModel } from "./models/table.model";
import { UrlModel } from "./models/url.model";
import { downloadImage, getCleanedFileName, HEADER, IMAGE, removeUmlaute, TEXT } from "./utils";

export class FupaTable {
  private result: TableModel[] = []
  private ersteMannschaft: string = "1040157"
  private zweiteMannschaft: string = "1048991"
  private key: string

  constructor(mannschaft: 'erste' | 'zweite') {
    this.key = mannschaft === 'erste' ? this.ersteMannschaft : this.zweiteMannschaft
  }

  public async create(): Promise<TableModel[]> {
    try {
      const url =
        `https://www.fupa.net/fupa/widget.php?val=${this.key}&p=start&act=tabelle&fupa_widget_header=0&fupa_widget_navi=0&fupa_widget_div=widget_5d62e4e03ab28&url=www.tsv-doerzbach.de`
      const AxiosInstance = axios.create();

      const res = await AxiosInstance.get(url);

      const html = res.data;
      const $ = cheerio.load(html);
      const table: cheerio.Cheerio = $("tr");
      for (const row of table) {
        const cols = $(row).find("td");
        const imageUrl = $(cols[2]).find("img").attr("src")
        console.log( $(cols[0]).text().trim())
        const item: TableModel = {
          number: $(cols[0]).text().trim(),
          team: removeUmlaute($(cols[3]).text().trim()),
          logo: IMAGE_PATH + '/' +  getCleanedFileName($(cols[3]).text().trim()),
          games: $(cols[4]).text().trim(),
          wins: $(cols[5]).text().trim(),
          draws: $(cols[6]).text().trim(),
          losses: $(cols[7]).text().trim(),
          goals: $(cols[8]).text().trim(),
          diff: $(cols[9]).text().trim(),
          points: $(cols[10]).text().trim(),
        };

        if (item && imageUrl ) {
          await downloadImage(imageUrl, item.logo)
          this.result.push(item);
        }
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
