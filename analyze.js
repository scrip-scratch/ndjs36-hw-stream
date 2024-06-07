const fs = require("fs");
const path = require("path");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });
let coinSide;
let currentLogFilePath;

const LOG_FOLDER_PATH = path.join(__dirname, "logs");

const startAnalyze = () => {
  rl.question(
    "Давай проанализаруем результаты игры. Введи название лог-файла. ",
    (answer) => {
      checkAnswer(answer);
    }
  );
};

const isFileExists = (fileName) => {
  return fs.existsSync(`${LOG_FOLDER_PATH}/${fileName}.txt`);
};

const checkAnswer = (answer) => {
  if (isFileExists(answer)) {
    fs.readFile(`${LOG_FOLDER_PATH}/${answer}.txt`, (error, data) => {
      if (error) {
        return console.log(error);
      }
      const log = data.toString();
      const win = (log.match(/Победа/g) || []).length;
      const lose = (log.match(/Проигрыш/g) || []).length;
      const totalCount = win + lose;
      const winPercent = (win * 100) / totalCount;
      console.log("Всего игр: " + totalCount);
      console.log("Побед: " + win);
      console.log("Поражение: " + lose);
      console.log("Процент побед: " + winPercent.toFixed(0) + "%");
    });
    rl.close();
    return;
  } else {
    console.log("Файл не найден.");
    rl.question("Введи корректное название лог-файла. ", (answer) => {
      checkAnswer(answer);
    });
  }
};

startAnalyze();
