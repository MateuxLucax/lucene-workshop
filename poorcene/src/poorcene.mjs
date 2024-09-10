import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import stemmer from "./stemmer.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.join(__dirname, "../assets");

export class Poorcene {
  constructor() {
    this.index = {};
    this.words = [];
    this.loadFromFile();
  }

  /**
   * Index a word in the list.
   * 1. Add the word to the list.
   * 2. Stem the word.
   * 3. Add the word index to the index.
   * 
   * @param {string} word - The word to be indexed.
   * 
   * @returns {void}
   */
  indexWord(word) {
    console.time("elapsed");
    this.words.push(word);
    const stemmedWord = stemmer(word);

    if (!this.index[stemmedWord]) {
      this.index[stemmedWord] = [];
    }

    this.index[stemmedWord].push(this.words.length - 1);
    console.timeEnd("elapsed");
  }

  /**
   * Find the index of a word in the list.
   * 
   * @param {string} word - The word to be found.
   * 
   * @returns {Array} The index of the word.
   */
  findWordIndex(word) {
    console.time("elapsed");
    const stemmedWord = stemmer(word);

    if (!this.index[stemmedWord]) {
      return [];
    }

    const result = this.index[stemmedWord].map((index) => this.words[index]);
    console.timeEnd("elapsed");
    return result;
  }

  loadBrText() {
    const filePath = path.join(ASSETS_DIR, "br-utf8.txt");
    if (!fs.existsSync(filePath)) return;

    const data = fs.readFileSync(filePath, "utf8");
    const words = data.split("\n");
    for (const word of words) {
      this.indexWord(word);
    }
    this.storeInFile();
  }

  storeInFile() {
    const indexPath = path.join(ASSETS_DIR, "index.json");
    const wordsPath = path.join(ASSETS_DIR, "words.json");

    fs.writeFileSync(indexPath, JSON.stringify(this.index));
    fs.writeFileSync(wordsPath, JSON.stringify(this.words));
  }

  loadFromFile() {
    const indexPath = path.join(ASSETS_DIR, "index.json");
    const wordsPath = path.join(ASSETS_DIR, "words.json");

    if (!fs.existsSync(indexPath) || !fs.existsSync(wordsPath)) return;

    console.time("index");
    const index = fs.readFileSync(indexPath);
    this.index = JSON.parse(index);
    console.timeEnd("index");

    console.time("words");
    const words = fs.readFileSync(wordsPath);
    this.words = JSON.parse(words);
    console.timeEnd("words");
  }
}