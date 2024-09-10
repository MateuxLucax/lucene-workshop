import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import stemmer from "./stemmer.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.join(__dirname, "../assets");

export class List {
  constructor() {
    this.list = [];
    this.loadFromFile();
  }

  add(word) {
    console.time("elapsed");
    this.list.push(word);
    console.timeEnd("elapsed");
  }

  query(word) {
    console.time("elapsed");
    const result = this.list.filter((item) => item === word);
    console.timeEnd("elapsed");

    return result;
  }

  loadBrText() {
    const filePath = path.join(ASSETS_DIR, "br-utf8.txt");
    if (!fs.existsSync(filePath)) return;

    const data = fs.readFileSync(filePath, "utf8");
    const words = data.split("\n");
    for (const word of words) {
      this.add(word);
    }
    this.storeInFile();
  }

  /**
   * Query the list with a stemmer.
   * 
   * @param {string} word - The word to be queried.
   * 
   * @returns {Array} The list of words.
   */
  queryWithStemmer(word) {
    console.time("elapsed");
    const result = this.list.filter((item) => stemmer(item) === stemmer(word));
    console.timeEnd("elapsed");

    return result;
  }

  storeInFile() {
    const listPath = path.join(ASSETS_DIR, "list.json");
    fs.writeFileSync(listPath, JSON.stringify(this.list));
  }

  loadFromFile() {
    const listPath = path.join(ASSETS_DIR, "list.json");
    if (!fs.existsSync(listPath)) return;

    console.time("list");
    const list = fs.readFileSync(listPath);
    if (list) this.list = JSON.parse(list);
    console.timeEnd("list");
  }
}
