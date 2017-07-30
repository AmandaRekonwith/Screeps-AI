var statsController = require('Controllers_Stats_StatsController');
//var statsController2 = require('Controllers_Stats_StatsController2');
var brainController = require('Controllers_BrainController');
//require('Libraries_XMLHttpRequest');
//let require('http://www.google.com/');


module.exports.loop = function ()
{


    //test

    //var http = require('http');

    brainController.processStimuli();
    brainController.takeAction();

    for (let roomName in Game.rooms)
    {
        let room = Game.rooms[roomName];
        let towersArray = room.memory.structures.towersArray;

        let towersCount = towersArray.length;
        for(let x=0; x<towersCount; x++)
        {
            let tower = towersArray[x];

            //var hostiles = room.find(FIND_HOSTILE_CREEPS);

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile != null)
            {
               tower.attack(closestHostile);
            }
        }
    }

    for (let roomName in Game.rooms)
    {
        let stats = statsController.collectStats(roomName);
    }
}