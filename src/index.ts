import { FupaStatistics } from "./fupa-statistics";
import { Parser } from "json2csv";
import { FupaTable } from "./fupa-table";
import Path from "path";
import Fs from "fs";
import { FussballdeMatches } from "./fussballde-matches";
import { FupaSpielplan } from "./fupa-spielplan";
import { GamedayService } from "./gameday.service";

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

  console.log("Generating Spielplan...");

  const fupaSpielplan: FupaSpielplan = new FupaSpielplan(gameDayService);
  const spielplan = await fupaSpielplan.createComplete()
  const parser = new Parser(csvOptions);
  const csv = parser.parse(spielplan);
  const path = OUTPUT_PATH + "/Spielplan.txt";
  Fs.writeFileSync(path, csv);

  console.log(
    gameDayService.gamedayNumber,
    gameDayService.timeErste,
    gameDayService.timeZweite
  );

  console.log("Generating Statistics...");

  const fupaStatsErste: FupaStatistics = new FupaStatistics("erste");
  fupaStatsErste.create().then((data) => {
    const parser = new Parser(csvOptions);
    const csv = parser.parse(data);
    const path = OUTPUT_PATH + "/ErsteStatistik.txt";
    Fs.writeFileSync(path, csv);
  });

  const fupaStatsZweite: FupaStatistics = new FupaStatistics("zweite");
  fupaStatsZweite.create().then((data) => {
    const parser = new Parser(csvOptions);
    const csv = parser.parse(data);
    const path = OUTPUT_PATH + "/ZweiteStatistik.txt";
    Fs.writeFileSync(path, csv);
  });

  console.log("Generating Table...");

  const fupaTableErste = new FupaTable("erste");
  fupaTableErste.create().then((data) => {
    const parser = new Parser(csvOptions);
    const csv = parser.parse(data);
    const path = OUTPUT_PATH + "/ErsteTabelle.txt";
    Fs.writeFileSync(path, csv);
  });

  const fupaTableZweite = new FupaTable("zweite");
  fupaTableZweite.create().then((data) => {
    const parser = new Parser(csvOptions);
    const csv = parser.parse(data);
    const path = OUTPUT_PATH + "/ZweiteTabelle.txt";
    Fs.writeFileSync(path, csv);
  });

  console.log("Generating Matches...");

  const fussballdeMatchesErste: FussballdeMatches = new FussballdeMatches(
    "erste",
    gameDayService.gamedayNumber,
    gameDayService.timeErste
  );
  fussballdeMatchesErste.create().then((data) => {
    const parser = new Parser(csvOptions);
    const csv = parser.parse(data);
    const path = OUTPUT_PATH + "/ErsteBegegnungen.txt";
    Fs.writeFileSync(path, csv);
  });

  const fussballdeMatchesZweite: FussballdeMatches = new FussballdeMatches(
    "zweite",
    gameDayService.gamedayNumber,
    gameDayService.timeZweite
  );
  fussballdeMatchesZweite.create().then((data) => {
    const parser = new Parser(csvOptions);
    const csv = parser.parse(data);
    const path = OUTPUT_PATH + "/ZweiteBegegnungen.txt";
    Fs.writeFileSync(path, csv);
  });

  console.log("Done!!");
};
