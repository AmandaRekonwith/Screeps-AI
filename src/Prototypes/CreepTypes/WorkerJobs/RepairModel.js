/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
let roleUpgrader = require('controller_upgrader');

let WorkerJobSupplyExtensionModel = {

    /** @param {Creep} creep **/
    run: function(creep)
    {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

        if ( (creep.carry.energy < creep.carryCapacity)
            && ((creep.memory.currentTask == "WalkingToEnergySource") || (creep.memory.currentTask == "Harvesting")) )
        {
            let action = creep.harvest(source);

            if (action == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.memory.currentTask = "WalkingToEnergySource";
            }
            else
            {
                creep.memory.currentTask = "Harvesting";
            }
        }

        if(creep.carry.energy == creep.carryCapacity && creep.memory.currentTask == "Harvesting")
        {
            creep.memory.currentTask = "DoneHarvesting";
            creep.memory.currentTask = "WalkingToStructure";
        }

        if( (creep.memory.currentTask == "WalkingToStructure")
            || (creep.memory.currentTask == "Repairing")
            || (creep.memory.currentTask == "Upgrading")
            || (creep.memory.currentTask == "Transferring")
            || (creep.memory.currentTask == "Building"))
        {
            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s)=> s.hits < s.hitsMax && s.structureType && (((s.hits / s.hitsMax) * 100) < 85) && s.structureType != STRUCTURE_WALL
            });

            if(!structure)
            {
                let action = creep.repair(structure);
                if (action == ERR_NOT_IN_RANGE)
                {
                    creep.memory.currentTask = "WalkingToStructure";
                    creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else
                {
                    if (creep.carry.energy == 0)
                    {
                        creep.memory.currentTask = "WalkingToEnergySource";
                    }
                    else
                    {
                        creep.memory.currentTask = "Repairing";
                        if(((structure.hits /structure.hitsMax) * 100) > 98)
                        {
                            structure = null;
                        }
                    }
                }
            }
            else
            {
                roleUpgrader.run(creep);
            }
        }
    }
};

module.exports = roleRepairer;