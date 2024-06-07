const fs = require("fs");
const path = require("path");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });
let coinSide;
let currentLogFilePath;

const LOG_FOLDER_PATH = path.join(__dirname, "logs");

const getRandomCoinSide = () => (Math.random() > 0.5 ? "1" : "0");

const startGame = () => {
  coinSide = getRandomCoinSide();
  rl.question("Начнем игру! Орел(1) или решка(0)? ", (answer) => {
    checkAnswer(answer);
  });
};

const askQuestion = () => {
  coinSide = getRandomCoinSide();
  rl.question(
    "Давай еще раз? Орел(1) или решка(0)? Если надоело, введи 'стоп'. ",
    (answer) => {
      checkAnswer(answer);
    }
  );
};

const isFileExists = (fileName) => {
  return fs.existsSync(`${LOG_FOLDER_PATH}/${fileName}.txt`);
};

const addRecordToLogFile = (win) => {
  const resultRecord =
    new Date().toISOString() + (win ? ": Победа" : ": Проигрыш") + "\n";
  fs.appendFile(currentLogFilePath, resultRecord, (error) => {
    if (error) throw new Error(error);
  });
};

const createLogFile = () => {
  rl.question(
    "Для начала игры напиши название файла для логирования результатов игры. ",
    (answer) => {
      if (typeof answer === "string" && answer !== "") {
        if (isFileExists(answer)) {
          console.log("Файл с таким именем уже существует.");
          createLogFile();
          return;
        }
        currentLogFilePath = path.join(LOG_FOLDER_PATH, `${answer}.txt`);
        const initRecord = new Date().toISOString() + ": Файл создан. \n";
        fs.writeFile(currentLogFilePath, initRecord, (error) => {
          if (error) throw new Error(error);
        });
        startGame();
        return;
      } else {
        console.log("Некоректный ввод");
        createLogFile();
        return;
      }
    }
  );
};

const checkRightAnswer = (answer) => {
  if (answer === coinSide) {
    console.log("Угадал!");
    addRecordToLogFile(true);
  } else {
    console.log("Не угадал!");
    addRecordToLogFile(false);
  }
  askQuestion();
};

const checkAnswer = (answer) => {
  if (answer === "стоп") {
    console.log("До свидания!", "\n");
    rl.close();
    return;
  }
  if (answer.toLowerCase() === "1" || answer.toLowerCase() === "0") {
    checkRightAnswer(answer);
    return;
  } else {
    console.log("Некоректный ввод");
    rl.question(
      "Орел(1) или решка(0)? Если надоело, введи 'стоп'. ",
      (answer) => {
        checkAnswer(answer);
      }
    );
    return;
  }
};

createLogFile();
