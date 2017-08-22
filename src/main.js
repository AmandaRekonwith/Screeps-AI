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

            let target = null;
            let maximumHealCount = 0;

            if(closestHostile != null)
            {
                let hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
                let hostileCreepsCount = hostileCreeps.length;

                for(let y=0; y<hostileCreepsCount; y++)
                {
                    let hostileCreep = hostileCreeps[y];

                    let hostileCreepBodyParts = hostileCreep.body;
                    let hostileCreepBodyPartsCount = hostileCreepBodyParts.length;

                    let healCount = 0;

                    for (let z=0; z < hostileCreepBodyPartsCount; z++)
                    {
                        hostileCreepBodyPart = hostileCreepBodyParts[z];

                        if (hostileCreepBodyPart.type == "heal")
                        {
                            healCount += 1;

                            target = hostileCreep;
                        }
                    }

                    if(healCount > maximumHealCount)
                    {
                        maximumHealCount = healCount;
                    }
                }

                console.log(maximumHealCount);
                if(maximumHealCount < 3 * towersCount)
                {
                    if (target != null)
                    {
                        tower.attack(target);
                    }
                    else
                    {
                        tower.attack(closestHostile);
                    }
                }
                else
                {
                    //repair whatever wall the fucks are attacking

                }
            }
            else
            {
                let creepsArray = room.find(FIND_MY_CREEPS);
                let creepsCount = creepsArray.length;

                let damagedCreep = null;

                for(z=0; z<creepsCount; z++)
                {
                    if(creepsArray[z].hits < creepsArray[z].hitsMax )
                    {
                        damagedCreep = creepsArray[z];
                    }
                }

                if(damagedCreep != null)
                {
                    tower.heal(damagedCreep);
                }
                else
                {
                    if (room.storage.store[RESOURCE_ENERGY] > 900000)
                    {
                        tower.repair(room.memory.structures.rampartsArray[0]);
                    }
                }
            }
        }
    }

    for (let roomName in Game.rooms)
    {
        let stats = statsController.collectStats(roomName);
    }
}