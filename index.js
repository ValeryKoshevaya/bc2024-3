// index.js

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// Функція для перевірки існування файлу
const checkFileExists = (filePath) => {
    return fs.existsSync(filePath);
};

// Обробка аргументів командного рядка
program
    .requiredOption('-i, --input <path>', 'шлях до файлу для читання (JSON)')
    .option('-o, --output <path>', 'шлях до файлу для запису результату')
    .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);

// Отримуємо значення параметрів
const options = program.opts();

// Перевірка наявності обов'язкового параметра
if (!options.input) {
    console.error("Please, specify input file");
    process.exit(1);
}

// Перевірка, чи існує файл
const inputFilePath = path.resolve(options.input);
if (!checkFileExists(inputFilePath)) {
    console.error("Cannot find input file");
    process.exit(1);
}

// Читання даних з JSON файлу
let jsonData;
try {
    const rawData = fs.readFileSync(inputFilePath);
    jsonData = JSON.parse(rawData);
} catch (error) {
    console.error("Error reading or parsing input file:", error.message);
    process.exit(1);
}

// Логіка для отримання максимального курсу
let maxRate = -Infinity;
for (const currency of jsonData) {
    const rate = parseFloat(currency.rate);
    if (rate > maxRate) {
        maxRate = rate;
    }
}

// Форматування результату
const result = `Максимальний курс: ${maxRate}`;

// Виведення результату у консоль або запис у файл
if (options.display) {
    console.log(result);
}

if (options.output) {
    fs.writeFileSync(options.output, result);
}
