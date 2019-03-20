const uuidv4 = require('uuid/v4');
const objModels = require('./models/objModels');


module.exports.disableOpenCommand = function(test) {
    const openCommand = test.commands.find(action => action.command === 'open');
    openCommand.command = '//' + openCommand.command;
    return test;
};


module.exports.includePauses = function (test) {
    let result = [];
    let prevCommad = '';

    for (let action of test.commands) {
        result.push(action);

        if (action.target === 'css=.j-cat-select-link > span' && action.command === 'click' && prevCommad === ''
            || prevCommad === 'click' && action.command === 'click' && action.target.includes('css=')) {

            let pauseModel = Object.assign({}, objModels.models.pauseModel);
            pauseModel.id = uuidv4();
            result.push(pauseModel);
            prevCommad = action.command;
        } else {
            prevCommad = '';
        }
    }

    return result;
};