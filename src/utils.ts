import Path from "path";
import Fs from "fs";
import axios from "axios";
import { IMAGE_PATH } from ".";

export const TEXT = "text#";
export const IMAGE = "img#";
export const HEADER = "hdr#";

export async function downloadImage(url: string, fileName: string) {
  const path = Path.resolve(IMAGE_PATH, fileName);
  if (!Fs.existsSync(path)) {
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
}

export function getCleanedFileName(fileName: string) {
  return fileName
    .replace("/", "-")
    .replace(" ", "")
    .replace(" ", "")
    .trim()
    .toLowerCase() + ".jpg";
}

