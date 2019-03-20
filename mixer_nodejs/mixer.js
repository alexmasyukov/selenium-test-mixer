const fs = require('fs');
const utils = require('./utils');
// const argv = require("yargs").argv;
// console.log(`f ${argv.f}`);
// let includeAuth = process.argv[0];

const auth = JSON.parse(fs.readFileSync("source_tests/auth.side", "utf8")),
    genVariables = JSON.parse(fs.readFileSync("source_tests/generate_variables.side", "utf8")),
    standartFieldsCommands = JSON.parse(fs.readFileSync("source_tests/standart_fields.side", "utf8"));
    testsOfCategories = JSON.parse(fs.readFileSync("source_tests/categories.side", "utf8"));


const authCommands = [...auth.tests[0].commands],
    variablesCommands = [...genVariables.tests[0].commands],
    standartFilelds = [...standartFieldsCommands.tests[0].commands];


// Установки для параллельных тестов
const defaultSuite = testsOfCategories.suites[0];
defaultSuite.timeout = 5000;
defaultSuite.parallel = true;
defaultSuite.tests = [];


let categoryCommandsWithPauses = [];
for (let test of testsOfCategories.tests) {
    // Выключаем команду Open из тела теста
    // test = utils.disableOpenCommand(test);

    // Проставляем паузы для действий связанных с выбором категорий
    // (они асинхронны, им нужно время на загрузку)
    categoryCommandsWithPauses = utils.includePauses(test);

    // Добавляем команды в каждый тест
    test.commands = [...authCommands,
        ...variablesCommands,
        ...categoryCommandsWithPauses,
        ...standartFilelds];

    // Добавляем текущий тест в раздел Параллельного тестирования
    defaultSuite.tests.push(test.id);
}

// const formattedData = JSON.stringify(testsOfCategories.tests[3].commands, null, 2);
const formattedData = JSON.stringify(testsOfCategories, null, 2);
fs.writeFile('test_with_auth.side', formattedData, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});



