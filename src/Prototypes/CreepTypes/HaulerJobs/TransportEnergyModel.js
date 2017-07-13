let HaulerJobTransportEnergyModel =
{
	run: function(creep)
	{
		let room = creep.room;
		let jobIndex = creep.memory.jobIndex;
		let jobType = "hauler";
		let job = room.memory.jobs.haulerJobBoard.jobs[jobIndex];
		let currentTask = creep.memory.currentTask;
		let container = Game.getObjectById(jobIndex);
		let storageArray = room.memory.structures.storageArray;

		room.memory.jobs.haulerJobBoard.jobs[jobIndex].creep = creep;
		room.memory.jobs.haulerJobBoard.jobs[jobIndex].active = true;

		if (creep.carry.energy < creep.carryCapacity &&
			(creep.memory.currentTask == "WalkingToEnergySource" || creep.memory.currentTask == "Harvesting"))
		{
			let action = creep.withdraw(container, RESOURCE_ENERGY);

			if (action == ERR_NOT_IN_RANGE)
			{
				creep.moveTo(container.pos.x, container.pos.y, {visualizePathStyle: {stroke: '#ffaa00'}});
				creep.memory.currentTask = "WalkingToEnergySource";
			}
			else
			{
				creep.memory.currentTask = "Harvesting";
			}
		}
		else
		{
			if (creep.carry.energy == creep.carryCapacity && creep.memory.currentTask == "Harvesting")
			{
				creep.memory.currentTask = "DoneHarvesting";
				creep.memory.currentTask = "WalkingToStorage";
			}

			if (creep.memory.currentTask == "WalkingToStorage" || creep.memory.curentTask == "Transferring")
			{
				let action = creep.transfer(target, RESOURCE_ENERGY);

				if (action == ERR_NOT_IN_RANGE)
				{
					creep.memory.currentTask = "WalkingToStorage";
					creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
				}
				else
				{
					creep.memory.currentTask = "Transferring";
					if (creep.carry.energy == 0)
					{
						creep.memory.currentTask = "WalkingToEnergySource";
					}
				}
			}
		}
	}
}

module.exports = HaulerJobTransportEnergyModel;