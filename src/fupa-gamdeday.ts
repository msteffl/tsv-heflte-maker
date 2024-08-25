import axios from "axios";
import { IMAGE_PATH } from ".";
import { downloadImage, getCleanedFileName, HEADER, IMAGE, removeUmlaute, TEXT } from "./utils";
import { addWeeks, format, isWithinInterval, subWeeks } from "date-fns";
import { FupaGamedayModel } from "./models/fupa-gameday.model";
import { MatchModel } from "./models/match.model";

export class FupaGameday {
  private result: MatchModel[] = []
  private ersteMannschaft: string = "kreisliga-a3-franken"
  private zweiteMannschaft: string = "kreisliga-a1-franken-reserve"
  private key: string

  constructor(mannschaft: 'erste' | 'zweite') {
    this.key = mannschaft === 'erste' ? this.ersteMannschaft : this.zweiteMannschaft
  }

  public async create(): Promise<MatchModel[]> {
    try {
      const dateFrom = format(new Date(), 'yyyy-MM-dd')
      const url =
        `https://api.fupa.net/v1/competitions/${this.key}/seasons/current/matches?from=${dateFrom}&fallback=true`
      const AxiosInstance = axios.create();

      const matches = (await AxiosInstance.get<FupaGamedayModel>(url)).data;

      for (const match of matches) {
        const item: MatchModel = {
          home: removeUmlaute(match.homeTeam.name.full),
          guest: removeUmlaute(match.awayTeam.name.full),
          time: match.kickoff,
          logoGuest: IMAGE_PATH + '/' + getCleanedFileName(match.awayTeam.name.full, 'png'),
          logoHome: IMAGE_PATH + '/' + getCleanedFileName(match.homeTeam.name.full, 'png')
        };
        await downloadImage(`${match.homeTeam.image.path}/100x100.png`, item.logoHome)
        await downloadImage(`${match.awayTeam.image.path}/100x100.png`, item.logoGuest)

        const dateIsWithinInterval = isWithinInterval(new Date(item.time),
          { start: new Date(), end: addWeeks(new Date(),1) })
          
        if (dateIsWithinInterval) {
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
      logoGuest: HEADER + '',
      guest: HEADER + 'Gast'
    }
  }

  public transform(): MatchModel[]{
    const transformedResult: MatchModel[] = []
    transformedResult.push(this.createHeaderRow())
    for (const item of this.result) {
      transformedResult.push({
        time: TEXT + format(item.time, "dd.MM.yyyy HH:mm"),
        logoHome: IMAGE + item.logoHome,
        home: TEXT + item.home,
        logoGuest: item.guest.toLowerCase() === "spielfrei" ? TEXT : IMAGE + item.logoGuest,
        guest: TEXT + item.guest
      })
    }
    return transformedResult
  }
}
