/**
 * Created by Amand on 6/20/2017.
 * Rethinking how jobs are assigned and completed.
 * Eventually doing away with 'roles' in favor of assigning prioritized jobs to screeps
 */

var RoomJobsController =
{
	checkIfConstructionJobExists(constructionSite)
	{
		let room = constructionSite.room;

		if (!room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[constructionSite.id])
		{
			let job =
			{
				id: constructionSite.id
			};
			room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[constructionSite.id] = job;
		}
	},

	scanJobs: function (room)
	{
		this.scanWorkerJobs(room);
		this.scanHaulerJobs(room);
		this.scanStationaryJobs(room);
	},

	scanWorkerJobs: function (room)
	{
		this.scanWorkerSupplyExtensionJobs(room);
		this.scanWorkerSupplySpawnJobs(room);
	},

	scanWorkerSupplyExtensionJobs: function (room)
	{
		let supplyExtensionJobs = room.memory.jobs.workerJobBoard.routineJobs.supplyExtension;

		//find all empty extensions
		let extensionsArray = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) =>
			{
				return (structure.structureType == STRUCTURE_EXTENSION
				&& structure.energy < structure.energyCapacity);
			}
		});
		//generate a WORKER job for each one provided one doesn't already exist
		let extensionsCount = extensionsArray.length;

		for (let x = 0; x < extensionsCount; x++)
		{
			let extension = extensionsArray[x];

			// if the job doesn't exist, or it exists, but the job had been completed before (hence resetting the creep to null and active to false
			if (!room.memory.jobs.workerJobBoard.routineJobs.supplyExtension)
			{
				room.memory.jobs.workerJobBoard.routineJobs.supplySpawn = {};
				room.memory.jobs.workerJobBoard.routineJobs.supplyExtension = {};
			}

			if (!room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id])
			{
				room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id] = {};
				room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id].active = true;
				room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id].creep = null;
				room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id].id = extension.id;
				room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id].index = x;
			}
			else
			{
				if(room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id].active == false)
				{
					room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id].active = true;
					room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id].creep = null;
				}
			}
		}
	},

	scanWorkerSupplySpawnJobs: function (room)
	{
		//find all empty spawns
		let spawnsArray = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) =>
			{
				return (structure.structureType == STRUCTURE_SPAWN);
			}
		});
		//generate a WORKER job for each one provided one doesn't already exist
		let spawnsCount = spawnsArray.length;

		for (let x = 0; x < spawnsCount; x++)
		{
			let spawn = spawnsArray[x];
			// if the job doesn't exist, or it exists, but the job had been completed before (hence resetting the creep to null and active to false
			if (!room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id])
			{
				room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id] = {};
				room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].active = true;
				room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].creep = null;
				room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].id = spawn.id;
				room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].index = x;
			}
			else
			{
				if (spawn.energy == spawn.energyCapacity)
				{
					room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].active = false;
					room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].creep = null;
					room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].id = spawn.id;
					room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].index = x;
				}

				if (spawn.energy < spawn.energyCapacity)
				{
					if(room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].active == false)
					{
						room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].active = true;
						room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawn.id].creep = null;
					}
				}
			}
		}
	},


	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<HAULER JOBS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	scanHaulerJobs: function (room)
	{
		//create hauler jobs, based on how many storage and containers exist... will fidget with this eventually
		/*
		let storageArray = room.memory.structures.storageArray;
		let storageCount = storageArray.length;

		if (storageCount > 0)
		{
			let haulerJobs = room.memory.jobs.haulerJobBoard.jobs;

			let structureContainersArray = room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER
				&& i.store[RESOURCE_ENERGY] > 0
			});
			let structureContainersCount = structureContainersArray.length;

			for (let x = 0; x < structureContainersCount; x++)
			{
				if (!haulerJobs[structureContainersArray[x].id] || haulerJobs[structureContainersArray[x].id].creep == null)
				{
					haulerJobs[structureContainersArray[x].id].containerID = structureContainersArray[x].id;
					haulerJobs[structureContainersArray[x].id].active = false;
					haulerJobs[structureContainersArray[x].id].creep = null;
				}
			}

			room.memory.jobs.haulerJobBoard.jobs = haulerJobs;
		}
		*/
	},

	scanStationaryJobs: function (room)
	{
		//stationary harvester

		/*
		let stationaryHarvesterJobsArray = room.memory.jobs.stationaryJobBoard.harvesterJobs;
		let stationaryHarvesterJobsCount = stationaryHarvesterJobsArray.length;

		let numberOfStationaryHarvesterJobsActive = 0;
		for (let x = 0; x < stationaryHarvesterJobsCount; x++)
		{
			let stationaryHarvesterJob = stationaryHarvesterJobsArray[x];
			if (stationaryHarvesterJob.creep != null)
			{
				let creep = Game.creeps[stationaryHarvesterJob.creep.name];
				if (stationaryHarvesterJob.active == true && !creep)
				{
					room.memory.jobs.stationaryJobBoard.harvesterJobs.active = false;
					room.memory.jobs.stationaryJobBoard.harvesterJobs.creep = null;
				} //if creep died, reset job active to false
				if (stationaryHarvesterJob.active == true)
				{
					numberOfStationaryHarvesterJobsActive += 1;
				}
			}
		}*/

		/*

		 add code here to check if containers still exist, if not delete job...
		 */

		//let stationaryJobsActive = {numberOfStationaryHarvesterJobsActive: numberOfStationaryHarvesterJobsActive};
		//room.memory.stationaryJobsActive = stationaryJobsActive;

		/*
		let structuresMapArray = room.memory.jobs.stationaryJobBoard.mapArray;

		//scan for stationary harvester jobs in room
		let energySourcesArray = room.memory.environment.energySourcesArray;
		let energySourcesCount = energySourcesArray.length;
		for (let e = 0; e < energySourcesCount; e++)
		{
			let energySource = energySourcesArray[e];
			let energySourcePositionX = energySource.pos.x;
			let energySourcePositionY = energySource.pos.y;

			//harvester jobs will be detected by two containers existing 2 spaces away from the energy source
			//currently i am only searching for instances where the 2 containers are placed horizontally and vertically.

			//check two locations, map indicates what i'm looking for x is container, e energy source, j, desired job site
			//   [ ][ ][x]      [        ][       ][ x, y-2 ]
			//   [ ][j][ ]      [        ][x-1,y-1][        ]
			//   [x][ ][e]      [ x-2, y ][       ][        ]
			if (this.checkContainersPositions(room, energySourcePositionX, energySourcePositionY - 2, energySourcePositionX - 2, energySourcePositionY) == true)
			{
				if (this.checkIfStationaryHarvesterJobSiteAlreadyExists(room, energySourcePositionX - 1, energySourcePositionY - 1) == false)
				{
					this.addNewStationaryHarvesterJob(room, e, energySourcePositionX - 1, energySourcePositionY - 1, energySourcePositionX, energySourcePositionY - 2, energySourcePositionX - 2, energySourcePositionY);
				}
			}
			//check two locations, map indicates what i'm looking for x is container, e energy source, j, desired job site
			//   [x][ ][ ]      [ x, y-2 ][       ][        ]
			//   [ ][j][ ]      [        ][x+1,y-1][        ]
			//   [e][ ][x]      [        ][       ][ x+2, y ]
			else if (this.checkContainersPositions(room, energySourcePositionX, energySourcePositionY - 2, energySourcePositionX + 2, energySourcePositionY) == true)
			{
				if (this.checkIfStationaryHarvesterJobSiteAlreadyExists(room, energySourcePositionX + 1, energySourcePositionY - 1) == false)
				{
					this.addNewStationaryHarvesterJob(room, e, energySourcePositionX + 1, energySourcePositionY - 1, energySourcePositionX, energySourcePositionY - 2, energySourcePositionX + 2, energySourcePositionY);
				}
			}
			//check two locations, map indicates what i'm looking for x is container, e energy source, j, desired job site
			//   [e][ ][x]      [        ][       ][ x+2, y ]
			//   [ ][j][ ]      [        ][x+1,y+1][        ]
			//   [x][ ][ ]      [ x, y+2 ][       ][        ]
			else if (this.checkContainersPositions(room, energySourcePositionX, energySourcePositionY + 2, energySourcePositionX + 2, energySourcePositionY) == true)
			{
				if (this.checkIfStationaryHarvesterJobSiteAlreadyExists(room, energySourcePositionX + 1, energySourcePositionY + 1) == false)
				{
					this.addNewStationaryHarvesterJob(room, e, energySourcePositionX + 1, energySourcePositionY + 1, energySourcePositionX, energySourcePositionY + 2, energySourcePositionX + 2, energySourcePositionY);
				}
			}
			//check two locations, map indicates what i'm looking for x is container, e energy source, j, desired job site
			//   [x][ ][e]      [ x-2, y ][       ][       ]
			//   [ ][j][ ]      [        ][x-1,y+1][       ]
			//   [ ][ ][x]      [        ][       ][ x,y+2 ]
			else if (this.checkContainersPositions(room, energySourcePositionX - 2, energySourcePositionY, energySourcePositionX, energySourcePositionY + 2) == true)
			{
				if (this.checkIfStationaryHarvesterJobSiteAlreadyExists(room, energySourcePositionX - 1, energySourcePositionY + 1) == false)
				{
					this.addNewStationaryHarvesterJob(room, e, energySourcePositionX - 1, energySourcePositionY + 1, energySourcePositionX - 2, energySourcePositionY, energySourcePositionX, energySourcePositionY + 2);
				}
			}
		}
		*/
	},

	addNewStationaryHarvesterJob: function (room, energySourceIndex, newStationaryHarvesterJobPositionX, newStationaryHarvesterJobPositionY, container1PositionX, container1PositionY, container2PositionX, container2PositionY)
	{
		let newStationaryHarvesterJobPosition = room.getPositionAt(newStationaryHarvesterJobPositionX, newStationaryHarvesterJobPositionY);

		let containerPositionsArray = [];

		let container1Position = room.getPositionAt(container1PositionX, container1PositionY);
		let container2Position = room.getPositionAt(container2PositionX, container2PositionY);
		containerPositionsArray.push(container1Position);
		containerPositionsArray.push(container2Position);

		let newStationaryHarvesterJob = {};
		newStationaryHarvesterJob.pos = newStationaryHarvesterJobPosition;
		newStationaryHarvesterJob.containerPositionsArray = containerPositionsArray;
		newStationaryHarvesterJob.active = false;
		newStationaryHarvesterJob.energySourceIndex = energySourceIndex;
		newStationaryHarvesterJob.creep = null;

		room.memory.jobs.stationaryJobBoard.harvesterJobs.push(newStationaryHarvesterJob);
	},

	checkIfStationaryHarvesterJobSiteAlreadyExists: function (room, stationaryHarvesterJobSitePossiblePositionX, stationaryHarvesterJobSitePossiblePositionY)
	{
		var stationaryHarvesterJobsArray = room.memory.jobs.stationaryJobBoard.harvesterJobs;
		var stationaryHarvesterJobsCount = stationaryJobsArray.length;

		let jobAlreadyExists = false;

		for (let j = 0; j < stationaryHarvesterJobsCount; j++)
		{
			let existingStationaryHarvesterJobPosition = stationaryHarvesterJobsArray[j].pos;

			if (stationaryHarvesterJobSitePossiblePositionX == existingStationaryHarvesterJobPosition.x && stationaryHarvesterJobSitePossiblePositionY == existingStationaryHarvesterJobPosition.y)
			{
				jobAlreadyExists = true;
			}
		}

		return jobAlreadyExists;
	},

	checkContainersPositions: function (room, container1PossiblePositionX, container1PossiblePositionY, container2PossiblePositionX, container2PossiblePositionY)
	{
		let structuresMapArray = room.memory.structures.mapArray;

		if (structuresMapArray[container1PossiblePositionX][container1PossiblePositionY] == 16
			&& structuresMapArray[container2PossiblePositionX][container2PossiblePositionY] == 16)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}

module.exports = RoomJobsController;