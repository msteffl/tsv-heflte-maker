import axios from "axios";
import cheerio from "cheerio";
import { IMAGE_PATH } from ".";
import { MatchModel } from "./models/match.model";
import { StatisticModel } from "./models/statistic.model";
import { TableModel } from "./models/table.model";
import { UrlModel } from "./models/url.model";
import { downloadImage, getCleanedFileName, HEADER, IMAGE, TEXT } from "./utils";

export class FussballdeMatches {
  private result: MatchModel[] = []
  private ersteMannschaft: string = "02FDV4O918000000VUM1DNOMVS4UPRQD"
  private zweiteMannschaft: string = "02FDV54H50000000VUM1DNO5VUCNOT5O"
  private key: string
  private gameDay: number

  constructor(mannschaft: 'erste' | 'zweite', gameDay: number) {
    this.key = mannschaft === 'erste' ? this.ersteMannschaft : this.zweiteMannschaft
    this.gameDay = gameDay
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

        console.log($(team[0]).text().trim())
        console.log($(logo[0]).attr('data-responsive-image'))
        console.log($(team[1]).text().trim())
        console.log($(logo[1]).attr('data-responsive-image'))


        let imageUrlHome = $(logo[0]).attr('data-responsive-image')
        imageUrlHome = imageUrlHome ? imageUrlHome.replace("//", ""): imageUrlHome

        let iamgeUrlGuest = $(logo[1]).attr('data-responsive-image')
        iamgeUrlGuest = iamgeUrlGuest ? iamgeUrlGuest.replace("//", ""): iamgeUrlGuest

        const item: MatchModel = {
          date: "",
          time: "13:00",
          logoHome: imageUrlHome ? IMAGE_PATH + '/' +  $(team[0]).text().trim() : "",
          logoGuest: iamgeUrlGuest ? IMAGE_PATH + '/' +  $(team[1]).text().trim() : "",
          home: $(team[0]).text().trim(),
          guest: $(team[1]).text().trim(),
          result: "-:-"
        };
        console.log(item)
        if (item && item.home !== "") {
          // await downloadImage(imageUrlHome, item.logoHome)
          // await downloadImage(iamgeUrlGuest, item.logoGuest)
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
      result: HEADER + 'Ergebnis'
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
