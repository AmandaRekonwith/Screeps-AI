var controllerBrain = require('Controllers_BrainController');

module.exports.loop = function ()
{
    controllerBrain.processStimuli();
    controllerBrain.takeAction();

    var towers = Game.spawns.Caffeine.room.find(FIND_MY_STRUCTURES,
        { filter: (structure) => { return (structure.structureType == STRUCTURE_TOWER)}});


    var tower = towers[0];

    var hostiles = Game.spawns.Caffeine.room.find(FIND_HOSTILE_CREEPS);

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile != null)
    {
        towers[0].attack(hostiles[0]);
        towers[1].attack(hostiles[0]);
    }
    else
    {
        closestDamagedStructure =  tower.pos.findClosestByRange(FIND_MY_STRUCTURES,
            { filter: (structure) => { return (structure.hits < structure.hitMax)}});
        if(closestDamagedStructure != null)
        {
            tower.repair(closestDamagedStructure);
        }
    }


}