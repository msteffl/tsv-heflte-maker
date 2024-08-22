import Path from "path";
import Fs from "fs";
import axios from "axios";
import { IMAGE_PATH } from ".";

export const TEXT = "txt#";
export const IMAGE = "img#";
export const HEADER = "hdr#";

export async function downloadImage(url: string, fileName: string) {
  try {
    const path = Path.resolve(IMAGE_PATH, fileName);
    if (!Fs.existsSync(path)) {
      console.log('Download image ' + url)
      const writer = Fs.createWriteStream(path);

      const response = await axios.create()({
        url,
        method: "GET",
        responseType: "stream",
      });

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export function getCleanedFileName(fileName: string, format: string = "jpg") {
  fileName = removeUmlaute(fileName)
  return fileName
    .trim()
    .replace("\\", "-")
    .replace("/", "-")
    .replace(" ", "")
    .replace(" ", "")
    .replace(" ", "")
    .replace(" ", "")
    .substring(0,10)
    .toLowerCase() + "." + format;
}

export function removeUmlaute(text: string) {
  return text
    .replace(/\u00e4/g, "ae")
    .replace(/\u00fc/g, "ue")
    .replace(/\u00f6/g, "oe")
    .replace(/\u00df/g, "ss")
}

export function getCleanedTeamName(text: string) {
  text = removeUmlaute(text)
  return text
    .replace(/[^\w\s\\\/\-]/gi, '')
}
