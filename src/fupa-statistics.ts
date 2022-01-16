import axios from "axios";
import cheerio from "cheerio";
import { StatisticModel } from "./models/statistic.model";
import { UrlModel } from "./models/url.model";

export class FupaStatistics {
  private urls: UrlModel[];

  constructor(urls: UrlModel[]) {
    this.urls = urls;
  }

  public async get(): Promise<StatisticModel[]> {
    const url =
      "https://www.fupa.net/fupa/widget.php?val=989540&p=start&act=statistik&fupa_widget_header=0&fupa_widget_navi=0&fupa_widget_div=widget_5d62e502d43e7&url=www.tsv-doerzbach.de";
    const AxiosInstance = axios.create();

    const stats: StatisticModel[] = [];

    const res = await AxiosInstance.get(url)

    const html = res.data;
        const $ = cheerio.load(html);
        console.log(html);
        const table: cheerio.Cheerio = $("tr");
        table.each((i, row) => {
          const cols = $(row).find("td");
          const item = {
            number: $(cols[0]).text(),
            name: $(cols[2]).text(),
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
            stats.push(item)
          }
        });

        return stats
  }
}
