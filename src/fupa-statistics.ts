import axios from "axios";
import cheerio from "cheerio";
import { IMAGE_PATH } from ".";
import { StatisticModel } from "./models/statistic.model";
import { UrlModel } from "./models/url.model";
import { IMAGE, removeUmlaute, TEXT } from "./utils";

export class FupaStatistics {
  private ersteMannschaft: string = "1040157"
  private zweiteMannschaft: string = "1048991"
  private key: string
  private result: StatisticModel[] = []

  constructor(mannschaft: 'erste' | 'zweite') {
    this.key = mannschaft === 'erste' ? this.ersteMannschaft : this.zweiteMannschaft
  }

  public async create(): Promise<StatisticModel[]> {
    const url =
      `https://www.fupa.net/fupa/widget.php?val=${this.key}&p=start&act=statistik&fupa_widget_header=0&fupa_widget_navi=0&fupa_widget_div=widget_5d62e502d43e7&url=www.tsv-doerzbach.de`
    const AxiosInstance = axios.create();

    const res = await AxiosInstance.get(url)

    const html = res.data;
        const $ = cheerio.load(html);
        const table: cheerio.Cheerio = $("tr");
        table.each((i, row) => {
          const cols = $(row).find("td");
          const item = {
            number: $(cols[0]).text(),
            name: removeUmlaute($(cols[2]).text()),
            games: $(cols[3]).text(),
            scores: $(cols[4]).text(),
            assist: $(cols[5]).text(),
            elevenMeter: $(cols[6]).text(),
            yellowCard: $(cols[7]).text(),
            yellowRedCard: $(cols[8]).text(),
            redCard: $(cols[9]).text(),
            in: $(cols[10]).text(),
            out: $(cols[11]).text(),
            playTime: $(cols[12]).text()
          };

          if (item && item.number !== "") {
            this.result.push(item);
          }
        });
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
