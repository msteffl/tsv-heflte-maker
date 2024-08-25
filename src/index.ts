import { FupaStatistics } from "./fupa-statistics";
import { Parser } from "json2csv";
import { FupaTable } from "./fupa-table";
import Path from "path";
import Fs from "fs";
import { FussballdeMatches } from "./fussballde-matches";
import { FupaSpielplanSingle } from "./fupa-spielplan-single";
import { GamedayService } from "./gameday.service";
import { FussballdeTorjaeger } from "./fussballde-torjaeger";
import { FupaGamedayModel } from "./models/fupa-gameday.model";
import { FupaGameday } from "./fupa-gamdeday";

export const IMAGE_PATH = __dirname + "/images";
export const OUTPUT_PATH = __dirname + "/output";

run()

async function run() {
  const csvOptions = {
    delimiter: "|",
    header: false,
    quote: "",
  };

  if(!Fs.existsSync(OUTPUT_PATH)) {
    Fs.mkdirSync(OUTPUT_PATH);
  }

  if(!Fs.existsSync(IMAGE_PATH)) {
    Fs.mkdirSync(IMAGE_PATH);
  }

  const gameDayService = new GamedayService();

  console.log("Generating Gameday...");
  const fupaGameday: FupaGameday = new FupaGameday("erste");
  const gamedayErste = await fupaGameday.create()
  const gamedayErsteParser = new Parser(csvOptions);
  const gamedayErsteCsv = gamedayErsteParser.parse(gamedayErste);
  const gamedayErstePath = OUTPUT_PATH + "/ErsteBegegnungen.txt";
  Fs.writeFileSync(gamedayErstePath, gamedayErsteCsv);

  const fupaGamedayZweite: FupaGameday = new FupaGameday("zweite");
  const gamedayZweite = await fupaGamedayZweite.create()
  const gamedayZweiteParser = new Parser(csvOptions);
  const gamedayZweiteCsv = gamedayZweiteParser.parse(gamedayZweite);
  const gamedayZweitePath = OUTPUT_PATH + "/ZweiteBegegnungen.txt";
  Fs.writeFileSync(gamedayZweitePath, gamedayZweiteCsv);

  console.log("Generating Spielplan...");

  const fupaSpielplanErste: FupaSpielplanSingle = new FupaSpielplanSingle("erste");
  const spielplanErste = await fupaSpielplanErste.create()
  const parserErste = new Parser(csvOptions);
  const csvErste = parserErste.parse(spielplanErste);
  const pathErste = OUTPUT_PATH + "/ErsteSpielplan.txt";
  Fs.writeFileSync(pathErste, csvErste);

  const fupaSpielplanZweite: FupaSpielplanSingle = new FupaSpielplanSingle("zweite");
  const spielplanZweite = await fupaSpielplanZweite.create()
  const parserZweite = new Parser(csvOptions);
  const csvZweite = parserZweite.parse(spielplanZweite);
  const pathZweite = OUTPUT_PATH + "/ZweiteSpielplan.txt";
  Fs.writeFileSync(pathZweite, csvZweite);

  // console.log(
  //   gameDayService.gamedayNumber,
  //   gameDayService.timeErste,
  //   gameDayService.timeZweite
  // );

  console.log("Generating Statistics...");

  const fupaStatsErste: FupaStatistics = new FupaStatistics("erste");
  const statErste = await fupaStatsErste.create()
  const statErsteParser = new Parser(csvOptions);
  const statErsteCsv = statErsteParser.parse(statErste);
  const statErstePath = OUTPUT_PATH + "/ErsteStatistik.txt";
  Fs.writeFileSync(statErstePath, statErsteCsv);

  const fupaStatsZweite: FupaStatistics = new FupaStatistics("zweite");
  const statZweite = await fupaStatsZweite.create()
  const statZweiteParser = new Parser(csvOptions);
  const statZweiteCsv = statZweiteParser.parse(statZweite);
  const statZweitePath = OUTPUT_PATH + "/ZweiteStatistik.txt";
  Fs.writeFileSync(statZweitePath, statZweiteCsv);

  console.log("Generating Table...");

  const fupaTableErste = new FupaTable("erste");
  const tableErste = await fupaTableErste.create()
  const tableErsteParser = new Parser(csvOptions);
  const tableErsteCsv = tableErsteParser.parse(tableErste);
  const tableErstePath = OUTPUT_PATH + "/ErsteTabelle.txt";
  Fs.writeFileSync(tableErstePath, tableErsteCsv);

  const fupaTableZweite = new FupaTable("zweite");
  const tableZweite = await fupaTableZweite.create()
  const tableZweiteParser = new Parser(csvOptions);
  const tableZweiteCsv = tableZweiteParser.parse(tableZweite);
  const tableZweitePath = OUTPUT_PATH + "/ZweiteTabelle.txt";
  Fs.writeFileSync(tableZweitePath, tableZweiteCsv);

  console.log("Generating Matches...");

  // const fussballdeMatchesErste: FussballdeMatches = new FussballdeMatches(
  //   "erste",
  //   gameDayService.gamedayNumber,
  //   gameDayService.timeErste
  // );
  // const matchesErste = await fussballdeMatchesErste.create()
  // const matchesErsteParser = new Parser(csvOptions);
  // const matchesErsteCsv = matchesErsteParser.parse(matchesErste);
  // const matchesErstePath = OUTPUT_PATH + "/ErsteBegegnungen.txt";
  // Fs.writeFileSync(matchesErstePath, matchesErsteCsv);

  // const fussballdeMatchesZweite: FussballdeMatches = new FussballdeMatches(
  //   "zweite",
  //   gameDayService.gamedayNumber,
  //   gameDayService.timeZweite
  // );
  // const matchesZweite = await fussballdeMatchesZweite.create()
  // const matchesZweiteParser = new Parser(csvOptions);
  // const matchesZweiteCsv = matchesZweiteParser.parse(matchesZweite);
  // const matchesZweitePath = OUTPUT_PATH + "/ZweiteBegegnungen.txt";
  // Fs.writeFileSync(matchesZweitePath, matchesZweiteCsv);

  console.log("Generating Torjäger...")

  const fussballdeTorjaeger = new FussballdeTorjaeger("erste");
  const torjaegerErste = await  fussballdeTorjaeger.create()
  const torjaegerErsteParser = new Parser(csvOptions);
  const torjaegerErsteCsv = torjaegerErsteParser.parse(torjaegerErste);
  const torjaegerErstePath = OUTPUT_PATH + "/ErsteTorjaeger.txt";
  Fs.writeFileSync(torjaegerErstePath, torjaegerErsteCsv);

  console.log("Done!!");
};
