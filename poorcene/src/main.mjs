import readline from "node:readline";
import { Poorcene } from "./poorcene.mjs";
import { List } from "./list.mjs";

const poorcene = new Poorcene();
const list = new List();

const readliner = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUser() {
  readliner.question(
    "Options: \n1. Index word\n2. Query word\n3. Add brazillian words\n4. Query random word\n5. Exit\n" + '-'.repeat(20) + "\n",
    (answer) => {
      console.log('-'.repeat(20));
      switch (answer) {
        case "1":
          readliner.question("Enter a word to index: ", (word) => {
            poorcene.indexWord(word);
            console.log('-'.repeat(20));
            list.add(word);
            promptUser();
          });
          break;
        case "2":
          readliner.question("Enter a word to query: ", (word) => {
            console.log('-'.repeat(20));
            console.log(`Poorcene query: ${poorcene.findWordIndex(word).length} results`);
            console.log('-'.repeat(20));
            console.log(`List with stemmer ${list.queryWithStemmer(word).length} results`);
            console.log('-'.repeat(20));
            console.log(`List without stemmer: ${list.query(word).length} results`);
            console.log('-'.repeat(20));
            promptUser();
          });
          break;
        case "3":
          for (let i = 0; i < 10; i++) {
            console.time("elapsed");
            poorcene.loadBrText();
            list.loadBrText();
            console.timeEnd("elapsed");
          }
          promptUser();
          break;
        case "4":
          const randomIndex = Math.floor(Math.random() * list.list.length);
          const randomWord = list.list[randomIndex];
          console.log(`Random word: ${randomWord}`);
          console.log('-'.repeat(20));
          console.log(`Poorcene query: ${poorcene.findWordIndex(randomWord).length} results`);
          console.log('-'.repeat(20));
          console.log(`List with stemmer ${list.queryWithStemmer(randomWord).length} results`);
          console.log('-'.repeat(20));
          console.log(`List without stemmer: ${list.query(randomWord).length} results`);
          console.log('-'.repeat(20));
          promptUser();
          break;
        case "5":
          console.log("Exiting...");
          poorcene.storeInFile();
          list.storeInFile();
          readliner.close();
          break;
        default:
          console.log("Invalid option");
          promptUser();
          break;
      }
    }
  );
}

promptUser();
