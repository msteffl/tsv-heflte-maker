import axios from "axios";
import cheerio from "cheerio";
import { IMAGE_PATH } from ".";
import { TableModel } from "./models/table.model";
import { downloadImage, getCleanedFileName, HEADER, IMAGE, removeUmlaute, TEXT } from "./utils";
import { DataHistory } from "./models/fupa-torjaeger-model";
import { TorjagerModel } from "./models/torjaeger.model";

export class FupaTorjaeger {
  private result: TorjagerModel[] = []
  private ersteMannschaft: string = "tsv-doerzbachklepsau-m1"
  private zweiteMannschaft: string = "tsv-doerzbachklepsau-mr2"
  private key: string

  constructor(mannschaft: 'erste' | 'zweite') {
    this.key = mannschaft === 'erste' ? this.ersteMannschaft : this.zweiteMannschaft
  }

  public async create(): Promise<TorjagerModel[]> {
    try {
      const url =
        `https://www.fupa.net/league/kreisliga-a3-franken/scorers`
      const AxiosInstance = axios.create();

      const res = await AxiosInstance.get<string>(url);

      const $ = cheerio.load(res.data);

      const scriptTag = $('script').filter((i, el) => $(el).html().includes('window.REDUX_DATA')).html();

      const jsonString = scriptTag.split('window.REDUX_DATA = ')[1].split(';</script>')[0];

      // Parse the extracted JSON
      const reduxData = JSON.parse(jsonString);

      // Get the dataHistory object
      const dataHistory: DataHistory = reduxData.dataHistory[0];

      let rank = 1

      for (const scorer of dataHistory.LeagueScorersPage.scorers) {
        const item: TorjagerModel = {
          rank: rank.toString(),
          clubLogo:  IMAGE_PATH + '/' + getCleanedFileName(scorer.team.name.full, 'png'),
          image: IMAGE_PATH + '/' + getCleanedFileName(scorer.player.slug, 'png'),
          name: removeUmlaute(scorer.player.firstName + " " + scorer.player.lastName),
          club: removeUmlaute(scorer.team.name.full.trim()),
          goals: scorer.statistics.goals.toString()
        };
        rank = rank +1
        await downloadImage(`${scorer.team.image.path}/100x100.png`, item.clubLogo)
        await downloadImage(`${scorer.player.image.path}/100x100.png`, item.image)
        this.result.push(item);
      }
      //use only first 15 entries 
      this.result = this.result.slice(0, 15)
    
      return this.transform();
    } catch (error) {
      console.log(error);
    }
  }

  private createHeaderRow(): TorjagerModel {
    return {
      rank: HEADER + 'Platz',
      image: HEADER + '',
      name: HEADER + 'Spieler',
      clubLogo: HEADER + '',
      club: HEADER + 'Mannschaft',
      goals: HEADER + 'Tore',
    }
  }

  public transform(): TorjagerModel[]{
    const transformedResult: TorjagerModel[] = []
    transformedResult.push(this.createHeaderRow())
    for (const item of this.result) {
      transformedResult.push({
        rank: TEXT + item.rank,
        image: IMAGE + item.image,
        name: TEXT + item.name,
        clubLogo: IMAGE + item.clubLogo,
        club: TEXT+ item.club,
        goals: TEXT + item.goals
      })
    }
    return transformedResult
  }
}
