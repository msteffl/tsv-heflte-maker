import { FupaStatistics } from "./fupa-statistics"
import { Parser } from "json2csv"
import { FupaTable } from "./fupa-table"
import Path from "path";
import Fs from "fs";
import { FussballdeMatches } from "./fussballde-matches";
import { FupaSpielplan } from "./fupa-spielplan";
import { GamedayService } from "./gameday.service";

export const IMAGE_PATH = __dirname + "/images"
export const OUTPUT_PATH = __dirname + "/output"

const csvOptions = {
  delimiter: "|",
  header: false,
  quote: ''
}

const gameDayService = new GamedayService()

const fupaSpielplan: FupaSpielplan = new FupaSpielplan()
fupaSpielplan.createComplete().then(data => {
  const parser = new Parser(csvOptions)
  const csv = parser.parse(data)
  const path = OUTPUT_PATH + '/Spielplan.txt'
  Fs.writeFileSync(path, csv)
})

const fupaStatsErste: FupaStatistics = new FupaStatistics('erste')
fupaStatsErste.create().then(data => {
  const parser = new Parser(csvOptions)
  const csv = parser.parse(data)
  const path = OUTPUT_PATH + '/ErsteStatistik.txt'
  Fs.writeFileSync(path, csv)
})

const fupaStatsZweite: FupaStatistics = new FupaStatistics('zweite')
fupaStatsZweite.create().then(data => {
  const parser = new Parser(csvOptions)
  const csv = parser.parse(data)
  const path = OUTPUT_PATH + '/ZweiteStatistik.txt'
  Fs.writeFileSync(path, csv)
})

const fupaTableErste = new FupaTable('erste')
fupaTableErste.create().then(data => {
  const parser = new Parser(csvOptions)
  const csv = parser.parse(data)
  const path = OUTPUT_PATH + '/ErsteTabelle.txt'
  Fs.writeFileSync(path, csv)
})

const fupaTableZweite = new FupaTable('zweite')
fupaTableZweite.create().then(data => {
  const parser = new Parser(csvOptions)
  const csv = parser.parse(data)
  const path = OUTPUT_PATH + '/ZweiteTabelle.txt'
  Fs.writeFileSync(path, csv)
})

const fussballdeMatchesErste: FussballdeMatches = new FussballdeMatches('erste', 16, "15:00")
fussballdeMatchesErste.create().then(data => {
  const parser = new Parser(csvOptions)
  const csv = parser.parse(data)
  const path = OUTPUT_PATH + '/ErsteBegegnungen.txt'
  Fs.writeFileSync(path, csv)
})

const fussballdeMatchesZweite: FussballdeMatches = new FussballdeMatches('zweite', 16, "13:00")
fussballdeMatchesZweite.create().then(data => {
  const parser = new Parser(csvOptions)
  const csv = parser.parse(data)
  const path = OUTPUT_PATH + '/ZweiteBegegnungen.txt'
  Fs.writeFileSync(path, csv)
})