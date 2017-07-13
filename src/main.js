var controllerBrain = require('Controllers_BrainController');

module.exports.loop = function ()
{
    controllerBrain.processStimuli();
    controllerBrain.takeAction();
}