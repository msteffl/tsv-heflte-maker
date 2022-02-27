import axios from "axios";
import cheerio from "cheerio";
import { IMAGE_PATH } from ".";
import { MatchModel } from "./models/match.model";
import { StatisticModel } from "./models/statistic.model";
import { TableModel } from "./models/table.model";
import { UrlModel } from "./models/url.model";
import { downloadImage, getCleanedFileName, HEADER, IMAGE, removeUmlaute, TEXT } from "./utils";

export class FussballdeMatches {
  private result: MatchModel[] = []
  private ersteMannschaft: string = "02FDV4O918000000VUM1DNOMVS4UPRQD"
  private zweiteMannschaft: string = "02FDV54H50000000VUM1DNO5VUCNOT5O"
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
          date: "",
          time: this.matchTime,
          logoHome: imageUrlHome ? IMAGE_PATH + '/' +  getCleanedFileName($( team[0]).text()) : "",
          logoGuest: iamgeUrlGuest ? IMAGE_PATH + '/' +  getCleanedFileName($(team[1]).text()) : "",
          home: removeUmlaute($(team[0]).text().trim()),
          guest: removeUmlaute($(team[1]).text().trim()),
          result: "-:-"
        };
        if (item && item.home !== "") {
          console.log(item.home + " vs. " + item.guest)
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
      date: HEADER + 'Datum',
      time: HEADER + 'Zeit',
      logoHome: HEADER + '',
      home: HEADER + 'Heim',
      logoGuest: HEADER + '',
      guest: HEADER + 'Gast',
      result: HEADER + 'Erg.'
    }
  }

  public transform(): MatchModel[]{
    const transformedResult: MatchModel[] = []
    transformedResult.push(this.createHeaderRow())
    for (const item of this.result) {
      transformedResult.push({
        date: TEXT + item.date,
        time: TEXT + item.time,
        logoHome: IMAGE + item.logoHome,
        logoGuest: IMAGE + item.logoGuest,
        home: TEXT + item.home,
        guest: TEXT + item.guest,
        result: TEXT + item.result,
      })
    }
    return transformedResult
  }
}
