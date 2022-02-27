import axios from "axios";
import cheerio from "cheerio";
import { IMAGE_PATH } from ".";
import { GamedayService } from "./gameday.service";
import { SpielplanCompleteModel } from "./models/spielplan-complete.model";
import { SpielplanModel } from "./models/spielplan.model";
import { StatisticModel } from "./models/statistic.model";
import { TableModel } from "./models/table.model";
import { UrlModel } from "./models/url.model";
import { downloadImage, getCleanedFileName, HEADER, IMAGE, removeUmlaute, TEXT } from "./utils";

export class FupaSpielplan {
  private resultComplete: SpielplanCompleteModel[] = []
  private ersteMannschaft: string = "989540"
  private zweiteMannschaft: string = "989681"
  private spielplanErste: SpielplanModel[]
  private spielplanZweite: SpielplanModel[]

  constructor(private gamedayService: GamedayService) {
  }

  public async createComplete(): Promise<SpielplanCompleteModel[]> {
    this.spielplanErste = await this.create(this.ersteMannschaft)
    this.spielplanZweite = await this.create(this.zweiteMannschaft)
    this.setGameday()
    return this.transform()
  }

  public async create(key: string): Promise<SpielplanModel[]> {
    try {
      const result: SpielplanModel[] = []
      const url =
        `https://www.fupa.net/fupa/widget.php?val=${key}&p=start&act=spielplan&fupa_widget_header=0&fupa_widget_navi=0&fupa_widget_div=widget_621bac55e7459&url=www.tsv-doerzbach.de`
      const AxiosInstance = axios.create();

      const res = await AxiosInstance.get(url);

      const html = res.data;
      const $ = cheerio.load(html);
      const table: cheerio.Cheerio = $("tr");
      let section = 'kreisliga'
      for (const row of table) {
        const header = $(row).find("th");
        if(header.length > 0) {
          section = $(header).text()
        } else {
          if(section.toLowerCase().includes("kreisliga")) {
            const cols = $(row).find("td");
            const imageUrl = $(cols[3]).find("img").attr("src")
            const item: SpielplanModel = {
              matchDay: $(cols[0]).text().trim(),
              date: $(cols[1]).text().trim(),
              location: $(cols[2]).text().trim(),
              logo: IMAGE_PATH + '/' +  getCleanedFileName($(cols[4]).text().trim()),
              team: removeUmlaute($(cols[4]).text().trim()),
              result:$(cols[5]).text().trim()
            }
            if (item && item.matchDay !== "") {
              await downloadImage(imageUrl, item.logo)
              result.push(item);
            }
          }
        }
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  private setGameday(): void {
    for (const game of this.spielplanErste) {
      if(game.result == "-:-") {
        this.gamedayService.setGamedayNumber(game.matchDay)
        this.gamedayService.setTimeErste(game.date.substring(13,18))
        const zweite = this.spielplanZweite.find(zweite => zweite.matchDay === game.matchDay)
        if(zweite) {
          this.gamedayService.setTimeZweite(zweite.date.substring(13,18))
        }
      }
    }
  }

  private createHeaderRow(): SpielplanCompleteModel {
    return {
        matchDay: HEADER + '',
        date: HEADER + '',
        location: HEADER + '',
        logo: HEADER + '',
        team: HEADER + '',
        resultZweite: HEADER + '2.MS',
        result: HEADER + '1.MS'
    }
  }

  public transform(): SpielplanCompleteModel[]{
    const transformedResult: SpielplanCompleteModel[] = []
    transformedResult.push(this.createHeaderRow())
    for (const item of this.spielplanErste) {

      const zweite = this.spielplanZweite.find(zweite => zweite.matchDay === item.matchDay)
      const zweiteTime = (zweite ? `${zweite.date.substring(13,18)} / `: '')

      transformedResult.push({
        matchDay: TEXT + item.matchDay,
        date: TEXT + item.date.substring(0,12) + " " + zweiteTime + item.date.substring(13,18),
        logo: IMAGE + item.logo,
        location: TEXT + item.location,
        team: TEXT + item.team,
        resultZweite: TEXT + (zweite ? zweite.result : "/"),
        result: TEXT + item.result,
      })
    }
    return transformedResult
  }
}
