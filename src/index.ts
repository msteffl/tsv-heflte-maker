import { FupaStatistics } from "./fupa-statistics"
import { Parser } from "json2csv"
import { FupaTable } from "./fupa-table"
import Path from "path";
import Fs from "fs";

export const IMAGE_PATH = __dirname + "/images"
export const OUTPUT_PATH = __dirname + "/output"

const csvOptions = {
  delimiter: "|",
  header: false
}


const fupaStats: FupaStatistics = new FupaStatistics([{team: 'erste', type: 'statistik', 'url': 'https://fussball.de'}])


const stats = fupaStats.get().then(data => {
  const parser = new Parser()
  const csv = parser.parse(data)
  console.log(csv)
})

const fupaTable = new FupaTable()

const table = fupaTable.create().then(data => {
  const output = fupaTable.transform()
  const parser = new Parser(csvOptions)
  const csv = parser.parse(output)
  const path = OUTPUT_PATH + '/ErsteTabelle.txt'
  Fs.writeFileSync(path, csv)
})