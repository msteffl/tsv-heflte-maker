import axios from "axios";
import cheerio from "cheerio";
import { IMAGE_PATH } from ".";
import { MatchModel } from "./models/match.model";
import { StatisticModel } from "./models/statistic.model";
import { TableModel } from "./models/table.model";
import { UrlModel } from "./models/url.model";
import { downloadImage, getCleanedFileName, getCleanedTeamName, HEADER, IMAGE, removeUmlaute, TEXT } from "./utils";

export class FussballdeMatches {
  private result: MatchModel[] = []
  private ersteMannschaft: string = "02J18GRKM0000000VUM1DNPCVU4MLK3F"
  private zweiteMannschaft: string = "02J18H6D1C000000VUM1DNOPVS9NSHQP"
  private key: string
  private gameDay: number
  private matchTime: string

  constructor(mannschaft: 'erste' | 'zweite', gameDay: number, matchTime: string) {
    this.key = mannschaft === 'erste' ? this.ersteMannschaft : this.zweiteMannschaft
    this.gameDay = gameDay
    this.matchTime = matchTime
  }

  public async create(): Promise<MatchModel[]> {
    try {
      const url =
        `https://www.fussball.de/widget2/-/caller/tsv-doerzbach.de/schluessel/${this.key}/spieltag/${this.gameDay}/#!/`
      const AxiosInstance = axios.create();

      const res = await AxiosInstance.get(url);

      const html = res.data;
      const $ = cheerio.load(html);
      const table: cheerio.Cheerio = $("tbody > tr");
      for (const row of table) {
        const team = $(row).find(".column-club");
        const logo: cheerio.Cheerio = $(row).find(".column-club > a > .club-logo > span ");

        // console.log($(team[0]).text().trim())
        // console.log($(logo[0]).attr('data-responsive-image'))
        // console.log($(team[1]).text().trim())
        // console.log($(logo[1]).attr('data-responsive-image'))


        let imageUrlHome = $(logo[0]).attr('data-responsive-image')
        imageUrlHome = imageUrlHome ? imageUrlHome.replace("//www.", "https://"): imageUrlHome

        let iamgeUrlGuest = $(logo[1]).attr('data-responsive-image')
        iamgeUrlGuest = iamgeUrlGuest ? iamgeUrlGuest.replace("//www.", "https://"): iamgeUrlGuest

        const item: MatchModel = {
          time: this.matchTime,
          logoHome: imageUrlHome ? IMAGE_PATH + '/' +  getCleanedFileName($( team[0]).text()) : "",
          logoGuest: iamgeUrlGuest ? IMAGE_PATH + '/' +  getCleanedFileName($(team[1]).text()) : "",
          home: getCleanedTeamName($(team[0]).text().trim()),
          guest: getCleanedTeamName($(team[1]).text().trim()),
          result: "-:-"
        };
        if (item && item.home !== "") {
          if (imageUrlHome) {
            await downloadImage(imageUrlHome, item.logoHome)
          }
          if (iamgeUrlGuest) {
            await downloadImage(iamgeUrlGuest, item.logoGuest)
          }
          this.result.push(item);
        }
      }

      return this.transform();
    } catch (error) {
      console.log(error);
    }
  }

  private createHeaderRow(): MatchModel {
    return {
      time: HEADER + 'Zeit',
      logoHome: HEADER + '',
      home: HEADER + 'Heim',
      result: HEADER + 'Erg.',
      logoGuest: HEADER + '',
      guest: HEADER + 'Gast',
    }
  }

  public transform(): MatchModel[]{
    const transformedResult: MatchModel[] = []
    transformedResult.push(this.createHeaderRow())
    for (const item of this.result) {
      transformedResult.push({
        time: TEXT + item.time,
        logoHome: IMAGE + item.logoHome,
        home: TEXT + item.home,
        result: TEXT + item.result,
        logoGuest: item.guest.toLowerCase() === "spielfrei" ? TEXT : IMAGE + item.logoGuest,
        guest: TEXT + item.guest
      })
    }
    return transformedResult
  }
}
