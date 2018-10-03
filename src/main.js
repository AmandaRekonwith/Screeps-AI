var statsController = require('Controllers_Stats_StatsController');
//(var statsController2 = require('Controllers_Stats_StatsController2');
var brainController = require('Controllers_BrainController');
//require('Libraries_XMLHttpRequest');
//let require'http://www.google.com/');


module.exports.loop = function ()
{
    //test

    //var http = require('http');

    brainController.processStimuli();
    brainController.takeAction();

    for (let roomName in Game.rooms)
    {
        let stats = statsController.collectStats(roomName);
    }
}