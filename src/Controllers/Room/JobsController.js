/**
 * Created by Amand on 6/20/2017.
 * Rethinking how jobs are assigned and completed.
 * Eventually doing away with 'roles' in favor of assigning prioritized jobs to screeps
 */

var RoomJobsController =
{
	scanJobs: function (room)
	{
		this.scanWorkerJobs(room);
		this.scanHaulerJobs(room);
		this.scanStationaryJobs(room);
		//this.scanClaimerJobs(room);
	},

	scanWorkerJobs: function (room)
	{
		this.scanGeneralJobs(room);
		this.scanWorkerConstructionJobs(room);
		this.scanWorkerRepairJobs(room);
	},

	scanWorkerConstructionJobs: function(room)
	{
		//if job complete delete job
		for(let constructionIndex in room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure)
		{
			if(!Game.getObjectById(constructionIndex))
			{
				delete room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[constructionIndex];
			}
		}

		//now scan jobs
		let constructionSitesArray = room.find(FIND_MY_CONSTRUCTION_SITES);

		let constructionSitesCount = constructionSitesArray.length;
		for (let x = 0; x < constructionSitesCount; x++)
		{
			let constructionSite = constructionSitesArray[x];
			if (!room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[constructionSite.id])
			{
				room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[constructionSite.id] = {};
			}
		}
	},

	scanWorkerRepairJobs: function(room)
	{
		let repairStructureJobs = room.memory.jobs.workerJobBoard.routineJobs.repairStructure;

		for(let structureID in repairStructureJobs)
		{
			if(!Game.getObjectById(structureID))
			{
				delete room.memory.jobs.workerJobBoard.routineJobs.repairStructure[structureID];
			}
			else
			{
				let structure = Game.getObjectById(structureID);
				if(structure.hits == structure.hitsMax)
				{
					delete room.memory.jobs.workerJobBoard.routineJobs.repairStructure[structureID];
				}
			}
		}

		//now scan
		let structuresArray = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) =>
			{
				return (structure.hits < structure.hitsMax);
			}
		});

		let structuresCount = structuresArray.length;
		for(let x=0; x<structuresCount; x++)
		{
			if(!room.memory.jobs.workerJobBoard.routineJobs.repairStructure[structuresArray[x].id])
			{
				room.memory.jobs.workerJobBoard.routineJobs.repairStructure[structuresArray[x].id] = {};
			}
		}

		//scan walls
		let repairWallJobs = room.memory.jobs.workerJobBoard.routineJobs.repairWall;

		for(let wallID in repairWallJobs)
		{
			if(!Game.getObjectById(wallID))
			{
				delete room.memory.jobs.workerJobBoard.routineJobs.repairWall[wallID];
			}
			else
			{
				let wall = Game.getObjectById(wallID);
				if(wall.hits == wall.hitsMax)
				{
					delete room.memory.jobs.workerJobBoard.routineJobs.repairWall[wallID];
				}
			}
		}

		let wallsCount = room.memory.structures.wallsArray.length;
		for(let x=0; x<wallsCount; x++)
		{
			wall = room.memory.structures.wallsArray[x];
			if(!room.memory.jobs.workerJobBoard.routineJobs.repairWall[wall.id] && wall.hits < wall.hitsMax)
			{
				room.memory.jobs.workerJobBoard.routineJobs.repairWall[wall.id] = {};
			}
		}
	},

	scanGeneralJobs: function (room)
	{
		this.scanGeneralSupplyExtensionJobs(room);
		this.scanGeneralSupplySpawnJobs(room);
		this.scanGeneralSupplyTowerJobs(room);
		this.scanGeneralSupplyStorageJobs(room);
	},

	scanGeneralSupplyExtensionJobs: function (room)
	{
		let supplyExtensionJobs = room.memory.jobs.generalJobBoard.supplyExtension;

		let extensionsArray = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) =>
			{
				return (structure.structureType == STRUCTURE_EXTENSION);
			}
		});

		//generate a GENERAL job for each one provided one doesn't already exist
		let extensionsCount = extensionsArray.length;
		for (let x = 0; x < extensionsCount; x++)
		{
			let extension = extensionsArray[x];

			if (extension.energy < extension.energyCapacity && !room.memory.jobs.generalJobBoard.supplyExtension[extension.id])
			{
				room.memory.jobs.generalJobBoard.supplyExtension[extension.id] = {};
			}
			if (extension.energy == extension.energyCapacity)
			{
				if (room.memory.jobs.generalJobBoard.supplyExtension[extension.id])
				{
					delete room.memory.jobs.generalJobBoard.supplyExtension[extension.id];
				}
			}
		}
	},

	scanGeneralSupplySpawnJobs: function (room)
	{
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

			if (spawn.energy <= spawn.energyCapacity && !room.memory.jobs.generalJobBoard.supplySpawn[spawn.id])
			{
				room.memory.jobs.generalJobBoard.supplySpawn[spawn.id] = {};
			}
			if (spawn.energy == spawn.energyCapacity)
			{
				if (room.memory.jobs.generalJobBoard.supplySpawn[spawn.id])
				{
					delete room.memory.jobs.generalJobBoard.supplySpawn[spawn.id];
				}
			}
		}
	},

	scanGeneralSupplyStorageJobs: function (room)
	{
		if(room.storage)
		{
			let storage = room.storage;

			if( _.sum(storage.store) < storage.storeCapacity) // job complete && !room.memory.jobs.generalJobBoard.supplyStorage[storage.id])
			{
				room.memory.jobs.generalJobBoard.supplyStorage[storage.id] = {};
			}
			if (_.sum(storage.store) == storage.storeCapacity)
			{
				if (room.memory.jobs.generalJobBoard.supplyStorage[storage.id])
				{
					delete room.memory.jobs.generalJobBoard.supplyStorage[storage.id];
				}
			}
		}
	},

	scanGeneralSupplyTowerJobs: function (room)
	{
		let towersArray = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) =>
			{
				return (structure.structureType == STRUCTURE_TOWER);
			}
		});

		//generate a WORKER job for each one provided one doesn't already exist
		let towersCount = towersArray.length;

		for (let x = 0; x < towersCount; x++)
		{
			let tower = towersArray[x];

			if (tower.energy <= tower.energyCapacity && !room.memory.jobs.generalJobBoard.supplyTower[tower.id])
			{
				room.memory.jobs.generalJobBoard.supplyTower[tower.id] = {};
			}
			if (tower.energy == tower.energyCapacity)
			{
				if (room.memory.jobs.generalJobBoard.supplyTower[tower.id])
				{
					delete room.memory.jobs.generalJobBoard.supplyTower[tower.id];
				}
			}
		}
	},


	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<HAULER JOBS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	scanHaulerJobs: function (room)
	{
		let storageCount = room.memory.structures.storageArray.length;

		//delete hauler jobs first if objects disappeared...or there is no energy in containers.
		for(let containerID in room.memory.jobs.haulerJobBoard.moveEnergyFromContainer)
		{
			if (!Game.getObjectById(containerID))
			{
				delete room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[containerID];
			}
			else
			{
				if (Game.getObjectById(containerID).store[RESOURCE_ENERGY] == 0)
				{
					delete room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[containerID];
				}
			}

			if (storageCount == 0)
			{
				delete room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[containerID];
			}
		}

		//create hauler jobs, based on how many storage and containers exist... will fidget with this eventually
		if (storageCount > 0)
		{
			let structureContainersArray = room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER
				&& i.store[RESOURCE_ENERGY] > 0
			});
			let structureContainersCount = structureContainersArray.length;

			for (let x = 0; x < structureContainersCount; x++)
			{
				if (!room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[structureContainersArray[x].id])
				{
					room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[structureContainersArray[x].id] = {};
				}
			}
		}
	},

	/*
	getNumberOfAvailableStationaryJobs: function (room)
	{
		let stationaryHarvesterJobs = room.memory.jobs.stationaryJobBoard.harvestEnergy;
		let manageStorageAndTerminalJobs = room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal;

		let numberOfAvailableStationaryHarvesterJobs = 0;
		for (let energySourceID in stationaryHarvesterJobs)
		{
			let stationaryHarvesterJob = stationaryHarvesterJobs[energySourceID];

			if (stationaryHarvesterJob.creepID == null && stationaryHarvesterJob.active == false)
			{
				numberOfAvailableStationaryHarvesterJobs += 1;
			}
		}

		for (let energySourceID in manageStorageAndTerminalJobs)
		{
			let manageStorageAndTerminalJob = manageStorageAndTerminalJobs[energySourceID];

			if (manageStorageAndTerminalJob.creepID == null && manageStorageAndTerminalJob.active == false)
			{
				numberOfAvailableStationaryHarvesterJobs += 1;
			}
		}

		return numberOfAvailableStationaryHarvesterJobs;
	},
	*/

	scanStationaryJobs: function (room)
	{
		this.scanHarvestEnergyJobs(room);
		this.scanStationaryManageStorageAndTerminalJobs(room);
	},

	scanStationaryManageStorageAndTerminalJobs: function (room)
	{
		let manageStorageAndTerminalJobs = room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal;

		let numberOfStationaryManageStorageAndTerminalJobsActive = 0;
		for (let energySourceID in manageStorageAndTerminalJobs)
		{
			let energySource = Game.getObjectById(energySourceID);
			if(energySource) //if the storage container exists... then continue... if not.. make sure the job is deleted.
			{
				let stationaryManageStorageAndTerminalJob = room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[energySourceID];
				let creepID = stationaryManageStorageAndTerminalJob.creepID;

				if (creepID != null)
				{
					let creep = Game.getObjectById(creepID);
					if (stationaryManageStorageAndTerminalJob.active == true && !creep)
					{
						room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[energySourceID].active = false;
						room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[energySourceID].creepID = null;
					} //if creep died, reset job active to false
					else
					{
						if (stationaryManageStorageAndTerminalJob.active == true && creep)
						{
							numberOfStationaryManageStorageAndTerminalJobsActive += 1;
						}
					}
				}
			}
			else
			{
				delete room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[energySourceID];
			}
		}

		//now scan
		if(room.memory.structures.storageArray.length > 0)
		{
			let energySourceID = room.memory.structures.storageArray[0].id;
			if(!room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[energySourceID])
			{
				let energySourceID = room.memory.structures.storageArray[0].id;
				let energySource = Game.getObjectById(energySourceID);

				let storagePositionX = energySource.pos.x;
				let storagePositionY = energySource.pos.y;

				//FOR NOW, I am making sure the storage container is within distance of the upgrade controller
				// (this is not automated, but placed on the game map by hand)
				//AND am MANUALLY making sure the space above the storage unit is empty, and in range of the upgrade controller.
				//that will be the site of this job. ... so that said, y - 1.

				let jobPosition = {x: storagePositionX, y: storagePositionY - 1};

				let manageStorageAndTerminalJob = {};
				manageStorageAndTerminalJob.pos = jobPosition;
				manageStorageAndTerminalJob.active = false;
				manageStorageAndTerminalJob.creepID = null;

				room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[energySourceID] = manageStorageAndTerminalJob;
			}
		}
	},

	scanHarvestEnergyJobs: function(room)
	{
		let stationaryHarvestEnergyJobs = room.memory.jobs.stationaryJobBoard.harvestEnergy;

		let numberOfStationaryHarvestEnergyJobsActive = 0;
		for (let energySourceID in stationaryHarvestEnergyJobs)
		{
			let stationaryHarvestEnergyJob = stationaryHarvestEnergyJobs[energySourceID];

			let creepID = stationaryHarvestEnergyJob.creepID;

			if(creepID != null)
			{
				let creep = Game.getObjectById(creepID);
				if (stationaryHarvestEnergyJob.active == true && !creep)
				{
					room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID].active = false;
					room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID].creepID = null;
				} //if creep died, reset job active to false
				else
				{
					if (stationaryHarvestEnergyJob.active == true && creep)
					{
						numberOfStationaryHarvestEnergyJobsActive += 1;
					}
				}
			}
		}

		/*

		 add code here to check if containers still exist, if not delete job...
		 */

		//let stationaryJobsActive = {numberOfStationaryHarvestEnergyJobsActive: numberOfStationaryHarvestEnergyJobsActive};
		//room.memory.stationaryJobsActive = stationaryJobsActive;


		let structuresMapArray = room.memory.jobs.stationaryJobBoard.mapArray;

		//scan for stationary harvestEnergy jobs in room
		let energySourcesArray = room.memory.environment.energySourcesArray;
		let energySourcesCount = energySourcesArray.length;
		for (let e = 0; e < energySourcesCount; e++)
		{
			let energySource = energySourcesArray[e];
			let energySourcePositionX = energySource.pos.x;
			let energySourcePositionY = energySource.pos.y;

			//harvestEnergy jobs will be detected by two containers existing 2 spaces away from the energy source
			//currently i am only searching for instances where the 2 containers are placed horizontally and vertically.

			//check two locations, map indicates what i'm looking for x is container, e energy source, j, desired job site
			//   [ ][ ][x]      [        ][       ][ x, y-2 ]
			//   [ ][j][ ]      [        ][x-1,y-1][        ]
			//   [x][ ][e]      [ x-2, y ][       ][        ]
			if (this.checkContainersPositions(room, energySourcePositionX, energySourcePositionY - 2, energySourcePositionX - 2, energySourcePositionY) == true)
			{
				if (this.checkIfStationaryHarvestEnergyJobSiteAlreadyExists(room, energySourcePositionX - 1, energySourcePositionY - 1) == false)
				{
					this.addNewStationaryHarvestEnergyJob(room, e, energySourcePositionX - 1, energySourcePositionY - 1, energySourcePositionX, energySourcePositionY - 2, energySourcePositionX - 2, energySourcePositionY);
				}
			}
			//check two locations, map indicates what i'm looking for x is container, e energy source, j, desired job site
			//   [x][ ][ ]      [ x, y-2 ][       ][        ]
			//   [ ][j][ ]      [        ][x+1,y-1][        ]
			//   [e][ ][x]      [        ][       ][ x+2, y ]
			else if (this.checkContainersPositions(room, energySourcePositionX, energySourcePositionY - 2, energySourcePositionX + 2, energySourcePositionY) == true)
			{
				if (this.checkIfStationaryHarvestEnergyJobSiteAlreadyExists(room, energySourcePositionX + 1, energySourcePositionY - 1) == false)
				{
					this.addNewStationaryHarvestEnergyJob(room, e, energySourcePositionX + 1, energySourcePositionY - 1, energySourcePositionX, energySourcePositionY - 2, energySourcePositionX + 2, energySourcePositionY);
				}
			}
			//check two locations, map indicates what i'm looking for x is container, e energy source, j, desired job site
			//   [e][ ][x]      [        ][       ][ x+2, y ]
			//   [ ][j][ ]      [        ][x+1,y+1][        ]
			//   [x][ ][ ]      [ x, y+2 ][       ][        ]
			else if (this.checkContainersPositions(room, energySourcePositionX, energySourcePositionY + 2, energySourcePositionX + 2, energySourcePositionY) == true)
			{
				if (this.checkIfStationaryHarvestEnergyJobSiteAlreadyExists(room, energySourcePositionX + 1, energySourcePositionY + 1) == false)
				{
					this.addNewStationaryHarvestEnergyJob(room, e, energySourcePositionX + 1, energySourcePositionY + 1, energySourcePositionX, energySourcePositionY + 2, energySourcePositionX + 2, energySourcePositionY);
				}
			}
			//check two locations, map indicates what i'm looking for x is container, e energy source, j, desired job site
			//   [x][ ][e]      [ x-2, y ][       ][       ]
			//   [ ][j][ ]      [        ][x-1,y+1][       ]
			//   [ ][ ][x]      [        ][       ][ x,y+2 ]
			else if (this.checkContainersPositions(room, energySourcePositionX - 2, energySourcePositionY, energySourcePositionX, energySourcePositionY + 2) == true)
			{
				if (this.checkIfStationaryHarvestEnergyJobSiteAlreadyExists(room, energySourcePositionX - 1, energySourcePositionY + 1) == false)
				{
					this.addNewStationaryHarvestEnergyJob(room, e, energySourcePositionX - 1, energySourcePositionY + 1, energySourcePositionX - 2, energySourcePositionY, energySourcePositionX, energySourcePositionY + 2);
				}
			}
		}
	},

	addNewStationaryHarvestEnergyJob: function (room, energySourceIndex, newStationaryHarvestEnergyJobPositionX, newStationaryHarvestEnergyJobPositionY, container1PositionX, container1PositionY, container2PositionX, container2PositionY)
	{
		let newStationaryHarvestEnergyJobPosition = room.getPositionAt(newStationaryHarvestEnergyJobPositionX, newStationaryHarvestEnergyJobPositionY);

		let containerPositionsArray = [];

		let container1Position = room.getPositionAt(container1PositionX, container1PositionY);
		let container2Position = room.getPositionAt(container2PositionX, container2PositionY);
		containerPositionsArray.push(container1Position);
		containerPositionsArray.push(container2Position);

		let newStationaryHarvestEnergyJob = {};
		newStationaryHarvestEnergyJob.pos = newStationaryHarvestEnergyJobPosition;
		newStationaryHarvestEnergyJob.containerPositionsArray = containerPositionsArray;
		newStationaryHarvestEnergyJob.active = false;
		newStationaryHarvestEnergyJob.creepID = null;

		room.memory.jobs.stationaryJobBoard.harvestEnergy[room.memory.environment.energySourcesArray[energySourceIndex].id] = newStationaryHarvestEnergyJob;
	},

	checkIfStationaryHarvestEnergyJobSiteAlreadyExists: function (room, stationaryHarvestEnergyJobSitePossiblePositionX, stationaryHarvestEnergyJobSitePossiblePositionY)
	{
		let energySources = room.memory.environment.energySourcesArray;
		let energySourcesCount = energySources.length;

		let jobAlreadyExists = false;

		for (let j = 0; j < energySourcesCount; j++)
		{
			let energySource = energySources[j];

			if(room.memory.jobs.stationaryJobBoard.harvestEnergy[energySource.id])
			{
				let stationaryJob = room.memory.jobs.stationaryJobBoard.harvestEnergy[energySource.id];
				let existingStationaryHarvestEnergyJobPosition = stationaryJob.pos;

				if (stationaryHarvestEnergyJobSitePossiblePositionX == existingStationaryHarvestEnergyJobPosition.x && stationaryHarvestEnergyJobSitePossiblePositionY == existingStationaryHarvestEnergyJobPosition.y)
				{
					jobAlreadyExists = true;
				}
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