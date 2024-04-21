import axios from "axios";
import cheerio from "cheerio";
import { IMAGE_PATH } from ".";
import { downloadImage, getCleanedFileName, getCleanedTeamName, HEADER, IMAGE, removeUmlaute, TEXT } from "./utils";
import { TorjagerModel } from "./models/torjaeger.model";

export class FussballdeTorjaeger {
  private result: TorjagerModel[] = []
  private ersteMannschaft: string = "02MO7107BS000000VUM1DNQEVSSLFGOQ"  // Wettbewerb Widget
  private zweiteMannschaft: string = "02MO71A6U0000000VUM1DNR6VVOS3IG5" // Wettbewerb Widget
  private key: string

  constructor(mannschaft: 'erste' | 'zweite') {
    this.key = mannschaft === 'erste' ? this.ersteMannschaft : this.zweiteMannschaft
  }

  public async create(): Promise<TorjagerModel[]> {
    try {
      const url =
        `https://www.fussball.de/torjaeger/kreisliga-a3-hohenlohe-nord--bezirk-hohenlohe-kl-kreisliga-a-herren-saison2324-wuerttemberg/-/staffel/02MDC3CG8O000007VS5489B3VS8P6BMU-G#!/section/top-scorer`
      const AxiosInstance = axios.create();

      const res = await AxiosInstance.get(url);

      const html = res.data;
      const $ = cheerio.load(html);
      const table: cheerio.Cheerio = $("table > tbody > tr");
      for (let i = 0; i < 15; i++) {
        const row = table[i]
        const rank = $(row).find(".column-rank");
        
        const clubLogo = $(row).find(".column-club > a > .club-logo > img")
        let clubLogoUrl = $(clubLogo).attr('src')
        clubLogoUrl = clubLogoUrl ? clubLogoUrl.replace("//www.", "https://"): clubLogoUrl
        
        const clubName = $(row).find(".column-club > a > .club-name").text()

        const playerImage: cheerio.Cheerio = $(row).find(".column-player > a > .player-image > span ");
        let imageUrlPlayer = $(playerImage[0]).attr('data-responsive-image')
        imageUrlPlayer = imageUrlPlayer ? imageUrlPlayer.replace("//www.", "https://") : imageUrlPlayer
        imageUrlPlayer = imageUrlPlayer.startsWith("//images") ? imageUrlPlayer.replace("//images", "https://images") : imageUrlPlayer
        
        const playerName = $(row).find(".column-player > a > .player-name").text()

        const goals = $(row).find(".column-goals").text()

        if(imageUrlPlayer) {
          await downloadImage(imageUrlPlayer, IMAGE_PATH + '/' + getCleanedFileName(playerName))
        }

        if(clubLogoUrl) {
          await downloadImage(clubLogoUrl, IMAGE_PATH + '/' + getCleanedFileName(clubName))
        }

        const item: TorjagerModel = {
          rank: rank ? $(rank).text() : "",
          clubLogo: clubLogoUrl ? IMAGE_PATH + '/' +  getCleanedFileName(clubName) : "",
          image: imageUrlPlayer ? IMAGE_PATH + '/' +  getCleanedFileName(playerName) : "",
          name: removeUmlaute(playerName),
          club: getCleanedTeamName(clubName).trim(),
          goals: goals
        };
        if (item) {
          this.result.push(item);
        }
      }

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
