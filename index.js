const fs = require('fs'); // Модуль для роботи з файловою системою
const path = require('path'); // Модуль для роботи з файлами
const { Command } = require('commander'); // Модуль для обробки командного рядка

const program = new Command();

program
  .option('-i, --input <path>', 'шлях до файлу для читання')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

try {
  const data = fs.readFileSync(options.input, 'utf-8');
  const jsonData = JSON.parse(data);
  
  const rates = jsonData.map(item => item.rate);
  const maxRate = Math.max(...rates);

  const result = `Максимальний курс: ${maxRate}`;

  if (options.display) {
    console.log(result);
  }

  if (options.output) {
    fs.writeFileSync(options.output, result, 'utf-8');
  }

} catch (error) {
  console.error('Error reading or processing the file:', error);
}
