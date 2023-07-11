const chalk = require("chalk");
const fs = require("node:fs");
const { format } = require("date-fns");

async function info(str) {
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }
    fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Shiru] [INFO]: ${str}\n`, (err) => {
        if (err) throw err;
    });
    console.info(chalk.cyan(`[Shiru] ${chalk.bold("INFO:")} ${str}`));
}

async function warn(str) {
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }
    fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Shiru] [WARN]: ${str}\n`, (err) => {
        if (err) throw err;
    });
    console.warn(chalk.yellow(`[Shiru] ${chalk.bold("WARNING:")} ${str}`));
}

async function error(str) {
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }
    fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Shiru] [ERROR]: ${str}\n`, (err) => {
        if (err) throw err;
    });
    console.error(chalk.red(`[Shiru] ${chalk.bold("ERROR:")} ${str}`));
}

async function success(str) {
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }
    fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Shiru] [SUCCESS]: ${str}\n`, (err) => {
        if (err) throw err;
    });
    console.info(chalk.green(`[Shiru] ${chalk.bold("SUCCESS:")} ${str}`));
}

module.exports = {
    info,
    warn,
    error,
    success,
};
