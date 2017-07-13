let StationaryJobBargeMiningModel = {

	/** @param {Creep} creep **/
	run: function(creep)
	{
		let room = creep.room;
		let jobIndex = creep.memory.jobIndex;
		let jobType = "harvester";
		let job = room.memory.jobs.stationaryJobBoard.harvesterJobs[jobIndex];
		let energySourceIndex = job.energySourceIndex;
		let jobSitePosition = job.pos;
		let currentTask = creep.memory.currentTask;

		room.memory.jobs.stationaryJobBoard.harvesterJobs[jobIndex].creep = creep;
		room.memory.jobs.stationaryJobBoard.harvesterJobs[jobIndex].active = true;

		if ((creep.pos.x != jobSitePosition.x) || (creep.pos.y != jobSitePosition.y))
		{
			creep.moveTo(jobSitePosition.x, jobSitePosition.y, {visualizePathStyle: {stroke: '#ffaa00'}});
			creep.memory.currentTask = "WalkingToJobSite";
		}
		else
		{
			if(creep.carry.energy < creep.carryCapacity &&
				(creep.memory.currentTask == "WalkingToJobSite"
				|| creep.memory.currentTask == "Harvesting"))
			{
				creep.memory.currentTask = "Harvesting";

				let energySourceIndex = job.energySourceIndex;
				let energySourceObject = room.memory.environment.energySourcesArray[energySourceIndex];
				let energySourcePosition = energySourceObject.pos;
				let energySource = room.lookForAt(LOOK_SOURCES, energySourcePosition.x, energySourcePosition.y);

				if(energySource[0].energy == 0 || creep.carry.energy == creep.carryCapacity)
				{
					creep.memory.currentTask = "Working";
				}
				else
				{
					creep.harvest(energySource[0]);
				}
			}
			else
			{
				creep.memory.currentTask = "Working";

				let containerPositionsArray = job.containerPositionsArray;
				let positionsCount = containerPositionsArray.length;

				for(let f=0; f<positionsCount; f++)
				{
					let structureContainersArray = room.find(FIND_STRUCTURES, {
						filter: (i) => i.structureType == STRUCTURE_CONTAINER
						&& i.hits < i.hitsMax
						&& i.pos.x == containerPositionsArray[f].x  && i.pos.y == containerPositionsArray[f].y
					});

					if (structureContainersArray != '')
					{
						let action = creep.repair(structureContainersArray[0]);
					}
				}

				for(let z=0; z<positionsCount; z++)
				{
					let structureContainersArray = room.find(FIND_STRUCTURES, {
						filter: (i) => i.structureType == STRUCTURE_CONTAINER
						&& i.store[RESOURCE_ENERGY] < i.storeCapacity
						&& i.pos.x == containerPositionsArray[z].x && i.pos.y == containerPositionsArray[z].y
					});

					if(structureContainersArray != '')
					{
						let action = creep.transfer(structureContainersArray[0], RESOURCE_ENERGY);
					}
				}

				if (creep.carry.energy == 0)
				{
					creep.memory.currentTask = "Harvesting";
				}
			}
		}



		/*
		 if(creep.carry.energy == creep.carryCapacity && creep.memory.currentTask == "Harvesting")
		 {
		 creep.memory.currentTask = "DoneHarvesting";
		 }
		 */
		//let containersPositionsArray = job.containersPositionsArray;



	}
};

module.exports = StationaryJobBargeMiningModel;