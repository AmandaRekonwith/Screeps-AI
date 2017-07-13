let roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep)
    {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

        if (creep.carry.energy < creep.carryCapacity &&
            (creep.memory.currentTask == "WalkingToEnergySource" || creep.memory.currentTask == "Harvesting"))
        {
            let action = creep.harvest(source);

            if (action == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.memory.currentTask = "WalkingToEnergySource";
            }
            else {
                creep.memory.currentTask = "Harvesting";
            }
        }

        if (creep.carry.energy == creep.carryCapacity && creep.memory.currentTask == "Harvesting") {
            creep.memory.currentTask = "DoneHarvesting";
            creep.memory.currentTask = "WalkingToController";
        }


        if ((creep.memory.currentTask == "WalkingToStructure") ||
            (creep.memory.currentTask == "WalkingToController") ||
            (creep.memory.currentTask == "Building") ||
            (creep.memory.currentTask == "Upgrading") ||
            (creep.memory.currentTask == "Repairing") ||
            (creep.memory.currentTask == "Transferring"))
        {



            action = creep.upgradeController(creep.room.controller);
            if (action == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            else
            {
                creep.upgradeController(creep.room.controller);
                creep.memory.currentTask = "Upgrading";

                if (creep.carry.energy == 0)
                {
                    creep.memory.currentTask = "WalkingToEnergySource";
                }
            }
        }
    }
};

module.exports = roleUpgrader;